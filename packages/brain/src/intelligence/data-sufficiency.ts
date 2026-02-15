/**
 * Data Sufficiency Checker
 * Validates whether a store has enough data for various features
 */

import { prisma } from '@brandmind/shared';
import { Prisma } from '@prisma/client';

// ============================================
// TYPES
// ============================================

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

// ============================================
// THRESHOLDS
// ============================================

const THRESHOLDS = {
    storeAge: {
        minimum: 7,
        recommended: 30,
    },
    orders: {
        minimum: 1,
        forPredictions: 20,
        forCategoryExpansion: 50,
        forSeasonality: 100,
    },
    products: {
        minimum: 5,
        recommended: 20,
    },
    customers: {
        minimum: 15,
        forSegmentation: 50,
        forRepeatAnalysis: 100,
    },
    multiItemOrders: {
        forBasketAffinity: 30,
    },
    monthsOfData: {
        forSeasonality: 6,
    },
    repeatCustomers: {
        minimum: 10,
    },
};

// ============================================
// MAIN FUNCTION
// ============================================

export async function checkDataSufficiency(shopId: string): Promise<SufficiencyResult> {
    const blockers: DataBlocker[] = [];
    const warnings: DataWarning[] = [];
    const estimates: DataEstimate[] = [];

    // ═══════════════════════════════════════════════════════════════
    // GATHER CURRENT DATA STATS
    // ═══════════════════════════════════════════════════════════════
    const [orderStats, productStats, customerStats] = await Promise.all([
        prisma.order.aggregate({
            where: { shopId },
            _count: true,
            _min: { createdAt: true },
            _max: { createdAt: true },
        }),
        prisma.product.aggregate({
            where: { shopId },
            _count: true,
        }),
        prisma.customer.aggregate({
            where: { shopId },
            _count: true,
        }),
    ]);

    const orderCount = orderStats._count;
    const productCount = productStats._count;
    const customerCount = customerStats._count;

    const firstOrderDate = orderStats._min.createdAt;
    const lastOrderDate = orderStats._max.createdAt;

    const storeAgeDays = firstOrderDate
        ? Math.floor((Date.now() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const dataSpanDays = firstOrderDate && lastOrderDate
        ? Math.floor((lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    // Get multi-item orders count
    const ordersWithMultipleItems = await prisma.order.findMany({
        where: { shopId },
        select: { id: true, _count: { select: { lineItems: true } } },
    });
    const multiItemOrderCount = ordersWithMultipleItems.filter(o => o._count.lineItems > 1).length;

    // Get distinct categories
    const categories = await prisma.product.groupBy({
        by: ['productType'],
        where: { shopId, productType: { not: null } },
    });
    const categoryCount = categories.length;

    // Get repeat customers count
    let repeatCustomerCount = 0;
    try {
        const repeatCustomers = await prisma.$queryRaw`
            SELECT COUNT(DISTINCT "customerId") as count
            FROM "Order"
            WHERE "shopId" = ${shopId}
              AND "customerId" IS NOT NULL
            GROUP BY "customerId"
            HAVING COUNT(*) > 1
        ` as any[];
        repeatCustomerCount = repeatCustomers.length;
    } catch (e) {
        // Query might fail if no orders exist
        repeatCustomerCount = 0;
    }

    const stats = {
        orderCount,
        productCount,
        customerCount,
        storeAgeDays,
        dataSpanDays,
        multiItemOrderCount,
        categoryCount,
        repeatCustomerCount,
    };

    // ═══════════════════════════════════════════════════════════════
    // CHECK GLOBAL MINIMUMS
    // ═══════════════════════════════════════════════════════════════

    // No orders at all
    if (orderCount === 0) {
        blockers.push({
            feature: 'all',
            requirement: 'At least 1 order required',
            current: '0 orders',
            needed: '1+ orders',
            message: 'No orders found. Make your first sale to start building your Brand DNA.',
        });
    }

    // Store too new
    if (orderCount > 0 && storeAgeDays < THRESHOLDS.storeAge.minimum) {
        blockers.push({
            feature: 'all',
            requirement: `Store must be at least ${THRESHOLDS.storeAge.minimum} days old`,
            current: `${storeAgeDays} days`,
            needed: `${THRESHOLDS.storeAge.minimum} days`,
            message: `Your store data is only ${storeAgeDays} days old. We need at least ${THRESHOLDS.storeAge.minimum} days of sales data to begin analysis.`,
            estimatedReadyDate: new Date(Date.now() + (THRESHOLDS.storeAge.minimum - storeAgeDays) * 24 * 60 * 60 * 1000),
        });
    }

    // Too few products
    if (productCount < THRESHOLDS.products.minimum) {
        blockers.push({
            feature: 'catalogAnalysis',
            requirement: `Minimum ${THRESHOLDS.products.minimum} products`,
            current: `${productCount} products`,
            needed: `${THRESHOLDS.products.minimum} products`,
            message: `Only ${productCount} products found. Add more products for meaningful catalog analysis.`,
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CHECK FEATURE-SPECIFIC THRESHOLDS
    // ═══════════════════════════════════════════════════════════════

    // NEXT HIT PREDICTIONS
    if (orderCount > 0 && orderCount < THRESHOLDS.orders.forPredictions) {
        blockers.push({
            feature: 'nextHitPredictions',
            requirement: `Minimum ${THRESHOLDS.orders.forPredictions} orders for predictions`,
            current: `${orderCount} orders`,
            needed: `${THRESHOLDS.orders.forPredictions} orders`,
            message: `You have ${orderCount} orders. We need at least ${THRESHOLDS.orders.forPredictions} to identify reliable patterns for product predictions.`,
            estimatedReadyDate: estimateWhenReady(orderCount, THRESHOLDS.orders.forPredictions, storeAgeDays),
        });

        estimates.push({
            feature: 'nextHitPredictions',
            currentProgress: Math.round((orderCount / THRESHOLDS.orders.forPredictions) * 100),
            estimatedDaysUntilReady: estimateDaysUntilOrders(orderCount, THRESHOLDS.orders.forPredictions, storeAgeDays),
            message: `${THRESHOLDS.orders.forPredictions - orderCount} more orders needed`,
        });
    }

    if (orderCount >= THRESHOLDS.orders.forPredictions && storeAgeDays < THRESHOLDS.storeAge.recommended) {
        warnings.push({
            feature: 'nextHitPredictions',
            message: `Only ${storeAgeDays} days of data (${THRESHOLDS.storeAge.recommended} recommended)`,
            impact: 'Predictions may be less accurate with limited historical data',
        });
    }

    // SEASONALITY ANALYSIS
    const monthsOfData = Math.floor(dataSpanDays / 30);
    if (monthsOfData < THRESHOLDS.monthsOfData.forSeasonality) {
        blockers.push({
            feature: 'seasonalityAnalysis',
            requirement: `${THRESHOLDS.monthsOfData.forSeasonality} months of order data`,
            current: `${monthsOfData} months`,
            needed: `${THRESHOLDS.monthsOfData.forSeasonality} months`,
            message: `Seasonality analysis requires ${THRESHOLDS.monthsOfData.forSeasonality}+ months of data. You have ${monthsOfData} months.`,
            estimatedReadyDate: new Date(Date.now() + (THRESHOLDS.monthsOfData.forSeasonality - monthsOfData) * 30 * 24 * 60 * 60 * 1000),
        });

        estimates.push({
            feature: 'seasonalityAnalysis',
            currentProgress: Math.round((monthsOfData / THRESHOLDS.monthsOfData.forSeasonality) * 100),
            estimatedDaysUntilReady: (THRESHOLDS.monthsOfData.forSeasonality - monthsOfData) * 30,
            message: `${THRESHOLDS.monthsOfData.forSeasonality - monthsOfData} more months of data needed`,
        });
    }

    // CUSTOMER SEGMENTATION (RFM)
    if (customerCount < THRESHOLDS.customers.forSegmentation) {
        blockers.push({
            feature: 'customerSegmentation',
            requirement: `${THRESHOLDS.customers.forSegmentation} customers minimum`,
            current: `${customerCount} customers`,
            needed: `${THRESHOLDS.customers.forSegmentation} customers`,
            message: `Customer segmentation requires at least ${THRESHOLDS.customers.forSegmentation} unique customers.`,
        });
    } else if (repeatCustomerCount < THRESHOLDS.repeatCustomers.minimum) {
        warnings.push({
            feature: 'customerSegmentation',
            message: `Only ${repeatCustomerCount} repeat customers (${THRESHOLDS.repeatCustomers.minimum} recommended)`,
            impact: 'Repeat purchase patterns may not be statistically reliable',
        });
    }

    // BASKET AFFINITY / CROSS-PURCHASE
    if (multiItemOrderCount < THRESHOLDS.multiItemOrders.forBasketAffinity) {
        blockers.push({
            feature: 'basketAffinity',
            requirement: `${THRESHOLDS.multiItemOrders.forBasketAffinity} multi-item orders`,
            current: `${multiItemOrderCount} multi-item orders`,
            needed: `${THRESHOLDS.multiItemOrders.forBasketAffinity} multi-item orders`,
            message: 'Cross-purchase analysis needs orders with multiple products to identify buying patterns.',
        });

        estimates.push({
            feature: 'basketAffinity',
            currentProgress: Math.round((multiItemOrderCount / THRESHOLDS.multiItemOrders.forBasketAffinity) * 100),
            estimatedDaysUntilReady: estimateDaysUntilOrders(multiItemOrderCount, THRESHOLDS.multiItemOrders.forBasketAffinity, storeAgeDays),
            message: `${THRESHOLDS.multiItemOrders.forBasketAffinity - multiItemOrderCount} more multi-item orders needed`,
        });
    }

    // CATEGORY EXPANSION
    if (orderCount < THRESHOLDS.orders.forCategoryExpansion) {
        blockers.push({
            feature: 'categoryExpansion',
            requirement: `${THRESHOLDS.orders.forCategoryExpansion} orders for category expansion`,
            current: `${orderCount} orders`,
            needed: `${THRESHOLDS.orders.forCategoryExpansion} orders`,
            message: 'Category expansion recommendations require established sales patterns.',
        });
    }

    if (categoryCount < 2) {
        warnings.push({
            feature: 'categoryExpansion',
            message: `Only ${categoryCount} product category detected`,
            impact: 'Category expansion suggestions will be based on market research only',
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CALCULATE OVERALL SCORE
    // ═══════════════════════════════════════════════════════════════
    const criticalBlockers = blockers.filter(b => b.feature === 'all' || b.feature === 'nextHitPredictions');
    const sufficient = criticalBlockers.length === 0;

    // Score based on how much data we have vs ideal
    const orderScore = Math.min(100, (orderCount / 100) * 100);
    const ageScore = Math.min(100, (storeAgeDays / 90) * 100);
    const productScore = Math.min(100, (productCount / 20) * 100);
    const customerScore = Math.min(100, (customerCount / 50) * 100);

    const score = Math.round((orderScore + ageScore + productScore + customerScore) / 4);

    // ═══════════════════════════════════════════════════════════════
    // SAVE TO DATABASE
    // ═══════════════════════════════════════════════════════════════
    await prisma.dataSufficiency.upsert({
        where: { shopId },
        update: {
            orderCount,
            productCount,
            customerCount,
            storeAgeDays,
            dataSpanDays,
            multiItemOrderCount,
            categoryCount,
            repeatCustomerCount,
            overallScore: score,
            isSufficient: sufficient,
            nextHitReady: !blockers.some(b => b.feature === 'nextHitPredictions' || b.feature === 'all'),
            seasonalityReady: !blockers.some(b => b.feature === 'seasonalityAnalysis'),
            customerSegmentReady: !blockers.some(b => b.feature === 'customerSegmentation'),
            basketAffinityReady: !blockers.some(b => b.feature === 'basketAffinity'),
            categoryExpansionReady: !blockers.some(b => b.feature === 'categoryExpansion'),
            blockers: blockers as unknown as Prisma.InputJsonValue,
            warnings: warnings as unknown as Prisma.InputJsonValue,
            estimates: estimates as unknown as Prisma.InputJsonValue,
            checkedAt: new Date(),
        },
        create: {
            shopId,
            orderCount,
            productCount,
            customerCount,
            storeAgeDays,
            dataSpanDays,
            multiItemOrderCount,
            categoryCount,
            repeatCustomerCount,
            overallScore: score,
            isSufficient: sufficient,
            nextHitReady: !blockers.some(b => b.feature === 'nextHitPredictions' || b.feature === 'all'),
            seasonalityReady: !blockers.some(b => b.feature === 'seasonalityAnalysis'),
            customerSegmentReady: !blockers.some(b => b.feature === 'customerSegmentation'),
            basketAffinityReady: !blockers.some(b => b.feature === 'basketAffinity'),
            categoryExpansionReady: !blockers.some(b => b.feature === 'categoryExpansion'),
            blockers: blockers as unknown as Prisma.InputJsonValue,
            warnings: warnings as unknown as Prisma.InputJsonValue,
            estimates: estimates as unknown as Prisma.InputJsonValue,
        },
    });

    console.log(`[DataSufficiency] Shop ${shopId}: Score ${score}%, Sufficient: ${sufficient}, Blockers: ${blockers.length}`);

    return {
        sufficient,
        score,
        blockers,
        warnings,
        estimates,
        stats,
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function estimateDaysUntilOrders(current: number, needed: number, storeAgeDays: number): number {
    if (storeAgeDays === 0 || current === 0) return 30; // Default estimate
    const ordersPerDay = current / Math.max(1, storeAgeDays);
    if (ordersPerDay === 0) return 30;
    return Math.ceil((needed - current) / ordersPerDay);
}

function estimateWhenReady(current: number, needed: number, storeAgeDays: number): Date {
    const daysUntil = estimateDaysUntilOrders(current, needed, storeAgeDays);
    return new Date(Date.now() + daysUntil * 24 * 60 * 60 * 1000);
}

// ============================================
// QUICK CHECK (For UI without full recompute)
// ============================================

export async function getDataSufficiency(shopId: string): Promise<SufficiencyResult | null> {
    const cached = await prisma.dataSufficiency.findUnique({
        where: { shopId },
    });

    if (!cached) {
        return checkDataSufficiency(shopId);
    }

    // If cached data is older than 1 hour, recompute
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (cached.checkedAt < oneHourAgo) {
        return checkDataSufficiency(shopId);
    }

    return {
        sufficient: cached.isSufficient,
        score: cached.overallScore,
        blockers: (cached.blockers as unknown as DataBlocker[]) || [],
        warnings: (cached.warnings as unknown as DataWarning[]) || [],
        estimates: (cached.estimates as unknown as DataEstimate[]) || [],
        stats: {
            orderCount: cached.orderCount,
            productCount: cached.productCount,
            customerCount: cached.customerCount,
            storeAgeDays: cached.storeAgeDays,
            dataSpanDays: cached.dataSpanDays,
            multiItemOrderCount: cached.multiItemOrderCount,
            categoryCount: cached.categoryCount,
            repeatCustomerCount: cached.repeatCustomerCount,
        },
    };
}

// ============================================
// FEATURE-SPECIFIC CHECK
// ============================================

export async function canUseFeature(shopId: string, feature: string): Promise<{ allowed: boolean; blocker?: DataBlocker }> {
    const sufficiency = await getDataSufficiency(shopId);
    if (!sufficiency) {
        return { allowed: false, blocker: { feature: 'all', requirement: 'Data check failed', current: 'Unknown', needed: 'Unknown', message: 'Unable to check data sufficiency' } };
    }

    const blocker = sufficiency.blockers.find(b => b.feature === feature || b.feature === 'all');
    return {
        allowed: !blocker,
        blocker,
    };
}
