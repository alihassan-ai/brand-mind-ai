import { prisma } from '@brandmind/shared';
import { decrypt } from '../auth/crypto';
import { syncProducts, syncOrders, syncCustomers } from './shopify-sync';
import { syncMetaAds } from './meta-sync';
import { backfillDailyMetrics } from '@brandmind/brain';
import { createSyncLog, updateSyncLog } from './sync-audit';

const SYNC_THRESHOLD_MINUTES = 240; // 4 hours instead of 30 minutes
const activeSyncs = new Set<string>();

/**
 * Checks if data is stale and triggers a background incremental sync if needed.
 */
export async function triggerAutoSync(shopId: string, force: boolean = false): Promise<void> {
    console.log(`[Auto-Sync] Entry for shop ${shopId} (force=${force})`);

    if (activeSyncs.has(shopId)) {
        console.log(`[Auto-Sync] Shop ${shopId} already has an active sync in this local process cache.`);
        return;
    }

    try {
        // 1. Check for active sync in DB
        const activeSync = await (prisma as any).syncEvent.findFirst({
            where: {
                shopId,
                status: 'running'
            }
        });

        if (activeSync) {
            const startTime = new Date(activeSync.startedAt).getTime();
            const elapsedMins = (Date.now() - startTime) / (60 * 1000);

            if (elapsedMins > 10) {
                console.log(`[Auto-Sync] Found ZOMBIE sync (${activeSync.id}) for shop ${shopId} - elapsed ${elapsedMins.toFixed(1)} mins. Marking as failed.`);
                await updateSyncLog(activeSync.id, {
                    status: 'failed',
                    error: `Sync timed out/abandoned after ${elapsedMins.toFixed(1)} minutes (detected by zombie cleanup)`
                });
            } else if (!force) {
                console.log(`[Auto-Sync] Sync already in progress for shop ${shopId} (started ${elapsedMins.toFixed(1)} mins ago). Skipping trigger.`);
                return;
            } else {
                console.log(`[Auto-Sync] Sync in progress, but force=true. Proceeding with extra caution for ${shopId}.`);
            }
        }

        // 1b. Cooldown Check (Only if not forced)
        if (!force) {
            const lastSyncEvent = await (prisma as any).syncEvent.findFirst({
                where: { shopId },
                orderBy: { startedAt: 'desc' }
            });

            if (lastSyncEvent && (Date.now() - new Date(lastSyncEvent.startedAt).getTime()) < 3 * 60 * 1000) {
                console.log(`[Auto-Sync] Cooldown active for ${shopId} (last attempt < 3 mins ago).`);
                return;
            }
        }

        // 2. Check sync states for staleness
        const syncStates = await prisma.syncState.findMany({
            where: { shopId }
        });

        const now = new Date();
        const threshold = SYNC_THRESHOLD_MINUTES * 60 * 1000;

        // CRITICAL: We need sync if:
        // A) Any of the 3 core resources are missing from syncStates
        // B) Any resource is older than the threshold
        const requiredResources = ['products', 'orders', 'customers'];
        const existingResources = syncStates.map(s => s.resource);
        const missingResources = requiredResources.filter(r => !existingResources.includes(r));

        const needsSync = force || missingResources.length > 0 || syncStates.some((state: any) => {
            const lastSynced = new Date(state.lastSyncedAt).getTime();
            return (now.getTime() - lastSynced) > threshold;
        });

        if (missingResources.length > 0) {
            console.log(`[Auto-Sync] Missing states for: ${missingResources.join(', ')}`);
        }

        if (needsSync) {
            activeSyncs.add(shopId);
            console.log(`[Auto-Sync] Data stale for shop ${shopId}. Triggering update...`);

            // We return the promise so the caller can choose to await it if they want (e.g. initial sync)
            return (async () => {
                let logId = '';
                console.log(`[Auto-Sync] Launching async sync process for ${shopId}`);
                try {
                    const log = await createSyncLog(shopId, 'incremental');
                    logId = log.id;

                    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
                    if (!shop) return;

                    const accessToken = decrypt(shop.accessToken);
                    const shopDomain = shop.shopDomain;

                    const [products, orders, customers, metaResult] = await Promise.all([
                        syncProducts(shopId, shopDomain, accessToken),
                        syncOrders(shopId, shopDomain, accessToken),
                        syncCustomers(shopId, shopDomain, accessToken),
                        syncMetaAds(shopId)
                    ]);

                    console.log(`[Auto-Sync] Meta Sync Result:`, metaResult);

                    console.log(`[Auto-Sync] Completed background update for ${shopDomain}. Running metrics backfill...`);

                    // After data is fresh, backfill the metrics for the dashboard
                    await backfillDailyMetrics(shopId, 30);

                    await updateSyncLog(logId, {
                        status: 'success',
                        stats: { products, orders, customers }
                    });

                    console.log(`[Auto-Sync] Completed background update and metrics backfill for ${shopDomain}`);
                } catch (err: any) {
                    console.error('[Auto-Sync] Background sync failed:', err.message);
                    if (logId) {
                        await updateSyncLog(logId, {
                            status: 'failed',
                            error: err.message
                        });
                    }
                } finally {
                    activeSyncs.delete(shopId);
                }
            })();
        }
    } catch (error) {
        console.error('[Auto-Sync] Error checking sync status:', error);
    }
}
