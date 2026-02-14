/**
 * Retention Agent
 * RFM analysis, churn prediction, and retention insights
 */
import { prisma } from '@brandmind/shared';
// ============================================
// HELPERS
// ============================================
function toNumber(val) {
    if (val === null || val === undefined)
        return 0;
    if (typeof val === 'number')
        return val;
    return Number(val);
}
function calculateRFMScore(value, thresholds) {
    // Higher value = higher score for Frequency and Monetary
    if (value >= thresholds[0])
        return 5;
    if (value >= thresholds[1])
        return 4;
    if (value >= thresholds[2])
        return 3;
    if (value >= thresholds[3])
        return 2;
    return 1;
}
function calculateRecencyScore(daysSince, thresholds) {
    // Lower days = higher score for Recency
    if (daysSince <= thresholds[0])
        return 5;
    if (daysSince <= thresholds[1])
        return 4;
    if (daysSince <= thresholds[2])
        return 3;
    if (daysSince <= thresholds[3])
        return 2;
    return 1;
}
function determineSegment(r, f, m) {
    const rfm = `${r}${f}${m}`;
    // Champions: High in all dimensions
    if (r >= 4 && f >= 4 && m >= 4)
        return 'champions';
    // Loyal: High frequency and monetary
    if (f >= 4 && m >= 4)
        return 'loyal';
    // Potential Loyal: Recent with medium frequency
    if (r >= 4 && (f === 3 || f === 4) && m >= 3)
        return 'potential_loyal';
    // New: Very recent, low frequency
    if (r >= 4 && f === 1)
        return 'new';
    // Promising: Recent with low to medium frequency
    if (r >= 3 && f <= 2 && m <= 2)
        return 'promising';
    // Need Attention: Above average in all
    if (r === 3 && f === 3 && m === 3)
        return 'need_attention';
    // About to Sleep: Below average recency
    if (r === 2 && f >= 2 && m >= 2)
        return 'about_to_sleep';
    // At Risk: High value but haven't purchased recently
    if (r <= 2 && f >= 3 && m >= 3)
        return 'at_risk';
    // Hibernating: Low recency, low frequency
    if (r <= 2 && f <= 2)
        return 'hibernating';
    // Lost: Lowest in all
    if (r === 1 && f === 1)
        return 'lost';
    return 'need_attention';
}
function calculateChurnRisk(r, f, daysSince, avgFrequency) {
    // Base risk from RFM scores
    let risk = 0;
    // Recency is the strongest predictor
    risk += (5 - r) * 0.15;
    // Low frequency increases risk
    risk += (5 - f) * 0.05;
    // If days since last order exceeds average by 2x, high risk
    if (avgFrequency > 0 && daysSince > avgFrequency * 2) {
        risk += 0.3;
    }
    return Math.min(1, Math.max(0, risk));
}
// ============================================
// RFM CALCULATOR
// ============================================
export async function calculateRFM(shopId) {
    console.log(`[RetentionAgent] Calculating RFM for shop: ${shopId}`);
    // Get all customers with orders
    const customers = await prisma.customer.findMany({
        where: { shopId },
        select: { id: true, shopifyId: true },
    });
    // Get all orders grouped by customer
    const orders = await prisma.order.findMany({
        where: { shopId, customerId: { not: null } },
        select: {
            customerId: true,
            totalPrice: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    // Group orders by customer
    const customerOrders = new Map();
    for (const order of orders) {
        if (!order.customerId)
            continue;
        const existing = customerOrders.get(order.customerId) || [];
        existing.push(order);
        customerOrders.set(order.customerId, existing);
    }
    // Calculate RFM values for each customer
    const now = new Date();
    const rfmValues = [];
    for (const [customerId, custOrders] of customerOrders.entries()) {
        if (custOrders.length === 0)
            continue;
        const lastOrder = custOrders[0];
        const daysSince = Math.floor((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const totalSpent = custOrders.reduce((sum, o) => sum + toNumber(o.totalPrice), 0);
        rfmValues.push({
            customerId,
            daysSince,
            orderCount: custOrders.length,
            totalSpent,
        });
    }
    if (rfmValues.length === 0) {
        return [];
    }
    // Calculate percentile thresholds
    const recencyValues = rfmValues.map(r => r.daysSince).sort((a, b) => a - b);
    const frequencyValues = rfmValues.map(r => r.orderCount).sort((a, b) => b - a);
    const monetaryValues = rfmValues.map(r => r.totalSpent).sort((a, b) => b - a);
    const getPercentile = (arr, p) => arr[Math.floor(arr.length * p)] || arr[0];
    const recencyThresholds = [
        getPercentile(recencyValues, 0.2),
        getPercentile(recencyValues, 0.4),
        getPercentile(recencyValues, 0.6),
        getPercentile(recencyValues, 0.8),
    ];
    const frequencyThresholds = [
        getPercentile(frequencyValues, 0.2),
        getPercentile(frequencyValues, 0.4),
        getPercentile(frequencyValues, 0.6),
        getPercentile(frequencyValues, 0.8),
    ];
    const monetaryThresholds = [
        getPercentile(monetaryValues, 0.2),
        getPercentile(monetaryValues, 0.4),
        getPercentile(monetaryValues, 0.6),
        getPercentile(monetaryValues, 0.8),
    ];
    // Calculate average order frequency
    const avgFrequency = rfmValues.reduce((sum, r) => sum + r.daysSince, 0) / rfmValues.length;
    // Generate RFM data
    const rfmData = [];
    for (const customer of rfmValues) {
        const r = calculateRecencyScore(customer.daysSince, recencyThresholds);
        const f = calculateRFMScore(customer.orderCount, frequencyThresholds);
        const m = calculateRFMScore(customer.totalSpent, monetaryThresholds);
        const segment = determineSegment(r, f, m);
        const churnRisk = calculateChurnRisk(r, f, customer.daysSince, avgFrequency);
        // Predict next order based on average frequency
        const avgDaysBetweenOrders = customer.orderCount > 1
            ? customer.daysSince / (customer.orderCount - 1)
            : null;
        const predictedNextOrderDays = avgDaysBetweenOrders
            ? Math.max(0, Math.round(avgDaysBetweenOrders - customer.daysSince))
            : null;
        rfmData.push({
            customerId: customer.customerId,
            recencyScore: r,
            frequencyScore: f,
            monetaryScore: m,
            rfmSegment: segment,
            daysSinceLastOrder: customer.daysSince,
            totalOrders: customer.orderCount,
            totalSpent: Math.round(customer.totalSpent * 100) / 100,
            avgOrderValue: Math.round((customer.totalSpent / customer.orderCount) * 100) / 100,
            churnRisk: Math.round(churnRisk * 100) / 100,
            predictedNextOrderDays,
        });
    }
    // Save to database
    for (const data of rfmData) {
        await prisma.customerRFM.upsert({
            where: {
                id: `${shopId}-${data.customerId}`,
            },
            update: {
                recencyScore: data.recencyScore,
                frequencyScore: data.frequencyScore,
                monetaryScore: data.monetaryScore,
                rfmSegment: data.rfmSegment,
                daysSinceLastOrder: data.daysSinceLastOrder,
                totalOrders: data.totalOrders,
                totalSpent: data.totalSpent,
                avgOrderValue: data.avgOrderValue,
                churnRisk: data.churnRisk,
                predictedNextOrderDays: data.predictedNextOrderDays,
                computedAt: new Date(),
            },
            create: {
                id: `${shopId}-${data.customerId}`,
                shopId,
                customerId: data.customerId,
                recencyScore: data.recencyScore,
                frequencyScore: data.frequencyScore,
                monetaryScore: data.monetaryScore,
                rfmSegment: data.rfmSegment,
                daysSinceLastOrder: data.daysSinceLastOrder,
                totalOrders: data.totalOrders,
                totalSpent: data.totalSpent,
                avgOrderValue: data.avgOrderValue,
                churnRisk: data.churnRisk,
                predictedNextOrderDays: data.predictedNextOrderDays,
            },
        });
    }
    console.log(`[RetentionAgent] Calculated RFM for ${rfmData.length} customers`);
    return rfmData;
}
// ============================================
// RETENTION INSIGHTS
// ============================================
export async function generateRetentionInsights(shopId) {
    // First calculate RFM
    const rfmData = await calculateRFM(shopId);
    if (rfmData.length === 0)
        return [];
    // Group by segment
    const segmentGroups = new Map();
    for (const data of rfmData) {
        const existing = segmentGroups.get(data.rfmSegment) || [];
        existing.push(data);
        segmentGroups.set(data.rfmSegment, existing);
    }
    const insights = [];
    // At-Risk Segment
    const atRisk = segmentGroups.get('at_risk') || [];
    if (atRisk.length > 0) {
        const revenueAtRisk = atRisk.reduce((sum, c) => sum + c.totalSpent, 0);
        insights.push({
            segmentType: 'at_risk',
            customerCount: atRisk.length,
            revenueAtRisk,
            avgChurnProbability: atRisk.reduce((sum, c) => sum + c.churnRisk, 0) / atRisk.length,
            recommendedAction: 'Send win-back email campaign with personalized discount',
            actionType: 'win_back',
            campaignSuggestion: {
                channel: 'email',
                timing: 'within 7 days',
                offer: '15% off next purchase',
                messaging: 'We miss you! Come back for an exclusive offer',
            },
            expectedLift: 0.15,
            confidence: 0.75,
        });
    }
    // Champions
    const champions = segmentGroups.get('champions') || [];
    if (champions.length > 0) {
        insights.push({
            segmentType: 'vip',
            customerCount: champions.length,
            revenueAtRisk: 0,
            recommendedAction: 'Invite to VIP program or early access',
            actionType: 'loyalty_reward',
            campaignSuggestion: {
                channel: 'email',
                timing: 'this week',
                offer: 'Early access to new arrivals',
                messaging: 'As a valued VIP customer, you get first look',
            },
            expectedLift: 0.2,
            confidence: 0.85,
        });
    }
    // Hibernating
    const hibernating = segmentGroups.get('hibernating') || [];
    if (hibernating.length > 0) {
        insights.push({
            segmentType: 'dormant',
            customerCount: hibernating.length,
            revenueAtRisk: hibernating.reduce((sum, c) => sum + c.totalSpent * 0.3, 0),
            avgReactivationProbability: 0.1,
            recommendedAction: 'Deep discount reactivation campaign',
            actionType: 'win_back',
            campaignSuggestion: {
                channel: 'email',
                timing: 'within 14 days',
                offer: '25% off or free shipping',
                messaging: 'It\'s been a while! Here\'s something special.',
            },
            expectedLift: 0.08,
            confidence: 0.6,
        });
    }
    // Save insights to database
    for (const insight of insights) {
        await prisma.retentionInsight.create({
            data: {
                shopId,
                segmentType: insight.segmentType,
                customerCount: insight.customerCount,
                revenueAtRisk: insight.revenueAtRisk || 0,
                churnProbability: insight.avgChurnProbability,
                reactivationProbability: insight.avgReactivationProbability,
                recommendedAction: insight.recommendedAction,
                actionType: insight.actionType,
                campaignSuggestion: insight.campaignSuggestion,
                expectedLift: insight.expectedLift,
                confidence: insight.confidence,
            },
        });
    }
    return insights;
}
// ============================================
// SUMMARY
// ============================================
export async function getRetentionSummary(shopId) {
    const rfm = await prisma.customerRFM.findMany({
        where: { shopId },
    });
    const segmentBreakdown = {};
    let atRiskCount = 0;
    let revenueAtRisk = 0;
    for (const customer of rfm) {
        segmentBreakdown[customer.rfmSegment] = (segmentBreakdown[customer.rfmSegment] || 0) + 1;
        if (customer.rfmSegment === 'at_risk' || customer.rfmSegment === 'hibernating') {
            atRiskCount++;
            revenueAtRisk += toNumber(customer.totalSpent) * 0.3;
        }
    }
    const insights = await prisma.retentionInsight.findMany({
        where: { shopId, status: 'active' },
        orderBy: { revenueAtRisk: 'desc' },
        take: 5,
    });
    return {
        totalCustomers: rfm.length,
        segmentBreakdown,
        atRiskCount,
        revenueAtRisk: Math.round(revenueAtRisk),
        topInsights: insights,
    };
}
