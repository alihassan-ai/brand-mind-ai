/**
 * NextHit Outcome Tracker
 * Tracks the outcomes of launched candidates to enable learning and feedback loops
 */
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
/**
 * Record a launch decision for a NextHit candidate
 */
export declare function recordLaunchDecision(candidateId: string, decision: 'launched' | 'rejected' | 'deferred', reason: string, launchDate?: Date): Promise<void>;
/**
 * Record actual performance metrics after launch
 */
export declare function recordLaunchPerformance(candidateId: string, metrics: {
    actualRevenue: number;
    actualUnits: number;
    refundRate: number;
}): Promise<void>;
/**
 * Record lessons learned from a launched candidate
 */
export declare function recordLessonsLearned(candidateId: string, lessons: string): Promise<void>;
/**
 * Analyze the accuracy of predictions for completed outcomes
 */
export declare function analyzeOutcomes(shopId: string): Promise<{
    totalLaunched: number;
    exceeded: number;
    met: number;
    missed: number;
    averageAccuracy: number;
    insights: string[];
}>;
/**
 * Get launch history with outcomes for a shop
 */
export declare function getLaunchHistory(shopId: string, limit?: number): Promise<any[]>;
/**
 * Apply learnings from outcomes to adjust future scoring weights
 * Returns suggested weight adjustments based on historical accuracy
 */
export declare function suggestWeightAdjustments(shopId: string): Promise<{
    suggestions: Array<{
        weight: string;
        currentValue: number;
        suggestedValue: number;
        reason: string;
    }>;
}>;
//# sourceMappingURL=outcome-tracker.d.ts.map