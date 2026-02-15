/**
 * Trend Integration Service
 * Provides trend data for product categories
 *
 * Note: External Google Trends scraping is disabled (unreliable).
 * Instead, we use intelligent estimates and let AI provide market knowledge.
 */
import { prisma } from '@brandmind/shared';
// ============================================
// TREND ESTIMATION
// ============================================
/**
 * Generate trend estimates for a keyword
 * Uses keyword characteristics and category knowledge for reasonable estimates
 *
 * Note: For real-time trends, integrate SerpAPI or similar paid service
 */
function generateTrendEstimate(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    // Fashion/apparel category knowledge
    const trendingCategories = {
        'harem': { score: 65, velocity: 8 }, // Steady interest
        'palazzo': { score: 70, velocity: 12 }, // Growing trend
        'yoga': { score: 75, velocity: 15 }, // Strong growth
        'loungewear': { score: 80, velocity: 20 }, // Very popular post-pandemic
        'sustainable': { score: 72, velocity: 18 }, // Growing eco-consciousness
        'bamboo': { score: 68, velocity: 14 }, // Eco-friendly materials trending
        'linen': { score: 60, velocity: 5 }, // Seasonal (summer)
        'warm': { score: 55, velocity: -5 }, // Seasonal decline (if not winter)
        'kids': { score: 58, velocity: 6 }, // Stable
        'rock': { score: 45, velocity: 3 }, // Niche but stable
    };
    // Check for matching categories
    for (const [cat, data] of Object.entries(trendingCategories)) {
        if (lowerKeyword.includes(cat)) {
            return {
                keyword,
                trendScore: data.score,
                velocity: data.velocity,
                acceleration: 0,
                seasonalIndex: getSeasonalIndex(lowerKeyword),
                source: 'category_estimate',
            };
        }
    }
    // Default: generate consistent estimate based on keyword hash
    const hash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseScore = 40 + (hash % 30); // 40-70 range
    const velocity = ((hash * 7) % 20) - 5; // -5 to +15 range
    return {
        keyword,
        trendScore: baseScore,
        velocity,
        acceleration: 0,
        seasonalIndex: 1.0,
        source: 'keyword_estimate',
    };
}
/**
 * Get seasonal index based on current month and product type
 */
function getSeasonalIndex(keyword) {
    const month = new Date().getMonth(); // 0-11
    // Summer items (May-August)
    if (keyword.includes('linen') || keyword.includes('summer') || keyword.includes('light')) {
        return month >= 4 && month <= 7 ? 1.3 : 0.7;
    }
    // Winter items (November-February)
    if (keyword.includes('warm') || keyword.includes('winter') || keyword.includes('fleece')) {
        return month >= 10 || month <= 1 ? 1.3 : 0.7;
    }
    // Loungewear - slight boost in fall/winter
    if (keyword.includes('lounge')) {
        return month >= 9 || month <= 2 ? 1.15 : 1.0;
    }
    return 1.0; // Default: no seasonal adjustment
}
// ============================================
// CACHE LAYER
// ============================================
/**
 * Get trend data for a keyword (with caching)
 */
export async function getTrendData(keyword, region = 'US') {
    // Check cache first
    const cached = await prisma.trendData.findUnique({
        where: {
            keyword_region_source: {
                keyword,
                region,
                source: 'category_estimate',
            },
        },
    });
    // Return cached if not expired (cache for 7 days)
    if (cached && cached.expiresAt > new Date()) {
        return {
            keyword: cached.keyword,
            trendScore: cached.trendScore,
            velocity: cached.velocity,
            acceleration: cached.acceleration,
            seasonalIndex: cached.seasonalIndex || 1.0,
            source: cached.source,
        };
    }
    // Generate fresh estimate
    const fresh = generateTrendEstimate(keyword);
    // Cache it (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    try {
        await prisma.trendData.upsert({
            where: {
                keyword_region_source: {
                    keyword,
                    region,
                    source: fresh.source,
                },
            },
            update: {
                trendScore: fresh.trendScore,
                velocity: fresh.velocity,
                acceleration: fresh.acceleration,
                seasonalIndex: fresh.seasonalIndex,
                fetchedAt: new Date(),
                expiresAt,
            },
            create: {
                keyword,
                region,
                source: fresh.source,
                trendScore: fresh.trendScore,
                velocity: fresh.velocity,
                acceleration: fresh.acceleration,
                seasonalIndex: fresh.seasonalIndex,
                expiresAt,
            },
        });
    }
    catch (e) {
        // Cache failure shouldn't break the flow
        console.warn(`[Trends] Failed to cache trend for ${keyword}`);
    }
    return fresh;
}
/**
 * Fetch trends for store's product categories
 */
export async function fetchTrendsForStore(shopId) {
    // Get unique product types from store
    const products = await prisma.product.findMany({
        where: { shopId },
        select: { productType: true },
        distinct: ['productType'],
    });
    const keywords = products
        .map(p => p.productType)
        .filter((t) => !!t && t.length > 2);
    // Fetch trends for each keyword
    const trends = [];
    for (const keyword of keywords.slice(0, 20)) { // Limit to 20
        try {
            const trend = await getTrendData(keyword);
            trends.push(trend);
        }
        catch (err) {
            console.error(`[Trends] Failed to fetch for ${keyword}:`, err);
        }
    }
    return trends.sort((a, b) => b.trendScore - a.trendScore);
}
/**
 * Get top trending keywords for store
 */
export async function getTopTrends(shopId, limit = 10) {
    const trends = await fetchTrendsForStore(shopId);
    return trends
        .filter(t => t.velocity > 0) // Only positive momentum
        .slice(0, limit);
}
