/**
 * AI Product Research Module
 *
 * Uses AI to research external market trends and suggest NEW product opportunities
 * that don't exist in the store's catalog yet.
 */
export interface StoreContext {
    shopId: string;
    shopDomain: string;
    primaryCategories: string[];
    topColors: string[];
    priceSweetSpot: {
        min: number;
        max: number;
    };
    brandStyle: string;
    existingProductTitles: string[];
}
export interface ProductResearchResult {
    productIdea: string;
    productType: string;
    targetPrice: number;
    marketEvidence: {
        trendScore: number;
        searchVolume: string;
        competitorGap: string;
        seasonalRelevance: string;
    };
    reasoning: string;
    differentiators: string[];
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
    source: 'ai_research';
}
export interface ResearchPromptContext {
    categories: string[];
    topColors: string[];
    priceRange: string;
    existingProducts: string[];
    brandDescription: string;
}
export declare function researchNewProducts(shopId: string): Promise<ProductResearchResult[]>;
export { researchNewProducts as runProductResearch };
//# sourceMappingURL=product-research.d.ts.map