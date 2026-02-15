import { prisma } from '@brandmind/shared';
import { Decimal } from '@prisma/client/runtime/library';

interface PatternData {
    winners: Array<{ attribute: string; value: string; successRate: number; sampleSize: number }>;
    averageRefundRate: number;
    averageVelocity: number;
}

export async function runBackgroundAnalysis(shopId: string) {
    console.log(`[BackgroundAnalyzer] Running analysis for shop ${shopId}`);

    // Analyze and store patterns
    await analyzeColorPatterns(shopId);
    await analyzePriceBandPatterns(shopId);
    await analyzeCategoryPatterns(shopId);
    await analyzeSeasonalPatterns(shopId);
    await analyzeCrossPurchasePatterns(shopId);

    console.log(`[BackgroundAnalyzer] Pattern memory updated for shop ${shopId}`);
}

async function analyzeColorPatterns(shopId: string) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);

    // Get all line items with product info
    const lineItems = await prisma.orderLineItem.findMany({
        where: {
            order: { shopId, createdAt: { gte: last90Days } },
        },
        include: {
            order: { include: { refunds: true } },
        },
    });

    const colors = ['maroon', 'black', 'white', 'navy', 'red', 'blue', 'green', 'gold', 'brown', 'grey', 'pink', 'beige', 'cream', 'olive'];
    const colorStats: Record<string, { sales: number; refunds: number; revenue: number }> = {};

    for (const item of lineItems) {
        const title = item.title.toLowerCase();
        for (const color of colors) {
            if (title.includes(color)) {
                if (!colorStats[color]) {
                    colorStats[color] = { sales: 0, refunds: 0, revenue: 0 };
                }
                colorStats[color].sales += item.quantity;
                colorStats[color].revenue += Number(item.price) * item.quantity;
                if (item.order.refunds.length > 0) {
                    colorStats[color].refunds++;
                }
                break;
            }
        }
    }

    // Find winning colors (high sales, low refund rate)
    const winners = Object.entries(colorStats)
        .filter(([_, stats]) => stats.sales >= 5)
        .map(([color, stats]) => ({
            attribute: 'color',
            value: color,
            successRate: stats.sales > 0 ? 1 - (stats.refunds / stats.sales) : 0,
            sampleSize: stats.sales,
            revenue: stats.revenue,
        }))
        .sort((a, b) => b.successRate * b.sampleSize - a.successRate * a.sampleSize);

    if (winners.length > 0) {
        await prisma.patternMemory.upsert({
            where: { shopId_patternType: { shopId, patternType: 'color_preference' } },
            update: {
                patternData: { winners: winners.slice(0, 5) },
                confidence: Math.min(0.9, winners[0].sampleSize / 50),
                sampleSize: winners.reduce((sum, w) => sum + w.sampleSize, 0),
                lastUpdated: new Date(),
            },
            create: {
                shopId,
                patternType: 'color_preference',
                patternData: { winners: winners.slice(0, 5) },
                confidence: Math.min(0.9, winners[0].sampleSize / 50),
                sampleSize: winners.reduce((sum, w) => sum + w.sampleSize, 0),
            },
        });
    }
}

async function analyzePriceBandPatterns(shopId: string) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);

    const lineItems = await prisma.orderLineItem.findMany({
        where: {
            order: { shopId, createdAt: { gte: last90Days } },
        },
        include: {
            order: { include: { refunds: true } },
        },
    });

    // Define price bands
    const bands: Record<string, { min: number; max: number; sales: number; refunds: number }> = {
        'budget': { min: 0, max: 30, sales: 0, refunds: 0 },
        'value': { min: 30, max: 60, sales: 0, refunds: 0 },
        'mid': { min: 60, max: 100, sales: 0, refunds: 0 },
        'premium': { min: 100, max: 200, sales: 0, refunds: 0 },
        'luxury': { min: 200, max: 10000, sales: 0, refunds: 0 },
    };

    for (const item of lineItems) {
        const price = Number(item.price);
        for (const [band, range] of Object.entries(bands)) {
            if (price >= range.min && price < range.max) {
                bands[band].sales += item.quantity;
                if (item.order.refunds.length > 0) {
                    bands[band].refunds++;
                }
                break;
            }
        }
    }

    const winners = Object.entries(bands)
        .filter(([_, stats]) => stats.sales >= 3)
        .map(([band, stats]) => ({
            attribute: 'price_band',
            value: band,
            successRate: stats.sales > 0 ? 1 - (stats.refunds / stats.sales) : 0,
            sampleSize: stats.sales,
        }))
        .sort((a, b) => b.successRate * b.sampleSize - a.successRate * a.sampleSize);

    if (winners.length > 0) {
        await prisma.patternMemory.upsert({
            where: { shopId_patternType: { shopId, patternType: 'price_band' } },
            update: {
                patternData: { winners, optimalBand: winners[0].value },
                confidence: Math.min(0.9, winners[0].sampleSize / 30),
                sampleSize: winners.reduce((sum, w) => sum + w.sampleSize, 0),
                lastUpdated: new Date(),
            },
            create: {
                shopId,
                patternType: 'price_band',
                patternData: { winners, optimalBand: winners[0].value },
                confidence: Math.min(0.9, winners[0].sampleSize / 30),
                sampleSize: winners.reduce((sum, w) => sum + w.sampleSize, 0),
            },
        });
    }
}

async function analyzeCategoryPatterns(shopId: string) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);

    const products = await prisma.product.findMany({
        where: { shopId },
        include: {
            variants: {
                include: {
                    metrics: { where: { date: { gte: last90Days } } },
                },
            },
        },
    });

    const categoryStats: Record<string, { sales: number; revenue: number; products: number }> = {};

    for (const product of products) {
        const category = product.productType || 'Uncategorized';
        if (!categoryStats[category]) {
            categoryStats[category] = { sales: 0, revenue: 0, products: 0 };
        }
        categoryStats[category].products++;

        for (const variant of product.variants) {
            for (const metric of variant.metrics) {
                categoryStats[category].sales += metric.unitsSold;
                categoryStats[category].revenue += Number(metric.revenue);
            }
        }
    }

    const winners = Object.entries(categoryStats)
        .filter(([_, stats]) => stats.sales >= 5)
        .map(([category, stats]) => ({
            attribute: 'category',
            value: category,
            velocityPerProduct: stats.products > 0 ? stats.sales / stats.products : 0,
            sampleSize: stats.sales,
            revenue: stats.revenue,
        }))
        .sort((a, b) => b.velocityPerProduct - a.velocityPerProduct);

    if (winners.length > 0) {
        await prisma.patternMemory.upsert({
            where: { shopId_patternType: { shopId, patternType: 'category_affinity' } },
            update: {
                patternData: { winners: winners.slice(0, 5), topCategory: winners[0].value },
                confidence: Math.min(0.9, winners[0].sampleSize / 40),
                sampleSize: winners.reduce((sum, w) => sum + w.sampleSize, 0),
                lastUpdated: new Date(),
            },
            create: {
                shopId,
                patternType: 'category_affinity',
                patternData: { winners: winners.slice(0, 5), topCategory: winners[0].value },
                confidence: Math.min(0.9, winners[0].sampleSize / 40),
                sampleSize: winners.reduce((sum, w) => sum + w.sampleSize, 0),
            },
        });
    }
}

async function analyzeSeasonalPatterns(shopId: string) {
    // Analyze last 12 months for seasonal patterns
    const last12Months = new Date();
    last12Months.setFullYear(last12Months.getFullYear() - 1);

    const metrics = await prisma.dailyMetric.findMany({
        where: { shopId, date: { gte: last12Months } },
        orderBy: { date: 'asc' },
    });

    const monthlyRevenue: Record<number, { total: number; count: number }> = {};

    for (const m of metrics) {
        const month = m.date.getMonth();
        if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = { total: 0, count: 0 };
        }
        monthlyRevenue[month].total += Number(m.netRevenue);
        monthlyRevenue[month].count++;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seasonality = Object.entries(monthlyRevenue).map(([month, data]) => ({
        month: monthNames[parseInt(month)],
        avgRevenue: data.count > 0 ? data.total / data.count : 0,
    }));

    const avgAllMonths = seasonality.reduce((sum, s) => sum + s.avgRevenue, 0) / (seasonality.length || 1);
    const peakMonths = seasonality.filter(s => s.avgRevenue > avgAllMonths * 1.2);
    const slowMonths = seasonality.filter(s => s.avgRevenue < avgAllMonths * 0.8);

    await prisma.patternMemory.upsert({
        where: { shopId_patternType: { shopId, patternType: 'seasonal' } },
        update: {
            patternData: { peakMonths, slowMonths, monthlyData: seasonality },
            confidence: metrics.length > 60 ? 0.8 : 0.5,
            sampleSize: metrics.length,
            lastUpdated: new Date(),
        },
        create: {
            shopId,
            patternType: 'seasonal',
            patternData: { peakMonths, slowMonths, monthlyData: seasonality },
            confidence: metrics.length > 60 ? 0.8 : 0.5,
            sampleSize: metrics.length,
        },
    });
}

async function analyzeCrossPurchasePatterns(shopId: string) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);

    const orders = await prisma.order.findMany({
        where: { shopId, createdAt: { gte: last90Days } },
        include: { lineItems: true },
    });

    // Track which products are bought together
    const pairCounts: Record<string, { count: number; products: [string, string] }> = {};

    for (const order of orders) {
        const productTitles = [...new Set(order.lineItems.map(li => li.title))];
        if (productTitles.length < 2) continue;

        for (let i = 0; i < productTitles.length; i++) {
            for (let j = i + 1; j < productTitles.length; j++) {
                const key = [productTitles[i], productTitles[j]].sort().join('|||');
                if (!pairCounts[key]) {
                    pairCounts[key] = { count: 0, products: [productTitles[i], productTitles[j]] };
                }
                pairCounts[key].count++;
            }
        }
    }

    const topPairs = Object.values(pairCounts)
        .filter(p => p.count >= 3)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    await prisma.patternMemory.upsert({
        where: { shopId_patternType: { shopId, patternType: 'cross_purchase' } },
        update: {
            patternData: { topPairs },
            confidence: topPairs.length > 0 ? Math.min(0.85, topPairs[0].count / 15) : 0.3,
            sampleSize: orders.length,
            lastUpdated: new Date(),
        },
        create: {
            shopId,
            patternType: 'cross_purchase',
            patternData: { topPairs },
            confidence: topPairs.length > 0 ? Math.min(0.85, topPairs[0].count / 15) : 0.3,
            sampleSize: orders.length,
        },
    });
}
