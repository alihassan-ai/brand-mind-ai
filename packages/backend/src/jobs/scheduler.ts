/**
 * Scheduled Jobs System
 * Framework for running periodic analysis jobs
 */

import { prisma } from '@brandmind/shared';
import { runFullSync } from '../sync/shopify-sync';
import { computeStoreDNA } from '@brandmind/brain/intelligence/store-dna';
import { detectAllGaps } from '@brandmind/brain/intelligence/gap-detector';
import { fetchTrendsForStore } from '@brandmind/brain/intelligence/trends';
import { calculateRFM, generateRetentionInsights } from '@brandmind/brain/agents/retention-agent';

// ============================================
// TYPES
// ============================================

export type JobType =
    | 'sync'
    | 'store_dna'
    | 'gap_detection'
    | 'trends'
    | 'rfm'
    | 'retention_insights'
    | 'full_analysis';

export interface JobResult {
    jobType: JobType;
    success: boolean;
    duration: number;
    result?: any;
    error?: string;
}

// ============================================
// JOB RUNNER
// ============================================

export async function runJob(shopId: string, jobType: JobType): Promise<JobResult> {
    const startTime = Date.now();

    try {
        let result: any;

        switch (jobType) {
            case 'sync':
                result = await runFullSync(shopId);
                break;

            case 'store_dna':
                result = await computeStoreDNA(shopId);
                break;

            case 'gap_detection':
                result = await detectAllGaps(shopId);
                break;

            case 'trends':
                result = await fetchTrendsForStore(shopId);
                break;

            case 'rfm':
                result = await calculateRFM(shopId);
                break;

            case 'retention_insights':
                result = await generateRetentionInsights(shopId);
                break;

            case 'full_analysis':
                // Run all analysis jobs in sequence
                const syncResult = await runFullSync(shopId);
                const dnaResult = await computeStoreDNA(shopId);
                const gapsResult = await detectAllGaps(shopId);
                const rfmResult = await calculateRFM(shopId);
                result = { sync: syncResult, dna: dnaResult, gaps: gapsResult, rfm: rfmResult };
                break;

            default:
                throw new Error(`Unknown job type: ${jobType}`);
        }

        const duration = Date.now() - startTime;

        // Log job execution
        await prisma.agentExecution.create({
            data: {
                shopId,
                agentType: `job_${jobType}`,
                triggerType: 'manual',
                status: 'completed',
                completedAt: new Date(),
                inputContext: { jobType },
                outputResult: { success: true, resultSummary: summarizeResult(result) },
                latencyMs: duration,
            },
        });

        return { jobType, success: true, duration, result };

    } catch (error: any) {
        const duration = Date.now() - startTime;

        // Log error
        await prisma.agentExecution.create({
            data: {
                shopId,
                agentType: `job_${jobType}`,
                triggerType: 'manual',
                status: 'failed',
                completedAt: new Date(),
                inputContext: { jobType },
                errorMessage: error.message,
                latencyMs: duration,
            },
        });

        return { jobType, success: false, duration, error: error.message };
    }
}

// ============================================
// BATCH JOB RUNNER
// ============================================

export async function runDailyJobs(shopId: string): Promise<JobResult[]> {
    const jobs: JobType[] = ['sync', 'store_dna', 'gap_detection'];
    const results: JobResult[] = [];

    for (const job of jobs) {
        const result = await runJob(shopId, job);
        results.push(result);

        // If sync fails, skip dependent jobs
        if (job === 'sync' && !result.success) {
            break;
        }
    }

    return results;
}

export async function runWeeklyJobs(shopId: string): Promise<JobResult[]> {
    const jobs: JobType[] = ['trends', 'rfm', 'retention_insights'];
    const results: JobResult[] = [];

    for (const job of jobs) {
        const result = await runJob(shopId, job);
        results.push(result);
    }

    return results;
}

// ============================================
// HELPERS
// ============================================

function summarizeResult(result: any): string {
    if (!result) return 'No result';

    if (typeof result === 'object') {
        if (result.products !== undefined) {
            return `Synced: ${result.products} products, ${result.orders} orders`;
        }
        if (result.summary?.totalGaps !== undefined) {
            return `Detected ${result.summary.totalGaps} gaps`;
        }
        if (Array.isArray(result)) {
            return `Processed ${result.length} items`;
        }
    }

    return 'Completed';
}

// ============================================
// JOB STATUS
// ============================================

export async function getJobHistory(shopId: string, limit: number = 20): Promise<any[]> {
    return prisma.agentExecution.findMany({
        where: {
            shopId,
            agentType: { startsWith: 'job_' },
        },
        orderBy: { startedAt: 'desc' },
        take: limit,
    });
}

export async function getLastJobRun(shopId: string, jobType: JobType): Promise<Date | null> {
    const lastRun = await prisma.agentExecution.findFirst({
        where: {
            shopId,
            agentType: `job_${jobType}`,
            status: 'completed',
        },
        orderBy: { completedAt: 'desc' },
        select: { completedAt: true },
    });

    return lastRun?.completedAt || null;
}
