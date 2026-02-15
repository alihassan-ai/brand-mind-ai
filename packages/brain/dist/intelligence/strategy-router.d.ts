/**
 * Strategy Router
 * Determines which product expansion strategy to recommend based on Brand DNA signals
 */
export type ExpansionStrategy = 'VARIANT_EXTENSION' | 'HORIZONTAL_EXTENSION' | 'VERTICAL_EXTENSION' | 'CATEGORY_EXPANSION' | 'NEW_DOMAIN_ENTRY' | 'OPTIMIZE_EXISTING';
export interface StrategyRecommendation {
    primaryStrategy: ExpansionStrategy;
    reasoning: string[];
    confidence: number;
    alternativeStrategies: Array<{
        strategy: ExpansionStrategy;
        reasoning: string;
    }>;
    launchTiming: {
        recommended: string;
        reasoning: string;
    };
}
interface DNASignals {
    heroProductShare: number;
    top5ProductShare: number;
    concentrationRisk: 'low' | 'medium' | 'high';
    orderVelocityTrend: 'accelerating' | 'stable' | 'declining';
    revenueGrowth30d: number;
    marginHealthStatus: 'healthy' | 'moderate' | 'stressed';
    inferredCashPosition: 'cash_rich' | 'balanced' | 'tight';
    cashCowProductCount: number;
    starProductCount: number;
    categoryDepth: 'shallow' | 'moderate' | 'deep';
    categoryBreadth: 'narrow' | 'moderate' | 'broad';
    seasonalPosition: 'pre_peak' | 'peak' | 'post_peak' | 'off_season';
    monthsUntilPeak: number;
}
export declare function determineExpansionStrategy(signals: DNASignals): StrategyRecommendation;
export declare function getStrategyRecommendation(shopId: string): Promise<StrategyRecommendation | null>;
export declare const STRATEGY_INFO: Record<ExpansionStrategy, {
    name: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    timeToMarket: string;
    examples: string[];
}>;
export {};
//# sourceMappingURL=strategy-router.d.ts.map