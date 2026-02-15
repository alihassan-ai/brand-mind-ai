import { Prisma } from '@prisma/client';
export declare function runDeepAnalysis(candidateId: string): Promise<{
    id: string;
    createdAt: Date;
    candidateId: string;
    demandRisk: Prisma.JsonValue;
    refundRisk: Prisma.JsonValue;
    brandRisk: Prisma.JsonValue;
    operationalRisk: Prisma.JsonValue;
    cannibalizationRisk: Prisma.JsonValue;
    revenueScenarios: Prisma.JsonValue;
    testPath: Prisma.JsonValue;
}>;
//# sourceMappingURL=deep-analyzer.d.ts.map