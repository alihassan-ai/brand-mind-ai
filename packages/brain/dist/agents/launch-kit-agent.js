/**
 * Launch Kit Agent
 * Product launch strategy, copy generation, and success planning
 */
import { prisma } from '@brandmind/shared';
import OpenAI from 'openai';
// ============================================
// LAUNCH STRATEGY GENERATOR
// ============================================
async function generateLaunchStrategy(input) {
    // Get store DNA for context
    const storeDNA = await prisma.storeDNA.findUnique({
        where: { shopId: input.shopId },
    });
    const seasonality = (storeDNA === null || storeDNA === void 0 ? void 0 : storeDNA.seasonalityCurve) || [];
    const currentMonth = new Date().getMonth();
    // Find peak month
    const peakMonth = seasonality.reduce((best, current) => {
        if (!best || current.revenueIndex > best.revenueIndex)
            return current;
        return best;
    }, null);
    // Determine launch timing
    const monthsUntilPeak = peakMonth
        ? (peakMonth.month - currentMonth + 12) % 12
        : 1;
    const timing = {
        recommendedLaunch: monthsUntilPeak <= 2
            ? 'Launch now to catch upcoming peak'
            : `Launch in ${monthsUntilPeak - 1} months, 1 month before peak`,
        peakMonth: (peakMonth === null || peakMonth === void 0 ? void 0 : peakMonth.monthName) || 'Unknown',
        reasoning: peakMonth
            ? `${peakMonth.monthName} shows ${Math.round(peakMonth.revenueIndex * 100)}% of average revenue`
            : 'Insufficient data for seasonality analysis',
    };
    // Channel prioritization based on price point
    const channels = {
        primary: input.targetPrice > 100 ? 'Email to existing customers' : 'Social media',
        secondary: input.targetPrice > 100
            ? ['Instagram stories', 'SMS', 'Influencer seeding']
            : ['Email newsletter', 'Google Shopping', 'TikTok'],
        prioritization: input.targetPrice > 100
            ? 'Focus on existing customers and premium positioning'
            : 'Maximize reach with social and paid acquisition',
    };
    // Budget suggestion (roughly 10-15% of target first month revenue)
    const estimatedFirstMonthUnits = input.targetPrice > 100 ? 20 : 50;
    const estimatedRevenue = estimatedFirstMonthUnits * input.targetPrice;
    const suggestedBudget = Math.round(estimatedRevenue * 0.12);
    const budget = {
        suggested: suggestedBudget,
        breakdown: {
            'Paid Social': Math.round(suggestedBudget * 0.4),
            'Email/SMS': Math.round(suggestedBudget * 0.1),
            'Influencer': Math.round(suggestedBudget * 0.3),
            'Creative': Math.round(suggestedBudget * 0.2),
        },
    };
    return { timing, channels, budget };
}
// ============================================
// COPY ASSETS GENERATOR (LLM)
// ============================================
async function generateCopyAssets(input) {
    var _a;
    // Get brand voice for context
    const brandVoice = await prisma.brandVoice.findUnique({
        where: { shopId: input.shopId },
    });
    const toneDescription = ((_a = brandVoice === null || brandVoice === void 0 ? void 0 : brandVoice.toneAttributes) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'professional, friendly';
    const prompt = `Generate marketing copy for a new product launch.

Product: ${input.productName}
Type: ${input.productType}
Price: €${input.targetPrice}
Description: ${input.description || 'A new addition to our collection'}
Brand Voice: ${toneDescription}

Generate:
1. A compelling headline (max 8 words)
2. A tagline (max 12 words)
3. Product description (2-3 sentences)
4. Email subject line (max 50 chars)
5. Three social media posts (Instagram-style, with emojis)

Return as JSON with keys: headline, tagline, description, emailSubject, socialPosts (array)`;
    try {
        const openai = new OpenAI();
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.8,
        });
        const content = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);
        return {
            headline: parsed.headline || `Introducing ${input.productName}`,
            tagline: parsed.tagline || 'Your new favorite is here',
            description: parsed.description || input.description || '',
            emailSubject: parsed.emailSubject || `New Arrival: ${input.productName}`,
            socialPosts: parsed.socialPosts || [
                `✨ New drop alert! ${input.productName} is here`,
                `Just launched: ${input.productName} 🚀`,
                `The wait is over! Shop ${input.productName} now 🛒`,
            ],
        };
    }
    catch (error) {
        console.error('[LaunchKit] Copy generation failed:', error);
        return {
            headline: `Introducing ${input.productName}`,
            tagline: 'Your new favorite is here',
            description: input.description || '',
            emailSubject: `New: ${input.productName}`,
            socialPosts: [
                `✨ Just launched: ${input.productName}`,
                `New arrival alert! 🚀`,
                `Shop our newest addition 🛒`,
            ],
        };
    }
}
// ============================================
// PRICING STRATEGY
// ============================================
async function generatePricingStrategy(input) {
    const storeDNA = await prisma.storeDNA.findUnique({
        where: { shopId: input.shopId },
    });
    const priceBands = storeDNA === null || storeDNA === void 0 ? void 0 : storeDNA.priceBands;
    // Find the best performing band near target price
    let nearestBand = null;
    if (Array.isArray(priceBands) && priceBands.length > 0) {
        nearestBand = priceBands.reduce((best, band) => {
            const bandMid = (band.min + band.max) / 2;
            const distance = Math.abs(bandMid - input.targetPrice);
            if (!best || distance < best.distance) {
                return Object.assign(Object.assign({}, band), { distance });
            }
            return best;
        }, null);
    }
    else if (priceBands && typeof priceBands === 'object') {
        // Object format: { low, mid, high } - use thresholds to find nearest band
        const bands = [
            { band: 'budget', min: 0, max: priceBands.low || 30 },
            { band: 'mid', min: priceBands.low || 30, max: priceBands.mid || 100 },
            { band: 'premium', min: priceBands.mid || 100, max: priceBands.high || 200 },
        ];
        nearestBand = bands.reduce((best, band) => {
            const bandMid = (band.min + band.max) / 2;
            const distance = Math.abs(bandMid - input.targetPrice);
            if (!best || distance < best.distance) {
                return Object.assign(Object.assign({}, band), { distance });
            }
            return best;
        }, null);
    }
    // Intro pricing (10-15% off for launch)
    const introDiscountPercent = (nearestBand === null || nearestBand === void 0 ? void 0 : nearestBand.refundRate) > 10 ? 10 : 15;
    const introPrice = Math.round(input.targetPrice * (1 - introDiscountPercent / 100) * 100) / 100;
    // Get potential bundle products
    const topProducts = await prisma.product.findMany({
        where: { shopId: input.shopId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { title: true },
    });
    const bundleOptions = topProducts.slice(0, 2).map((p, i) => ({
        name: `${input.productName} + ${p.title}`,
        products: [input.productName, p.title],
        bundlePrice: Math.round((input.targetPrice * 1.6) * 100) / 100,
        savings: Math.round(input.targetPrice * 0.15 * 100) / 100,
    }));
    return {
        msrp: input.targetPrice,
        introPrice,
        introDiscountPercent,
        bundleOptions,
    };
}
// ============================================
// SUCCESS METRICS
// ============================================
function generateSuccessMetrics(input, strategy) {
    const estimatedFirstWeekUnits = input.targetPrice > 100 ? 5 : 15;
    const estimatedFirstMonthUnits = estimatedFirstWeekUnits * 3;
    return {
        day7Target: {
            units: estimatedFirstWeekUnits,
            revenue: Math.round(estimatedFirstWeekUnits * input.targetPrice),
        },
        day30Target: {
            units: estimatedFirstMonthUnits,
            revenue: Math.round(estimatedFirstMonthUnits * input.targetPrice),
        },
        breakeven: {
            units: Math.ceil(strategy.budget.suggested / (input.targetPrice * 0.4)),
            days: 30,
        },
    };
}
// ============================================
// MAIN FUNCTION
// ============================================
export async function generateLaunchKit(input) {
    console.log(`[LaunchKit] Generating kit for: ${input.productName}`);
    // Generate all components
    const [strategy, copyAssets, pricing] = await Promise.all([
        generateLaunchStrategy(input),
        generateCopyAssets(input),
        generatePricingStrategy(input),
    ]);
    const successMetrics = generateSuccessMetrics(input, strategy);
    // Build risk mitigation
    const riskMitigation = {
        topRisks: [
            { risk: 'Low initial traction', mitigation: 'Prepare retargeting campaign', severity: 'medium' },
            { risk: 'Price sensitivity', mitigation: 'A/B test with different intro discounts', severity: 'low' },
            { risk: 'Supply issues', mitigation: 'Start with limited quantity messaging', severity: 'low' },
        ],
        mitigationSteps: [
            'Monitor first 48 hours closely',
            'Prepare backup creative assets',
            'Have customer support briefed',
        ],
    };
    // Pre-launch checklist
    const prelaunchChecklist = [
        { task: 'Product photography ready', status: 'pending', owner: 'Marketing', dueDate: '-7 days' },
        { task: 'Email campaign drafted', status: 'pending', owner: 'Marketing', dueDate: '-5 days' },
        { task: 'Social posts scheduled', status: 'pending', owner: 'Social', dueDate: '-3 days' },
        { task: 'Inventory confirmed', status: 'pending', owner: 'Operations', dueDate: '-2 days' },
        { task: 'Team briefed', status: 'pending', owner: 'All', dueDate: '-1 day' },
    ];
    // Save to database
    const launchKit = await prisma.launchKit.create({
        data: {
            shopId: input.shopId,
            candidateId: input.candidateId || null,
            productName: input.productName,
            productType: input.productType,
            targetPrice: input.targetPrice,
            launchStrategy: strategy,
            copyAssets: copyAssets,
            pricingStrategy: pricing,
            targetAudience: {
                primaryPersona: 'Existing customers',
                secondaryPersona: 'Social followers',
                messaging: copyAssets.tagline,
            },
            successMetrics: successMetrics,
            riskMitigation: riskMitigation,
            prelaunchChecklist: prelaunchChecklist,
            status: 'draft',
        },
    });
    console.log(`[LaunchKit] Created kit ID: ${launchKit.id}`);
    return launchKit;
}
// ============================================
// GET LAUNCH KITS
// ============================================
export async function getLaunchKits(shopId) {
    return prisma.launchKit.findMany({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function getLaunchKit(id) {
    return prisma.launchKit.findUnique({ where: { id } });
}
