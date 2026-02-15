export interface PublicBrandAnalysis {
    brandName: string;
    description: string;
    healthScore: number;
    estimatedRevenue: string;
    topOpportunities: string[];
    riskSignals: string[];
    modernityScore: number;
}
export declare function analyzePublicDomain(domain: string): Promise<PublicBrandAnalysis>;
//# sourceMappingURL=public-analyzer.d.ts.map