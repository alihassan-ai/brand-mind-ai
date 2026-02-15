/**
 * Unified Candidate Scorer
 * Single scoring pipeline that uses the deterministic formula v1.0.0
 *
 * SCORING FORMULA v1.0.0:
 * SCORE = (0.25×store_fit + 0.20×gap_fill + 0.20×trend + 0.15×margin + 0.10×competition + 0.10×seasonality)
 */
import { TrendResult } from '../intelligence/trends';
export declare const SCORING_VERSION = "1.0.0";
export declare const SCORING_WEIGHTS: {
    storeFit: number;
    gapFill: number;
    trendMomentum: number;
    marginPotential: number;
    competition: number;
    seasonalityMatch: number;
};
export interface RawCandidate {
    title: string;
    description: string;
    patternSource: string;
    patternEvidence: Record<string, any>;
    confidence: number;
    hitType: 'safe' | 'moderate' | 'bold';
}
export interface ScoredCandidate extends RawCandidate {
    scores: {
        storeFit: number;
        gapFill: number;
        trendMomentum: number;
        marginPotential: number;
        competition: number;
        seasonalityMatch: number;
    };
    totalScore: number;
    rank: number;
    scoreExplanation: string;
    inputHash: string;
}
export interface ScoringContext {
    storeDNA: any;
    catalogGaps: any[];
    patterns: any[];
    existingProducts: any[];
    seasonalityData: any[];
    trendData: Map<string, TrendResult>;
}
export declare function scoreAndFilterCandidates(shopId: string, candidates: RawCandidate[]): Promise<ScoredCandidate[]>;
//# sourceMappingURL=candidate-scorer.d.ts.map