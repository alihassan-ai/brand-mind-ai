'use server';

import { redirect } from 'next/navigation';
import { getCurrentShop } from '@brandmind/backend/auth/session';
import { prisma } from '@brandmind/shared';
import {
    runBackgroundAnalysis,
    generateCandidates,
    scoreAndFilterCandidates,
    scoreCandidateWithAudit,
    runDeepAnalysis,
    ScoringInput
} from '@brandmind/brain';
import { computeStoreDNA } from '@brandmind/brain/intelligence/store-dna';
import { getTrendData } from '@brandmind/brain/intelligence/trends';

export async function generateNextHit() {
    console.log('[NextHit] Starting generation via Server Action');

    const shop = await getCurrentShop();

    if (!shop) {
        console.log('[NextHit] No shop found in session');
        redirect('/onboarding');
    }

    try {
        console.log(`[NextHit] Generating for ${shop.shopDomain}`);

        // Step 0: Aggressive cleanup
        await prisma.nextHitOutcome.deleteMany({
            where: {
                candidate: {
                    shopId: shop.id,
                }
            }
        });

        await prisma.scoringAudit.deleteMany({
            where: {
                candidate: {
                    shopId: shop.id
                }
            }
        });

        await prisma.nextHitAnalysis.deleteMany({
            where: {
                candidate: {
                    shopId: shop.id,
                }
            }
        });

        await prisma.nextHitCandidate.deleteMany({
            where: {
                shopId: shop.id,
            }
        });

        // Step 1: Run background analysis to update pattern memory
        await runBackgroundAnalysis(shop.id);

        // Step 1.5: Refresh StoreDNA to ensure topPerformingTypes is populated
        const { seedDNAFromShopify } = await import('@brandmind/brain');
        await seedDNAFromShopify(shop.id);

        // Step 2: Generate raw candidates
        const rawCandidates = await generateCandidates(shop.id);

        // Step 3: Score and filter to top 10 (legacy scorer)
        const top10 = await scoreAndFilterCandidates(shop.id, rawCandidates);

        // Step 3.5: Run deterministic scoring with audit trail on top candidates
        let storeDNA = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });

        // If StoreDNA is missing, compute it now
        if (!storeDNA) {
            console.log(`[NextHit] StoreDNA missing for ${shop.shopDomain}, computing now...`);
            storeDNA = await computeStoreDNA(shop.id);
        }

        const catalogGaps = await prisma.catalogGap.findMany({ where: { shopId: shop.id, status: 'active' } });

        for (const candidate of top10.slice(0, 5)) {
            const dbCandidate = await prisma.nextHitCandidate.findFirst({
                where: { shopId: shop.id, title: candidate.title },
            });
            if (dbCandidate) {
                // Extract keyword for trend lookup
                const evidence = candidate.patternEvidence as any;
                const keyword = evidence.category || evidence.baseCategory || evidence.winningColor || evidence.gapType || candidate.title.split(':')[1]?.trim() || candidate.title;

                let trendResult = null;
                try {
                    // Use the cached/live trend fetcher
                    trendResult = await getTrendData(keyword, 'US');
                } catch (e) {
                    console.error(`[NextHit] Trend fetch failed for ${keyword}:`, e);
                }

                const scoringInput: ScoringInput = {
                    candidateId: dbCandidate.id,
                    candidateTitle: candidate.title,
                    candidateType: candidate.patternSource || 'unknown',
                    shopId: shop.id,
                    storeDNA: storeDNA as any,
                    catalogGaps,
                    trendData: trendResult,
                    seasonalityData: (storeDNA as any)?.seasonalityCurve || [],
                };
                await scoreCandidateWithAudit(scoringInput);
            }
        }

        // Step 4: Run deep analysis on top 3
        for (const candidate of top10.slice(0, 3)) {
            const dbCandidate = await prisma.nextHitCandidate.findFirst({
                where: { shopId: shop.id, title: candidate.title },
            });
            if (dbCandidate) {
                await runDeepAnalysis(dbCandidate.id);
            }
        }

        console.log(`[NextHit] Generated ${top10.length} candidates for ${shop.shopDomain}`);

    } catch (error: any) {
        console.error('[NextHit] Generation error:', error);
        throw new Error(`Generation failed: ${error.message}`);
    }

    redirect('/nexthits');
}
