/**
 * Evidence & Grounding System
 * Tracks data sources, builds reasoning chains, and guards against hallucination
 */
export interface EvidenceItem {
    claim: string;
    source: string;
    dataPoint: string | number;
    timestamp: Date;
    strength: 'strong' | 'moderate' | 'weak';
}
export interface ReasoningChain {
    conclusion: string;
    evidence: EvidenceItem[];
    confidence: number;
    reasoning: string;
}
export interface DataQuality {
    shopId: string;
    freshness: number;
    completeness: number;
    volume: number;
    overallScore: number;
    issues: string[];
}
export declare class EvidenceCollector {
    private evidence;
    private shopId;
    constructor(shopId: string);
    addEvidence(claim: string, source: string, dataPoint: string | number, strength?: 'strong' | 'moderate' | 'weak'): void;
    getEvidence(): EvidenceItem[];
    buildReasoningChain(conclusion: string, reasoning: string): ReasoningChain;
}
export declare function calculateDataQuality(shopId: string): Promise<DataQuality>;
export declare function validateClaim(shopId: string, claim: string, type: 'product' | 'order' | 'customer' | 'metric'): Promise<{
    valid: boolean;
    reason: string;
    suggestion?: string;
}>;
export declare function calculateConfidence(shopId: string, sampleSize: number, patternStrength: number): Promise<{
    confidence: number;
    explanation: string;
}>;
export declare function getInsufficientDataResponse(reason: string): {
    type: 'insufficient_data';
    message: string;
    suggestions: string[];
};
//# sourceMappingURL=evidence.d.ts.map