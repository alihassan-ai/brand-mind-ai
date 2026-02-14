import { prisma } from '@brandmind/shared';

export interface Baseline {
    average: number;
    stdDev: number;
}

export async function computeDailyMetricBaselines(shopId: string, daysLookback: number = 30) {
    const metrics = await prisma.dailyMetric.findMany({
        where: { shopId },
        orderBy: { date: 'desc' },
        take: daysLookback,
    });

    if (metrics.length === 0) return null;

    const revenues = metrics.map((m: any) => Number(m.netRevenue));
    const orderCounts = metrics.map((m: any) => m.orderCount);

    return {
        netRevenue: calculateStats(revenues),
        orderCount: calculateStats(orderCounts),
    };
}

export async function computeProductBaselines(variantId: string, daysLookback: number = 30) {
    const metrics = await prisma.productMetric.findMany({
        where: { variantId },
        orderBy: { date: 'desc' },
        take: daysLookback,
    });

    if (metrics.length === 0) return null;

    const unitsSold = metrics.map((m: any) => m.unitsSold);

    return {
        unitsSold: calculateStats(unitsSold),
    };
}

function calculateStats(values: number[]): Baseline {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return {
        average: mean,
        stdDev: Math.sqrt(variance),
    };
}
