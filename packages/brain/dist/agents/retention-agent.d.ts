/**
 * Retention Agent
 * RFM analysis, churn prediction, and retention insights
 */
interface RFMData {
    customerId: string;
    recencyScore: number;
    frequencyScore: number;
    monetaryScore: number;
    rfmSegment: string;
    daysSinceLastOrder: number;
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    churnRisk: number;
    predictedNextOrderDays: number | null;
}
export declare function calculateRFM(shopId: string): Promise<RFMData[]>;
export declare function generateRetentionInsights(shopId: string): Promise<any[]>;
export declare function getRetentionSummary(shopId: string): Promise<{
    totalCustomers: number;
    segmentBreakdown: Record<string, number>;
    atRiskCount: number;
    revenueAtRisk: number;
    topInsights: any[];
}>;
export {};
//# sourceMappingURL=retention-agent.d.ts.map