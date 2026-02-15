import { getGoalWeights } from './goals';
export class EngineModule {
}
export class DecisionEngine {
    constructor() {
        this.modules = [];
    }
    registerModule(module) {
        this.modules.push(module);
    }
    async run(shopId) {
        const candidates = [];
        for (const module of this.modules) {
            try {
                const results = await module.run(shopId);
                candidates.push(...results);
            }
            catch (error) {
                console.error(`Module ${module.constructor.name} failed:`, error);
            }
        }
        return await this.rankCandidates(shopId, candidates);
    }
    async rankCandidates(shopId, candidates) {
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
            return Object.assign(Object.assign({}, c), { category, score: Math.round(score * 100) / 100, priorityBoost });
        })
            .sort((a, b) => {
            // Dangers always come first, then sort by score
            if (a.type === 'danger' && b.type !== 'danger')
                return -1;
            if (a.type !== 'danger' && b.type === 'danger')
                return 1;
            return b.score - a.score;
        });
    }
    inferCategory(candidate) {
        const title = candidate.title.toLowerCase();
        if (title.includes('refund') || title.includes('return'))
            return 'refund';
        if (title.includes('revenue') || title.includes('sales') || title.includes('restock'))
            return 'revenue';
        if (title.includes('bundle') || title.includes('aov') || title.includes('upsell'))
            return 'aov';
        if (title.includes('stock') || title.includes('risk') || title.includes('drop'))
            return 'risk';
        return 'general';
    }
}
