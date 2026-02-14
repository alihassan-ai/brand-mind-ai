/**
 * Deterministic Candidate Scorer
 * Enhanced scoring with SHA256 hashing, version tracking, and full audit trail
 *
 * SCORING FORMULA v1.0.0:
 * SCORE = (0.25×store_fit + 0.20×gap_fill + 0.20×trend + 0.15×margin + 0.10×competition + 0.10×seasonality)
 */
import { SCORING_WEIGHTS, SCORING_VERSION } from './candidate-scorer';
export { SCORING_WEIGHTS, SCORING_VERSION };
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
export declare function scoreCandidate(input: ScoringInput): Promise<ScoringResult>;
/**
 * Score and persist audit trail
 */
export declare function scoreCandidateWithAudit(input: ScoringInput): Promise<ScoringResult>;
/**
 * Batch score multiple candidates
 */
export declare function scoreCandidates(shopId: string, candidates: Array<{
    id: string;
    title: string;
    productType: string;
}>): Promise<ScoringResult[]>;
//# sourceMappingURL=deterministic-scorer.d.ts.map