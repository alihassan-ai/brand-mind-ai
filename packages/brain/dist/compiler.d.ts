export type BrandDNA = {
    brandName: string;
    mission: string;
    promise: string;
    positioning: {
        target: string;
        category: string;
        differentiator: string;
        proof: string;
    };
    coreValues: string[];
    antiValues: string[];
    toneAttributes: string[];
    neverLanguage: string[];
    primaryPersona: {
        name: string;
        jobToBeDone: string;
        triggers: string[];
        objections: string[];
    } | null;
    riskTolerance: string;
    priorityAreas: string[];
    northStarMetric: string;
};
/**
 * Compile the Brand DNA for a given shop.
 * This is the "always-on" context injected into every LLM call.
 */
export declare function compileBrandDNA(shopId: string): Promise<BrandDNA | null>;
/**
 * Generate the system prompt for LLM calls based on Brand DNA.
 */
export declare function generateBrandSystemPrompt(dna: BrandDNA): string;
//# sourceMappingURL=compiler.d.ts.map