export declare enum GoalType {
    REVENUE_GROWTH = "REVENUE_GROWTH",
    REFUND_REDUCTION = "REFUND_REDUCTION",
    AOV_GROWTH = "AOV_GROWTH",
    ACQUISITION = "ACQUISITION"
}
export interface GoalWeights {
    revenueWeight: number;
    refundWeight: number;
    aovWeight: number;
    riskWeight: number;
}
export declare function getGoalWeights(shopId: string): Promise<GoalWeights>;
export declare function setGoal(shopId: string, type: GoalType, params: any): Promise<{
    id: string;
    shopId: string;
    createdAt: Date;
    type: string;
    targetMetric: string | null;
    targetValue: number | null;
    timeHorizonDays: number | null;
    constraints: import("@prisma/client/runtime/library").JsonValue | null;
    priority: number;
}>;
//# sourceMappingURL=goals.d.ts.map