export interface ShopContext {
    shopId: string;
    shopDomain: string;
    accessToken: string;
}
export interface DateRange {
    from: Date;
    to: Date;
}
export interface PaginationOptions {
    limit?: number;
    cursor?: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface ScoringWeights {
    storeFit: number;
    gapFill: number;
    trendScore: number;
    marginPotential: number;
    competitionLevel: number;
    seasonalAlignment: number;
}
export declare const DEFAULT_SCORING_WEIGHTS: ScoringWeights;
//# sourceMappingURL=index.d.ts.map