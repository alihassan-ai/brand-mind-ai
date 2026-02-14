import { prisma } from '@brandmind/shared';
import { Prisma } from '@prisma/client';

interface RiskLevel {
    level: 'low' | 'moderate' | 'high';
    score: number;
    evidence: string;
    confidence: number;
    category: 'internal' | 'external';
}

interface RevenueScenario {
    label: string;
    revenue: number;
    units: number;
    assumptions: string[];
    probability: number;
}

interface TestPath {
    type: string;
    description: string;
    successCriteria: string;
    stopConditions: string;
    dataLearned: string;
    investmentRequired: string;
}

export async function runDeepAnalysis(candidateId: string) {
    const candidate = await prisma.nextHitCandidate.findUnique({
        where: { id: candidateId },
        include: {
            shop: {
                include: {
                    products: { include: { variants: true } },
                    goals: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
            },
        },
    });

    if (!candidate) throw new Error('Candidate not found');

    const shopId = candidate.shopId;
    const patterns = await prisma.patternMemory.findMany({ where: { shopId } });
    const goal = candidate.shop.goals[0];

    // 1. Multi-dimensional risk decomposition
    const demandRisk = assessDemandRisk(candidate, patterns);
    const refundRisk = assessRefundRisk(candidate, patterns);
    const brandRisk = assessBrandRisk(candidate, patterns);
    const operationalRisk = assessOperationalRisk(candidate);
    const cannibalizationRisk = assessCannibalizationRisk(candidate, candidate.shop.products);

    // 2. Revenue scenarios
    const revenueScenarios = generateRevenueScenarios(candidate, patterns);

    // 3. Test path recommendation
    const testPath = recommendTestPath(candidate, revenueScenarios);

    // Persist the analysis
    const analysis = await prisma.nextHitAnalysis.upsert({
        where: { candidateId },
        update: {
            demandRisk: demandRisk as unknown as Prisma.InputJsonValue,
            refundRisk: refundRisk as unknown as Prisma.InputJsonValue,
            brandRisk: brandRisk as unknown as Prisma.InputJsonValue,
            operationalRisk: operationalRisk as unknown as Prisma.InputJsonValue,
            cannibalizationRisk: cannibalizationRisk as unknown as Prisma.InputJsonValue,
            revenueScenarios: revenueScenarios as unknown as Prisma.InputJsonValue,
            testPath: testPath as unknown as Prisma.InputJsonValue,
        },
        create: {
            candidateId,
            demandRisk: demandRisk as unknown as Prisma.InputJsonValue,
            refundRisk: refundRisk as unknown as Prisma.InputJsonValue,
            brandRisk: brandRisk as unknown as Prisma.InputJsonValue,
            operationalRisk: operationalRisk as unknown as Prisma.InputJsonValue,
            cannibalizationRisk: cannibalizationRisk as unknown as Prisma.InputJsonValue,
            revenueScenarios: revenueScenarios as unknown as Prisma.InputJsonValue,
            testPath: testPath as unknown as Prisma.InputJsonValue,
        },
    });

    // Update candidate status
    await prisma.nextHitCandidate.update({
        where: { id: candidateId },
        data: { status: 'analyzing' },
    });

    return analysis;
}

function assessDemandRisk(candidate: any, patterns: any[]): RiskLevel {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;

    // Bundle opportunities - use actual evidence
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        const count = evidence.coOccurrenceCount || 0;
        return {
            level: count > 10 ? 'low' : 'moderate',
            score: count > 10 ? 0.2 : 0.4,
            evidence: count > 0 ? `${count} customers already buy these together` : 'Bundle based on product affinity',
            confidence: 0.85,
            category: 'internal',
        };
    }

    // Color + product combinations
    if (source === 'color_product_combination' || source === 'color_extension' || source === 'color_variant') {
        const successRate = parseFloat(String(evidence.colorSuccessRate || '0').replace('%', ''));
        const productShare = evidence.productTypeShare || 0;
        return {
            level: successRate > 70 ? 'low' : 'moderate',
            score: successRate > 70 ? 0.2 : 0.4,
            evidence: `${evidence.color || 'Color'} has ${successRate}% success rate, ${evidence.productType || 'Product'} is ${productShare.toFixed(1)}% of revenue`,
            confidence: 0.8,
            category: 'internal',
        };
    }

    // Price optimization
    if (source === 'price_optimization') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `${evidence.optimalBand || 'Optimal'} price band (${evidence.priceRange || ''}) converts best for your customers`,
            confidence: 0.75,
            category: 'internal',
        };
    }

    // Growth expansion
    if (source === 'growth_expansion') {
        const growth = evidence.growthRate || 0;
        return {
            level: growth > 50 ? 'low' : 'moderate',
            score: growth > 50 ? 0.3 : 0.5,
            evidence: `${evidence.category || 'Category'} growing at ${growth.toFixed(0)}% with ${(evidence.currentRevenueShare || 0).toFixed(1)}% current share`,
            confidence: 0.7,
            category: 'internal',
        };
    }

    // Gap fillers
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            level: 'moderate',
            score: 0.45,
            evidence: source === 'price_gap'
                ? `Price gap in ${evidence.priceRange || 'range'} with ${evidence.adjacentDemand || 0} adjacent orders`
                : `${evidence.month || 'Seasonal'} underperforms at ${((evidence.revenueIndex || 1) * 100).toFixed(0)}%`,
            confidence: 0.65,
            category: 'internal',
        };
    }

    // Variant expansion
    if (source === 'variant_expansion') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `Based on top seller "${evidence.baseProduct || 'product'}" with €${(evidence.baseRevenue || 0).toFixed(0)} revenue`,
            confidence: 0.75,
            category: 'internal',
        };
    }

    // AI research
    if (source === 'ai_market_research') {
        return {
            level: evidence.riskLevel === 'low' ? 'low' : evidence.riskLevel === 'high' ? 'high' : 'moderate',
            score: evidence.riskLevel === 'low' ? 0.3 : evidence.riskLevel === 'high' ? 0.7 : 0.5,
            evidence: `Trend score ${evidence.trendScore || 'N/A'}, search volume ${evidence.searchVolume || 'N/A'}`,
            confidence: 0.6,
            category: 'external',
        };
    }

    // Default with actual pattern source
    return {
        level: 'moderate',
        score: 0.4,
        evidence: `Based on ${source.replace(/_/g, ' ')} pattern analysis`,
        confidence: 0.65,
        category: 'internal',
    };
}

function assessRefundRisk(candidate: any, patterns: any[]): RiskLevel {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;

    // Bundles typically have lower refund risk
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        return {
            level: 'low',
            score: 0.15,
            evidence: 'Bundles use existing products - no quality uncertainty',
            confidence: 0.85,
            category: 'internal',
        };
    }

    // Color/variant extensions from proven products
    if (source === 'color_product_combination' || source === 'color_extension' || source === 'color_variant' || source === 'variant_expansion') {
        return {
            level: 'low',
            score: 0.2,
            evidence: `Extending proven ${evidence.productType || evidence.baseProduct || 'product'} with known quality profile`,
            confidence: 0.75,
            category: 'internal',
        };
    }

    // Price optimization targets proven bands
    if (source === 'price_optimization') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `${evidence.optimalBand || 'Target'} price band has established refund benchmarks`,
            confidence: 0.7,
            category: 'internal',
        };
    }

    // Growth expansion - slightly higher risk
    if (source === 'growth_expansion') {
        return {
            level: 'moderate',
            score: 0.35,
            evidence: `${evidence.category || 'Category'} expansion may have varying quality expectations`,
            confidence: 0.65,
            category: 'internal',
        };
    }

    // AI research - external, less predictable
    if (source === 'ai_market_research') {
        return {
            level: 'moderate',
            score: 0.4,
            evidence: 'New product concept requires quality validation',
            confidence: 0.55,
            category: 'external',
        };
    }

    return {
        level: 'moderate',
        score: 0.35,
        evidence: 'Standard quality verification recommended',
        confidence: 0.6,
        category: 'internal',
    };
}

function assessBrandRisk(candidate: any, _patterns: any[]): RiskLevel {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;

    // Extensions of existing products have low brand risk
    if (['color_product_combination', 'color_extension', 'color_variant', 'variant_expansion', 'bundle_opportunity', 'bundle_merge', 'price_optimization'].includes(source)) {
        return {
            level: 'low',
            score: 0.15,
            evidence: `Natural extension of ${evidence.productType || evidence.category || 'existing'} catalog`,
            confidence: 0.8,
            category: 'internal',
        };
    }

    // Growth expansion - moderate brand consideration
    if (source === 'growth_expansion') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `${evidence.category || 'Category'} already part of brand identity`,
            confidence: 0.75,
            category: 'internal',
        };
    }

    // Gap fillers
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            level: 'low',
            score: 0.2,
            evidence: 'Fills gap in existing catalog structure',
            confidence: 0.7,
            category: 'internal',
        };
    }

    // AI research - new concepts need brand alignment check
    if (source === 'ai_market_research') {
        return {
            level: evidence.riskLevel === 'low' ? 'low' : 'moderate',
            score: evidence.riskLevel === 'low' ? 0.25 : 0.45,
            evidence: `New concept based on ${evidence.productType || 'market'} trends - verify brand fit`,
            confidence: 0.6,
            category: 'external',
        };
    }

    return {
        level: 'low',
        score: 0.2,
        evidence: 'Fits within current catalog style',
        confidence: 0.7,
        category: 'internal',
    };
}

function assessOperationalRisk(candidate: any): RiskLevel {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;

    // Bundles are operationally simple
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        return {
            level: 'low',
            score: 0.1,
            evidence: 'Uses existing inventory - no new SKUs or suppliers needed',
            confidence: 0.9,
            category: 'internal',
        };
    }

    // Price optimization - existing product types
    if (source === 'price_optimization') {
        return {
            level: 'moderate',
            score: 0.35,
            evidence: `New ${evidence.targetProductType || 'product'} at ${evidence.priceRange || 'target'} price point`,
            confidence: 0.7,
            category: 'internal',
        };
    }

    // Color/variant extensions
    if (['color_product_combination', 'color_extension', 'color_variant', 'variant_expansion'].includes(source)) {
        return {
            level: 'moderate',
            score: 0.4,
            evidence: `Production run for ${evidence.color || evidence.suggestedVariant || 'new'} variant`,
            confidence: 0.7,
            category: 'internal',
        };
    }

    // Growth expansion - scaling existing category
    if (source === 'growth_expansion') {
        return {
            level: 'moderate',
            score: 0.45,
            evidence: `Expand ${evidence.category || 'category'} with existing supplier relationships`,
            confidence: 0.65,
            category: 'internal',
        };
    }

    // Gap fillers
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            level: 'moderate',
            score: 0.4,
            evidence: source === 'price_gap' ? 'New product at underserved price point' : 'Seasonal product requires timing coordination',
            confidence: 0.65,
            category: 'internal',
        };
    }

    // AI research - may need new suppliers
    if (source === 'ai_market_research') {
        return {
            level: evidence.riskLevel === 'high' ? 'high' : 'moderate',
            score: evidence.riskLevel === 'high' ? 0.65 : 0.5,
            evidence: 'New concept may require supplier discovery and validation',
            confidence: 0.55,
            category: 'external',
        };
    }

    return {
        level: 'moderate',
        score: 0.45,
        evidence: 'Standard operational requirements',
        confidence: 0.6,
        category: 'internal',
    };
}

function assessCannibalizationRisk(candidate: any, products: any[]): RiskLevel {
    const title = candidate.title.toLowerCase();

    // Check for similar products
    let highestOverlap = 0;
    let overlappingProduct = '';

    for (const product of products) {
        const existingTitle = product.title.toLowerCase();
        const candidateWords = new Set(title.split(/\s+/).filter((w: string) => w.length > 3));
        const existingWords = new Set(existingTitle.split(/\s+/).filter((w: string) => w.length > 3));
        const overlap = Array.from(candidateWords).filter((w) => existingWords.has(w as string)).length;

        if (overlap > highestOverlap) {
            highestOverlap = overlap;
            overlappingProduct = product.title;
        }
    }

    if (highestOverlap >= 3) {
        return {
            level: 'high',
            score: 0.7,
            evidence: `May compete with "${overlappingProduct}"`,
            confidence: 0.75,
            category: 'internal',
        };
    }

    if (candidate.patternSource === 'bundle_merge') {
        return {
            level: 'low',
            score: 0.1,
            evidence: 'Bundles complement rather than compete',
            confidence: 0.85,
            category: 'internal',
        };
    }

    return {
        level: 'low',
        score: 0.2,
        evidence: 'Distinct enough from existing catalog',
        confidence: 0.7,
        category: 'internal',
    };
}

function generateRevenueScenarios(candidate: any, _patterns: any[]): {
    conservative: RevenueScenario;
    expected: RevenueScenario;
    aggressive: RevenueScenario;
} {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;

    // Extract base price from evidence
    let basePrice = 50;
    if (evidence.priceRange) {
        const match = evidence.priceRange.match(/(\d+)/);
        if (match) basePrice = parseFloat(match[1]);
    } else if (evidence.targetPrice) {
        basePrice = parseFloat(String(evidence.targetPrice).replace(/[€$]/g, ''));
    } else if (evidence.productTypeRevenue && evidence.productTypeShare) {
        // Estimate from category data
        basePrice = evidence.productTypeRevenue / Math.max(1, evidence.productTypeShare) * 0.01;
    }

    // Estimate units based on pattern source and confidence
    const confidenceMultiplier = candidate.confidence || 0.7;
    let baseUnits = candidate.hitType === 'bold' ? 50 : candidate.hitType === 'moderate' ? 30 : 20;

    // Adjust based on evidence
    if (evidence.coOccurrenceCount) {
        baseUnits = Math.max(baseUnits, evidence.coOccurrenceCount * 2);
    }

    // Source-specific assumptions
    const getAssumptions = (level: 'conservative' | 'expected' | 'aggressive') => {
        const base = {
            conservative: ['Limited marketing reach', 'Competition response', 'Seasonal headwinds'],
            expected: ['Pattern continues as observed', 'Standard marketing support', 'Stable competitive landscape'],
            aggressive: ['Strong word of mouth', 'Cross-sell to existing customers', 'Favorable market timing'],
        };

        if (source === 'bundle_opportunity') {
            return level === 'expected'
                ? ['Bundle promoted in checkout', 'Email to past purchasers', 'No new inventory risk']
                : base[level];
        }
        if (source === 'color_product_combination') {
            return level === 'expected'
                ? [`${evidence.color || 'Color'} proven with ${evidence.colorSuccessRate || '80%'} success`, `${evidence.productType || 'Product'} is top category`, 'Loyal customer base']
                : base[level];
        }
        return base[level];
    };

    return {
        conservative: {
            label: 'Conservative',
            revenue: Math.round(basePrice * baseUnits * 0.5),
            units: Math.round(baseUnits * 0.5),
            assumptions: getAssumptions('conservative'),
            probability: 0.25,
        },
        expected: {
            label: 'Expected',
            revenue: Math.round(basePrice * baseUnits * confidenceMultiplier),
            units: Math.round(baseUnits * confidenceMultiplier),
            assumptions: getAssumptions('expected'),
            probability: 0.5,
        },
        aggressive: {
            label: 'Aggressive',
            revenue: Math.round(basePrice * baseUnits * 1.5),
            units: Math.round(baseUnits * 1.5),
            assumptions: getAssumptions('aggressive'),
            probability: 0.25,
        },
    };
}

function recommendTestPath(candidate: any, scenarios: any): TestPath {
    const source = candidate.patternSource;
    const evidence = candidate.patternEvidence || {};

    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        return {
            type: 'Soft Bundle Test',
            description: 'Create bundle listing with existing inventory',
            successCriteria: '10+ bundle sales in first 14 days',
            stopConditions: 'Less than 3 sales after 7 days',
            dataLearned: 'Whether customers perceive value in the combined offering',
            investmentRequired: 'Low - no new inventory needed',
        };
    }

    if (['color_product_combination', 'color_extension', 'color_variant', 'variant_expansion'].includes(source)) {
        const units = Math.round(scenarios.conservative.units * 1.2);
        return {
            type: 'Limited Batch Launch',
            description: `Produce ${units} units of ${evidence.color || evidence.suggestedVariant || 'new variant'}`,
            successCriteria: `${Math.round(units * 0.5)}+ units sold in 21 days (50% sell-through)`,
            stopConditions: 'Less than 20% sell-through after 14 days',
            dataLearned: 'Actual demand vs predicted, refund rate, customer feedback',
            investmentRequired: `€${Math.round(units * 20)}-€${Math.round(units * 50)} production cost`,
        };
    }

    if (source === 'price_optimization') {
        return {
            type: 'Price Point Validation',
            description: `Launch at ${evidence.priceRange || 'optimal'} price point with limited inventory`,
            successCriteria: 'Conversion rate matches or exceeds band average',
            stopConditions: 'Conversion significantly below average after 7 days',
            dataLearned: 'Price elasticity and margin potential at this point',
            investmentRequired: 'Moderate - limited inventory at target price',
        };
    }

    if (source === 'growth_expansion') {
        return {
            type: 'Category Expansion Test',
            description: `Add 3-5 new SKUs in ${evidence.category || 'growth category'}`,
            successCriteria: 'Maintain category growth rate with new additions',
            stopConditions: 'New SKUs underperform existing by >50%',
            dataLearned: 'Which sub-styles resonate in expanding category',
            investmentRequired: 'Moderate - diversified inventory across new SKUs',
        };
    }

    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            type: source === 'price_gap' ? 'Gap Fill Test' : 'Seasonal Pre-Launch',
            description: source === 'price_gap'
                ? `Launch product in ${evidence.priceRange || 'underserved'} range`
                : `Time launch for ${evidence.month || 'seasonal'} demand`,
            successCriteria: 'Capture adjacent demand without cannibalization',
            stopConditions: 'Returns from adjacent bands without net gain',
            dataLearned: 'Whether gap represents real demand or price sensitivity',
            investmentRequired: 'Moderate - targeted inventory',
        };
    }

    if (source === 'ai_market_research') {
        return {
            type: 'Pre-order Campaign',
            description: 'Validate market demand before production commitment',
            successCriteria: '25+ pre-orders in 14 days',
            stopConditions: 'Less than 10 pre-orders after 7 days',
            dataLearned: 'Real demand signal for new concept',
            investmentRequired: 'Low - marketing only until validated',
        };
    }

    return {
        type: 'Minimum Viable Launch',
        description: 'Small batch with focused marketing',
        successCriteria: '30% sell-through in first month',
        stopConditions: 'Less than 15% sell-through after 2 weeks',
        dataLearned: 'Market response, pricing sensitivity, customer profile',
        investmentRequired: 'Moderate - limited inventory + marketing',
    };
}
