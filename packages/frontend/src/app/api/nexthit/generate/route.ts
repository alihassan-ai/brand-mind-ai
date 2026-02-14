import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import { runBackgroundAnalysis } from "@brandmind/brain/nexthit/background-analyzer";
import { generateCandidates } from "@brandmind/brain/nexthit/candidate-generator";
import { scoreAndFilterCandidates } from "@brandmind/brain/nexthit/candidate-scorer";
import { runDeepAnalysis } from "@brandmind/brain/nexthit/deep-analyzer";
import { computeStoreDNA } from "@brandmind/brain/intelligence/store-dna";
import { detectAllGaps } from "@brandmind/brain/intelligence/gap-detector";

export async function POST(req: NextRequest) {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    console.log(`[NextHit] Starting generation for ${shopDomain}`);

    // Step 0: Ensure StoreDNA exists (needed for scoring)
    let storeDNA = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });
    if (!storeDNA) {
      console.log(`[NextHit] StoreDNA missing, computing now...`);
      storeDNA = await computeStoreDNA(shop.id);
    }

    // Step 1: Run background pattern analysis
    console.log(`[NextHit] Running background pattern analysis...`);
    await runBackgroundAnalysis(shop.id);

    // Step 2: Detect catalog gaps
    console.log(`[NextHit] Detecting catalog gaps...`);
    await detectAllGaps(shop.id);

    // Step 3: Generate raw candidates from patterns and gaps
    console.log(`[NextHit] Generating candidates...`);
    const rawCandidates = await generateCandidates(shop.id);

    // Step 4: Score candidates using unified formula v1.0.0
    // (Includes store DNA, gap fill, trend momentum, margin, competition, seasonality)
    console.log(`[NextHit] Scoring ${rawCandidates.length} candidates with unified formula...`);
    const top10 = await scoreAndFilterCandidates(shop.id, rawCandidates);

    // Step 5: Run deep risk analysis on top 3 candidates
    console.log(`[NextHit] Running deep analysis on top 3...`);
    for (const candidate of top10.slice(0, 3)) {
      const dbCandidate = await prisma.nextHitCandidate.findFirst({
        where: { shopId: shop.id, title: candidate.title },
      });
      if (dbCandidate) {
        await runDeepAnalysis(dbCandidate.id);
      }
    }

    console.log(`[NextHit] Generation complete. ${top10.length} candidates for ${shopDomain}`);

    return NextResponse.redirect(new URL("/nexthits", req.url));
  } catch (error: any) {
    console.error("[NextHit] Generation error:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
