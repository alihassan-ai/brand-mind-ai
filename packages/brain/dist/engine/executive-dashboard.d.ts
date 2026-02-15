export interface ExecutiveKPIs {
    revenueMomentum: {
        value: number;
        trend: 'up' | 'down' | 'flat';
        comparison: 'WoW' | 'MoM';
    };
    profitabilityHealth: {
        score: number;
        status: 'healthy' | 'fragile' | 'critical';
    };
    growthQuality: {
        score: number;
    };
    customerHealth: {
        score: number;
    };
    discountPressure: {
        value: number;
        trend: 'rising' | 'declining' | 'stable';
    };
    operationalRisk: {
        level: 'LOW' | 'MEDIUM' | 'HIGH';
        signal: string;
    };
}
export declare function calculateExecutiveKPIs(shopId: string): Promise<ExecutiveKPIs>;
export declare function generateExecutiveBrief(shopId: string, kpis: ExecutiveKPIs): Promise<string>;
//# sourceMappingURL=executive-dashboard.d.ts.map