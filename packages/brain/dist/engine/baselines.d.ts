export interface Baseline {
    average: number;
    stdDev: number;
}
export declare function computeDailyMetricBaselines(shopId: string, daysLookback?: number): Promise<{
    netRevenue: Baseline;
    orderCount: Baseline;
} | null>;
export declare function computeProductBaselines(variantId: string, daysLookback?: number): Promise<{
    unitsSold: Baseline;
} | null>;
//# sourceMappingURL=baselines.d.ts.map