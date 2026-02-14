import { prisma } from '@brandmind/shared';
import { Decimal } from '@prisma/client/runtime/library';
export async function aggregateDailyMetrics(shopId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const orders = await prisma.order.findMany({
        where: {
            shopId,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            refunds: true,
            lineItems: true,
        },
    });
    const orderCount = orders.length;
    const grossRevenue = orders.reduce((acc, order) => acc.plus(order.totalPrice), new Decimal(0));
    const refundAmount = orders.reduce((acc, order) => {
        const orderRefunds = order.refunds.reduce((rAcc, r) => rAcc.plus(r.amount), new Decimal(0));
        return acc.plus(orderRefunds);
    }, new Decimal(0));
    const netRevenue = grossRevenue.minus(refundAmount);
    const aov = orderCount > 0 ? grossRevenue.dividedBy(orderCount) : new Decimal(0);
    // FIXED: Proper customer segmentation using actual order-customer links
    const { newCustomersCount, returningCustomersCount } = await calculateCustomerSegmentation(shopId, orders, startOfDay);
    // v1.1 Executive Dashboard simulation engine
    // Values are simulated based on revenue volume to provide context until 3rd party APIs are connected
    const marketingSpend = netRevenue.mul(0.25); // Target 4x ROAS simulation
    const sessions = Math.floor(netRevenue.toNumber() / 2.5); // Simulation based on avg $2.50 RPC
    const fulfillmentTime = 1.5 + (Math.random() * 2); // Simulated 1.5 - 3.5 days
    await prisma.dailyMetric.upsert({
        where: {
            shopId_date: {
                shopId,
                date: startOfDay,
            },
        },
        update: {
            grossRevenue,
            netRevenue,
            orderCount,
            aov,
            refundAmount,
            newCustomersCount,
            returningCustomersCount,
            marketingSpend,
            sessions,
            fulfillmentTime,
        },
        create: {
            shopId,
            date: startOfDay,
            grossRevenue,
            netRevenue,
            orderCount,
            aov,
            refundAmount,
            newCustomersCount,
            returningCustomersCount,
            marketingSpend,
            sessions,
            fulfillmentTime,
        },
    });
}
/**
 * Calculate new vs returning customers based on actual order history
 */
async function calculateCustomerSegmentation(shopId, todaysOrders, beforeDate) {
    let newCustomersCount = 0;
    let returningCustomersCount = 0;
    // Get unique customer IDs from today's orders
    const customerIds = [...new Set(todaysOrders.map(o => o.customerId).filter(Boolean))];
    if (customerIds.length === 0) {
        // No customer links - all orders are "guest" orders, count as new
        return { newCustomersCount: todaysOrders.length, returningCustomersCount: 0 };
    }
    // For each customer, check if they had orders before today
    for (const customerId of customerIds) {
        const previousOrderCount = await prisma.order.count({
            where: {
                shopId,
                customerId,
                createdAt: {
                    lt: beforeDate,
                },
            },
        });
        if (previousOrderCount > 0) {
            returningCustomersCount++;
        }
        else {
            newCustomersCount++;
        }
    }
    // Count orders without customer links as new customers
    const ordersWithoutCustomer = todaysOrders.filter(o => !o.customerId).length;
    newCustomersCount += ordersWithoutCustomer;
    return { newCustomersCount, returningCustomersCount };
}
export async function aggregateProductMetrics(shopId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const lineItems = await prisma.orderLineItem.findMany({
        where: {
            order: {
                shopId,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        },
        include: {
            order: {
                include: {
                    refunds: true,
                },
            },
        },
    });
    // Group by variantId with refund tracking
    const variantStats = {};
    for (const item of lineItems) {
        if (!item.variantId)
            continue;
        if (!variantStats[item.variantId]) {
            variantStats[item.variantId] = { revenue: new Decimal(0), unitsSold: 0, refundCount: 0 };
        }
        const itemTotal = new Decimal(item.price).mul(item.quantity);
        variantStats[item.variantId].revenue = variantStats[item.variantId].revenue.plus(itemTotal);
        variantStats[item.variantId].unitsSold += item.quantity;
        // Check if this order has refunds
        if (item.order.refunds.length > 0) {
            variantStats[item.variantId].refundCount++;
        }
    }
    for (const [variantId, stats] of Object.entries(variantStats)) {
        const variant = await prisma.variant.findUnique({ where: { shopifyId: variantId } });
        if (!variant)
            continue;
        // Calculate refund rate as percentage of units sold
        const refundRate = stats.unitsSold > 0 ? (stats.refundCount / stats.unitsSold) * 100 : 0;
        await prisma.productMetric.upsert({
            where: {
                variantId_date: {
                    variantId: variant.id,
                    date: startOfDay,
                },
            },
            update: {
                revenue: stats.revenue,
                unitsSold: stats.unitsSold,
                refundRate,
            },
            create: {
                variantId: variant.id,
                date: startOfDay,
                revenue: stats.revenue,
                unitsSold: stats.unitsSold,
                refundRate,
            },
        });
    }
}
// New: Get top selling products for a shop
export async function getTopProducts(shopId, limit = 10) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const metrics = await prisma.productMetric.groupBy({
        by: ['variantId'],
        where: {
            date: { gte: last30Days },
            variant: { product: { shopId } },
        },
        _sum: {
            revenue: true,
            unitsSold: true,
        },
        orderBy: {
            _sum: {
                revenue: 'desc',
            },
        },
        take: limit,
    });
    const products = await Promise.all(metrics.map(async (m) => {
        const variant = await prisma.variant.findUnique({
            where: { id: m.variantId },
            include: { product: true },
        });
        return {
            productTitle: (variant === null || variant === void 0 ? void 0 : variant.product.title) || 'Unknown',
            variantTitle: (variant === null || variant === void 0 ? void 0 : variant.title) || '',
            revenue: Number(m._sum.revenue || 0),
            unitsSold: m._sum.unitsSold || 0,
        };
    }));
    return products;
}
