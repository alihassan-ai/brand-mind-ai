interface RawCandidate {
    title: string;
    description: string;
    patternSource: string;
    patternEvidence: Record<string, any>;
    confidence: number;
    hitType: 'safe' | 'moderate' | 'bold';
}
export declare function generateCandidates(shopId: string): Promise<RawCandidate[]>;
export {};
//# sourceMappingURL=candidate-generator.d.ts.map