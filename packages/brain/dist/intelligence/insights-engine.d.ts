/**
 * Insights Engine
 * Unified intelligence layer for all store insights
 */
export interface CatalogHealth {
    overallScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    metrics: {
        diversification: {
            score: number;
            label: string;
            detail: string;
        };
        priceCoverage: {
            score: number;
            label: string;
            detail: string;
        };
        categoryDepth: {
            score: number;
            label: string;
            detail: string;
        };
        velocity: {
            score: number;
            label: string;
            detail: string;
        };
        customerLoyalty: {
            score: number;
            label: string;
            detail: string;
        };
    };
    recommendations: string[];
}
export interface PatternInsight {
    id: string;
    type: 'color_winner' | 'bundle_opportunity' | 'price_sweet_spot' | 'seasonal_peak' | 'growth_category';
    title: string;
    detail: string;
    action: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    icon: string;
}
export interface ProductGrade {
    productId: string;
    title: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
    metrics: {
        velocity: number;
        revenue: number;
        refundRate: number;
    };
    trend: 'up' | 'down' | 'stable';
    recommendation: string;
}
export interface BundleSuggestion {
    id: string;
    products: string[];
    productIds: string[];
    coOccurrences: number;
    suggestedDiscount: number;
    estimatedUplift: number;
    bundleName: string;
    confidence: number;
}
export interface PriceAlert {
    productId: string;
    productTitle: string;
    currentPrice: number;
    currentBand: string;
    optimalBand: string;
    suggestion: string;
    potentialUplift: string;
}
export interface SeasonalMonth {
    month: string;
    monthIndex: number;
    revenueIndex: number;
    isPeak: boolean;
    isSlow: boolean;
    recommendation: string;
    icon: string;
}
export interface CannibalizationPair {
    product1: {
        id: string;
        title: string;
    };
    product2: {
        id: string;
        title: string;
    };
    similarity: number;
    sharedAttributes: string[];
    recommendation: string;
}
export interface CustomerCohort {
    name: string;
    count: number;
    percentage: number;
    totalRevenue: number;
    avgOrderValue: number;
    color: string;
    action: string;
}
export interface RestockAlert {
    productId: string;
    productTitle: string;
    currentStock: number;
    dailyVelocity: number;
    daysUntilStockout: number;
    urgency: 'critical' | 'warning' | 'ok';
    suggestedReorder: number;
}
export interface MarketingMoment {
    id: string;
    type: 'product_launch' | 'flash_sale' | 'bundle_promo' | 'winback' | 'loyalty';
    timing: string;
    title: string;
    description: string;
    targetAudience: string;
    expectedImpact: string;
    priority: 'high' | 'medium' | 'low';
}
export declare function calculateCatalogHealth(shopId: string): Promise<CatalogHealth>;
export declare function getPatternInsights(shopId: string): Promise<PatternInsight[]>;
export declare function gradeProducts(shopId: string): Promise<ProductGrade[]>;
export declare function suggestBundles(shopId: string): Promise<BundleSuggestion[]>;
export declare function getPriceAlerts(shopId: string): Promise<PriceAlert[]>;
export declare function getSeasonalCalendar(shopId: string): Promise<SeasonalMonth[]>;
export declare function detectCannibalization(shopId: string): Promise<CannibalizationPair[]>;
export declare function analyzeCustomerCohorts(shopId: string): Promise<CustomerCohort[]>;
export declare function predictRestocks(shopId: string): Promise<RestockAlert[]>;
export declare function findMarketingMoments(shopId: string): Promise<MarketingMoment[]>;
//# sourceMappingURL=insights-engine.d.ts.map