export declare function aggregateDailyMetrics(shopId: string, date: Date): Promise<void>;
export declare function aggregateProductMetrics(shopId: string, date: Date): Promise<void>;
export declare function getTopProducts(shopId: string, limit?: number): Promise<{
    productTitle: string;
    variantTitle: string;
    revenue: number;
    unitsSold: any;
}[]>;
//# sourceMappingURL=metrics.d.ts.map