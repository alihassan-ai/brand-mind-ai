import { prisma } from '@brandmind/shared';
import { Decimal } from '@prisma/client/runtime/library';

export async function generateBusinessMemory(shopId: string) {
    const shop = await prisma.shop.findUnique({
        where: { id: shopId },
        include: {
            orders: { take: 1000, orderBy: { createdAt: 'desc' }, include: { lineItems: true } },
            products: { include: { variants: true } },
            dailyMetrics: { orderBy: { date: 'desc' }, take: 30 },
        },
    });

    if (!shop) throw new Error('Shop not found');

    // 1. Identity Memory - Price Tier & Catalog
    // 1. Identity Memory - Price Tier & Catalog
    const allPrices = shop.products.flatMap((p: any) => p.variants.map((v: any) => Number(v.price)));
    const medianPrice = calculateMedian(allPrices);
    const productCount = shop.products.length;
    const productTypes = Array.from(new Set(shop.products.map((p: any) => p.productType).filter(Boolean)));

    // 2. Discount Dependence Analysis
    const discountedOrders = shop.orders.filter((o: any) => Number(o.totalDiscounts) > 0);
    const discountRatio = shop.orders.length > 0 ? discountedOrders.length / shop.orders.length : 0;

    // 3. Real Concentration Risk - % of revenue from top 3 products
    const productRevenue: Record<string, { title: string; revenue: number }> = {};
    for (const order of shop.orders) {
        for (const item of order.lineItems) {
            const pid = item.productId || 'unknown';
            if (!productRevenue[pid]) {
                productRevenue[pid] = { title: item.title, revenue: 0 };
            }
            productRevenue[pid].revenue += Number(item.price) * item.quantity;
        }
    }

    const sortedProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue);
    const totalRevenue = sortedProducts.reduce((acc, p) => acc + p.revenue, 0);
    const top3Revenue = sortedProducts.slice(0, 3).reduce((acc, p) => acc + p.revenue, 0);
    const concentrationRisk = totalRevenue > 0 ? top3Revenue / totalRevenue : 0;

    // 4. Real Volatility Score - StdDev of daily revenue / mean
    const dailyRevenues = shop.dailyMetrics.map((m: any) => Number(m.netRevenue));
    const volatilityScore = calculateVolatility(dailyRevenues);

    // 5. Customer Patterns
    const avgOrderInterval = calculateAverageOrderInterval(shop.orders);
    const averageAOV = shop.dailyMetrics.length > 0
        ? shop.dailyMetrics.reduce((acc: number, m: any) => acc + Number(m.aov), 0) / shop.dailyMetrics.length
        : 0;

    // 6. Recent Performance Summary
    const last7DaysMetrics = shop.dailyMetrics.slice(0, 7);
    const recentTrend = last7DaysMetrics.length >= 2
        ? Number(last7DaysMetrics[0].netRevenue) - Number(last7DaysMetrics[last7DaysMetrics.length - 1].netRevenue)
        : 0;

    const memory = {
        identity: {
            priceTier: medianPrice > 100 ? 'premium' : medianPrice > 40 ? 'mid-market' : 'budget',
            medianPrice: Math.round(medianPrice * 100) / 100,
            productCount,
            topCategories: productTypes.slice(0, 5),
            topProducts: sortedProducts.slice(0, 5).map(p => p.title),
        },
        behavioral: {
            discountDependence: discountRatio > 0.5 ? 'high' : discountRatio > 0.2 ? 'moderate' : 'low',
            discountRatio: Math.round(discountRatio * 100),
            averageOrderInterval: Math.round(avgOrderInterval),
            averageAOV: Math.round(averageAOV * 100) / 100,
        },
        riskProfile: {
            volatilityScore: Math.round(volatilityScore * 100) / 100,
            volatilityRating: volatilityScore > 0.5 ? 'high' : volatilityScore > 0.2 ? 'moderate' : 'stable',
            concentrationRisk: Math.round(concentrationRisk * 100),
            concentrationRating: concentrationRisk > 0.6 ? 'high' : concentrationRisk > 0.3 ? 'moderate' : 'diversified',
        },
        performance: {
            last7DaysTrend: recentTrend > 0 ? 'growing' : recentTrend < 0 ? 'declining' : 'stable',
            trendAmount: Math.round(recentTrend * 100) / 100,
            totalOrdersLast30Days: shop.orders.length,
        },
    };

    return await prisma.businessMemorySnapshot.create({
        data: {
            shopId,
            date: new Date(),
            snapshot: memory as any,
        },
    });
}

function calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
}

function calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    if (mean === 0) return 0;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return stdDev / mean; // Coefficient of variation
}

function calculateAverageOrderInterval(orders: { createdAt: Date }[]): number {
    if (orders.length < 2) return 30; // Default to 30 days

    const sorted = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const intervals: number[] = [];

    for (let i = 1; i < Math.min(sorted.length, 100); i++) {
        const diff = sorted[i - 1].createdAt.getTime() - sorted[i].createdAt.getTime();
        intervals.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
    }

    return intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 30;
}
