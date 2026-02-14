/**
 * NextHit Outcome Tracker
 * Tracks the outcomes of launched candidates to enable learning and feedback loops
 */
import { prisma } from '@brandmind/shared';
import { Prisma } from '@prisma/client';
// ============================================
// OUTCOME RECORDING
// ============================================
/**
 * Record a launch decision for a NextHit candidate
 */
export async function recordLaunchDecision(candidateId, decision, reason, launchDate) {
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
export async function recordLaunchPerformance(candidateId, metrics) {
    var _a, _b;
    // Get the candidate and its analysis for comparison
    const candidate = await prisma.nextHitCandidate.findUnique({
        where: { id: candidateId },
        include: { analysis: true },
    });
    if (!candidate) {
        throw new Error(`Candidate ${candidateId} not found`);
    }
    // Calculate performance vs prediction
    let performanceVsPrediction = 'met';
    if ((_a = candidate.analysis) === null || _a === void 0 ? void 0 : _a.revenueScenarios) {
        const scenarios = candidate.analysis.revenueScenarios;
        const expectedRevenue = ((_b = scenarios.expected) === null || _b === void 0 ? void 0 : _b.revenue) || 0;
        if (metrics.actualRevenue > expectedRevenue * 1.2) {
            performanceVsPrediction = 'exceeded';
        }
        else if (metrics.actualRevenue < expectedRevenue * 0.7) {
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
export async function recordLessonsLearned(candidateId, lessons) {
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
export async function analyzeOutcomes(shopId) {
    var _a, _b;
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
    const insights = [];
    for (const outcome of outcomes) {
        if (outcome.performanceVsPrediction === 'exceeded')
            exceeded++;
        else if (outcome.performanceVsPrediction === 'met')
            met++;
        else
            missed++;
        // Calculate accuracy
        if (((_a = outcome.candidate.analysis) === null || _a === void 0 ? void 0 : _a.revenueScenarios) && outcome.actualRevenue) {
            const scenarios = outcome.candidate.analysis.revenueScenarios;
            const expectedRevenue = ((_b = scenarios.expected) === null || _b === void 0 ? void 0 : _b.revenue) || 1;
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
    const patternPerformance = {};
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
        }
        else if (successRate > 0.8 && perf.total >= 3) {
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
export async function getLaunchHistory(shopId, limit = 20) {
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
export async function suggestWeightAdjustments(shopId) {
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
    const suggestions = [];
    // Analyze which score components correlated with success
    let trendSuccessCorrelation = 0;
    let seasonalitySuccessCorrelation = 0;
    let gapFillSuccessCorrelation = 0;
    for (const outcome of outcomes) {
        const scores = outcome.candidate.scores;
        const succeeded = outcome.performanceVsPrediction !== 'missed';
        if ((scores === null || scores === void 0 ? void 0 : scores.trendMomentum) > 0.6 && succeeded)
            trendSuccessCorrelation++;
        if ((scores === null || scores === void 0 ? void 0 : scores.trendMomentum) > 0.6 && !succeeded)
            trendSuccessCorrelation--;
        if ((scores === null || scores === void 0 ? void 0 : scores.seasonalityMatch) > 0.6 && succeeded)
            seasonalitySuccessCorrelation++;
        if ((scores === null || scores === void 0 ? void 0 : scores.seasonalityMatch) > 0.6 && !succeeded)
            seasonalitySuccessCorrelation--;
        if ((scores === null || scores === void 0 ? void 0 : scores.gapFill) > 0.6 && succeeded)
            gapFillSuccessCorrelation++;
        if ((scores === null || scores === void 0 ? void 0 : scores.gapFill) > 0.6 && !succeeded)
            gapFillSuccessCorrelation--;
    }
    // Suggest adjustments based on correlations
    if (trendSuccessCorrelation < -2) {
        suggestions.push({
            weight: 'trendMomentum',
            currentValue: 0.20,
            suggestedValue: 0.15,
            reason: 'Trend momentum has weak correlation with actual success. Consider reducing weight.',
        });
    }
    else if (trendSuccessCorrelation > 2) {
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
