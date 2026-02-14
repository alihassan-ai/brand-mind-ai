/**
 * Insights Engine
 * Unified intelligence layer for all store insights
 */
import { prisma } from '@brandmind/shared';
// ============================================
// CATALOG HEALTH
// ============================================
export async function calculateCatalogHealth(shopId) {
    var _a;
    const dnaRaw = await prisma.storeDNA.findUnique({ where: { shopId } });
    const patterns = await prisma.patternMemory.findMany({ where: { shopId } });
    if (!dnaRaw) {
        return getDefaultCatalogHealth();
    }
    // Cast to any to access dynamic fields
    const dna = dnaRaw;
    // Diversification score based on concentration risk
    const concentrationRisk = dna.concentrationRisk || 'medium';
    const heroShare = dna.heroProductShare || 0;
    const diversification = {
        score: concentrationRisk === 'low' ? 90 : concentrationRisk === 'medium' ? 65 : 35,
        label: concentrationRisk === 'low' ? 'Well Diversified' : concentrationRisk === 'medium' ? 'Moderate Risk' : 'High Concentration',
        detail: `Hero product is ${heroShare.toFixed(1)}% of revenue`
    };
    // Price coverage
    const pricePattern = patterns.find(p => p.patternType === 'price_band');
    const priceBands = ((_a = pricePattern === null || pricePattern === void 0 ? void 0 : pricePattern.patternData) === null || _a === void 0 ? void 0 : _a.winners) || [];
    const priceCoverage = {
        score: Math.min(100, priceBands.length * 25),
        label: priceBands.length >= 4 ? 'Full Coverage' : priceBands.length >= 2 ? 'Partial Coverage' : 'Limited',
        detail: `Active in ${priceBands.length} price bands`
    };
    // Category depth
    const catDepth = dna.categoryDepth || 'moderate';
    const catBreadth = dna.categoryBreadth || 'moderate';
    const categoryDepth = {
        score: catDepth === 'deep' ? 90 : catDepth === 'moderate' ? 65 : 40,
        label: catDepth === 'deep' ? 'Deep Catalog' : catDepth === 'moderate' ? 'Moderate Depth' : 'Shallow',
        detail: `${catBreadth} category breadth`
    };
    // Velocity - use revenueGrowth30d to determine trend
    const revenueGrowth = dna.revenueGrowth30d || 0;
    const velocityTrend = revenueGrowth > 15 ? 'accelerating' : revenueGrowth > -5 ? 'stable' : 'declining';
    const velocity = {
        score: velocityTrend === 'accelerating' ? 95 : velocityTrend === 'stable' ? 70 : 40,
        label: velocityTrend === 'accelerating' ? 'Growing Fast' : velocityTrend === 'stable' ? 'Stable' : 'Slowing',
        detail: `${revenueGrowth.toFixed(1)}% growth last 30d`
    };
    // Customer loyalty
    const repeatRate = dna.repeatPurchaseRate || 0;
    const customerLoyalty = {
        score: Math.min(100, repeatRate * 200),
        label: repeatRate > 0.3 ? 'Strong Loyalty' : repeatRate > 0.15 ? 'Moderate' : 'Needs Work',
        detail: `${(repeatRate * 100).toFixed(1)}% repeat purchase rate`
    };
    const overallScore = Math.round((diversification.score * 0.2) +
        (priceCoverage.score * 0.15) +
        (categoryDepth.score * 0.15) +
        (velocity.score * 0.3) +
        (customerLoyalty.score * 0.2));
    const grade = overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F';
    const recommendations = [];
    if (diversification.score < 60)
        recommendations.push('Reduce dependency on hero product');
    if (priceCoverage.score < 50)
        recommendations.push('Expand into more price bands');
    if (velocity.score < 60)
        recommendations.push('Focus on marketing to boost velocity');
    if (customerLoyalty.score < 50)
        recommendations.push('Implement loyalty program');
    return {
        overallScore,
        grade,
        metrics: { diversification, priceCoverage, categoryDepth, velocity, customerLoyalty },
        recommendations
    };
}
function getDefaultCatalogHealth() {
    return {
        overallScore: 0,
        grade: 'F',
        metrics: {
            diversification: { score: 0, label: 'No Data', detail: 'Sync your store first' },
            priceCoverage: { score: 0, label: 'No Data', detail: 'Sync your store first' },
            categoryDepth: { score: 0, label: 'No Data', detail: 'Sync your store first' },
            velocity: { score: 0, label: 'No Data', detail: 'Sync your store first' },
            customerLoyalty: { score: 0, label: 'No Data', detail: 'Sync your store first' },
        },
        recommendations: ['Connect your Shopify store to get insights']
    };
}
// ============================================
// PATTERN INSIGHTS
// ============================================
export async function getPatternInsights(shopId) {
    var _a, _b, _c, _d, _e;
    const patterns = await prisma.patternMemory.findMany({ where: { shopId } });
    const insights = [];
    for (const pattern of patterns) {
        const data = pattern.patternData;
        if (pattern.patternType === 'color_preference' && ((_a = data === null || data === void 0 ? void 0 : data.winners) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const winner = data.winners[0];
            insights.push({
                id: `color-${winner.value}`,
                type: 'color_winner',
                title: `${capitalize(winner.value)} is your champion color`,
                detail: `${(winner.successRate * 100).toFixed(0)}% success rate across ${winner.sampleSize} orders`,
                action: 'Expand this color to more product types',
                confidence: pattern.confidence,
                impact: winner.successRate > 0.8 ? 'high' : 'medium',
                icon: 'palette'
            });
        }
        if (pattern.patternType === 'cross_purchase' && ((_b = data === null || data === void 0 ? void 0 : data.topPairs) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const pair = data.topPairs[0];
            insights.push({
                id: `bundle-${pair.products[0].slice(0, 10)}`,
                type: 'bundle_opportunity',
                title: 'Bundle opportunity detected',
                detail: `${pair.count} customers buy these together`,
                action: `Create bundle: ${shortenName(pair.products[0])} + ${shortenName(pair.products[1])}`,
                confidence: pattern.confidence,
                impact: pair.count > 20 ? 'high' : 'medium',
                icon: 'package'
            });
        }
        if (pattern.patternType === 'price_band' && (data === null || data === void 0 ? void 0 : data.optimalBand)) {
            insights.push({
                id: 'price-sweet-spot',
                type: 'price_sweet_spot',
                title: `${capitalize(data.optimalBand)} is your sweet spot`,
                detail: 'Customers convert best at this price point',
                action: 'Focus new products in this price range',
                confidence: pattern.confidence,
                impact: 'high',
                icon: 'dollar-sign'
            });
        }
        if (pattern.patternType === 'seasonal' && ((_c = data === null || data === void 0 ? void 0 : data.peakMonths) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            const peak = data.peakMonths[0];
            insights.push({
                id: `seasonal-${peak.month}`,
                type: 'seasonal_peak',
                title: `${peak.month} is your peak season`,
                detail: `Revenue ${((peak.avgRevenue / (((_d = data.monthlyData) === null || _d === void 0 ? void 0 : _d.reduce((s, m) => s + m.avgRevenue, 0)) / 12 || 1)) * 100 - 100).toFixed(0)}% above average`,
                action: 'Plan inventory and launches for this period',
                confidence: pattern.confidence,
                impact: 'high',
                icon: 'trending-up'
            });
        }
        if (pattern.patternType === 'category_affinity' && ((_e = data === null || data === void 0 ? void 0 : data.winners) === null || _e === void 0 ? void 0 : _e.length) > 0) {
            const top = data.winners[0];
            if (top.velocityPerProduct > 5) {
                insights.push({
                    id: `category-${top.value}`,
                    type: 'growth_category',
                    title: `${top.value} has high velocity`,
                    detail: `${top.velocityPerProduct.toFixed(1)} units/product in 90 days`,
                    action: 'Consider expanding this category',
                    confidence: pattern.confidence,
                    impact: 'medium',
                    icon: 'zap'
                });
            }
        }
    }
    return insights.sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return impactOrder[a.impact] - impactOrder[b.impact];
    });
}
// ============================================
// PRODUCT GRADER
// ============================================
export async function gradeProducts(shopId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const products = await prisma.product.findMany({
        where: { shopId },
        include: {
            variants: {
                include: {
                    metrics: {
                        where: { date: { gte: sixtyDaysAgo } },
                        orderBy: { date: 'desc' }
                    }
                }
            }
        }
    });
    const grades = [];
    for (const product of products) {
        const recentMetrics = product.variants.flatMap(v => v.metrics.filter(m => m.date >= thirtyDaysAgo));
        const olderMetrics = product.variants.flatMap(v => v.metrics.filter(m => m.date < thirtyDaysAgo && m.date >= sixtyDaysAgo));
        const recentRevenue = recentMetrics.reduce((s, m) => s + Number(m.revenue), 0);
        const olderRevenue = olderMetrics.reduce((s, m) => s + Number(m.revenue), 0);
        const recentUnits = recentMetrics.reduce((s, m) => s + m.unitsSold, 0);
        const velocity = recentUnits / 30;
        const refundRate = 0.05; // Would calculate from actual refund data
        // Score: 40% velocity, 40% revenue, 20% low refund
        const velocityScore = Math.min(100, velocity * 10);
        const revenueScore = Math.min(100, recentRevenue / 50);
        const refundScore = (1 - refundRate) * 100;
        const score = (velocityScore * 0.4) + (revenueScore * 0.4) + (refundScore * 0.2);
        const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';
        let trend = 'stable';
        if (olderRevenue > 0) {
            const change = (recentRevenue - olderRevenue) / olderRevenue;
            trend = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';
        }
        let recommendation = 'Keep stocked';
        if (grade === 'F')
            recommendation = 'Consider discontinuing';
        else if (grade === 'D')
            recommendation = 'Needs marketing boost';
        else if (grade === 'A')
            recommendation = 'Expand variants';
        grades.push({
            productId: product.id,
            title: product.title,
            grade,
            score: Math.round(score),
            metrics: { velocity, revenue: recentRevenue, refundRate },
            trend,
            recommendation
        });
    }
    return grades.sort((a, b) => b.score - a.score);
}
// ============================================
// BUNDLE SUGGESTIONS
// ============================================
export async function suggestBundles(shopId) {
    var _a;
    const crossPurchase = await prisma.patternMemory.findUnique({
        where: { shopId_patternType: { shopId, patternType: 'cross_purchase' } }
    });
    const topPairs = ((_a = crossPurchase === null || crossPurchase === void 0 ? void 0 : crossPurchase.patternData) === null || _a === void 0 ? void 0 : _a.topPairs) || [];
    const suggestions = [];
    for (let i = 0; i < Math.min(5, topPairs.length); i++) {
        const pair = topPairs[i];
        if (!pair.products || pair.products.length < 2)
            continue;
        suggestions.push({
            id: `bundle-${i}`,
            products: pair.products,
            productIds: [], // Would need to resolve from titles
            coOccurrences: pair.count,
            suggestedDiscount: pair.count > 20 ? 10 : 15,
            estimatedUplift: pair.count * 15,
            bundleName: `${shortenName(pair.products[0])} + ${shortenName(pair.products[1])} Set`,
            confidence: Math.min(0.9, 0.5 + pair.count / 50)
        });
    }
    return suggestions;
}
// ============================================
// PRICE ALERTS
// ============================================
export async function getPriceAlerts(shopId) {
    var _a, _b;
    const pricePattern = await prisma.patternMemory.findUnique({
        where: { shopId_patternType: { shopId, patternType: 'price_band' } }
    });
    const optimalBand = ((_a = pricePattern === null || pricePattern === void 0 ? void 0 : pricePattern.patternData) === null || _a === void 0 ? void 0 : _a.optimalBand) || 'value';
    const products = await prisma.product.findMany({
        where: { shopId },
        include: { variants: { take: 1 } }
    });
    const alerts = [];
    const priceRanges = {
        'budget': [0, 30],
        'value': [30, 60],
        'mid': [60, 100],
        'premium': [100, 200],
        'luxury': [200, 1000]
    };
    for (const product of products) {
        const price = Number(((_b = product.variants[0]) === null || _b === void 0 ? void 0 : _b.price) || 0);
        if (price === 0)
            continue;
        let currentBand = 'value';
        for (const [band, [min, max]] of Object.entries(priceRanges)) {
            if (price >= min && price < max) {
                currentBand = band;
                break;
            }
        }
        if (currentBand !== optimalBand) {
            const [optMin, optMax] = priceRanges[optimalBand];
            alerts.push({
                productId: product.id,
                productTitle: product.title,
                currentPrice: price,
                currentBand,
                optimalBand,
                suggestion: `Consider a variant at €${optMin}-${optMax}`,
                potentialUplift: '+15-25% conversion'
            });
        }
    }
    return alerts.slice(0, 10);
}
// ============================================
// SEASONAL CALENDAR
// ============================================
export async function getSeasonalCalendar(shopId) {
    const seasonal = await prisma.patternMemory.findUnique({
        where: { shopId_patternType: { shopId, patternType: 'seasonal' } }
    });
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = seasonal === null || seasonal === void 0 ? void 0 : seasonal.patternData;
    const monthlyData = (data === null || data === void 0 ? void 0 : data.monthlyData) || [];
    const peakMonths = (data === null || data === void 0 ? void 0 : data.peakMonths) || [];
    const slowMonths = (data === null || data === void 0 ? void 0 : data.slowMonths) || [];
    const avgRevenue = monthlyData.length > 0
        ? monthlyData.reduce((s, m) => s + m.avgRevenue, 0) / monthlyData.length
        : 1;
    return monthNames.map((month, idx) => {
        const monthData = monthlyData.find((m) => m.month === month);
        const revenue = (monthData === null || monthData === void 0 ? void 0 : monthData.avgRevenue) || 0;
        const isPeak = peakMonths.some((p) => p.month === month);
        const isSlow = slowMonths.some((s) => s.month === month);
        let recommendation = 'Maintain steady operations';
        let icon = 'minus';
        if (isPeak) {
            recommendation = 'Launch new products, stock up inventory';
            icon = 'rocket';
        }
        else if (isSlow) {
            recommendation = 'Run promotions, clear old stock';
            icon = 'tag';
        }
        return {
            month,
            monthIndex: idx,
            revenueIndex: avgRevenue > 0 ? revenue / avgRevenue : 1,
            isPeak,
            isSlow,
            recommendation,
            icon
        };
    });
}
// ============================================
// CANNIBALIZATION DETECTOR
// ============================================
export async function detectCannibalization(shopId) {
    var _a, _b;
    const products = await prisma.product.findMany({
        where: { shopId },
        include: { variants: { take: 1 } }
    });
    const pairs = [];
    for (let i = 0; i < products.length && pairs.length < 10; i++) {
        for (let j = i + 1; j < products.length && pairs.length < 10; j++) {
            const p1 = products[i];
            const p2 = products[j];
            const sharedAttributes = [];
            let similarity = 0;
            // Same product type
            if (p1.productType && p1.productType === p2.productType) {
                similarity += 0.4;
                sharedAttributes.push(`Same type: ${p1.productType}`);
            }
            // Similar price
            const price1 = Number(((_a = p1.variants[0]) === null || _a === void 0 ? void 0 : _a.price) || 0);
            const price2 = Number(((_b = p2.variants[0]) === null || _b === void 0 ? void 0 : _b.price) || 0);
            if (price1 > 0 && price2 > 0 && Math.abs(price1 - price2) < 15) {
                similarity += 0.3;
                sharedAttributes.push(`Similar price: €${price1.toFixed(0)} vs €${price2.toFixed(0)}`);
            }
            // Title word overlap
            const words1 = new Set(p1.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
            const words2 = new Set(p2.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
            const overlap = [...words1].filter(w => words2.has(w)).length;
            if (overlap >= 2) {
                similarity += 0.3 * Math.min(1, overlap / 3);
                sharedAttributes.push(`${overlap} shared keywords`);
            }
            if (similarity >= 0.6) {
                pairs.push({
                    product1: { id: p1.id, title: p1.title },
                    product2: { id: p2.id, title: p2.title },
                    similarity: Math.round(similarity * 100),
                    sharedAttributes,
                    recommendation: similarity > 0.8 ? 'Consider consolidating' : 'Differentiate positioning'
                });
            }
        }
    }
    return pairs.sort((a, b) => b.similarity - a.similarity);
}
// ============================================
// CUSTOMER COHORTS
// ============================================
export async function analyzeCustomerCohorts(shopId) {
    var _a;
    // Get orders grouped by customer
    const orders = await prisma.order.findMany({
        where: { shopId, customerId: { not: null } },
        select: { customerId: true, totalPrice: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });
    // Group orders by customer
    const customerOrders = {};
    for (const order of orders) {
        if (!order.customerId)
            continue;
        if (!customerOrders[order.customerId]) {
            customerOrders[order.customerId] = { orders: [] };
        }
        customerOrders[order.customerId].orders.push({
            totalPrice: order.totalPrice,
            createdAt: order.createdAt
        });
    }
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cohorts = {
        vip: { count: 0, revenue: 0 },
        loyal: { count: 0, revenue: 0 },
        atRisk: { count: 0, revenue: 0 },
        oneTime: { count: 0, revenue: 0 },
        new: { count: 0, revenue: 0 }
    };
    for (const customerId of Object.keys(customerOrders)) {
        const customerData = customerOrders[customerId];
        const orderCount = customerData.orders.length;
        const totalRevenue = customerData.orders.reduce((s, o) => s + Number(o.totalPrice), 0);
        const lastOrder = (_a = customerData.orders[0]) === null || _a === void 0 ? void 0 : _a.createdAt;
        const daysSince = lastOrder ? Math.floor((Date.now() - lastOrder.getTime()) / (1000 * 60 * 60 * 24)) : 999;
        if (orderCount >= 3 && totalRevenue > 300) {
            cohorts.vip.count++;
            cohorts.vip.revenue += totalRevenue;
        }
        else if (orderCount >= 2) {
            cohorts.loyal.count++;
            cohorts.loyal.revenue += totalRevenue;
        }
        else if (orderCount === 1 && daysSince > 90) {
            cohorts.atRisk.count++;
            cohorts.atRisk.revenue += totalRevenue;
        }
        else if (orderCount === 1 && daysSince <= 30) {
            cohorts.new.count++;
            cohorts.new.revenue += totalRevenue;
        }
        else {
            cohorts.oneTime.count++;
            cohorts.oneTime.revenue += totalRevenue;
        }
    }
    const total = Object.keys(customerOrders).length || 1;
    return [
        {
            name: 'VIP',
            count: cohorts.vip.count,
            percentage: (cohorts.vip.count / total) * 100,
            totalRevenue: cohorts.vip.revenue,
            avgOrderValue: cohorts.vip.count > 0 ? cohorts.vip.revenue / cohorts.vip.count : 0,
            color: '#f59e0b',
            action: 'Exclusive early access & perks'
        },
        {
            name: 'Loyal',
            count: cohorts.loyal.count,
            percentage: (cohorts.loyal.count / total) * 100,
            totalRevenue: cohorts.loyal.revenue,
            avgOrderValue: cohorts.loyal.count > 0 ? cohorts.loyal.revenue / cohorts.loyal.count : 0,
            color: '#10b981',
            action: 'Loyalty rewards program'
        },
        {
            name: 'New',
            count: cohorts.new.count,
            percentage: (cohorts.new.count / total) * 100,
            totalRevenue: cohorts.new.revenue,
            avgOrderValue: cohorts.new.count > 0 ? cohorts.new.revenue / cohorts.new.count : 0,
            color: '#3b82f6',
            action: 'Welcome series & second purchase incentive'
        },
        {
            name: 'One-Time',
            count: cohorts.oneTime.count,
            percentage: (cohorts.oneTime.count / total) * 100,
            totalRevenue: cohorts.oneTime.revenue,
            avgOrderValue: cohorts.oneTime.count > 0 ? cohorts.oneTime.revenue / cohorts.oneTime.count : 0,
            color: '#6b7280',
            action: 'Re-engagement campaign'
        },
        {
            name: 'At Risk',
            count: cohorts.atRisk.count,
            percentage: (cohorts.atRisk.count / total) * 100,
            totalRevenue: cohorts.atRisk.revenue,
            avgOrderValue: cohorts.atRisk.count > 0 ? cohorts.atRisk.revenue / cohorts.atRisk.count : 0,
            color: '#ef4444',
            action: 'Win-back campaign with discount'
        }
    ];
}
// ============================================
// RESTOCK PREDICTOR
// ============================================
export async function predictRestocks(shopId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const products = await prisma.product.findMany({
        where: { shopId },
        include: {
            variants: {
                include: {
                    metrics: {
                        where: { date: { gte: thirtyDaysAgo } }
                    }
                }
            }
        }
    });
    const alerts = [];
    for (const product of products) {
        const totalUnits = product.variants.reduce((s, v) => s + v.metrics.reduce((ss, m) => ss + m.unitsSold, 0), 0);
        const dailyVelocity = totalUnits / 30;
        const currentStock = product.variants.reduce((s, v) => s + (v.inventoryQuantity || 0), 0);
        const daysUntilStockout = dailyVelocity > 0 ? currentStock / dailyVelocity : 999;
        let urgency = 'ok';
        if (daysUntilStockout < 7)
            urgency = 'critical';
        else if (daysUntilStockout < 14)
            urgency = 'warning';
        if (urgency !== 'ok' || dailyVelocity > 0.5) {
            alerts.push({
                productId: product.id,
                productTitle: product.title,
                currentStock,
                dailyVelocity: Math.round(dailyVelocity * 10) / 10,
                daysUntilStockout: Math.round(daysUntilStockout),
                urgency,
                suggestedReorder: Math.round(dailyVelocity * 45) // 45 day supply
            });
        }
    }
    return alerts.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout).slice(0, 15);
}
// ============================================
// MARKETING MOMENTS
// ============================================
export async function findMarketingMoments(shopId) {
    var _a;
    const seasonal = await prisma.patternMemory.findUnique({
        where: { shopId_patternType: { shopId, patternType: 'seasonal' } }
    });
    const crossPurchase = await prisma.patternMemory.findUnique({
        where: { shopId_patternType: { shopId, patternType: 'cross_purchase' } }
    });
    const cohorts = await analyzeCustomerCohorts(shopId);
    const moments = [];
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        .toLocaleString('en', { month: 'short' });
    const seasonalData = seasonal === null || seasonal === void 0 ? void 0 : seasonal.patternData;
    const peakMonths = (seasonalData === null || seasonalData === void 0 ? void 0 : seasonalData.peakMonths) || [];
    const slowMonths = (seasonalData === null || seasonalData === void 0 ? void 0 : seasonalData.slowMonths) || [];
    // Peak month coming - product launch
    if (peakMonths.some((p) => p.month === nextMonth)) {
        moments.push({
            id: 'launch-peak',
            type: 'product_launch',
            timing: `Early ${nextMonth}`,
            title: 'Peak Season Launch Window',
            description: `${nextMonth} is historically your best month. Launch new products now.`,
            targetAudience: 'All customers',
            expectedImpact: '+20-40% revenue vs off-peak',
            priority: 'high'
        });
    }
    // Slow month coming - flash sale
    if (slowMonths.some((s) => s.month === nextMonth)) {
        moments.push({
            id: 'flash-slow',
            type: 'flash_sale',
            timing: `Start of ${nextMonth}`,
            title: 'Pre-emptive Flash Sale',
            description: `${nextMonth} typically underperforms. Run a flash sale to boost traffic.`,
            targetAudience: 'Email subscribers',
            expectedImpact: 'Mitigate 15-25% revenue dip',
            priority: 'high'
        });
    }
    // Bundle promo from cross-purchase
    const topPairs = ((_a = crossPurchase === null || crossPurchase === void 0 ? void 0 : crossPurchase.patternData) === null || _a === void 0 ? void 0 : _a.topPairs) || [];
    if (topPairs.length > 0) {
        moments.push({
            id: 'bundle-promo',
            type: 'bundle_promo',
            timing: 'This week',
            title: 'Bundle Campaign',
            description: `Promote top bundle: ${shortenName(topPairs[0].products[0])} + ${shortenName(topPairs[0].products[1])}`,
            targetAudience: 'Past purchasers of either product',
            expectedImpact: `+€${(topPairs[0].count * 15).toFixed(0)}/month potential`,
            priority: 'medium'
        });
    }
    // Win-back for at-risk
    const atRisk = cohorts.find(c => c.name === 'At Risk');
    if (atRisk && atRisk.count > 10) {
        moments.push({
            id: 'winback',
            type: 'winback',
            timing: 'Next 7 days',
            title: 'Win-Back Campaign',
            description: `${atRisk.count} customers haven't ordered in 90+ days`,
            targetAudience: 'At-risk segment',
            expectedImpact: `Recover €${(atRisk.count * 50).toFixed(0)} potential revenue`,
            priority: 'medium'
        });
    }
    // VIP appreciation
    const vip = cohorts.find(c => c.name === 'VIP');
    if (vip && vip.count > 5) {
        moments.push({
            id: 'vip-love',
            type: 'loyalty',
            timing: 'Ongoing',
            title: 'VIP Appreciation',
            description: `${vip.count} VIPs drive significant revenue. Show them love.`,
            targetAudience: 'VIP segment',
            expectedImpact: 'Increase LTV by 20%+',
            priority: 'low'
        });
    }
    return moments.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}
// ============================================
// HELPERS
// ============================================
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function shortenName(name) {
    const shortened = name
        .replace(/^(Warme Loungewear |Warme |Mystery )/i, '')
        .replace(/ Long Version$/i, '')
        .replace(/ Short Version$/i, '');
    return shortened.length > 25 ? shortened.substring(0, 22) + '...' : shortened;
}
