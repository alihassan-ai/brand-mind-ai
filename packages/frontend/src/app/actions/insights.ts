'use server';

import { getCurrentShop } from '@brandmind/backend/auth/session';
import {
    calculateCatalogHealth,
    getPatternInsights,
    gradeProducts,
    suggestBundles,
    getPriceAlerts,
    getSeasonalCalendar,
    detectCannibalization,
    analyzeCustomerCohorts,
    predictRestocks,
    findMarketingMoments,
    CatalogHealth,
    PatternInsight,
    ProductGrade,
    BundleSuggestion,
    PriceAlert,
    SeasonalMonth,
    CannibalizationPair,
    CustomerCohort,
    RestockAlert,
    MarketingMoment
} from '@brandmind/brain';

export interface InsightsDashboardData {
    catalogHealth: CatalogHealth;
    patternInsights: PatternInsight[];
    topProducts: ProductGrade[];
    bundles: BundleSuggestion[];
    priceAlerts: PriceAlert[];
    seasonalCalendar: SeasonalMonth[];
    cannibalization: CannibalizationPair[];
    customerCohorts: CustomerCohort[];
    restockAlerts: RestockAlert[];
    marketingMoments: MarketingMoment[];
}

export async function getInsightsDashboard(): Promise<InsightsDashboardData | null> {
    const shop = await getCurrentShop();
    if (!shop) return null;

    try {
        const [
            catalogHealth,
            patternInsights,
            allProducts,
            bundles,
            priceAlerts,
            seasonalCalendar,
            cannibalization,
            customerCohorts,
            restockAlerts,
            marketingMoments
        ] = await Promise.all([
            calculateCatalogHealth(shop.id),
            getPatternInsights(shop.id),
            gradeProducts(shop.id),
            suggestBundles(shop.id),
            getPriceAlerts(shop.id),
            getSeasonalCalendar(shop.id),
            detectCannibalization(shop.id),
            analyzeCustomerCohorts(shop.id),
            predictRestocks(shop.id),
            findMarketingMoments(shop.id)
        ]);

        return {
            catalogHealth,
            patternInsights,
            topProducts: allProducts.slice(0, 10),
            bundles,
            priceAlerts,
            seasonalCalendar,
            cannibalization,
            customerCohorts,
            restockAlerts,
            marketingMoments
        };
    } catch (error) {
        console.error('[Insights] Error fetching dashboard data:', error);
        return null;
    }
}

export async function getCatalogHealth(): Promise<CatalogHealth | null> {
    const shop = await getCurrentShop();
    if (!shop) return null;
    return calculateCatalogHealth(shop.id);
}

export async function getPatterns(): Promise<PatternInsight[]> {
    const shop = await getCurrentShop();
    if (!shop) return [];
    return getPatternInsights(shop.id);
}

export async function getProductGrades(): Promise<ProductGrade[]> {
    const shop = await getCurrentShop();
    if (!shop) return [];
    return gradeProducts(shop.id);
}

export async function getBundleSuggestions(): Promise<BundleSuggestion[]> {
    const shop = await getCurrentShop();
    if (!shop) return [];
    return suggestBundles(shop.id);
}

export async function getCustomerSegments(): Promise<CustomerCohort[]> {
    const shop = await getCurrentShop();
    if (!shop) return [];
    return analyzeCustomerCohorts(shop.id);
}

export async function getRestockPredictions(): Promise<RestockAlert[]> {
    const shop = await getCurrentShop();
    if (!shop) return [];
    return predictRestocks(shop.id);
}

export async function getMarketingOpportunities(): Promise<MarketingMoment[]> {
    const shop = await getCurrentShop();
    if (!shop) return [];
    return findMarketingMoments(shop.id);
}
