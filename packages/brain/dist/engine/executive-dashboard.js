import { prisma } from '@brandmind/shared';
import { Decimal } from '@prisma/client/runtime/library';
export async function calculateExecutiveKPIs(shopId) {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    // Fetch current and previous period metrics
    const currentMetrics = await prisma.dailyMetric.findMany({
        where: { shopId, date: { gte: last7Days } },
        orderBy: { date: 'desc' }
    });
    const previousMetrics = await prisma.dailyMetric.findMany({
        where: { shopId, date: { gte: prev7Days, lt: last7Days } },
        orderBy: { date: 'desc' }
    });
    const currentRevenue = currentMetrics.reduce((sum, m) => sum.plus(m.netRevenue), new Decimal(0));
    const previousRevenue = previousMetrics.reduce((sum, m) => sum.plus(m.netRevenue), new Decimal(0));
    const currentMarketing = currentMetrics.reduce((sum, m) => sum.plus(m.marketingSpend || 0), new Decimal(0));
    const currentSessions = currentMetrics.reduce((sum, m) => sum + (m.sessions || 0), 0);
    const currentRefunds = currentMetrics.reduce((sum, m) => sum.plus(m.refundAmount), new Decimal(0));
    // 1. Revenue Momentum
    const momentum = previousRevenue.gt(0)
        ? (currentRevenue.minus(previousRevenue)).dividedBy(previousRevenue).toNumber() * 100
        : 0;
    const revenueMomentum = {
        value: Math.round(momentum * 10) / 10,
        trend: momentum > 2 ? 'up' : momentum < -2 ? 'down' : 'flat',
        comparison: 'WoW'
    };
    // 2. Profitability Health Score (0-100)
    // formula: 0.45 * Gross Margin + 0.35 * Marketing Efficiency + 0.20 * Discount Pressure (inv)
    // For now, since COGS is pending, we assume 60% baseline margin
    const grossMarginTrend = 0.6;
    const roas = currentMarketing.gt(0) ? currentRevenue.dividedBy(currentMarketing).toNumber() : 5; // Default 5x if no spend
    const marketingEfficiency = Math.min(1, roas / 10); // Normalize to 10x ROAS
    const discountPressureVal = currentRevenue.gt(0) ? currentRefunds.dividedBy(currentRevenue).toNumber() : 0;
    const invDiscountPressure = 1 - discountPressureVal;
    const profitabilityScoreRaw = (0.45 * grossMarginTrend + 0.35 * marketingEfficiency + 0.20 * invDiscountPressure) * 100;
    const profitabilityScore = Math.min(100, Math.max(0, Math.round(profitabilityScoreRaw)));
    const profitabilityHealth = {
        score: profitabilityScore,
        status: profitabilityScore >= 75 ? 'healthy' : profitabilityScore >= 55 ? 'fragile' : 'critical'
    };
    // 3. Growth Quality Score (0-100)
    // Sustainable growth index
    const growthQualityScore = Math.min(100, Math.max(0, Math.round((momentum > 5 ? 85 : 50) + (marketingEfficiency * 15))));
    // 4. Customer Health Indicator (0-100)
    const newCustomers = currentMetrics.reduce((sum, m) => sum + m.newCustomersCount, 0);
    const returningCustomers = currentMetrics.reduce((sum, m) => sum + m.returningCustomersCount, 0);
    const totalCustomers = newCustomers + returningCustomers;
    const repeatRate = totalCustomers > 0 ? returningCustomers / totalCustomers : 0.2;
    const customerHealthScore = Math.min(100, Math.max(0, Math.round((repeatRate * 60) + 40)));
    // 5. Pricing & Discount Pressure Index
    const discountPressure = {
        value: Math.round(discountPressureVal * 100),
        trend: discountPressureVal > 0.15 ? 'rising' : 'stable'
    };
    // 6. Operational Risk Signal
    const currentFulfillmentTime = currentMetrics.length > 0
        ? currentMetrics.reduce((sum, m) => sum + (m.fulfillmentTime || 0), 0) / currentMetrics.length
        : 0;
    let riskLevel = 'LOW';
    let riskSignal = 'Operational metrics are stable across all departments.';
    if (discountPressureVal > 0.25) {
        riskLevel = 'HIGH';
        riskSignal = 'Aggressive discounting is eroding brand equity and margins.';
    }
    else if (currentFulfillmentTime > 4) {
        riskLevel = 'MEDIUM';
        riskSignal = 'Average fulfillment time is increasing, risking customer satisfaction scores.';
    }
    return {
        revenueMomentum,
        profitabilityHealth,
        growthQuality: { score: growthQualityScore },
        customerHealth: { score: customerHealthScore },
        discountPressure,
        operationalRisk: { level: riskLevel, signal: riskSignal }
    };
}
export async function generateExecutiveBrief(shopId, kpis) {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
    You are Antigravity, an AI Executive Business Partner for a Shopify brand.
    Analyze the following 6 Executive KPIs and provide a concise "Executive Brief" (3-4 sentences).
    
    KPIs:
    1. Revenue Momentum: ${kpis.revenueMomentum.value}% (${kpis.revenueMomentum.trend})
    2. Profitability Health: ${kpis.profitabilityHealth.score}/100 (${kpis.profitabilityHealth.status})
    3. Growth Quality: ${kpis.growthQuality.score}/100
    4. Customer Health: ${kpis.customerHealth.score}/100
    5. Discount Pressure: ${kpis.discountPressure.value}% (${kpis.discountPressure.trend})
    6. Operational Risk: ${kpis.operationalRisk.level} - ${kpis.operationalRisk.signal}

    Rules:
    - Answer: Is the business healthy? Where is risk? Where is opportunity?
    - Keep it under 100 words.
    - Be direct, executive, and non-generic.
    - Format as a single paragraph or clean bullet points.
  `;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
    });
    return response.choices[0].message.content || "Daily brief unavailable. System metrics are stable.";
}
