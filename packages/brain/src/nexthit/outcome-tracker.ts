/**
 * NextHit Outcome Tracker
 * Tracks the outcomes of launched candidates to enable learning and feedback loops
 */

import { prisma } from '@brandmind/shared';
import { Prisma } from '@prisma/client';

// ============================================
// TYPES
// ============================================

export interface LaunchOutcome {
    candidateId: string;
    decision: 'launched' | 'rejected' | 'deferred';
    decisionReason: string;
    launchDate?: Date;
    actualRevenue?: number;
    actualUnits?: number;
    refundRate?: number;
    performanceVsPrediction?: 'exceeded' | 'met' | 'missed';
    lessonsLearned?: string;
}

export interface OutcomeAnalysis {
    candidateId: string;
    predictedRevenue: number;
    actualRevenue: number;
    accuracy: number;
    predictedConfidence: number;
    factors: {
        storeFitAccurate: boolean;
        trendMomentumAccurate: boolean;
        seasonalityAccurate: boolean;
    };
}

// ============================================
// OUTCOME RECORDING
// ============================================

/**
 * Record a launch decision for a NextHit candidate
 */
export async function recordLaunchDecision(
    candidateId: string,
    decision: 'launched' | 'rejected' | 'deferred',
    reason: string,
    launchDate?: Date
): Promise<void> {
    // Update candidate status
    await prisma.nextHitCandidate.update({
        where: { id: candidateId },
        data: {
            status: decision === 'launched' ? 'launched' : decision === 'rejected' ? 'rejected' : 'shortlisted',
        },
    });

    // Create or update outcome record
    await prisma.nextHitOutcome.upsert({
        where: { candidateId },
        update: {
            decision,
            decisionReason: reason,
            launchDate: launchDate || null,
        },
        create: {
            candidateId,
            decision,
            decisionReason: reason,
            launchDate: launchDate || null,
        },
    });

    console.log(`[OutcomeTracker] Recorded ${decision} decision for candidate ${candidateId}`);
}

/**
 * Record actual performance metrics after launch
 */
export async function recordLaunchPerformance(
    candidateId: string,
    metrics: {
        actualRevenue: number;
        actualUnits: number;
        refundRate: number;
    }
): Promise<void> {
    // Get the candidate and its analysis for comparison
    const candidate = await prisma.nextHitCandidate.findUnique({
        where: { id: candidateId },
        include: { analysis: true },
    });

    if (!candidate) {
        throw new Error(`Candidate ${candidateId} not found`);
    }

    // Calculate performance vs prediction
    let performanceVsPrediction: 'exceeded' | 'met' | 'missed' = 'met';

    if (candidate.analysis?.revenueScenarios) {
        const scenarios = candidate.analysis.revenueScenarios as any;
        const expectedRevenue = scenarios.expected?.revenue || 0;

        if (metrics.actualRevenue > expectedRevenue * 1.2) {
            performanceVsPrediction = 'exceeded';
        } else if (metrics.actualRevenue < expectedRevenue * 0.7) {
            performanceVsPrediction = 'missed';
        }
    }

    // Update outcome record
    await prisma.nextHitOutcome.update({
        where: { candidateId },
        data: {
            actualRevenue: new Prisma.Decimal(metrics.actualRevenue),
            actualUnits: metrics.actualUnits,
            refundRate: metrics.refundRate,
            performanceVsPrediction,
        },
    });

    console.log(`[OutcomeTracker] Recorded performance for ${candidateId}: ${performanceVsPrediction}`);
}

/**
 * Record lessons learned from a launched candidate
 */
export async function recordLessonsLearned(
    candidateId: string,
    lessons: string
): Promise<void> {
    await prisma.nextHitOutcome.update({
        where: { candidateId },
        data: {
            lessonsLearned: lessons,
        },
    });
}

// ============================================
// OUTCOME ANALYSIS
// ============================================

/**
 * Analyze the accuracy of predictions for completed outcomes
 */
export async function analyzeOutcomes(shopId: string): Promise<{
    totalLaunched: number;
    exceeded: number;
    met: number;
    missed: number;
    averageAccuracy: number;
    insights: string[];
}> {
    const outcomes = await prisma.nextHitOutcome.findMany({
        where: {
            candidate: { shopId },
            decision: 'launched',
            actualRevenue: { not: null },
        },
        include: {
            candidate: {
                include: { analysis: true },
            },
        },
    });

    let exceeded = 0;
    let met = 0;
    let missed = 0;
    let totalAccuracy = 0;
    const insights: string[] = [];

    for (const outcome of outcomes) {
        if (outcome.performanceVsPrediction === 'exceeded') exceeded++;
        else if (outcome.performanceVsPrediction === 'met') met++;
        else missed++;

        // Calculate accuracy
        if (outcome.candidate.analysis?.revenueScenarios && outcome.actualRevenue) {
            const scenarios = outcome.candidate.analysis.revenueScenarios as any;
            const expectedRevenue = scenarios.expected?.revenue || 1;
            const accuracy = Math.min(1, Number(outcome.actualRevenue) / expectedRevenue);
            totalAccuracy += accuracy;
        }
    }

    const totalLaunched = outcomes.length;
    const averageAccuracy = totalLaunched > 0 ? totalAccuracy / totalLaunched : 0;

    // Generate insights
    if (exceeded > met + missed) {
        insights.push('Your predictions tend to be conservative. Consider raising confidence thresholds.');
    }
    if (missed > exceeded + met) {
        insights.push('Several launches underperformed. Review market trend data quality.');
    }
    if (averageAccuracy > 0.8) {
        insights.push('High prediction accuracy indicates strong pattern recognition.');
    }

    // Check for pattern-specific insights
    const patternPerformance: Record<string, { succeeded: number; total: number }> = {};
    for (const outcome of outcomes) {
        const source = outcome.candidate.patternSource;
        if (!patternPerformance[source]) {
            patternPerformance[source] = { succeeded: 0, total: 0 };
        }
        patternPerformance[source].total++;
        if (outcome.performanceVsPrediction !== 'missed') {
            patternPerformance[source].succeeded++;
        }
    }

    for (const [source, perf] of Object.entries(patternPerformance)) {
        const successRate = perf.succeeded / perf.total;
        if (successRate < 0.5 && perf.total >= 3) {
            insights.push(`${source} candidates have low success rate (${Math.round(successRate * 100)}%). Consider de-prioritizing.`);
        } else if (successRate > 0.8 && perf.total >= 3) {
            insights.push(`${source} candidates perform well (${Math.round(successRate * 100)}% success). Prioritize this pattern.`);
        }
    }

    return {
        totalLaunched,
        exceeded,
        met,
        missed,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        insights,
    };
}

/**
 * Get launch history with outcomes for a shop
 */
export async function getLaunchHistory(shopId: string, limit: number = 20): Promise<any[]> {
    const outcomes = await prisma.nextHitOutcome.findMany({
        where: {
            candidate: { shopId },
        },
        include: {
            candidate: {
                select: {
                    title: true,
                    patternSource: true,
                    hitType: true,
                    confidence: true,
                    scores: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });

    return outcomes.map(o => ({
        candidateTitle: o.candidate.title,
        patternSource: o.candidate.patternSource,
        hitType: o.candidate.hitType,
        predictedConfidence: o.candidate.confidence,
        decision: o.decision,
        decisionReason: o.decisionReason,
        launchDate: o.launchDate,
        actualRevenue: o.actualRevenue ? Number(o.actualRevenue) : null,
        actualUnits: o.actualUnits,
        refundRate: o.refundRate ? Number(o.refundRate) : null,
        performanceVsPrediction: o.performanceVsPrediction,
        lessonsLearned: o.lessonsLearned,
    }));
}

/**
 * Apply learnings from outcomes to adjust future scoring weights
 * Returns suggested weight adjustments based on historical accuracy
 */
export async function suggestWeightAdjustments(shopId: string): Promise<{
    suggestions: Array<{ weight: string; currentValue: number; suggestedValue: number; reason: string }>;
}> {
    const outcomes = await prisma.nextHitOutcome.findMany({
        where: {
            candidate: { shopId },
            decision: 'launched',
            actualRevenue: { not: null },
        },
        include: {
            candidate: {
                include: { analysis: true },
            },
        },
    });

    if (outcomes.length < 5) {
        return {
            suggestions: [{
                weight: 'N/A',
                currentValue: 0,
                suggestedValue: 0,
                reason: 'Not enough launch data to suggest adjustments. Need at least 5 completed launches.',
            }],
        };
    }

    const suggestions: Array<{ weight: string; currentValue: number; suggestedValue: number; reason: string }> = [];

    // Analyze which score components correlated with success
    let trendSuccessCorrelation = 0;
    let seasonalitySuccessCorrelation = 0;
    let gapFillSuccessCorrelation = 0;

    for (const outcome of outcomes) {
        const scores = outcome.candidate.scores as any;
        const succeeded = outcome.performanceVsPrediction !== 'missed';

        if (scores?.trendMomentum > 0.6 && succeeded) trendSuccessCorrelation++;
        if (scores?.trendMomentum > 0.6 && !succeeded) trendSuccessCorrelation--;

        if (scores?.seasonalityMatch > 0.6 && succeeded) seasonalitySuccessCorrelation++;
        if (scores?.seasonalityMatch > 0.6 && !succeeded) seasonalitySuccessCorrelation--;

        if (scores?.gapFill > 0.6 && succeeded) gapFillSuccessCorrelation++;
        if (scores?.gapFill > 0.6 && !succeeded) gapFillSuccessCorrelation--;
    }

    // Suggest adjustments based on correlations
    if (trendSuccessCorrelation < -2) {
        suggestions.push({
            weight: 'trendMomentum',
            currentValue: 0.20,
            suggestedValue: 0.15,
            reason: 'Trend momentum has weak correlation with actual success. Consider reducing weight.',
        });
    } else if (trendSuccessCorrelation > 2) {
        suggestions.push({
            weight: 'trendMomentum',
            currentValue: 0.20,
            suggestedValue: 0.25,
            reason: 'Trend momentum strongly predicts success. Consider increasing weight.',
        });
    }

    if (gapFillSuccessCorrelation > 2) {
        suggestions.push({
            weight: 'gapFill',
            currentValue: 0.20,
            suggestedValue: 0.25,
            reason: 'Gap-filling candidates outperform. Consider increasing weight.',
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            weight: 'all',
            currentValue: 0,
            suggestedValue: 0,
            reason: 'Current weights appear well-calibrated based on historical performance.',
        });
    }

    return { suggestions };
}
