import { prisma } from '@brandmind/shared';
import { Decimal } from '@prisma/client/runtime/library';

export interface ExecutiveKPIs {
    revenueMomentum: {
        value: number; // percentage
        trend: 'up' | 'down' | 'flat';
        comparison: 'WoW' | 'MoM';
    };
    profitabilityHealth: {
        score: number; // 0-100
        status: 'healthy' | 'fragile' | 'critical';
    };
    growthQuality: {
        score: number; // 0-100
    };
    customerHealth: {
        score: number; // 0-100
    };
    discountPressure: {
        value: number; // percentage
        trend: 'rising' | 'declining' | 'stable';
    };
    operationalRisk: {
        level: 'LOW' | 'MEDIUM' | 'HIGH';
        signal: string;
    };
}

export async function calculateExecutiveKPIs(shopId: string): Promise<ExecutiveKPIs> {
    const now = new Date();
    // Align to midnight to ensure clean windows
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    const last7Days = new Date(todayMidnight.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev7Days = new Date(todayMidnight.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch current and previous period metrics
    const currentMetrics = await prisma.dailyMetric.findMany({
        where: { shopId, date: { gte: last7Days } },
        orderBy: { date: 'desc' }
    });

    const previousMetrics = await prisma.dailyMetric.findMany({
        where: { shopId, date: { gte: prev7Days, lt: last7Days } },
        orderBy: { date: 'desc' }
    });

    const currentRevenue = currentMetrics.reduce((sum: Decimal, m: any) => sum.plus(m.netRevenue), new Decimal(0));
    const previousRevenue = previousMetrics.reduce((sum: Decimal, m: any) => sum.plus(m.netRevenue), new Decimal(0));

    const currentMarketing = currentMetrics.reduce((sum: Decimal, m: any) => sum.plus(m.marketingSpend || 0), new Decimal(0));
    const currentSessions = currentMetrics.reduce((sum: number, m: any) => sum + (m.sessions || 0), 0);
    const currentRefunds = currentMetrics.reduce((sum: Decimal, m: any) => sum.plus(m.refundAmount), new Decimal(0));

    // 1. Revenue Momentum
    let momentum = 0;
    if (previousRevenue.gt(0)) {
        momentum = (currentRevenue.minus(previousRevenue)).dividedBy(previousRevenue).toNumber() * 100;
    } else if (currentRevenue.gt(0)) {
        momentum = 100; // 100% growth if starting from zero
    }

    const revenueMomentum: ExecutiveKPIs['revenueMomentum'] = {
        value: Math.round(momentum * 10) / 10,
        trend: momentum > 2 ? 'up' : momentum < -2 ? 'down' : 'flat',
        comparison: 'WoW'
    };

    // 2. Profitability Health Score (0-100)
    // formula: 0.45 * Gross Margin + 0.35 * Marketing Efficiency + 0.20 * Discount Pressure (inv)

    // Attempt to calculate real Gross Margin if variants have cost data
    const variantsWithCost = await prisma.variant.findMany({
        where: { cost: { not: null } },
        select: { shopifyId: true, cost: true, price: true }
    });

    let grossMetric = 0.6; // Baseline 60%
    if (variantsWithCost.length > 0) {
        // Simple aggregate margin for now
        const avgMargin = variantsWithCost.reduce((sum, v) => {
            const price = v.price.toNumber();
            const cost = v.cost?.toNumber() || 0;
            return sum + (price > 0 ? (price - cost) / price : 0);
        }, 0) / variantsWithCost.length;
        grossMetric = Math.max(0.1, Math.min(0.9, avgMargin));
    }

    const roas = currentMarketing.gt(0) ? currentRevenue.dividedBy(currentMarketing).toNumber() : 5; // Default 5x if no spend
    const marketingEfficiency = Math.min(1, roas / 10); // Normalize to 10x ROAS
    const discountPressureVal = currentRevenue.gt(0) ? currentRefunds.dividedBy(currentRevenue).toNumber() : 0;
    const invDiscountPressure = 1 - discountPressureVal;

    const profitabilityScoreRaw = (0.45 * grossMetric + 0.35 * marketingEfficiency + 0.20 * invDiscountPressure) * 100;
    const profitabilityScore = Math.min(100, Math.max(0, Math.round(profitabilityScoreRaw)));

    const profitabilityHealth: ExecutiveKPIs['profitabilityHealth'] = {
        score: profitabilityScore,
        status: profitabilityScore >= 75 ? 'healthy' : profitabilityScore >= 55 ? 'fragile' : 'critical'
    };

    // 3. Growth Quality Score (0-100)
    // Sustainable growth index: combines momentum (volume) and efficiency (profitability)
    const momentumBonus = momentum > 10 ? 20 : momentum > 0 ? 10 : -10;
    const growthQualityScoreRaw = (marketingEfficiency * 70) + (momentumBonus) + 10;
    const growthQualityScore = Math.min(100, Math.max(0, Math.round(growthQualityScoreRaw)));

    // 4. Customer Health Indicator (0-100)
    const newCustomers = currentMetrics.reduce((sum: number, m: any) => sum + m.newCustomersCount, 0);
    const returningCustomers = currentMetrics.reduce((sum: number, m: any) => sum + m.returningCustomersCount, 0);
    const totalCustomers = newCustomers + returningCustomers;
    const repeatRate = totalCustomers > 0 ? returningCustomers / totalCustomers : 0;

    // Logic: NEW stores shouldn't be penalized for 0 repeats. 
    // If we have high new customer acquisition, we start healthy.
    const acquisitionStrength = Math.min(1, newCustomers / 10); // 10 new customers/week is decent for simulation
    const customerHealthScoreRaw = (repeatRate * 60) + (acquisitionStrength * 40);
    const customerHealthScore = Math.min(100, Math.max(20, Math.round(customerHealthScoreRaw)));

    // 5. Pricing & Discount Pressure Index
    const discountPressure: ExecutiveKPIs['discountPressure'] = {
        value: Math.round(discountPressureVal * 100),
        trend: discountPressureVal > 0.15 ? 'rising' : 'stable'
    };

    // 6. Operational Risk Signal
    const currentFulfillmentTime = currentMetrics.length > 0
        ? currentMetrics.reduce((sum: number, m: any) => sum + (m.fulfillmentTime || 0), 0) / currentMetrics.length
        : 0;

    const refundRate = currentRevenue.gt(0) ? currentRefunds.dividedBy(currentRevenue).toNumber() : 0;

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let riskSignal = 'Operational metrics are stable across all departments.';

    if (refundRate > 0.2 || discountPressureVal > 0.3) {
        riskLevel = 'HIGH';
        riskSignal = refundRate > 0.2
            ? 'Critical refund spike detected. Audit product quality and fulfillment accuracy immediately.'
            : 'Extreme discounting is destroying margin profile.';
    } else if (currentFulfillmentTime > 4 || momentum < -15) {
        riskLevel = 'MEDIUM';
        riskSignal = currentFulfillmentTime > 4
            ? 'Fulfillment latency detected. Scale up logistics capacity.'
            : 'Significant revenue contraction. Investigate demand drop-off.';
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


export async function generateExecutiveBrief(shopId: string, kpis: ExecutiveKPIs): Promise<string> {
    // FALLBACK GENERATOR: If API key is missing or AI fails, we use a deterministic rule-based brief
    const getFallbackBrief = () => {
        const health = kpis.profitabilityHealth.status;
        const trend = kpis.revenueMomentum.trend === 'up' ? 'positive' : 'concerning';
        const risk = kpis.operationalRisk.level === 'HIGH' ? 'Critical' : 'Moderate';

        return `Current performance is ${health} with a ${trend} revenue trajectory. ${kpis.operationalRisk.signal} ${risk} operational risks detected in the supply chain. Prioritize margin protection in the next 72 hours.`;
    };

    if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY missing - using rule-based fallback for Executive Brief');
        return getFallbackBrief();
    }

    try {
        const { OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
        You are BrandMindAI, an AI Executive Business Partner for a Shopify brand.
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
            max_tokens: 200,
        });

        return response.choices[0].message.content || getFallbackBrief();
    } catch (error) {
        console.error('LLM Brief generation failed:', error);
        return getFallbackBrief();
    }
}
