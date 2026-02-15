/**
 * Trend Integration Service
 * Provides trend data for product categories
 *
 * Note: External Google Trends scraping is disabled (unreliable).
 * Instead, we use intelligent estimates and let AI provide market knowledge.
 */
export interface TrendResult {
    keyword: string;
    trendScore: number;
    velocity: number;
    acceleration: number;
    seasonalIndex: number;
    source: string;
}
/**
 * Get trend data for a keyword (with caching)
 */
export declare function getTrendData(keyword: string, region?: string): Promise<TrendResult>;
/**
 * Fetch trends for store's product categories
 */
export declare function fetchTrendsForStore(shopId: string): Promise<TrendResult[]>;
/**
 * Get top trending keywords for store
 */
export declare function getTopTrends(shopId: string, limit?: number): Promise<TrendResult[]>;
//# sourceMappingURL=trends.d.ts.map