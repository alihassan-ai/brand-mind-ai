/**
 * Store DNA Extractor
 * Analyzes store data to extract patterns, preferences, and intelligence
 */
import { prisma } from '@brandmind/shared';
// ============================================
// HELPER FUNCTIONS
// ============================================
function toNumber(val) {
    if (val === null || val === undefined)
        return 0;
    if (typeof val === 'number')
        return val;
    return Number(val);
}
function getPriceBandLabel(price) {
    if (price < 25)
        return '0-25 (Budget)';
    if (price < 50)
        return '25-50 (Mid)';
    if (price < 100)
        return '50-100 (Premium)';
    if (price < 200)
        return '100-200 (Luxury)';
    return '200+ (Ultra)';
}
function getPriceBandBounds(band) {
    const bounds = {
        '0-25 (Budget)': { min: 0, max: 25 },
        '25-50 (Mid)': { min: 25, max: 50 },
        '50-100 (Premium)': { min: 50, max: 100 },
        '100-200 (Luxury)': { min: 100, max: 200 },
        '200+ (Ultra)': { min: 200, max: Infinity },
    };
    return bounds[band] || { min: 0, max: 0 };
}
// ============================================
// CALCULATORS
// ============================================
/**
 * 2.1 Product Velocity Calculator
 * velocity = total_units_sold / days_since_created
 * acceleration = Δvelocity_30d - Δvelocity_60d
 */
export async function calculateProductVelocities(shopId) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    // Get all products with their sales data
    const products = await prisma.product.findMany({
        where: { shopId },
        select: {
            id: true,
            shopifyId: true,
            title: true,
            createdAt: true,
        },
    });
    const velocities = [];
    for (const product of products) {
        // Total units sold (all time)
        const totalSales = await prisma.orderLineItem.aggregate({
            where: {
                productId: product.shopifyId,
                order: { shopId },
            },
            _sum: { quantity: true },
        });
        // Sales in last 30 days
        const sales30d = await prisma.orderLineItem.aggregate({
            where: {
                productId: product.shopifyId,
                order: { shopId, createdAt: { gte: thirtyDaysAgo } },
            },
            _sum: { quantity: true },
        });
        // Sales 30-60 days ago
        const sales60d = await prisma.orderLineItem.aggregate({
            where: {
                productId: product.shopifyId,
                order: {
                    shopId,
                    createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
                },
            },
            _sum: { quantity: true },
        });
        const totalUnitsSold = totalSales._sum.quantity || 0;
        const daysSinceCreated = Math.max(1, Math.floor((now.getTime() - product.createdAt.getTime()) / (24 * 60 * 60 * 1000)));
        const velocity = totalUnitsSold / daysSinceCreated;
        const velocity30d = (sales30d._sum.quantity || 0) / 30;
        const velocity60d = (sales60d._sum.quantity || 0) / 30;
        const acceleration = velocity30d - velocity60d;
        // Determine lifecycle stage
        let lifecycleStage;
        if (velocity < 0.01) {
            lifecycleStage = 'dead';
        }
        else if (acceleration > 0.05) {
            lifecycleStage = 'rising';
        }
        else if (acceleration < -0.05) {
            lifecycleStage = 'declining';
        }
        else {
            lifecycleStage = 'peak';
        }
        velocities.push({
            productId: product.id,
            title: product.title,
            velocity: Math.round(velocity * 100) / 100,
            acceleration: Math.round(acceleration * 100) / 100,
            lifecycleStage,
            daysSinceCreated,
            totalUnitsSold,
        });
    }
    return velocities.sort((a, b) => b.velocity - a.velocity);
}
/**
 * 2.2 Price Band Analyzer
 * Group products into bands and calculate metrics per band
 */
export async function analyzePriceBands(shopId) {
    // Get all line items with their prices
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        select: {
            price: true,
            quantity: true,
            orderId: true,
        },
    });
    // Get refunds by order
    const refunds = await prisma.refund.findMany({
        where: { order: { shopId } },
        select: { orderId: true, amount: true },
    });
    const refundedOrders = new Set(refunds.map(r => r.orderId));
    // Group by price band
    const bandData = {};
    const bandLabels = ['0-25 (Budget)', '25-50 (Mid)', '50-100 (Premium)', '100-200 (Luxury)', '200+ (Ultra)'];
    bandLabels.forEach(b => bandData[b] = { revenue: 0, orders: new Set(), refunds: 0, prices: [] });
    for (const item of lineItems) {
        const price = toNumber(item.price);
        const band = getPriceBandLabel(price);
        bandData[band].revenue += price * item.quantity;
        bandData[band].orders.add(item.orderId);
        bandData[band].prices.push(price);
        if (refundedOrders.has(item.orderId)) {
            bandData[band].refunds++;
        }
    }
    // Get product counts per band
    const variants = await prisma.variant.findMany({
        where: { product: { shopId } },
        select: { price: true },
    });
    const productCountByBand = {};
    bandLabels.forEach(b => productCountByBand[b] = 0);
    for (const v of variants) {
        const band = getPriceBandLabel(toNumber(v.price));
        productCountByBand[band]++;
    }
    // Build price bands array
    const priceBands = bandLabels.map(band => {
        const data = bandData[band];
        const bounds = getPriceBandBounds(band);
        const orderCount = data.orders.size;
        return {
            band,
            min: bounds.min,
            max: bounds.max === Infinity ? 1000 : bounds.max,
            revenue: Math.round(data.revenue * 100) / 100,
            orders: orderCount,
            products: productCountByBand[band],
            avgPrice: data.prices.length > 0
                ? Math.round((data.prices.reduce((a, b) => a + b, 0) / data.prices.length) * 100) / 100
                : 0,
            refundRate: orderCount > 0
                ? Math.round((data.refunds / orderCount) * 10000) / 100
                : 0,
        };
    });
    // Find sweet spot: highest (revenue × velocity) / (1 + refundRate)
    const sweetSpot = priceBands.reduce((best, current) => {
        const currentScore = (current.revenue * current.orders) / (1 + current.refundRate / 100);
        const bestScore = (best.revenue * best.orders) / (1 + best.refundRate / 100);
        return currentScore > bestScore ? current : best;
    }, priceBands[0]).band;
    return { priceBands, sweetSpot };
}
/**
 * 2.3 Product Type Performance
 */
export async function analyzeProductTypePerformance(shopId) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    // Get products with their types
    const products = await prisma.product.findMany({
        where: { shopId },
        select: { shopifyId: true, productType: true },
    });
    const productTypeMap = new Map(products.map(p => [p.shopifyId, p.productType || 'Uncategorized']));
    // Get sales data by product
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        include: { order: { select: { createdAt: true } } },
    });
    // Aggregate by product type
    const typeData = {};
    for (const item of lineItems) {
        const productType = productTypeMap.get(item.productId || '') || 'Uncategorized';
        if (!typeData[productType]) {
            typeData[productType] = { revenue: 0, revenue30d: 0, revenue60d: 0, orders: new Set() };
        }
        const revenue = toNumber(item.price) * item.quantity;
        typeData[productType].revenue += revenue;
        typeData[productType].orders.add(item.orderId);
        const orderDate = item.order.createdAt;
        if (orderDate >= thirtyDaysAgo) {
            typeData[productType].revenue30d += revenue;
        }
        else if (orderDate >= sixtyDaysAgo) {
            typeData[productType].revenue60d += revenue;
        }
    }
    const totalRevenue = Object.values(typeData).reduce((sum, d) => sum + d.revenue, 0);
    const performances = Object.entries(typeData).map(([type, data]) => {
        const growthRate = data.revenue60d > 0
            ? ((data.revenue30d - data.revenue60d) / data.revenue60d) * 100
            : 0;
        return {
            type,
            revenue: Math.round(data.revenue * 100) / 100,
            revenueShare: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 10000) / 100 : 0,
            orderCount: data.orders.size,
            growthRate: Math.round(growthRate * 100) / 100,
            avgOrderValue: data.orders.size > 0
                ? Math.round((data.revenue / data.orders.size) * 100) / 100
                : 0,
        };
    });
    return performances.sort((a, b) => b.revenue - a.revenue);
}
/**
 * 2.5 Vendor Performance & Concentration (HHI)
 */
export async function analyzeVendorPerformance(shopId) {
    // Get products with vendors
    const products = await prisma.product.findMany({
        where: { shopId },
        select: { shopifyId: true, vendor: true },
    });
    const vendorMap = new Map(products.map(p => [p.shopifyId, p.vendor || 'Unknown']));
    // Get sales data
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        select: { productId: true, price: true, quantity: true, orderId: true },
    });
    // Get refunds
    const refunds = await prisma.refund.findMany({
        where: { order: { shopId } },
        select: { orderId: true },
    });
    const refundedOrders = new Set(refunds.map(r => r.orderId));
    // Aggregate by vendor
    const vendorData = {};
    for (const item of lineItems) {
        const vendor = vendorMap.get(item.productId || '') || 'Unknown';
        if (!vendorData[vendor]) {
            vendorData[vendor] = { revenue: 0, orders: new Set(), refunds: 0 };
        }
        vendorData[vendor].revenue += toNumber(item.price) * item.quantity;
        vendorData[vendor].orders.add(item.orderId);
        if (refundedOrders.has(item.orderId)) {
            vendorData[vendor].refunds++;
        }
    }
    const totalRevenue = Object.values(vendorData).reduce((sum, d) => sum + d.revenue, 0);
    // Count products per vendor
    const vendorProductCount = {};
    for (const p of products) {
        const v = p.vendor || 'Unknown';
        vendorProductCount[v] = (vendorProductCount[v] || 0) + 1;
    }
    const vendors = Object.entries(vendorData).map(([vendor, data]) => ({
        vendor,
        revenue: Math.round(data.revenue * 100) / 100,
        revenueShare: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 10000) / 100 : 0,
        refundRate: data.orders.size > 0
            ? Math.round((data.refunds / data.orders.size) * 10000) / 100
            : 0,
        productCount: vendorProductCount[vendor] || 0,
    }));
    // Calculate HHI (Herfindahl-Hirschman Index)
    // HHI = Σ(market_share²), ranges from 0 (perfect competition) to 1 (monopoly)
    const hhi = vendors.reduce((sum, v) => {
        const share = v.revenueShare / 100;
        return sum + (share * share);
    }, 0);
    return {
        vendors: vendors.sort((a, b) => b.revenue - a.revenue),
        concentrationHHI: Math.round(hhi * 10000) / 10000,
    };
}
/**
 * 2.6 Seasonality Curve
 */
export async function analyzeSeasonality(shopId) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Get orders with dates
    const orders = await prisma.order.findMany({
        where: { shopId },
        select: { createdAt: true, totalPrice: true },
    });
    // Aggregate by month
    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
        monthlyData[i] = { revenue: 0, count: 0 };
    }
    for (const order of orders) {
        const month = order.createdAt.getMonth();
        monthlyData[month].revenue += toNumber(order.totalPrice);
        monthlyData[month].count++;
    }
    const avgMonthlyRevenue = Object.values(monthlyData).reduce((sum, d) => sum + d.revenue, 0) / 12;
    const seasonality = Object.entries(monthlyData).map(([month, data]) => ({
        month: parseInt(month),
        monthName: monthNames[parseInt(month)],
        revenue: Math.round(data.revenue * 100) / 100,
        revenueIndex: avgMonthlyRevenue > 0
            ? Math.round((data.revenue / avgMonthlyRevenue) * 100) / 100
            : 0,
        orderCount: data.count,
    }));
    return seasonality;
}
/**
 * 2.4 Customer Purchase Patterns - Entry Products
 * Returns top products that appear in orders (simplified)
 */
export async function findEntryProducts(shopId) {
    // Get all line items to analyze popular products
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        select: { title: true },
    });
    // Count occurrences
    const productCounts = {};
    for (const item of lineItems) {
        productCounts[item.title] = (productCounts[item.title] || 0) + 1;
    }
    const total = lineItems.length;
    return Object.entries(productCounts)
        .map(([title, count]) => ({
        title,
        count,
        share: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
}
/**
 * 2.7 Compute Store DNA - Main function
 */
export async function computeStoreDNA(shopId) {
    console.log(`[StoreDNA] Computing DNA for shop: ${shopId}`);
    // Run all calculators
    const [velocities, priceAnalysis, typePerformance, vendorAnalysis, seasonality, entryProducts] = await Promise.all([
        calculateProductVelocities(shopId),
        analyzePriceBands(shopId),
        analyzeProductTypePerformance(shopId),
        analyzeVendorPerformance(shopId),
        analyzeSeasonality(shopId),
        findEntryProducts(shopId),
    ]);
    // Load basket affinities from PatternMemory (cross_purchase pattern)
    const crossPurchasePattern = await prisma.patternMemory.findUnique({
        where: { shopId_patternType: { shopId, patternType: 'cross_purchase' } },
    });
    const basketAffinities = [];
    if (crossPurchasePattern) {
        const patternData = crossPurchasePattern.patternData;
        const topPairs = (patternData === null || patternData === void 0 ? void 0 : patternData.topPairs) || [];
        for (const pair of topPairs) {
            basketAffinities.push({
                product1: pair.products[0],
                product2: pair.products[1],
                cooccurrence: pair.count,
                lift: Math.min(3, pair.count / 5), // Normalize lift score
            });
        }
    }
    // Categorize products by lifecycle
    const rising = velocities.filter(v => v.lifecycleStage === 'rising');
    const peak = velocities.filter(v => v.lifecycleStage === 'peak');
    const declining = velocities.filter(v => v.lifecycleStage === 'declining');
    const dead = velocities.filter(v => v.lifecycleStage === 'dead');
    // Calculate health scores
    const catalogHealthScore = Math.min(100, Math.round((rising.length * 2 + peak.length * 1.5 - declining.length * 0.5 - dead.length) /
        Math.max(1, velocities.length) * 50 + 50));
    const customerHealthScore = Math.min(100, Math.round((entryProducts.length > 3 ? 30 : entryProducts.length * 10) +
        (vendorAnalysis.concentrationHHI < 0.25 ? 30 : 15) +
        40 // Base score
    ));
    // Upsert to database
    const storeDNA = await prisma.storeDNA.upsert({
        where: { shopId },
        update: {
            priceSweetSpot: { sweetSpot: priceAnalysis.sweetSpot },
            priceBands: priceAnalysis.priceBands,
            topPerformingTypes: typePerformance.slice(0, 5),
            growingTypes: typePerformance.filter(t => t.growthRate > 10),
            decliningTypes: typePerformance.filter(t => t.growthRate < -10),
            productLifecycles: velocities.slice(0, 50).map(v => ({
                productId: v.productId,
                stage: v.lifecycleStage,
                velocity: v.velocity,
                acceleration: v.acceleration,
            })),
            customerSegments: [],
            basketAffinities: basketAffinities,
            entryProducts: entryProducts,
            upgradePaths: [],
            vendorPerformance: vendorAnalysis.vendors.slice(0, 10),
            vendorConcentration: vendorAnalysis.concentrationHHI,
            seasonalityCurve: seasonality,
            catalogHealthScore,
            customerHealthScore,
            computedAt: new Date(),
        },
        create: {
            shopId,
            priceSweetSpot: { sweetSpot: priceAnalysis.sweetSpot },
            priceBands: priceAnalysis.priceBands,
            topPerformingTypes: typePerformance.slice(0, 5),
            growingTypes: typePerformance.filter(t => t.growthRate > 10),
            decliningTypes: typePerformance.filter(t => t.growthRate < -10),
            productLifecycles: velocities.slice(0, 50).map(v => ({
                productId: v.productId,
                stage: v.lifecycleStage,
                velocity: v.velocity,
                acceleration: v.acceleration,
            })),
            customerSegments: [],
            basketAffinities: basketAffinities,
            entryProducts: entryProducts,
            upgradePaths: [],
            vendorPerformance: vendorAnalysis.vendors.slice(0, 10),
            vendorConcentration: vendorAnalysis.concentrationHHI,
            seasonalityCurve: seasonality,
            catalogHealthScore,
            customerHealthScore,
        },
    });
    console.log(`[StoreDNA] Computation complete. Catalog Health: ${catalogHealthScore}, Customer Health: ${customerHealthScore}, Basket Affinities: ${basketAffinities.length}`);
    return storeDNA;
}
