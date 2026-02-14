/**
 * Store DNA Extractor
 * Analyzes store data to extract patterns, preferences, and intelligence
 */
import { Prisma } from '@prisma/client';
interface PriceBand {
    band: string;
    min: number;
    max: number;
    revenue: number;
    orders: number;
    products: number;
    avgPrice: number;
    refundRate: number;
}
interface ProductVelocity {
    productId: string;
    title: string;
    velocity: number;
    acceleration: number;
    lifecycleStage: 'rising' | 'peak' | 'declining' | 'dead';
    daysSinceCreated: number;
    totalUnitsSold: number;
}
interface ProductTypePerformance {
    type: string;
    revenue: number;
    revenueShare: number;
    orderCount: number;
    growthRate: number;
    avgOrderValue: number;
}
interface VendorPerformance {
    vendor: string;
    revenue: number;
    revenueShare: number;
    refundRate: number;
    productCount: number;
}
interface SeasonalityData {
    month: number;
    monthName: string;
    revenue: number;
    revenueIndex: number;
    orderCount: number;
}
/**
 * 2.1 Product Velocity Calculator
 * velocity = total_units_sold / days_since_created
 * acceleration = Δvelocity_30d - Δvelocity_60d
 */
export declare function calculateProductVelocities(shopId: string): Promise<ProductVelocity[]>;
/**
 * 2.2 Price Band Analyzer
 * Group products into bands and calculate metrics per band
 */
export declare function analyzePriceBands(shopId: string): Promise<{
    priceBands: PriceBand[];
    sweetSpot: string;
}>;
/**
 * 2.3 Product Type Performance
 */
export declare function analyzeProductTypePerformance(shopId: string): Promise<ProductTypePerformance[]>;
/**
 * 2.5 Vendor Performance & Concentration (HHI)
 */
export declare function analyzeVendorPerformance(shopId: string): Promise<{
    vendors: VendorPerformance[];
    concentrationHHI: number;
}>;
/**
 * 2.6 Seasonality Curve
 */
export declare function analyzeSeasonality(shopId: string): Promise<SeasonalityData[]>;
/**
 * 2.4 Customer Purchase Patterns - Entry Products
 * Returns top products that appear in orders (simplified)
 */
export declare function findEntryProducts(shopId: string): Promise<Array<{
    title: string;
    count: number;
    share: number;
}>>;
/**
 * 2.7 Compute Store DNA - Main function
 */
export declare function computeStoreDNA(shopId: string): Promise<{
    id: string;
    shopId: string;
    updatedAt: Date;
    computedAt: Date;
    brandName: string | null;
    tagline: string | null;
    mission: string | null;
    vision: string | null;
    coreValues: string[];
    antiValues: string[];
    brandPersonality: string[];
    targetAudience: Prisma.JsonValue | null;
    brandStory: string | null;
    foundingYear: number | null;
    industry: string | null;
    niche: string | null;
    pricePositioning: string | null;
    competitiveDifferentiator: string | null;
    directCompetitors: string[];
    marketMaturity: string | null;
    geographicReach: string | null;
    priceSweetSpot: Prisma.JsonValue | null;
    priceBands: Prisma.JsonValue | null;
    avgOrderValue: number | null;
    avgItemPrice: number | null;
    totalProducts: number | null;
    totalVariants: number | null;
    categoryBreakdown: Prisma.JsonValue | null;
    categoryDepth: string | null;
    categoryBreadth: string | null;
    topPerformingTypes: Prisma.JsonValue | null;
    growingTypes: Prisma.JsonValue | null;
    decliningTypes: Prisma.JsonValue | null;
    productLifecycles: Prisma.JsonValue | null;
    lifecycleDistribution: Prisma.JsonValue | null;
    vendorPerformance: Prisma.JsonValue | null;
    vendorConcentration: number | null;
    vendorCount: number | null;
    seasonalityCurve: Prisma.JsonValue | null;
    seasonalityPattern: string | null;
    peakMonths: string[];
    lowMonths: string[];
    avgOrderFrequency: number | null;
    repeatPurchaseRate: number | null;
    avgItemsPerOrder: number | null;
    basketAffinities: Prisma.JsonValue | null;
    entryProducts: Prisma.JsonValue | null;
    upgradePaths: Prisma.JsonValue | null;
    customerSegments: Prisma.JsonValue | null;
    segmentDistribution: Prisma.JsonValue | null;
    avgLTV: number | null;
    medianLTV: number | null;
    heroProductShare: number | null;
    top5ProductShare: number | null;
    concentrationRisk: string | null;
    revenueGrowth30d: number | null;
    revenueGrowth90d: number | null;
    orderVelocityTrend: string | null;
    newCustomerTrend: string | null;
    estimatedGrossMargin: number | null;
    gmroi: number | null;
    marginHealthStatus: string | null;
    inferredCashPosition: string | null;
    cashCowProductCount: number | null;
    starProductCount: number | null;
    questionMarkProductCount: number | null;
    seasonalPosition: string | null;
    monthsUntilPeak: number | null;
    launchWindowQuality: string | null;
    recommendedStrategy: string | null;
    strategyReasons: string[];
    strategyConfidence: number | null;
    alternativeStrategies: Prisma.JsonValue | null;
    recommendedLaunchTiming: string | null;
    launchTimingReason: string | null;
    completenessScore: number | null;
    dataQualityScore: number | null;
    isActionable: boolean;
    missingFields: Prisma.JsonValue | null;
    dataBlockers: Prisma.JsonValue | null;
    hasPublicDemoData: boolean;
    hasBrandBookData: boolean;
    hasShopifyData: boolean;
    lastShopifySync: Date | null;
    catalogHealthScore: number | null;
    customerHealthScore: number | null;
    overallHealthScore: number | null;
}>;
export {};
//# sourceMappingURL=store-dna.d.ts.map