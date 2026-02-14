/**
 * Deterministic Candidate Scorer
 * Enhanced scoring with SHA256 hashing, version tracking, and full audit trail
 * 
 * SCORING FORMULA v1.0.0:
 * SCORE = (0.25×store_fit + 0.20×gap_fill + 0.20×trend + 0.15×margin + 0.10×competition + 0.10×seasonality)
 */

import { prisma } from '@brandmind/shared';
import { createHash } from 'crypto';

// ============================================
// VERSION & WEIGHTS
// ============================================

// Use weights from candidate-scorer as single source of truth
import { SCORING_WEIGHTS, SCORING_VERSION } from './candidate-scorer';
export { SCORING_WEIGHTS, SCORING_VERSION };

// ============================================
// TYPES
// ============================================

export interface ScoringInput {
    candidateId: string;
    candidateTitle: string;
    candidateType: string;
    shopId: string;
    storeDNA: Record<string, any> | null;
    catalogGaps: any[];
    trendData: any | null;
    seasonalityData: any[];
}

export interface ScoreBreakdown {
    storeFitScore: number;
    gapFillScore: number;
    trendMomentum: number;
    marginPotential: number;
    competitionScore: number;
    seasonalityMatch: number;
    finalScore: number;
}

export interface ScoringResult {
    candidateId: string;
    inputHash: string;
    scores: ScoreBreakdown;
    weights: typeof SCORING_WEIGHTS;
    version: string;
    explanation: string;
}

// ============================================
// HASH FUNCTION
// ============================================

function computeInputHash(input: ScoringInput): string {
    const serialized = JSON.stringify({
        candidateId: input.candidateId,
        candidateTitle: input.candidateTitle,
        candidateType: input.candidateType,
        shopId: input.shopId,
        storeDNAHash: input.storeDNA ? JSON.stringify(input.storeDNA).slice(0, 500) : null,
        gapsCount: input.catalogGaps.length,
        hasTrend: !!input.trendData,
        seasonalityCount: input.seasonalityData.length,
    });
    return createHash('sha256').update(serialized).digest('hex');
}

// ============================================
// INDIVIDUAL SCORERS
// ============================================

/**
 * Store Fit Score - How well does this match the store's DNA patterns?
 */
function calculateStoreFitScore(input: ScoringInput): number {
    const { storeDNA, candidateType } = input;
    if (!storeDNA) return 0.5;

    let score = 0.5;
    const dna = storeDNA as any;

    // Check if candidate matches top performing types
    const topTypes = dna.topPerformingTypes || [];
    if (topTypes.some((t: any) => t.type?.toLowerCase().includes(candidateType.toLowerCase()))) {
        score += 0.3;
    }

    // Check if it matches the price sweet spot
    const priceSweetSpot = dna.priceSweetSpot?.sweetSpot || '';
    if (priceSweetSpot && candidateType.includes('Premium')) {
        score += 0.1;
    }

    // Check vendor concentration - if low, new vendors are encouraged
    const vendorConcentration = dna.vendorConcentration || 0;
    if (vendorConcentration > 0.5) {
        score += 0.1; // Encourage diversification
    }

    return Math.min(1, score);
}

/**
 * Gap Fill Score - Does this address a detected CatalogGap?
 */
function calculateGapFillScore(input: ScoringInput): number {
    const { catalogGaps, candidateTitle, candidateType } = input;
    if (!catalogGaps || catalogGaps.length === 0) return 0.3;

    let maxScore = 0.3;
    const titleLower = candidateTitle.toLowerCase();
    const typeLower = candidateType.toLowerCase();

    for (const gap of catalogGaps) {
        const gapData = gap.gapData || {};

        // Price gap match
        if (gap.gapType === 'price_gap') {
            const band = gapData.band?.toLowerCase() || '';
            if (titleLower.includes('budget') && band.includes('0-25')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            } else if (titleLower.includes('premium') && band.includes('100')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }

        // Category gap match
        if (gap.gapType === 'category_gap') {
            const missingCategory = gapData.missingCategory?.toLowerCase() || '';
            if (typeLower.includes(missingCategory)) {
                maxScore = Math.max(maxScore, gap.gapScore * 1.2);
            }
        }

        // Variant gap match
        if (gap.gapType === 'variant_gap') {
            const colorValue = gapData.value?.toLowerCase() || '';
            if (titleLower.includes(colorValue)) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
    }

    return Math.min(1, maxScore);
}

/**
 * Trend Momentum Score - External trend data if available
 */
function calculateTrendMomentum(input: ScoringInput): number {
    const { trendData } = input;
    if (!trendData) return 0.5; // Neutral if no trend data

    const velocity = trendData.velocity || 0;
    const acceleration = trendData.acceleration || 0;

    // Positive velocity with positive acceleration = strong momentum
    if (velocity > 0 && acceleration > 0) {
        return Math.min(1, 0.6 + velocity * 0.3 + acceleration * 0.1);
    }

    // Positive velocity but slowing
    if (velocity > 0 && acceleration <= 0) {
        return 0.5 + velocity * 0.2;
    }

    // Negative velocity = declining trend
    if (velocity < 0) {
        return Math.max(0.1, 0.5 + velocity * 0.3);
    }

    return 0.5;
}

/**
 * Margin Potential Score - Estimated profitability
 */
function calculateMarginPotential(input: ScoringInput): number {
    const { storeDNA, candidateType } = input;
    if (!storeDNA) return 0.5;

    const priceBands = (storeDNA as any).priceBands;

    // Premium products typically have higher margins
    if (candidateType.toLowerCase().includes('premium')) {
        return 0.8;
    }

    // Find the band with lowest refund rate (indicates quality)
    if (Array.isArray(priceBands) && priceBands.length > 0) {
        const lowestRefundBand = priceBands.reduce((best: any, band: any) => {
            if (!best || (band.refundRate !== undefined && band.refundRate < best.refundRate)) return band;
            return best;
        }, null);

        if (lowestRefundBand && candidateType.includes(lowestRefundBand.band)) {
            return 0.7;
        }
    } else if (priceBands && typeof priceBands === 'object') {
        // Object format from dna-seeder: { low, mid, high }
        const positioning = (storeDNA as any).pricePositioning;
        if (positioning === 'premium' || positioning === 'luxury') {
            return 0.7;
        }
    }

    return 0.5;
}

/**
 * Competition Score - Market saturation estimate (higher = less competition = better)
 */
function calculateCompetitionScore(input: ScoringInput): number {
    const { storeDNA, candidateType } = input;
    if (!storeDNA) return 0.5;

    const topTypes = (storeDNA as any).topPerformingTypes || [];
    const decliningTypes = (storeDNA as any).decliningTypes || [];

    // If the category is declining, there might be over-saturation
    if (decliningTypes.some((t: any) => t.type?.toLowerCase().includes(candidateType.toLowerCase()))) {
        return 0.3;
    }

    // If category is growing, good opportunity
    const growingTypes = (storeDNA as any).growingTypes || [];
    if (growingTypes.some((t: any) => t.type?.toLowerCase().includes(candidateType.toLowerCase()))) {
        return 0.8;
    }

    // Check catalog health - higher health = more competitive market
    const catalogHealth = (storeDNA as any).catalogHealthScore || 50;
    return catalogHealth > 70 ? 0.4 : 0.6;
}

/**
 * Seasonality Match Score - Timing alignment
 */
function calculateSeasonalityMatch(input: ScoringInput): number {
    const { seasonalityData, candidateType } = input;
    const currentMonth = new Date().getMonth();

    if (!seasonalityData || seasonalityData.length === 0) return 0.5;

    const currentMonthData = seasonalityData.find((s: any) => s.month === currentMonth);
    if (!currentMonthData) return 0.5;

    // If current month is a peak month, launching now is good
    if (currentMonthData.revenueIndex > 1.2) {
        return 0.9;
    }

    // If current month is slow, might want to wait
    if (currentMonthData.revenueIndex < 0.7) {
        return 0.4;
    }

    return 0.6;
}

// ============================================
// MAIN SCORING FUNCTION
// ============================================

export async function scoreCandidate(input: ScoringInput): Promise<ScoringResult> {
    // Calculate input hash for reproducibility
    const inputHash = computeInputHash(input);

    // Calculate all individual scores
    const storeFitScore = calculateStoreFitScore(input);
    const gapFillScore = calculateGapFillScore(input);
    const trendMomentum = calculateTrendMomentum(input);
    const marginPotential = calculateMarginPotential(input);
    const competitionScore = calculateCompetitionScore(input);
    const seasonalityMatch = calculateSeasonalityMatch(input);

    // Calculate weighted final score
    const finalScore =
        storeFitScore * SCORING_WEIGHTS.storeFit +
        gapFillScore * SCORING_WEIGHTS.gapFill +
        trendMomentum * SCORING_WEIGHTS.trendMomentum +
        marginPotential * SCORING_WEIGHTS.marginPotential +
        competitionScore * SCORING_WEIGHTS.competition +
        seasonalityMatch * SCORING_WEIGHTS.seasonalityMatch;

    const scores: ScoreBreakdown = {
        storeFitScore: Math.round(storeFitScore * 100) / 100,
        gapFillScore: Math.round(gapFillScore * 100) / 100,
        trendMomentum: Math.round(trendMomentum * 100) / 100,
        marginPotential: Math.round(marginPotential * 100) / 100,
        competitionScore: Math.round(competitionScore * 100) / 100,
        seasonalityMatch: Math.round(seasonalityMatch * 100) / 100,
        finalScore: Math.round(finalScore * 100) / 100,
    };

    // Generate explanation
    const explanation = generateScoringExplanation(scores);

    return {
        candidateId: input.candidateId,
        inputHash,
        scores,
        weights: SCORING_WEIGHTS,
        version: SCORING_VERSION,
        explanation,
    };
}

/**
 * Score and persist audit trail
 */
export async function scoreCandidateWithAudit(input: ScoringInput): Promise<ScoringResult> {
    const result = await scoreCandidate(input);

    // Persist to ScoringAudit table
    await prisma.scoringAudit.create({
        data: {
            candidateId: input.candidateId,
            inputHash: result.inputHash,
            storeFitScore: result.scores.storeFitScore,
            gapFillScore: result.scores.gapFillScore,
            trendMomentum: result.scores.trendMomentum,
            marginPotential: result.scores.marginPotential,
            competitionScore: result.scores.competitionScore,
            seasonalityMatch: result.scores.seasonalityMatch,
            weights: result.weights,
            finalScore: result.scores.finalScore,
            version: result.version,
            inputSnapshot: {
                candidateTitle: input.candidateTitle,
                candidateType: input.candidateType,
                shopId: input.shopId,
                gapsCount: input.catalogGaps.length,
                hasTrend: !!input.trendData,
            },
        },
    });

    return result;
}

/**
 * Batch score multiple candidates
 */
export async function scoreCandidates(
    shopId: string,
    candidates: Array<{ id: string; title: string; productType: string }>
): Promise<ScoringResult[]> {
    // Load shared context once
    const [storeDNA, catalogGaps] = await Promise.all([
        prisma.storeDNA.findUnique({ where: { shopId } }),
        prisma.catalogGap.findMany({ where: { shopId, status: 'active' } }),
    ]);

    const seasonalityData = (storeDNA as any)?.seasonalityCurve || [];

    const results: ScoringResult[] = [];

    for (const candidate of candidates) {
        const input: ScoringInput = {
            candidateId: candidate.id,
            candidateTitle: candidate.title,
            candidateType: candidate.productType || 'Unknown',
            shopId,
            storeDNA: storeDNA as any,
            catalogGaps,
            trendData: null, // Would be fetched from TrendData table in production
            seasonalityData,
        };

        const result = await scoreCandidateWithAudit(input);
        results.push(result);
    }

    // Sort by final score
    results.sort((a, b) => b.scores.finalScore - a.scores.finalScore);

    return results;
}

// ============================================
// HELPERS
// ============================================

function generateScoringExplanation(scores: ScoreBreakdown): string {
    const parts: string[] = [];

    if (scores.storeFitScore > 0.7) parts.push('Strong store DNA match');
    else if (scores.storeFitScore < 0.4) parts.push('Limited store fit');

    if (scores.gapFillScore > 0.6) parts.push('fills catalog gap');
    if (scores.trendMomentum > 0.7) parts.push('positive trend momentum');
    if (scores.marginPotential > 0.7) parts.push('high margin potential');
    if (scores.competitionScore > 0.7) parts.push('low competition');
    if (scores.seasonalityMatch > 0.7) parts.push('good timing');

    return parts.length > 0 ? parts.join(', ') : 'Balanced opportunity';
}
