import { prisma } from '@brandmind/shared';
import { decrypt } from '../auth/crypto';
import { syncProducts, syncOrders, syncCustomers } from './shopify-sync';
import { backfillDailyMetrics } from '@brandmind/brain';
import { createSyncLog, updateSyncLog } from './sync-audit';

const SYNC_THRESHOLD_MINUTES = 240; // 4 hours instead of 30 minutes
const activeSyncs = new Set<string>();

/**
 * Checks if data is stale and triggers a background incremental sync if needed.
 */
export async function triggerAutoSync(shopId: string): Promise<void> {
    if (activeSyncs.has(shopId)) {
        console.log(`[Auto-Sync] Shop ${shopId} already has an active sync in this process.`);
        return;
    }

    try {
        // 1. Check for active sync in DB
        const activeSync = await (prisma as any).syncEvent.findFirst({
            where: {
                shopId,
                status: 'running',
                startedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } // Reduced from 1hr to 15mins for faster recovery
            }
        });

        if (activeSync) {
            console.log(`[Auto-Sync] Sync already in progress for shop ${shopId}. Skipping trigger.`);
            return;
        }

        // 1b. Cooldown Check (e.g., don't try again if we just tried in the last 5 minutes)
        const lastSyncEvent = await (prisma as any).syncEvent.findFirst({
            where: { shopId },
            orderBy: { startedAt: 'desc' }
        });

        if (lastSyncEvent && (Date.now() - new Date(lastSyncEvent.startedAt).getTime()) < 5 * 60 * 1000) {
            // Already tried or completed very recently
            return;
        }

        // 2. Check sync states for staleness
        const syncStates = await prisma.syncState.findMany({
            where: { shopId }
        });

        const now = new Date();
        const threshold = SYNC_THRESHOLD_MINUTES * 60 * 1000;

        // Check if any resource is stale
        const needsSync = syncStates.length === 0 || syncStates.some((state: any) => {
            const lastSynced = new Date(state.lastSyncedAt).getTime();
            return (now.getTime() - lastSynced) > threshold;
        });

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

                    const [products, orders, customers] = await Promise.all([
                        syncProducts(shopId, shopDomain, accessToken),
                        syncOrders(shopId, shopDomain, accessToken),
                        syncCustomers(shopId, shopDomain, accessToken)
                    ]);

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
