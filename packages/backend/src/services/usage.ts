import { prisma } from '@brandmind/shared';

// OpenAI pricing per 1M tokens (as of 2024)
const PRICING: Record<string, { input: number; output: number }> = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    'text-embedding-3-small': { input: 0.02, output: 0 },
    'text-embedding-3-large': { input: 0.13, output: 0 },
};

interface UsageData {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export function calculateCost(model: string, usage: UsageData): number {
    const pricing = PRICING[model] || PRICING['gpt-4o-mini'];
    const inputCost = (usage.promptTokens / 1_000_000) * pricing.input;
    const outputCost = (usage.completionTokens / 1_000_000) * pricing.output;
    return inputCost + outputCost;
}

export async function logUsage(params: {
    userId: string;
    endpoint: string;
    model: string;
    usage: UsageData;
    metadata?: Record<string, any>;
}) {
    const cost = calculateCost(params.model, params.usage);

    try {
        await prisma.usageLog.create({
            data: {
                userId: params.userId,
                endpoint: params.endpoint,
                model: params.model,
                promptTokens: params.usage.promptTokens,
                completionTokens: params.usage.completionTokens,
                totalTokens: params.usage.totalTokens,
                cost: cost,
                metadata: params.metadata,
            },
        });

        console.log(`[Usage] Logged: ${params.endpoint} - ${params.usage.totalTokens} tokens - $${cost.toFixed(6)}`);
    } catch (error) {
        console.error('[Usage] Failed to log usage:', error);
    }

    return cost;
}

export async function getUserUsage(userId: string) {
    const logs = await prisma.usageLog.aggregate({
        where: { userId },
        _sum: {
            promptTokens: true,
            completionTokens: true,
            totalTokens: true,
            cost: true,
        },
        _count: true,
    });

    return {
        totalRequests: logs._count,
        promptTokens: logs._sum.promptTokens || 0,
        completionTokens: logs._sum.completionTokens || 0,
        totalTokens: logs._sum.totalTokens || 0,
        totalCost: Number(logs._sum.cost) || 0,
    };
}

export async function getAllUsageStats() {
    const userStats = await prisma.usageLog.groupBy({
        by: ['userId'],
        _sum: {
            promptTokens: true,
            completionTokens: true,
            totalTokens: true,
            cost: true,
        },
        _count: true,
    });

    const totalStats = await prisma.usageLog.aggregate({
        _sum: {
            promptTokens: true,
            completionTokens: true,
            totalTokens: true,
            cost: true,
        },
        _count: true,
    });

    return {
        byUser: userStats,
        total: {
            totalRequests: totalStats._count,
            promptTokens: totalStats._sum.promptTokens || 0,
            completionTokens: totalStats._sum.completionTokens || 0,
            totalTokens: totalStats._sum.totalTokens || 0,
            totalCost: Number(totalStats._sum.cost) || 0,
        },
    };
}
