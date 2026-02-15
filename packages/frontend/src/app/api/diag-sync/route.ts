import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@brandmind/shared';
import { getConnectedShop } from '@brandmind/backend/auth/session';
import { triggerAutoSync } from '@brandmind/backend/sync/auto-sync';

export async function GET(req: NextRequest) {
    try {
        const shopDomain = await getConnectedShop();
        if (!shopDomain) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const shop = await prisma.shop.findUnique({ where: { shopDomain } });
        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const reset = searchParams.get('reset') === 'true';
        const force = searchParams.get('force') === 'true';
        const verbose = searchParams.get('verbose') === 'true';

        if (reset) {
            console.log(`[Diag] Resetting sync states for shop ${shop.id}`);
            await (prisma as any).syncEvent.updateMany({
                where: { shopId: shop.id, status: 'running' },
                data: { status: 'failed', error: 'Manually reset via diagnostic tool' }
            });
        }

        if (force) {
            console.log(`[Diag] Forcing sync for shop ${shop.id}`);
            // We await it here so the diagnostic route stays open until sync finishes (up to 60s maxDuration)
            await triggerAutoSync(shop.id, true);
        }

        const [orders, products, customers, lastEvents, syncStates] = await Promise.all([
            prisma.order.count({ where: { shopId: shop.id } }),
            prisma.product.count({ where: { shopId: shop.id } }),
            prisma.customer.count({ where: { shopId: shop.id } }),
            (prisma as any).syncEvent.findMany({
                where: { shopId: shop.id },
                orderBy: { startedAt: 'desc' },
                take: 5
            }),
            prisma.syncState.findMany({
                where: { shopId: shop.id }
            })
        ]);

        return NextResponse.json({
            shop: shop.shopDomain,
            counts: { orders, products, customers },
            syncStates: verbose ? syncStates : syncStates.length,
            lastEvents
        });

    } catch (error: any) {
        console.error('[Diag] Sync diagnostic failed:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
