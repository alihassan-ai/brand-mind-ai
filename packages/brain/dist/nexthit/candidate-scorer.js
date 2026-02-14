/**
 * Unified Candidate Scorer
 * Single scoring pipeline that uses the deterministic formula v1.0.0
 *
 * SCORING FORMULA v1.0.0:
 * SCORE = (0.25×store_fit + 0.20×gap_fill + 0.20×trend + 0.15×margin + 0.10×competition + 0.10×seasonality)
 */
import { prisma } from '@brandmind/shared';
import { createHash } from 'crypto';
import { getTrendData } from '../intelligence/trends';
// ============================================
// VERSION & WEIGHTS (Single Source of Truth)
// ============================================
export const SCORING_VERSION = '1.0.0';
export const SCORING_WEIGHTS = {
    storeFit: 0.25,
    gapFill: 0.20,
    trendMomentum: 0.20,
    marginPotential: 0.15,
    competition: 0.10,
    seasonalityMatch: 0.10,
};
// ============================================
// MAIN SCORING FUNCTION
// ============================================
export async function scoreAndFilterCandidates(shopId, candidates) {
    console.log(`[CandidateScorer] Scoring ${candidates.length} candidates with unified formula v${SCORING_VERSION}`);
    // Load all context data once
    const context = await loadScoringContext(shopId, candidates);
    const scoredCandidates = [];
    for (const candidate of candidates) {
        const scores = {
            storeFit: calculateStoreFitScore(candidate, context),
            gapFill: calculateGapFillScore(candidate, context),
            trendMomentum: calculateTrendMomentum(candidate, context),
            marginPotential: calculateMarginPotential(candidate, context),
            competition: calculateCompetitionScore(candidate, context),
            seasonalityMatch: calculateSeasonalityMatch(candidate, context),
        };
        // Calculate weighted total score using unified formula
        const totalScore = scores.storeFit * SCORING_WEIGHTS.storeFit +
            scores.gapFill * SCORING_WEIGHTS.gapFill +
            scores.trendMomentum * SCORING_WEIGHTS.trendMomentum +
            scores.marginPotential * SCORING_WEIGHTS.marginPotential +
            scores.competition * SCORING_WEIGHTS.competition +
            scores.seasonalityMatch * SCORING_WEIGHTS.seasonalityMatch;
        const inputHash = computeInputHash(candidate, context, shopId);
        const scoreExplanation = generateExplanation(scores, candidate);
        scoredCandidates.push(Object.assign(Object.assign({}, candidate), { scores, totalScore: Math.round(totalScore * 100) / 100, rank: 0, scoreExplanation,
            inputHash }));
    }
    // Sort by total score and assign ranks
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);
    scoredCandidates.forEach((c, i) => c.rank = i + 1);
    // Return top 10
    const top10 = scoredCandidates.slice(0, 10);
    // Persist top 10 to database
    await persistCandidates(shopId, top10);
    console.log(`[CandidateScorer] Returning top 10 candidates`);
    return top10;
}
// ============================================
// CONTEXT LOADING
// ============================================
async function loadScoringContext(shopId, candidates) {
    var _a, _b;
    const [storeDNA, catalogGaps, patterns, existingProducts] = await Promise.all([
        prisma.storeDNA.findUnique({ where: { shopId } }),
        prisma.catalogGap.findMany({ where: { shopId, status: 'active' } }),
        prisma.patternMemory.findMany({ where: { shopId } }),
        prisma.product.findMany({
            where: { shopId },
            select: { title: true, productType: true },
        }),
    ]);
    const seasonalityData = (storeDNA === null || storeDNA === void 0 ? void 0 : storeDNA.seasonalityCurve) || [];
    // Fetch trend data for candidate keywords
    const trendData = new Map();
    const keywords = new Set();
    for (const candidate of candidates) {
        // Extract keywords from title and evidence
        const words = candidate.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        words.forEach(w => keywords.add(w));
        if ((_a = candidate.patternEvidence) === null || _a === void 0 ? void 0 : _a.category) {
            keywords.add(candidate.patternEvidence.category.toLowerCase());
        }
        if ((_b = candidate.patternEvidence) === null || _b === void 0 ? void 0 : _b.suggestedLine) {
            keywords.add(candidate.patternEvidence.suggestedLine.toLowerCase());
        }
    }
    // Fetch trends for keywords (limit to 10 to avoid rate limiting)
    const keywordsArray = Array.from(keywords).slice(0, 10);
    for (const keyword of keywordsArray) {
        try {
            const trend = await getTrendData(keyword);
            trendData.set(keyword, trend);
        }
        catch (err) {
            // Silently continue if trend fetch fails
        }
    }
    return {
        storeDNA: storeDNA,
        catalogGaps,
        patterns,
        existingProducts,
        seasonalityData,
        trendData,
    };
}
// ============================================
// INDIVIDUAL SCORERS
// ============================================
/**
 * Store Fit Score - How well does this match the store's DNA patterns?
 */
function calculateStoreFitScore(candidate, context) {
    var _a, _b, _c;
    const { storeDNA, patterns } = context;
    if (!storeDNA)
        return 0.5;
    let score = 0.5;
    const titleLower = candidate.title.toLowerCase();
    const source = candidate.patternSource;
    // Check if candidate matches top performing types
    const topTypes = storeDNA.topPerformingTypes || [];
    for (const t of topTypes) {
        const typeName = (t.type || '').toLowerCase();
        if (titleLower.includes(typeName) || source.includes(typeName)) {
            score += 0.25;
            break;
        }
    }
    // Check category affinity pattern
    const categoryPattern = patterns.find(p => p.patternType === 'category_affinity');
    if (categoryPattern) {
        const topCategory = ((_b = (_a = categoryPattern.patternData) === null || _a === void 0 ? void 0 : _a.topCategory) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
        if (titleLower.includes(topCategory) || source.includes(topCategory)) {
            score += 0.15;
        }
    }
    // Check if it matches the price sweet spot
    const priceSweetSpot = ((_c = storeDNA.priceSweetSpot) === null || _c === void 0 ? void 0 : _c.sweetSpot) || '';
    if (priceSweetSpot) {
        const evidence = candidate.patternEvidence;
        if (evidence.suggestedPrice || evidence.priceRange) {
            score += 0.1;
        }
    }
    return Math.min(1, score);
}
/**
 * Gap Fill Score - Does this address a detected CatalogGap?
 */
function calculateGapFillScore(candidate, context) {
    var _a;
    const { catalogGaps } = context;
    if (!catalogGaps || catalogGaps.length === 0)
        return 0.3;
    let maxScore = 0.3;
    const titleLower = candidate.title.toLowerCase();
    const source = candidate.patternSource;
    for (const gap of catalogGaps) {
        const gapData = gap.gapData || {};
        // Price gap match
        if (gap.gapType === 'price_gap') {
            const band = (gapData.band || '').toLowerCase();
            if (source === 'market_gap' && ((_a = candidate.patternEvidence) === null || _a === void 0 ? void 0 : _a.gapType) === 'Price Void') {
                maxScore = Math.max(maxScore, gap.gapScore * 1.2);
            }
            else if (titleLower.includes('budget') && band.includes('0-25')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
            else if (titleLower.includes('premium') && band.includes('100')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
        // Category gap match
        if (gap.gapType === 'category_gap') {
            const missingCategory = (gapData.missingCategory || '').toLowerCase();
            if (source === 'market_gap' || source === 'category_expansion') {
                if (titleLower.includes(missingCategory)) {
                    maxScore = Math.max(maxScore, gap.gapScore * 1.3);
                }
            }
        }
        // Variant gap match
        if (gap.gapType === 'variant_gap') {
            const colorValue = (gapData.value || '').toLowerCase();
            if (source === 'color_extension' && titleLower.includes(colorValue)) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
    }
    return Math.min(1, maxScore);
}
/**
 * Trend Momentum Score - External trend data integration
 */
function calculateTrendMomentum(candidate, context) {
    var _a;
    const { trendData } = context;
    // Find matching trend data
    const titleWords = candidate.title.toLowerCase().split(/\s+/);
    let bestTrend = null;
    for (const word of titleWords) {
        const trend = trendData.get(word);
        if (trend && (!bestTrend || trend.trendScore > bestTrend.trendScore)) {
            bestTrend = trend;
        }
    }
    // Also check evidence keywords
    if ((_a = candidate.patternEvidence) === null || _a === void 0 ? void 0 : _a.category) {
        const trend = trendData.get(candidate.patternEvidence.category.toLowerCase());
        if (trend && (!bestTrend || trend.trendScore > bestTrend.trendScore)) {
            bestTrend = trend;
        }
    }
    if (!bestTrend || bestTrend.source === 'error') {
        // Fallback to pattern-based scoring if no external trend data
        const source = candidate.patternSource;
        if (source === 'market_gap')
            return 0.7; // Market gaps indicate demand
        if (source === 'category_expansion')
            return 0.6;
        if (source === 'color_extension')
            return 0.55;
        return 0.5;
    }
    // Calculate score from trend data
    const velocity = bestTrend.velocity;
    const trendScore = bestTrend.trendScore;
    // High trend score + positive velocity = strong momentum
    if (trendScore > 70 && velocity > 0) {
        return Math.min(1, 0.7 + (trendScore / 100) * 0.2 + (velocity / 50) * 0.1);
    }
    // Moderate trend score
    if (trendScore > 40) {
        return 0.5 + (trendScore / 100) * 0.3;
    }
    // Low or declining trend
    if (velocity < 0) {
        return Math.max(0.2, 0.5 + velocity / 100);
    }
    return 0.5;
}
/**
 * Margin Potential Score - Estimated profitability
 */
function calculateMarginPotential(candidate, context) {
    var _a, _b;
    const { storeDNA } = context;
    const source = candidate.patternSource;
    const titleLower = candidate.title.toLowerCase();
    // Premium products typically have higher margins
    if (titleLower.includes('premium') || titleLower.includes('luxury') || titleLower.includes('elite')) {
        return 0.85;
    }
    // Bundles have good margin due to perceived value
    if (source === 'bundle_merge') {
        return 0.75;
    }
    // Check price band pattern for refund rates (proxy for quality/margin)
    if (storeDNA === null || storeDNA === void 0 ? void 0 : storeDNA.priceBands) {
        const priceBands = storeDNA.priceBands;
        // Handle both array format (from PatternMemory) and object format (from DNA seeder)
        if (Array.isArray(priceBands)) {
            const lowestRefundBand = priceBands.reduce((best, band) => {
                if (!best || (band.refundRate !== undefined && band.refundRate < best.refundRate))
                    return band;
                return best;
            }, null);
            if (lowestRefundBand && ((_b = (_a = candidate.patternEvidence) === null || _a === void 0 ? void 0 : _a.priceRange) === null || _b === void 0 ? void 0 : _b.includes(lowestRefundBand.band))) {
                return 0.7;
            }
        }
        else if (typeof priceBands === 'object') {
            // Object format: { low: number, mid: number, high: number }
            // Use price positioning instead
            const positioning = storeDNA.pricePositioning;
            if (positioning === 'premium' || positioning === 'luxury') {
                return 0.75;
            }
        }
    }
    // Category expansions have uncertain margins
    if (source === 'category_expansion') {
        return 0.5;
    }
    return 0.6;
}
/**
 * Competition Score - Market saturation estimate (higher = less competition = better)
 */
function calculateCompetitionScore(candidate, context) {
    const { storeDNA, existingProducts } = context;
    const titleLower = candidate.title.toLowerCase();
    const source = candidate.patternSource;
    // Check for cannibalization with existing products
    let highestOverlap = 0;
    for (const product of existingProducts) {
        const existingTitle = product.title.toLowerCase();
        const candidateWords = new Set(titleLower.split(/\s+/).filter((w) => w.length > 3));
        const existingWords = new Set(existingTitle.split(/\s+/).filter((w) => w.length > 3));
        const overlap = [...candidateWords].filter((w) => existingWords.has(w)).length;
        highestOverlap = Math.max(highestOverlap, overlap);
    }
    // High overlap = competing with existing products
    if (highestOverlap >= 3) {
        return 0.3;
    }
    // Bundles don't compete - they complement
    if (source === 'bundle_merge') {
        return 0.85;
    }
    // Category expansions open new space
    if (source === 'category_expansion' || source === 'market_gap') {
        return 0.8;
    }
    // Check if category is growing or declining
    if (storeDNA) {
        const decliningTypes = storeDNA.decliningTypes || [];
        const growingTypes = storeDNA.growingTypes || [];
        for (const t of decliningTypes) {
            if (titleLower.includes((t.type || '').toLowerCase())) {
                return 0.35;
            }
        }
        for (const t of growingTypes) {
            if (titleLower.includes((t.type || '').toLowerCase())) {
                return 0.75;
            }
        }
    }
    return 0.6;
}
/**
 * Seasonality Match Score - Timing alignment
 */
function calculateSeasonalityMatch(candidate, context) {
    const { seasonalityData } = context;
    const currentMonth = new Date().getMonth();
    if (!seasonalityData || seasonalityData.length === 0)
        return 0.5;
    const currentMonthData = seasonalityData.find((s) => s.month === currentMonth);
    if (!currentMonthData)
        return 0.5;
    const revenueIndex = currentMonthData.revenueIndex || 1.0;
    // Peak month - great time to launch
    if (revenueIndex > 1.2) {
        return 0.9;
    }
    // Above average month
    if (revenueIndex > 1.0) {
        return 0.7;
    }
    // Slow month - launching now is riskier
    if (revenueIndex < 0.7) {
        return 0.4;
    }
    return 0.6;
}
// ============================================
// HELPERS
// ============================================
function computeInputHash(candidate, context, shopId) {
    const serialized = JSON.stringify({
        title: candidate.title,
        source: candidate.patternSource,
        shopId,
        gapsCount: context.catalogGaps.length,
        hasStoreDNA: !!context.storeDNA,
        patternsCount: context.patterns.length,
    });
    return createHash('sha256').update(serialized).digest('hex').slice(0, 16);
}
function generateExplanation(scores, candidate) {
    const parts = [];
    if (scores.storeFit > 0.7)
        parts.push('Strong DNA match');
    else if (scores.storeFit < 0.4)
        parts.push('Limited store fit');
    if (scores.gapFill > 0.6)
        parts.push('fills catalog gap');
    if (scores.trendMomentum > 0.7)
        parts.push('positive trend momentum');
    else if (scores.trendMomentum < 0.4)
        parts.push('low market trend');
    if (scores.marginPotential > 0.7)
        parts.push('high margin potential');
    if (scores.competition > 0.7)
        parts.push('low competition');
    else if (scores.competition < 0.4)
        parts.push('may overlap existing products');
    if (scores.seasonalityMatch > 0.7)
        parts.push('good timing');
    else if (scores.seasonalityMatch < 0.5)
        parts.push('off-peak timing');
    return parts.length > 0 ? parts.join(', ') : 'Balanced opportunity';
}
async function persistCandidates(shopId, candidates) {
    // Clear old generated candidates (keep shortlisted, analyzing, etc.)
    await prisma.nextHitCandidate.deleteMany({
        where: { shopId, status: 'generated' },
    });
    // Insert new top 10
    for (const candidate of candidates) {
        await prisma.nextHitCandidate.create({
            data: {
                shopId,
                title: candidate.title,
                description: candidate.description,
                patternSource: candidate.patternSource,
                patternEvidence: candidate.patternEvidence,
                confidence: candidate.totalScore, // Use unified score as confidence
                hitType: candidate.hitType,
                status: 'generated',
                scores: candidate.scores,
                rank: candidate.rank,
            },
        });
    }
}
