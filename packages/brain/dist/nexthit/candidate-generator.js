import { prisma } from '@brandmind/shared';
import { researchNewProducts } from '../intelligence/product-research';
export async function generateCandidates(shopId) {
    console.log(`[CandidateGenerator] Generating candidates for shop ${shopId}`);
    const candidates = [];
    // Load StoreDNA for context
    const storeDNA = await prisma.storeDNA.findUnique({ where: { shopId } });
    const dnaData = storeDNA;
    // Load all pattern memories
    const patterns = await prisma.patternMemory.findMany({
        where: { shopId },
    });
    const patternMap = new Map(patterns.map(p => [p.patternType, p]));
    // Load top-performing products for reference
    const topProducts = await getTopProducts(shopId);
    // Strategy 1: Color + Product Type Combinations (Highest confidence - data-driven)
    const colorProductCandidates = generateColorProductCombinations(dnaData, patternMap);
    candidates.push(...colorProductCandidates);
    // Strategy 2: Price-Optimized Products (specific price points for specific products)
    const priceOptimizedCandidates = generatePriceOptimizedCandidates(dnaData, patternMap);
    candidates.push(...priceOptimizedCandidates);
    // Strategy 3: Cross-Purchase Bundle Opportunities
    const bundleCandidates = generateBundleCandidates(patternMap);
    candidates.push(...bundleCandidates);
    // Strategy 4: Growth Category Expansion
    const growthCandidates = generateGrowthCategoryCandidates(dnaData);
    candidates.push(...growthCandidates);
    // Strategy 5: Gap Fillers (price gaps, seasonal gaps)
    const gapCandidates = await generateGapCandidates(shopId, dnaData);
    candidates.push(...gapCandidates);
    // Strategy 6: Variant Expansion based on top sellers
    const variantCandidates = generateVariantExpansionCandidates(topProducts, patternMap);
    candidates.push(...variantCandidates);
    // Strategy 7: AI-Researched NEW Product Ideas (External Market Intelligence)
    try {
        const aiResearchCandidates = await generateAIResearchedCandidates(shopId);
        candidates.push(...aiResearchCandidates);
    }
    catch (error) {
        console.error('[CandidateGenerator] AI research failed, continuing with internal data:', error);
    }
    console.log(`[CandidateGenerator] Generated ${candidates.length} raw candidates`);
    return candidates;
}
/**
 * Strategy 1: Combine winning colors with top product types
 * e.g., "Launch Palazzo Pants in Olive" or "Launch Haremshosen in Gold"
 */
function generateColorProductCombinations(dnaData, patternMap) {
    var _a, _b;
    const candidates = [];
    if (!((_a = dnaData === null || dnaData === void 0 ? void 0 : dnaData.topPerformingTypes) === null || _a === void 0 ? void 0 : _a.length))
        return candidates;
    const colorPattern = patternMap.get('color_preference');
    if (!colorPattern)
        return candidates;
    const winningColors = ((_b = colorPattern.patternData) === null || _b === void 0 ? void 0 : _b.winners) || [];
    // Filter out generic "Other" type - only use actual product types
    const topTypes = dnaData.topPerformingTypes
        .filter(t => t.type && t.type !== 'Other' && t.type !== 'Uncategorized')
        .slice(0, 3);
    // Combine top 2 colors with top 2 product types
    for (const color of winningColors.slice(0, 2)) {
        for (const productType of topTypes.slice(0, 2)) {
            const title = `Launch ${productType.type} in ${capitalizeFirst(color.value)}`;
            candidates.push({
                title,
                description: `Combine your best-performing product type (${productType.type}, ${productType.revenueShare.toFixed(1)}% of revenue) with your winning color (${color.value}, ${(color.successRate * 100).toFixed(0)}% success rate). This is a data-backed safe bet.`,
                patternSource: 'color_product_combination',
                patternEvidence: {
                    productType: productType.type,
                    productTypeRevenue: productType.revenue,
                    productTypeShare: productType.revenueShare,
                    color: color.value,
                    colorSuccessRate: (color.successRate * 100).toFixed(1) + '%',
                    colorRevenue: color.revenue,
                    colorSampleSize: color.sampleSize,
                    combinedConfidence: (color.successRate * 0.5 + (productType.revenueShare / 100) * 0.5).toFixed(2),
                },
                confidence: Math.min(0.92, color.successRate * 0.5 + (productType.revenueShare / 100) * 0.5),
                hitType: 'safe',
            });
        }
    }
    return candidates;
}
/**
 * Strategy 2: Price-optimized product suggestions
 * e.g., "Launch Premium Haremshosen at €85-95" targeting optimal price bands
 */
function generatePriceOptimizedCandidates(dnaData, patternMap) {
    var _a;
    const candidates = [];
    const pricePattern = patternMap.get('price_band');
    if (!pricePattern)
        return candidates;
    const priceData = pricePattern.patternData;
    const optimalBand = priceData === null || priceData === void 0 ? void 0 : priceData.optimalBand;
    const winners = (priceData === null || priceData === void 0 ? void 0 : priceData.winners) || [];
    const priceRanges = {
        'budget': { min: 15, max: 30, tier: 'Entry-Level' },
        'value': { min: 30, max: 60, tier: 'Value' },
        'mid': { min: 60, max: 100, tier: 'Mid-Range' },
        'premium': { min: 100, max: 200, tier: 'Premium' },
        'luxury': { min: 200, max: 400, tier: 'Luxury' },
    };
    const range = priceRanges[optimalBand] || priceRanges['value'];
    // Filter out generic types - only use actual product types
    const validTypes = ((dnaData === null || dnaData === void 0 ? void 0 : dnaData.topPerformingTypes) || [])
        .filter(t => t.type && t.type !== 'Other' && t.type !== 'Uncategorized');
    // If no valid product types, skip this strategy
    if (!validTypes.length)
        return candidates;
    const topType = validTypes[0];
    const secondType = validTypes[1];
    // Suggest optimal price point for top product type
    candidates.push({
        title: `Launch ${range.tier} ${topType.type} at €${range.min}-${range.max}`,
        description: `Your customers convert best in the ${optimalBand} price band (${range.min}-${range.max}€). Launch a ${topType.type} specifically designed for this sweet spot to maximize conversion.`,
        patternSource: 'price_optimization',
        patternEvidence: {
            optimalBand,
            priceRange: `€${range.min}-${range.max}`,
            targetProductType: topType.type,
            bandSuccessRate: ((_a = winners.find((w) => w.value === optimalBand)) === null || _a === void 0 ? void 0 : _a.successRate) || 0.85,
            sampleSize: pricePattern.sampleSize,
        },
        confidence: (pricePattern.confidence || 0.7) * 0.9,
        hitType: 'safe',
    });
    // If there's a second product type with good growth, suggest for that too
    if (secondType && secondType.growthRate > 10) {
        candidates.push({
            title: `Launch ${range.tier} ${secondType.type} at €${range.min}-${range.max}`,
            description: `${secondType.type} is growing at ${secondType.growthRate.toFixed(0)}% and would benefit from a product at your optimal ${optimalBand} price point.`,
            patternSource: 'price_optimization',
            patternEvidence: {
                optimalBand,
                priceRange: `€${range.min}-${range.max}`,
                targetProductType: secondType.type,
                growthRate: secondType.growthRate,
            },
            confidence: (pricePattern.confidence || 0.7) * 0.75,
            hitType: 'moderate',
        });
    }
    return candidates;
}
/**
 * Strategy 3: Bundle candidates based on cross-purchase patterns
 * e.g., "Create Bundle: Haremshose Tiefsee + Haremshose Schwarz"
 */
function generateBundleCandidates(patternMap) {
    var _a;
    const candidates = [];
    const crossPurchase = patternMap.get('cross_purchase');
    if (!crossPurchase)
        return candidates;
    const topPairs = ((_a = crossPurchase.patternData) === null || _a === void 0 ? void 0 : _a.topPairs) || [];
    for (const pair of topPairs.slice(0, 3)) {
        if (pair.products.length < 2)
            continue;
        const product1 = shortenProductName(pair.products[0]);
        const product2 = shortenProductName(pair.products[1]);
        candidates.push({
            title: `Create Bundle: ${product1} + ${product2}`,
            description: `${pair.count} customers already buy these together. A pre-made bundle captures this demand with higher AOV and no new inventory risk.`,
            patternSource: 'bundle_opportunity',
            patternEvidence: {
                product1: pair.products[0],
                product2: pair.products[1],
                coOccurrenceCount: pair.count,
                bundleType: 'duo',
                inventoryRisk: 'none',
            },
            confidence: Math.min(0.9, 0.6 + (pair.count / 100)),
            hitType: 'safe',
        });
    }
    return candidates;
}
/**
 * Strategy 4: Growth category expansion
 * e.g., "Expand Rock Collection" (264% growth rate)
 */
function generateGrowthCategoryCandidates(dnaData) {
    var _a;
    const candidates = [];
    if (!((_a = dnaData === null || dnaData === void 0 ? void 0 : dnaData.topPerformingTypes) === null || _a === void 0 ? void 0 : _a.length))
        return candidates;
    // Find categories with high growth but lower revenue share (expansion opportunity)
    // Filter out generic "Other" type
    const growthOpportunities = dnaData.topPerformingTypes
        .filter(t => t.type && t.type !== 'Other' && t.type !== 'Uncategorized')
        .filter(t => t.growthRate > 20 && t.revenueShare < 15)
        .sort((a, b) => b.growthRate - a.growthRate);
    for (const category of growthOpportunities.slice(0, 2)) {
        candidates.push({
            title: `Expand ${category.type} Collection`,
            description: `${category.type} is growing at ${category.growthRate.toFixed(0)}% but only represents ${category.revenueShare.toFixed(1)}% of revenue. Expanding this line captures growing demand.`,
            patternSource: 'growth_expansion',
            patternEvidence: {
                category: category.type,
                growthRate: category.growthRate,
                currentRevenueShare: category.revenueShare,
                currentRevenue: category.revenue,
                avgOrderValue: category.avgOrderValue,
                potential: 'high_growth_underserved',
            },
            confidence: Math.min(0.85, 0.5 + (category.growthRate / 200)),
            hitType: 'moderate',
        });
    }
    return candidates;
}
/**
 * Strategy 5: Gap-based candidates (price gaps, seasonal gaps)
 */
async function generateGapCandidates(shopId, dnaData) {
    var _a;
    const candidates = [];
    const gaps = await prisma.catalogGap.findMany({
        where: { shopId, status: 'active' },
        orderBy: { gapScore: 'desc' },
        take: 5,
    });
    // Get first valid product type (not "Other")
    const validTypes = ((dnaData === null || dnaData === void 0 ? void 0 : dnaData.topPerformingTypes) || [])
        .filter(t => t.type && t.type !== 'Other' && t.type !== 'Uncategorized');
    const topType = ((_a = validTypes[0]) === null || _a === void 0 ? void 0 : _a.type) || 'Product';
    for (const gap of gaps) {
        const data = gap.gapData;
        if (gap.gapType === 'price_gap') {
            candidates.push({
                title: `Launch ${topType} in ${data.band} Price Range`,
                description: `You have only ${data.currentProducts} products in the ${data.band} range, but ${data.adjacentDemand} orders came from adjacent price bands. There's unmet demand here.`,
                patternSource: 'price_gap',
                patternEvidence: {
                    gapType: 'price_void',
                    priceRange: data.band,
                    currentProducts: data.currentProducts,
                    adjacentDemand: data.adjacentDemand,
                    suggestedProductType: topType,
                },
                confidence: gap.confidence,
                hitType: 'moderate',
            });
        }
        else if (gap.gapType === 'seasonal_gap') {
            candidates.push({
                title: `Launch ${data.month} Seasonal ${topType}`,
                description: `${data.month} underperforms at ${(data.revenueIndex * 100).toFixed(0)}% of average. A seasonal collection or promotion could lift this period.`,
                patternSource: 'seasonal_gap',
                patternEvidence: {
                    gapType: 'seasonal_weakness',
                    month: data.month,
                    revenueIndex: data.revenueIndex,
                    currentRevenue: data.currentRevenue,
                    averageRevenue: data.averageRevenue,
                },
                confidence: gap.confidence * 0.8,
                hitType: 'bold',
            });
        }
    }
    return candidates;
}
/**
 * Strategy 6: Variant expansion based on top sellers
 * e.g., "Launch Long Version of top-selling Haremshose"
 */
function generateVariantExpansionCandidates(topProducts, patternMap) {
    var _a, _b;
    const candidates = [];
    if (!topProducts.length)
        return candidates;
    // Get color preferences
    const colorPattern = patternMap.get('color_preference');
    const winningColors = ((_a = colorPattern === null || colorPattern === void 0 ? void 0 : colorPattern.patternData) === null || _a === void 0 ? void 0 : _a.winners) || [];
    const topColor = (_b = winningColors[0]) === null || _b === void 0 ? void 0 : _b.value;
    // Find top seller that could have variants
    const topSeller = topProducts[0];
    if (topSeller && topSeller.revenue > 1000) {
        // Check if it's a "Long Version" or regular
        const isLongVersion = topSeller.title.toLowerCase().includes('long');
        const variantSuggestion = isLongVersion ? 'Short Version' : 'Long Version';
        candidates.push({
            title: `Launch ${variantSuggestion} of ${shortenProductName(topSeller.title)}`,
            description: `Your top seller "${shortenProductName(topSeller.title)}" (€${topSeller.revenue.toFixed(0)} revenue) could have a ${variantSuggestion} to capture different customer preferences.`,
            patternSource: 'variant_expansion',
            patternEvidence: {
                baseProduct: topSeller.title,
                baseRevenue: topSeller.revenue,
                baseUnits: topSeller.unitsSold,
                suggestedVariant: variantSuggestion,
            },
            confidence: 0.75,
            hitType: 'safe',
        });
        // If we have a winning color, suggest that color for a different top product
        if (topColor && topProducts[1]) {
            const secondProduct = topProducts[1];
            if (!secondProduct.title.toLowerCase().includes(topColor.toLowerCase())) {
                candidates.push({
                    title: `Launch ${shortenProductName(secondProduct.title)} in ${capitalizeFirst(topColor)}`,
                    description: `${capitalizeFirst(topColor)} has a ${(winningColors[0].successRate * 100).toFixed(0)}% success rate. Apply this winning color to "${shortenProductName(secondProduct.title)}" for a low-risk variant.`,
                    patternSource: 'color_variant',
                    patternEvidence: {
                        baseProduct: secondProduct.title,
                        suggestedColor: topColor,
                        colorSuccessRate: winningColors[0].successRate,
                    },
                    confidence: winningColors[0].successRate * 0.8,
                    hitType: 'safe',
                });
            }
        }
    }
    return candidates;
}
/**
 * Strategy 7: AI-Researched NEW Product Ideas
 * Uses external market intelligence + AI to suggest genuinely new products
 */
async function generateAIResearchedCandidates(shopId) {
    console.log('[CandidateGenerator] Running AI product research...');
    const researchResults = await researchNewProducts(shopId);
    const candidates = [];
    for (const result of researchResults) {
        // Determine hit type based on risk level
        const hitType = result.riskLevel === 'low' ? 'safe' :
            result.riskLevel === 'high' ? 'bold' : 'moderate';
        candidates.push({
            title: `NEW: ${result.productIdea}`,
            description: result.reasoning,
            patternSource: 'ai_market_research',
            patternEvidence: {
                source: 'AI Market Research',
                productType: result.productType,
                targetPrice: `€${result.targetPrice}`,
                trendScore: result.marketEvidence.trendScore,
                searchVolume: result.marketEvidence.searchVolume,
                competitorGap: result.marketEvidence.competitorGap,
                seasonalRelevance: result.marketEvidence.seasonalRelevance,
                differentiators: result.differentiators,
                riskLevel: result.riskLevel,
            },
            confidence: result.confidence,
            hitType,
        });
    }
    console.log(`[CandidateGenerator] AI research generated ${candidates.length} new product ideas`);
    return candidates;
}
// ============================================
// HELPER FUNCTIONS
// ============================================
async function getTopProducts(shopId) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const metrics = await prisma.productMetric.groupBy({
        by: ['variantId'],
        where: {
            date: { gte: last30Days },
            variant: { product: { shopId } },
        },
        _sum: { revenue: true, unitsSold: true },
        orderBy: { _sum: { revenue: 'desc' } },
        take: 20,
    });
    const products = await Promise.all(metrics.map(async (m) => {
        const variant = await prisma.variant.findUnique({
            where: { id: m.variantId },
            include: { product: true },
        });
        return {
            variantId: m.variantId,
            title: (variant === null || variant === void 0 ? void 0 : variant.product.title) || 'Unknown',
            variantTitle: (variant === null || variant === void 0 ? void 0 : variant.title) || '',
            productType: (variant === null || variant === void 0 ? void 0 : variant.product.productType) || 'General',
            price: Number((variant === null || variant === void 0 ? void 0 : variant.price) || 0),
            revenue: Number(m._sum.revenue || 0),
            unitsSold: m._sum.unitsSold || 0,
        };
    }));
    return products;
}
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function shortenProductName(name) {
    // Remove common prefixes and shorten for readability
    const shortened = name
        .replace(/^(Warme Loungewear |Warme |Mystery )/i, '')
        .replace(/ Long Version$/i, ' (Long)')
        .replace(/ Short Version$/i, ' (Short)');
    // Truncate if still too long
    if (shortened.length > 40) {
        return shortened.substring(0, 37) + '...';
    }
    return shortened;
}
