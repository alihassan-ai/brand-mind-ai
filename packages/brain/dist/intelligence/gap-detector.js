/**
 * Gap Detection Engine
 * Identifies opportunities in the store's catalog
 */
import { prisma } from '@brandmind/shared';
// ============================================
// HELPERS
// ============================================
function toNumber(val) {
    if (val === null || val === undefined)
        return 0;
    if (typeof val === 'number')
        return val;
    return Number(val);
}
// ============================================
// GAP DETECTORS
// ============================================
/**
 * 3.1 Price Gap Detector
 * Finds price bands with adjacent demand but low product count
 */
export async function detectPriceGaps(shopId) {
    const gaps = [];
    // Get variants with prices
    const variants = await prisma.variant.findMany({
        where: { product: { shopId } },
        select: { price: true },
    });
    // Get sales by price bands
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        select: { price: true, quantity: true },
    });
    // Define price bands (clean, unformatted)
    const bands = [
        { name: '0-25', min: 0, max: 25, label: 'Budget' },
        { name: '25-50', min: 25, max: 50, label: 'Mid' },
        { name: '50-75', min: 50, max: 75, label: 'Standard' },
        { name: '75-100', min: 75, max: 100, label: 'Premium' },
        { name: '100-150', min: 100, max: 150, label: 'Elite' },
        { name: '150-200', min: 150, max: 200, label: 'Luxury' },
        { name: '200+', min: 200, max: Infinity, label: 'Ultra' },
    ];
    // Count products and sales per band
    const bandData = bands.map(band => {
        const productCount = variants.filter(v => {
            const price = toNumber(v.price);
            return price >= band.min && price < band.max;
        }).length;
        const sales = lineItems
            .filter(li => {
            const price = toNumber(li.price);
            return price >= band.min && price < band.max;
        })
            .reduce((sum, li) => sum + li.quantity, 0);
        return Object.assign(Object.assign({}, band), { productCount, sales });
    });
    // Detect gaps (low product count but adjacent bands have high sales)
    for (let i = 0; i < bandData.length; i++) {
        const current = bandData[i];
        const prev = bandData[i - 1];
        const next = bandData[i + 1];
        const adjacentSales = ((prev === null || prev === void 0 ? void 0 : prev.sales) || 0) + ((next === null || next === void 0 ? void 0 : next.sales) || 0);
        if (current.productCount < 5 && adjacentSales > 50) {
            const gapScore = Math.min(1, (adjacentSales / 100) * (1 - current.productCount / 10));
            if (gapScore > 0.3) {
                const avgAdjacentRevenue = adjacentSales * ((current.min + (current.max === Infinity ? current.min * 1.5 : current.max)) / 2);
                gaps.push({
                    gapType: 'price_gap',
                    gapScore: Math.round(gapScore * 100) / 100,
                    gapData: {
                        band: current.name,
                        priceRange: { min: current.min, max: current.max === Infinity ? 500 : current.max },
                        currentProducts: current.productCount,
                        adjacentDemand: adjacentSales,
                    },
                    description: `Price Void Detected: ${current.name} range`,
                    suggestedAction: `Expand catalog into the ${current.name} band. Regional demand is high with ${adjacentSales} units sold in adjacent price points.`,
                    potentialRevenue: Math.round(avgAdjacentRevenue * 0.3),
                    confidence: Math.min(0.9, gapScore + 0.2),
                });
            }
        }
    }
    return gaps;
}
/**
 * 3.2 Category Adjacency Gaps
 * Identifies missing complementary product categories
 */
export async function detectCategoryGaps(shopId) {
    const gaps = [];
    // Define category adjacencies (what should exist together)
    const categoryAdjacencies = {
        'Shoes': ['Socks', 'Shoe Care', 'Insoles', 'Laces'],
        'Dresses': ['Accessories', 'Jewelry', 'Bags', 'Belts'],
        'Coffee': ['Mugs', 'Coffee Accessories', 'Filters'],
        'Electronics': ['Cables', 'Cases', 'Accessories'],
        'Clothing': ['Accessories', 'Bags', 'Jewelry'],
        'Skincare': ['Tools', 'Accessories', 'Travel Size'],
        'Furniture': ['Accessories', 'Decor', 'Lighting'],
    };
    // Get existing product types
    const products = await prisma.product.findMany({
        where: { shopId },
        select: { productType: true },
    });
    const existingTypes = new Set(products.map(p => { var _a; return ((_a = p.productType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || ''; }));
    // Get revenue by type
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        include: { order: { select: { createdAt: true } } },
    });
    const productTypeMap = new Map(products.map(p => [p.productType, p.productType]));
    // Check for missing adjacencies
    for (const [mainCategory, adjacentCategories] of Object.entries(categoryAdjacencies)) {
        // Check if main category exists
        const hasMainCategory = Array.from(existingTypes).some(t => t.includes(mainCategory.toLowerCase()));
        if (hasMainCategory) {
            // Check for missing adjacent categories
            for (const adjacent of adjacentCategories) {
                const hasAdjacent = Array.from(existingTypes).some(t => t.includes(adjacent.toLowerCase()));
                if (!hasAdjacent) {
                    gaps.push({
                        gapType: 'category_gap',
                        gapScore: 0.6,
                        gapData: {
                            mainCategory,
                            missingCategory: adjacent,
                            reason: `Customers buying ${mainCategory} often want ${adjacent}`,
                        },
                        description: `Category Inconsistency: Missing ${adjacent}`,
                        suggestedAction: `Consider adding ${adjacent} products to complement your existing ${mainCategory} collection. High catalog affinity detected.`,
                        potentialRevenue: null,
                        confidence: 0.7,
                    });
                }
            }
        }
    }
    return gaps;
}
/**
 * 3.3 Variant Coverage Gaps
 * Detects underrepresented winning attributes (colors, sizes)
 */
export async function detectVariantGaps(shopId) {
    const gaps = [];
    // Get all variants with sales
    const variants = await prisma.variant.findMany({
        where: { product: { shopId } },
        select: {
            id: true,
            shopifyId: true,
            title: true,
            product: { select: { title: true, productType: true } }
        },
    });
    // Get sales by variant
    const lineItems = await prisma.orderLineItem.findMany({
        where: { order: { shopId } },
        select: { variantId: true, quantity: true },
    });
    const salesByVariant = new Map();
    for (const li of lineItems) {
        if (li.variantId) {
            salesByVariant.set(li.variantId, (salesByVariant.get(li.variantId) || 0) + li.quantity);
        }
    }
    // Extract common attributes from variant titles
    const colorKeywords = ['black', 'white', 'red', 'blue', 'green', 'pink', 'grey', 'brown', 'navy', 'beige'];
    const sizeKeywords = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'small', 'medium', 'large'];
    // Count sales by color
    const salesByColor = {};
    const productsByColor = {};
    for (const variant of variants) {
        const titleLower = variant.title.toLowerCase();
        for (const color of colorKeywords) {
            if (titleLower.includes(color)) {
                const sales = salesByVariant.get(variant.shopifyId) || 0;
                salesByColor[color] = (salesByColor[color] || 0) + sales;
                productsByColor[color] = (productsByColor[color] || 0) + 1;
            }
        }
    }
    // Find high-selling colors with low product representation
    const totalProducts = variants.length;
    for (const [color, sales] of Object.entries(salesByColor)) {
        const productCount = productsByColor[color] || 0;
        const productShare = productCount / totalProducts;
        const salesShare = sales / lineItems.reduce((sum, li) => sum + li.quantity, 0);
        // High demand (sales share) but low supply (product share)
        if (salesShare > productShare * 1.5 && productCount < 10) {
            gaps.push({
                gapType: 'variant_gap',
                gapScore: Math.round((salesShare - productShare) * 100) / 100,
                gapData: {
                    attribute: 'color',
                    value: color.charAt(0).toUpperCase() + color.slice(1),
                    currentProducts: productCount,
                    salesShare: Math.round(salesShare * 10000) / 100,
                    productShare: Math.round(productShare * 10000) / 100,
                },
                description: `Variant Depletion: ${color.charAt(0).toUpperCase() + color.slice(1)} shortage`,
                suggestedAction: `Increase depth in ${color} variants. This attribute accounts for ${Math.round(salesShare * 100)}% of volume but only ${Math.round(productShare * 100)}% of your assortment.`,
                potentialRevenue: null,
                confidence: 0.75,
            });
        }
    }
    return gaps;
}
/**
 * 3.4 Seasonal Gaps
 * Identifies months with low revenue that could use seasonal products
 */
export async function detectSeasonalGaps(shopId) {
    const gaps = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    // Get orders by month
    const orders = await prisma.order.findMany({
        where: { shopId },
        select: { createdAt: true, totalPrice: true },
    });
    // Group by month
    const revenueByMonth = {};
    for (let i = 0; i < 12; i++)
        revenueByMonth[i] = 0;
    for (const order of orders) {
        const month = order.createdAt.getMonth();
        revenueByMonth[month] += toNumber(order.totalPrice);
    }
    const avgMonthlyRevenue = Object.values(revenueByMonth).reduce((a, b) => a + b, 0) / 12;
    // Find low-revenue months
    for (const [month, revenue] of Object.entries(revenueByMonth)) {
        const monthIndex = parseInt(month);
        const revenueIndex = avgMonthlyRevenue > 0 ? revenue / avgMonthlyRevenue : 0;
        if (revenueIndex < 0.7 && avgMonthlyRevenue > 0) {
            const seasonalSuggestions = {
                0: 'New Year, Winter Sales',
                1: "Valentine's Day",
                2: 'Spring Collection, Easter prep',
                3: 'Easter, Spring cleaning',
                4: "Mother's Day, Spring items",
                5: "Father's Day, Summer prep",
                6: 'Summer Sale, Beach items',
                7: 'Back to School prep',
                8: 'Back to School, Fall collection',
                9: 'Halloween, Fall items',
                10: 'Black Friday, Holiday prep',
                11: 'Christmas, Holiday gifts',
            };
            gaps.push({
                gapType: 'seasonal_gap',
                gapScore: Math.round((1 - revenueIndex) * 100) / 100,
                gapData: {
                    month: monthNames[monthIndex],
                    monthIndex,
                    currentRevenue: Math.round(revenue),
                    averageRevenue: Math.round(avgMonthlyRevenue),
                    revenueIndex: Math.round(revenueIndex * 100) / 100,
                },
                description: `Seasonal Exposure: ${monthNames[monthIndex]} dip`,
                suggestedAction: `${monthNames[monthIndex]} performance is ${Math.round((1 - revenueIndex) * 100)}% below your annual baseline. Deploy ${seasonalSuggestions[monthIndex]} collections to bridge the gap.`,
                potentialRevenue: Math.round((avgMonthlyRevenue - revenue) * 0.5),
                confidence: 0.65,
            });
        }
    }
    return gaps;
}
/**
 * 3.5 Detect All Gaps - Main function
 */
export async function detectAllGaps(shopId) {
    console.log(`[GapDetector] Detecting gaps for shop: ${shopId}`);
    // Run all detectors
    const [priceGaps, categoryGaps, variantGaps, seasonalGaps] = await Promise.all([
        detectPriceGaps(shopId),
        detectCategoryGaps(shopId),
        detectVariantGaps(shopId),
        detectSeasonalGaps(shopId),
    ]);
    const allGaps = [...priceGaps, ...categoryGaps, ...variantGaps, ...seasonalGaps];
    // Sort by score
    allGaps.sort((a, b) => b.gapScore - a.gapScore);
    // Save to database
    for (const gap of allGaps) {
        await prisma.catalogGap.upsert({
            where: {
                id: `${shopId}-${gap.gapType}-${JSON.stringify(gap.gapData).slice(0, 50)}`,
            },
            update: {
                gapScore: gap.gapScore,
                gapData: gap.gapData,
                description: gap.description,
                suggestedAction: gap.suggestedAction,
                potentialRevenue: gap.potentialRevenue,
                confidence: gap.confidence,
                detectedAt: new Date(),
            },
            create: {
                shopId,
                gapType: gap.gapType,
                gapScore: gap.gapScore,
                gapData: gap.gapData,
                description: gap.description,
                suggestedAction: gap.suggestedAction,
                potentialRevenue: gap.potentialRevenue,
                confidence: gap.confidence,
            },
        });
    }
    // Build summary
    const byType = {};
    for (const gap of allGaps) {
        byType[gap.gapType] = (byType[gap.gapType] || 0) + 1;
    }
    console.log(`[GapDetector] Found ${allGaps.length} gaps`);
    return {
        gaps: allGaps,
        summary: {
            totalGaps: allGaps.length,
            byType,
            topOpportunity: allGaps[0] || null,
        },
    };
}
