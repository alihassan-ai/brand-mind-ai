import { prisma } from '@brandmind/shared';
import { getGoalWeights, GoalType } from './goals';

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

export abstract class EngineModule {
    abstract run(shopId: string): Promise<Candidate[]>;
}

export class DecisionEngine {
    private modules: EngineModule[] = [];

    registerModule(module: EngineModule) {
        this.modules.push(module);
    }

    async run(shopId: string): Promise<RankedCandidate[]> {
        const candidates: Candidate[] = [];

        for (const module of this.modules) {
            try {
                const results = await module.run(shopId);
                candidates.push(...results);
            } catch (error) {
                console.error(`Module ${module.constructor.name} failed:`, error);
            }
        }

        return await this.rankCandidates(shopId, candidates);
    }

    private async rankCandidates(shopId: string, candidates: Candidate[]): Promise<RankedCandidate[]> {
        const weights = await getGoalWeights(shopId);

        return candidates
            .map(c => {
                // Determine category weight based on candidate type and title
                let categoryWeight = 1.0;
                const category = this.inferCategory(c);

                switch (category) {
                    case 'revenue':
                        categoryWeight = weights.revenueWeight;
                        break;
                    case 'refund':
                        categoryWeight = weights.refundWeight;
                        break;
                    case 'aov':
                        categoryWeight = weights.aovWeight;
                        break;
                    case 'risk':
                        categoryWeight = weights.riskWeight;
                        break;
                }

                // Priority boost for dangers
                const priorityBoost = c.type === 'danger' ? 1.2 : 1.0;

                // Final score: (Alignment * Category Weight * Priority Boost) * Confidence
                const score = (c.goal_alignment * categoryWeight * priorityBoost) * c.confidence;

                return {
                    ...c,
                    category,
                    score: Math.round(score * 100) / 100,
                    priorityBoost,
                };
            })
            .sort((a, b) => {
                // Dangers always come first, then sort by score
                if (a.type === 'danger' && b.type !== 'danger') return -1;
                if (a.type !== 'danger' && b.type === 'danger') return 1;
                return b.score - a.score;
            });
    }

    private inferCategory(candidate: Candidate): 'revenue' | 'refund' | 'aov' | 'risk' | 'general' {
        const title = candidate.title.toLowerCase();

        if (title.includes('refund') || title.includes('return')) return 'refund';
        if (title.includes('revenue') || title.includes('sales') || title.includes('restock')) return 'revenue';
        if (title.includes('bundle') || title.includes('aov') || title.includes('upsell')) return 'aov';
        if (title.includes('stock') || title.includes('risk') || title.includes('drop')) return 'risk';

        return 'general';
    }
}
