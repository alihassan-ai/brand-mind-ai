/**
 * Strategy Router
 * Determines which product expansion strategy to recommend based on Brand DNA signals
 */

import { prisma } from '@brandmind/shared';
import { Prisma } from '@prisma/client';

// ============================================
// TYPES
// ============================================

export type ExpansionStrategy =
    | 'VARIANT_EXTENSION'      // Add sizes/colors to winners
    | 'HORIZONTAL_EXTENSION'   // New product in same category
    | 'VERTICAL_EXTENSION'     // Premium/budget version
    | 'CATEGORY_EXPANSION'     // Adjacent category
    | 'NEW_DOMAIN_ENTRY'       // Completely new category
    | 'OPTIMIZE_EXISTING';     // No new products, fix what you have

export interface StrategyRecommendation {
    primaryStrategy: ExpansionStrategy;
    reasoning: string[];
    confidence: number;
    alternativeStrategies: Array<{
        strategy: ExpansionStrategy;
        reasoning: string;
    }>;
    launchTiming: {
        recommended: string;
        reasoning: string;
    };
}

interface DNASignals {
    // Revenue Concentration
    heroProductShare: number;
    top5ProductShare: number;
    concentrationRisk: 'low' | 'medium' | 'high';

    // Growth Momentum
    orderVelocityTrend: 'accelerating' | 'stable' | 'declining';
    revenueGrowth30d: number;

    // Margin Health
    marginHealthStatus: 'healthy' | 'moderate' | 'stressed';

    // Cash Position
    inferredCashPosition: 'cash_rich' | 'balanced' | 'tight';
    cashCowProductCount: number;
    starProductCount: number;

    // Catalog Structure
    categoryDepth: 'shallow' | 'moderate' | 'deep';
    categoryBreadth: 'narrow' | 'moderate' | 'broad';

    // Timing
    seasonalPosition: 'pre_peak' | 'peak' | 'post_peak' | 'off_season';
    monthsUntilPeak: number;
}

// ============================================
// MAIN FUNCTION
// ============================================

export function determineExpansionStrategy(signals: DNASignals): StrategyRecommendation {
    const alternatives: StrategyRecommendation['alternativeStrategies'] = [];

    // ═══════════════════════════════════════════════════════════════
    // RULE 1: If margins are stressed, don't add products
    // ═══════════════════════════════════════════════════════════════
    if (signals.marginHealthStatus === 'stressed') {
        return {
            primaryStrategy: 'OPTIMIZE_EXISTING',
            reasoning: [
                'Margin health indicates financial stress',
                'Focus on improving existing product profitability before expansion',
                'New products would add complexity without solving core margin issues',
            ],
            confidence: 0.9,
            alternativeStrategies: [],
            launchTiming: {
                recommended: 'After margin recovery',
                reasoning: 'Stabilize margins before investing in new products',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RULE 2: If highly dependent on hero + hero is accelerating
    // → Diversify with variants (reduce risk while it's hot)
    // ═══════════════════════════════════════════════════════════════
    if (
        signals.heroProductShare > 40 &&
        signals.orderVelocityTrend === 'accelerating'
    ) {
        alternatives.push({
            strategy: 'HORIZONTAL_EXTENSION',
            reasoning: 'Could also introduce a complementary product in same category',
        });

        return {
            primaryStrategy: 'VARIANT_EXTENSION',
            reasoning: [
                `Hero product drives ${signals.heroProductShare.toFixed(0)}% of revenue - high concentration risk`,
                'Velocity is accelerating - capitalize on momentum while it lasts',
                'Adding variants reduces dependency risk while leveraging the winner',
            ],
            confidence: 0.85,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Now',
                reasoning: 'Strike while momentum is strong',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RULE 3: If highly dependent on hero + hero is declining
    // → Horizontal extension (same category, new product)
    // ═══════════════════════════════════════════════════════════════
    if (
        signals.heroProductShare > 40 &&
        signals.orderVelocityTrend === 'declining'
    ) {
        alternatives.push({
            strategy: 'VARIANT_EXTENSION',
            reasoning: 'Could refresh the hero with new variants to revive interest',
        });

        return {
            primaryStrategy: 'HORIZONTAL_EXTENSION',
            reasoning: [
                `Hero product (${signals.heroProductShare.toFixed(0)}% of revenue) is losing momentum`,
                'Need a new flagship product in the same category',
                'Customers already trust your category expertise - give them something fresh',
            ],
            confidence: 0.8,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Within 30 days',
                reasoning: 'Urgently need to replace declining hero',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RULE 4: If cash-rich + diversified + good margins
    // → Category expansion (you can afford to experiment)
    // ═══════════════════════════════════════════════════════════════
    if (
        signals.inferredCashPosition === 'cash_rich' &&
        signals.concentrationRisk === 'low' &&
        signals.marginHealthStatus === 'healthy'
    ) {
        alternatives.push({
            strategy: 'NEW_DOMAIN_ENTRY',
            reasoning: 'Strong position could support entering completely new market',
        });
        alternatives.push({
            strategy: 'VERTICAL_EXTENSION',
            reasoning: 'Could introduce premium tier to capture higher-value segment',
        });

        return {
            primaryStrategy: 'CATEGORY_EXPANSION',
            reasoning: [
                'Strong financial position allows for strategic category bets',
                'Revenue is well diversified - experimentation risk is manageable',
                'Time to expand market reach with an adjacent category',
            ],
            confidence: 0.75,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: signals.seasonalPosition === 'pre_peak' ? 'Before peak season' : 'When ready',
                reasoning: 'Financial runway supports thoughtful planning',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RULE 5: If category depth is shallow + winners exist
    // → Variant extension (fill out the line)
    // ═══════════════════════════════════════════════════════════════
    if (
        signals.categoryDepth === 'shallow' &&
        signals.starProductCount > 0
    ) {
        alternatives.push({
            strategy: 'HORIZONTAL_EXTENSION',
            reasoning: 'Could add complementary products instead of variants',
        });

        return {
            primaryStrategy: 'VARIANT_EXTENSION',
            reasoning: [
                'Catalog depth is shallow - clear opportunity to fill out variants',
                `${signals.starProductCount} star product(s) can be extended with more options`,
                'Lower risk than new product development - proven demand exists',
            ],
            confidence: 0.8,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Now',
                reasoning: 'Quick wins available from variant additions',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RULE 6: If breadth is narrow + margins are good
    // → Category expansion (broaden your reach)
    // Note: marginHealthStatus already checked for 'stressed' in RULE 1
    // ═══════════════════════════════════════════════════════════════
    if (signals.categoryBreadth === 'narrow') {
        alternatives.push({
            strategy: 'HORIZONTAL_EXTENSION',
            reasoning: 'Could deepen existing category before expanding',
        });

        return {
            primaryStrategy: 'CATEGORY_EXPANSION',
            reasoning: [
                'Category breadth is narrow - vulnerability to market shifts in single category',
                'Margins can support investment in new categories',
                'Basket affinity data can guide which adjacent category to enter',
            ],
            confidence: 0.7,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Within 60 days',
                reasoning: 'Diversification reduces long-term risk',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RULE 7: If approaching peak season + have cash
    // → Horizontal extension (quick wins for the season)
    // ═══════════════════════════════════════════════════════════════
    if (
        signals.seasonalPosition === 'pre_peak' &&
        signals.inferredCashPosition !== 'tight' &&
        signals.monthsUntilPeak <= 3
    ) {
        alternatives.push({
            strategy: 'VARIANT_EXTENSION',
            reasoning: 'Variants of existing products are faster to launch',
        });

        return {
            primaryStrategy: 'HORIZONTAL_EXTENSION',
            reasoning: [
                `Peak season approaching in ${signals.monthsUntilPeak} month(s)`,
                'Time to launch complementary products for seasonal demand',
                'Lower risk than category expansion, faster time to market',
            ],
            confidence: 0.75,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: `Within ${signals.monthsUntilPeak * 4} weeks`,
                reasoning: 'Must launch before peak to capture seasonal demand',
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // DEFAULT: Horizontal extension (safest growth move)
    // ═══════════════════════════════════════════════════════════════
    alternatives.push({
        strategy: 'VARIANT_EXTENSION',
        reasoning: 'Could focus on extending existing products first',
    });

    return {
        primaryStrategy: 'HORIZONTAL_EXTENSION',
        reasoning: [
            'Standard growth path: extend within known category',
            'Leverage existing brand equity and customer trust',
            'Moderate risk with moderate reward potential',
        ],
        confidence: 0.6,
        alternativeStrategies: alternatives,
        launchTiming: {
            recommended: 'When ready',
            reasoning: 'No urgent timing pressure detected',
        },
    };
}

// ============================================
// EXTRACT SIGNALS FROM STORE DNA
// ============================================

export async function getStrategyRecommendation(shopId: string): Promise<StrategyRecommendation | null> {
    const dna = await prisma.storeDNA.findUnique({
        where: { shopId },
    });

    if (!dna) {
        console.log(`[StrategyRouter] No StoreDNA found for shop ${shopId}`);
        return null;
    }

    // Extract signals from DNA
    const signals: DNASignals = {
        heroProductShare: dna.heroProductShare ?? 0,
        top5ProductShare: dna.top5ProductShare ?? 0,
        concentrationRisk: (dna.concentrationRisk as DNASignals['concentrationRisk']) ?? 'medium',
        orderVelocityTrend: (dna.orderVelocityTrend as DNASignals['orderVelocityTrend']) ?? 'stable',
        revenueGrowth30d: dna.revenueGrowth30d ?? 0,
        marginHealthStatus: (dna.marginHealthStatus as DNASignals['marginHealthStatus']) ?? 'moderate',
        inferredCashPosition: (dna.inferredCashPosition as DNASignals['inferredCashPosition']) ?? 'balanced',
        cashCowProductCount: dna.cashCowProductCount ?? 0,
        starProductCount: dna.starProductCount ?? 0,
        categoryDepth: (dna.categoryDepth as DNASignals['categoryDepth']) ?? 'moderate',
        categoryBreadth: (dna.categoryBreadth as DNASignals['categoryBreadth']) ?? 'moderate',
        seasonalPosition: (dna.seasonalPosition as DNASignals['seasonalPosition']) ?? 'off_season',
        monthsUntilPeak: dna.monthsUntilPeak ?? 6,
    };

    const recommendation = determineExpansionStrategy(signals);

    // Save recommendation to DNA
    await prisma.storeDNA.update({
        where: { shopId },
        data: {
            recommendedStrategy: recommendation.primaryStrategy,
            strategyReasons: recommendation.reasoning,
            strategyConfidence: recommendation.confidence,
            alternativeStrategies: recommendation.alternativeStrategies as unknown as Prisma.InputJsonValue,
            recommendedLaunchTiming: recommendation.launchTiming.recommended,
            launchTimingReason: recommendation.launchTiming.reasoning,
        },
    });

    console.log(`[StrategyRouter] Recommended ${recommendation.primaryStrategy} for shop ${shopId} (confidence: ${recommendation.confidence})`);

    return recommendation;
}

// ============================================
// STRATEGY DESCRIPTIONS (For UI)
// ============================================

export const STRATEGY_INFO: Record<ExpansionStrategy, {
    name: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    timeToMarket: string;
    examples: string[];
}> = {
    VARIANT_EXTENSION: {
        name: 'Variant Extension',
        description: 'Add new sizes, colors, or materials to your existing winning products',
        riskLevel: 'low',
        timeToMarket: '2-4 weeks',
        examples: [
            'Adding new colors to your best-selling dress',
            'Introducing size XXL for popular items',
            'Offering a leather version of a canvas bag',
        ],
    },
    HORIZONTAL_EXTENSION: {
        name: 'Horizontal Extension',
        description: 'Launch a new product in the same category as your current offerings',
        riskLevel: 'medium',
        timeToMarket: '4-8 weeks',
        examples: [
            'Adding pants to complement your tops collection',
            'Launching a new serum alongside existing skincare',
            'Introducing a new flavor of your popular snack',
        ],
    },
    VERTICAL_EXTENSION: {
        name: 'Vertical Extension',
        description: 'Create a premium or budget version of existing products',
        riskLevel: 'medium',
        timeToMarket: '6-10 weeks',
        examples: [
            'Premium organic version of your bestseller',
            'Budget-friendly line for price-sensitive customers',
            'Luxury limited edition collection',
        ],
    },
    CATEGORY_EXPANSION: {
        name: 'Category Expansion',
        description: 'Enter an adjacent category that complements your current offerings',
        riskLevel: 'medium',
        timeToMarket: '8-12 weeks',
        examples: [
            'Clothing brand adding accessories',
            'Skincare brand launching makeup',
            'Coffee company adding tea products',
        ],
    },
    NEW_DOMAIN_ENTRY: {
        name: 'New Domain Entry',
        description: 'Enter a completely new product category or market',
        riskLevel: 'high',
        timeToMarket: '12-16 weeks',
        examples: [
            'Fashion brand launching home goods',
            'Food company entering wellness supplements',
            'Beauty brand creating lifestyle products',
        ],
    },
    OPTIMIZE_EXISTING: {
        name: 'Optimize Existing',
        description: 'Focus on improving current product performance before adding new products',
        riskLevel: 'low',
        timeToMarket: 'Ongoing',
        examples: [
            'Improve margins on existing products',
            'Reduce refund rates',
            'Optimize pricing strategy',
        ],
    },
};
