export type CandidateType = 'opportunity' | 'danger';
export interface Candidate {
    type: CandidateType;
    title: string;
    recommended_action: string;
    impact_estimate: string;
    confidence: number;
    effort: 'low' | 'medium' | 'high';
    risk: 'low' | 'medium' | 'high';
    evidence: any;
    assumptions: string[];
    goal_alignment: number;
    category?: 'revenue' | 'refund' | 'aov' | 'risk' | 'general';
}
export interface RankedCandidate extends Candidate {
    score: number;
    priorityBoost: number;
}
export declare abstract class EngineModule {
    abstract run(shopId: string): Promise<Candidate[]>;
}
export declare class DecisionEngine {
    private modules;
    registerModule(module: EngineModule): void;
    run(shopId: string): Promise<RankedCandidate[]>;
    private rankCandidates;
    private inferCategory;
}
//# sourceMappingURL=decision.d.ts.map