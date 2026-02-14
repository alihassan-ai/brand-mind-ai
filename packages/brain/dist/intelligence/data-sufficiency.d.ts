/**
 * Data Sufficiency Checker
 * Validates whether a store has enough data for various features
 */
export interface DataBlocker {
    feature: string;
    requirement: string;
    current: string;
    needed: string;
    message: string;
    estimatedReadyDate?: Date;
}
export interface DataWarning {
    feature: string;
    message: string;
    impact: string;
}
export interface DataEstimate {
    feature: string;
    currentProgress: number;
    estimatedDaysUntilReady: number;
    message: string;
}
export interface SufficiencyResult {
    sufficient: boolean;
    score: number;
    blockers: DataBlocker[];
    warnings: DataWarning[];
    estimates: DataEstimate[];
    stats: {
        orderCount: number;
        productCount: number;
        customerCount: number;
        storeAgeDays: number;
        dataSpanDays: number;
        multiItemOrderCount: number;
        categoryCount: number;
        repeatCustomerCount: number;
    };
}
export declare function checkDataSufficiency(shopId: string): Promise<SufficiencyResult>;
export declare function getDataSufficiency(shopId: string): Promise<SufficiencyResult | null>;
export declare function canUseFeature(shopId: string, feature: string): Promise<{
    allowed: boolean;
    blocker?: DataBlocker;
}>;
//# sourceMappingURL=data-sufficiency.d.ts.map