/**
 * AI Product Research Module
 *
 * Uses AI to research external market trends and suggest NEW product opportunities
 * that don't exist in the store's catalog yet.
 */
import { prisma } from '@brandmind/shared';
import OpenAI from 'openai';
import { getTrendData } from './trends';
// ============================================
// MAIN RESEARCH FUNCTION
// ============================================
export async function researchNewProducts(shopId) {
    console.log(`[ProductResearch] Starting AI research for shop ${shopId}`);
    // 1. Build store context
    const context = await buildStoreContext(shopId);
    if (!context) {
        console.log('[ProductResearch] Could not build store context');
        return [];
    }
    // 2. Get trend data for primary categories
    const trendInsights = await gatherTrendInsights(context.primaryCategories);
    // 3. Call AI to research and suggest products
    const aiSuggestions = await callAIForProductResearch(context, trendInsights);
    // 4. Validate and score suggestions
    const validatedResults = await validateAndScoreSuggestions(aiSuggestions, context);
    console.log(`[ProductResearch] Generated ${validatedResults.length} AI-researched product ideas`);
    return validatedResults;
}
// ============================================
// CONTEXT BUILDING
// ============================================
async function buildStoreContext(shopId) {
    var _a, _b, _c;
    const shop = await prisma.shop.findUnique({
        where: { id: shopId },
        include: {
            products: {
                select: { title: true, productType: true },
                take: 100,
            },
        },
    });
    if (!shop)
        return null;
    const storeDNA = await prisma.storeDNA.findUnique({ where: { shopId } });
    const dnaData = storeDNA;
    const patterns = await prisma.patternMemory.findMany({ where: { shopId } });
    const colorPattern = patterns.find(p => p.patternType === 'color_preference');
    const pricePattern = patterns.find(p => p.patternType === 'price_band');
    // Extract top categories
    const primaryCategories = ((dnaData === null || dnaData === void 0 ? void 0 : dnaData.topPerformingTypes) || [])
        .slice(0, 5)
        .map((t) => t.type);
    // Extract top colors
    const topColors = (((_a = colorPattern === null || colorPattern === void 0 ? void 0 : colorPattern.patternData) === null || _a === void 0 ? void 0 : _a.winners) || [])
        .slice(0, 5)
        .map((c) => c.value);
    // Extract price sweet spot
    const optimalBand = ((_b = pricePattern === null || pricePattern === void 0 ? void 0 : pricePattern.patternData) === null || _b === void 0 ? void 0 : _b.optimalBand) || 'value';
    const priceRanges = {
        'budget': { min: 15, max: 30 },
        'value': { min: 30, max: 60 },
        'mid': { min: 60, max: 100 },
        'premium': { min: 100, max: 200 },
        'luxury': { min: 200, max: 400 },
    };
    const priceSweetSpot = priceRanges[optimalBand] || priceRanges['value'];
    // Get brand voice for style context
    const brandVoice = await prisma.brandVoice.findUnique({ where: { shopId } });
    const brandStyle = ((_c = brandVoice === null || brandVoice === void 0 ? void 0 : brandVoice.toneAttributes) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'comfortable, stylish, unique';
    // Get existing product titles to avoid suggesting duplicates
    const existingProductTitles = shop.products.map(p => p.title);
    return {
        shopId,
        shopDomain: shop.shopDomain,
        primaryCategories,
        topColors,
        priceSweetSpot,
        brandStyle,
        existingProductTitles,
    };
}
// ============================================
// TREND GATHERING
// ============================================
async function gatherTrendInsights(categories) {
    const insights = {};
    for (const category of categories.slice(0, 3)) {
        try {
            const trendData = await getTrendData(category, 'DE'); // German market
            if (trendData && trendData.trendScore > 0) {
                // Determine direction based on velocity
                const direction = trendData.velocity > 5 ? 'rising' :
                    trendData.velocity < -5 ? 'declining' : 'stable';
                insights[category] = {
                    trendScore: trendData.trendScore,
                    velocity: trendData.velocity,
                    direction,
                    seasonalIndex: trendData.seasonalIndex,
                    source: trendData.source,
                };
            }
        }
        catch (e) {
            // Trends are supplementary - don't fail the whole research
            console.log(`[ProductResearch] Could not get trends for ${category}, continuing without`);
        }
    }
    // If no trend data available, provide context to AI
    if (Object.keys(insights).length === 0) {
        console.log('[ProductResearch] No trend data available, AI will use general market knowledge');
    }
    return insights;
}
// ============================================
// AI RESEARCH CALL
// ============================================
async function callAIForProductResearch(context, trendInsights) {
    const openai = new OpenAI();
    const prompt = buildResearchPrompt(context, trendInsights);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a product research specialist for e-commerce fashion brands. Your job is to identify NEW product opportunities based on market trends, competitor analysis, and the store's existing strengths.

You must suggest SPECIFIC, ACTIONABLE product ideas - not vague categories. Each suggestion should be a product that could realistically be manufactured and sold.

Focus on:
1. Products that leverage the store's existing strengths (colors, price points, style)
2. Gap opportunities - products competitors have but this store doesn't
3. Emerging trends in the fashion/apparel space
4. Seasonal opportunities
5. Cross-category expansion that makes sense for the brand

Be specific: Instead of "comfortable pants", say "Bamboo Fabric Yoga Harem Pants with Elastic Waistband".`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.8,
            max_tokens: 2000,
        });
        const content = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);
        return parsed.suggestions || [];
    }
    catch (error) {
        console.error('[ProductResearch] AI call failed:', error);
        return [];
    }
}
function buildResearchPrompt(context, trendInsights) {
    const existingProductsSample = context.existingProductTitles.slice(0, 20).join('\n- ');
    const trendSummary = Object.keys(trendInsights).length > 0
        ? Object.entries(trendInsights)
            .map(([cat, data]) => `${cat}: trend score ${data.trendScore}/100, velocity ${data.velocity > 0 ? '+' : ''}${data.velocity}%, direction: ${data.direction}`)
            .join('\n')
        : 'External trend data unavailable - use your knowledge of current fashion/apparel market trends';
    return `Research NEW product opportunities for this e-commerce store:

## STORE PROFILE
- Domain: ${context.shopDomain}
- Primary Categories: ${context.primaryCategories.join(', ')}
- Best-Selling Colors: ${context.topColors.join(', ')}
- Price Sweet Spot: €${context.priceSweetSpot.min}-${context.priceSweetSpot.max}
- Brand Style: ${context.brandStyle}

## EXISTING PRODUCTS (sample - DO NOT suggest these)
- ${existingProductsSample}

## CURRENT MARKET TRENDS
${trendSummary || 'No trend data available'}

## YOUR TASK
Suggest 5 SPECIFIC new product ideas that:
1. Don't exist in the store yet
2. Fit the brand's style and price range
3. Leverage winning colors (${context.topColors.slice(0, 3).join(', ')})
4. Address market gaps or trends
5. Are realistic to manufacture and sell

Return JSON with this structure:
{
  "suggestions": [
    {
      "productIdea": "Specific product name (e.g., 'Bamboo Yoga Harem Pants with Mandala Print')",
      "productType": "Category (e.g., 'Haremshosen')",
      "suggestedPrice": 45,
      "marketEvidence": {
        "trendIndicator": "Description of why this is trending",
        "competitorInsight": "What competitors are doing in this space",
        "searchDemand": "Estimated demand level (high/medium/low)",
        "seasonalFit": "When this would sell best"
      },
      "reasoning": "2-3 sentences explaining why this is a good opportunity",
      "differentiators": ["Feature 1", "Feature 2", "Feature 3"],
      "riskLevel": "low|medium|high"
    }
  ]
}`;
}
// ============================================
// VALIDATION & SCORING
// ============================================
async function validateAndScoreSuggestions(aiSuggestions, context) {
    var _a, _b, _c, _d, _e, _f;
    const results = [];
    for (const suggestion of aiSuggestions) {
        // Skip if too similar to existing product
        const isDuplicate = context.existingProductTitles.some(existing => { var _a; return calculateSimilarity(existing.toLowerCase(), ((_a = suggestion.productIdea) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '') > 0.7; });
        if (isDuplicate) {
            console.log(`[ProductResearch] Skipping duplicate: ${suggestion.productIdea}`);
            continue;
        }
        // Calculate confidence score
        let confidence = 0.6; // Base confidence
        // Boost if uses winning color
        const usesWinningColor = context.topColors.some(color => { var _a; return (_a = suggestion.productIdea) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(color.toLowerCase()); });
        if (usesWinningColor)
            confidence += 0.1;
        // Boost if in primary category
        const inPrimaryCategory = context.primaryCategories.some(cat => {
            var _a, _b;
            return ((_a = suggestion.productType) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(cat.toLowerCase())) ||
                cat.toLowerCase().includes(((_b = suggestion.productType) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '');
        });
        if (inPrimaryCategory)
            confidence += 0.1;
        // Boost based on market evidence quality
        if (((_a = suggestion.marketEvidence) === null || _a === void 0 ? void 0 : _a.searchDemand) === 'high')
            confidence += 0.1;
        if (suggestion.riskLevel === 'low')
            confidence += 0.05;
        // Map to result structure
        results.push({
            productIdea: suggestion.productIdea || 'Unknown Product',
            productType: suggestion.productType || 'General',
            targetPrice: suggestion.suggestedPrice || context.priceSweetSpot.min,
            marketEvidence: {
                trendScore: ((_b = suggestion.marketEvidence) === null || _b === void 0 ? void 0 : _b.searchDemand) === 'high' ? 0.8 :
                    ((_c = suggestion.marketEvidence) === null || _c === void 0 ? void 0 : _c.searchDemand) === 'medium' ? 0.5 : 0.3,
                searchVolume: ((_d = suggestion.marketEvidence) === null || _d === void 0 ? void 0 : _d.searchDemand) || 'unknown',
                competitorGap: ((_e = suggestion.marketEvidence) === null || _e === void 0 ? void 0 : _e.competitorInsight) || 'No data',
                seasonalRelevance: ((_f = suggestion.marketEvidence) === null || _f === void 0 ? void 0 : _f.seasonalFit) || 'Year-round',
            },
            reasoning: suggestion.reasoning || 'AI-generated product suggestion',
            differentiators: suggestion.differentiators || [],
            riskLevel: suggestion.riskLevel || 'medium',
            confidence: Math.min(0.95, confidence),
            source: 'ai_research',
        });
    }
    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);
    return results.slice(0, 5); // Return top 5
}
/**
 * Simple similarity check using word overlap
 */
function calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 3));
    if (words1.size === 0 || words2.size === 0)
        return 0;
    const intersection = [...words1].filter(w => words2.has(w)).length;
    const union = new Set([...words1, ...words2]).size;
    return intersection / union;
}
// ============================================
// EXPORT FOR INDEX
// ============================================
export { researchNewProducts as runProductResearch };
