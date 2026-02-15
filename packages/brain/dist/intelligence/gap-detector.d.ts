/**
 * Gap Detection Engine
 * Identifies opportunities in the store's catalog
 */
interface GapResult {
    gapType: string;
    gapScore: number;
    gapData: Record<string, any>;
    description: string;
    suggestedAction: string;
    potentialRevenue: number | null;
    confidence: number;
}
/**
 * 3.1 Price Gap Detector
 * Finds price bands with adjacent demand but low product count
 */
export declare function detectPriceGaps(shopId: string): Promise<GapResult[]>;
/**
 * 3.2 Category Adjacency Gaps
 * Identifies missing complementary product categories
 */
export declare function detectCategoryGaps(shopId: string): Promise<GapResult[]>;
/**
 * 3.3 Variant Coverage Gaps
 * Detects underrepresented winning attributes (colors, sizes)
 */
export declare function detectVariantGaps(shopId: string): Promise<GapResult[]>;
/**
 * 3.4 Seasonal Gaps
 * Identifies months with low revenue that could use seasonal products
 */
export declare function detectSeasonalGaps(shopId: string): Promise<GapResult[]>;
/**
 * 3.5 Detect All Gaps - Main function
 */
export declare function detectAllGaps(shopId: string): Promise<{
    gaps: GapResult[];
    summary: {
        totalGaps: number;
        byType: Record<string, number>;
        topOpportunity: GapResult | null;
    };
}>;
export {};
//# sourceMappingURL=gap-detector.d.ts.map