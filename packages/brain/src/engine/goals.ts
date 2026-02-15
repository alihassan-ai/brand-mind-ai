import { prisma } from '@brandmind/shared';

export enum GoalType {
    REVENUE_GROWTH = 'REVENUE_GROWTH',
    REFUND_REDUCTION = 'REFUND_REDUCTION',
    AOV_GROWTH = 'AOV_GROWTH',
    ACQUISITION = 'ACQUISITION',
}

export interface GoalWeights {
    revenueWeight: number;
    refundWeight: number;
    aovWeight: number;
    riskWeight: number;
}

export async function getGoalWeights(shopId: string): Promise<GoalWeights> {
    const activeGoal = await prisma.goal.findFirst({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
    });

    if (!activeGoal) {
        return { revenueWeight: 1, refundWeight: 1, aovWeight: 1, riskWeight: 1 };
    }

    switch (activeGoal.type as GoalType) {
        case GoalType.REVENUE_GROWTH:
            return { revenueWeight: 2.0, refundWeight: 0.8, aovWeight: 1.5, riskWeight: 1.0 };
        case GoalType.REFUND_REDUCTION:
            return { revenueWeight: 0.8, refundWeight: 2.5, aovWeight: 1.0, riskWeight: 1.5 };
        case GoalType.AOV_GROWTH:
            return { revenueWeight: 1.2, refundWeight: 1.0, aovWeight: 2.5, riskWeight: 1.0 };
        default:
            return { revenueWeight: 1, refundWeight: 1, aovWeight: 1, riskWeight: 1 };
    }
}

export async function setGoal(shopId: string, type: GoalType, params: any) {
    return await prisma.goal.create({
        data: {
            shopId,
            type,
            targetValue: params.targetValue,
            timeHorizonDays: params.timeHorizonDays,
            constraints: params.constraints || {},
            priority: params.priority || 3,
        },
    });
}
