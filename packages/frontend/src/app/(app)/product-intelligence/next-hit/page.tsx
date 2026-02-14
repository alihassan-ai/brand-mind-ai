import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/nexthit/HeroSection";
import { HitCard } from "@/components/nexthit/HitCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { generateNextHit } from "@/app/actions/nexthit";
import { DataProgressDashboard } from "@/components/FeatureGate";
import { DNACompletenessSection } from "@/components/nexthit/DNACompletenessSection";
import { getDataSufficiency, checkDNACompleteness, getStrategyRecommendation, STRATEGY_INFO, seedDNAFromShopify } from "@brandmind/brain";
import {
  RefreshCw,
  Filter,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Target
} from "lucide-react";

export default async function NextHitsPage() {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    redirect("/onboarding");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    redirect("/onboarding");
  }

  // Check data sufficiency
  const sufficiency = await getDataSufficiency(shop.id);

  // Check if store has enough data for NextHit predictions
  const isDataSufficient = sufficiency?.sufficient ?? false;
  const nextHitBlocked = sufficiency?.blockers.some(
    b => b.feature === "nextHitPredictions" || b.feature === "all"
  );

  // Ensure StoreDNA exists if we have sufficient data
  let dna = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });
  if (!dna && isDataSufficient && !nextHitBlocked) {
    await seedDNAFromShopify(shop.id);
    dna = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });
  }

  // Now check DNA completeness and strategy
  const [dnaCompleteness, strategyRecommendation] = await Promise.all([
    checkDNACompleteness(shop.id),
    getStrategyRecommendation(shop.id)
  ]);

  // Only fetch candidates if data is sufficient
  const candidates = isDataSufficient && !nextHitBlocked
    ? await prisma.nextHitCandidate.findMany({
      where: { shopId: shop.id },
      orderBy: { confidence: "desc" },
      take: 20,
    })
    : [];

  const topCandidate = candidates.length > 0 ? candidates[0] : null;
  const secondaryHits = candidates.length > 1 ? candidates.slice(1) : [];

  // Get strategy info for display
  const currentStrategy = strategyRecommendation?.primaryStrategy;
  const strategyInfo = currentStrategy ? STRATEGY_INFO[currentStrategy] : null;

  return (
    <div className="space-y-16">

        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-3 py-1 border-[var(--border)] text-[var(--primary)] text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 mr-2" />
              Artificial Intelligence
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
              Next <span className="text-[var(--primary)] text-glow-amber">Hits</span>
            </h1>
            <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed">
              Proprietary forecasting engine analyzing store DNA and global trends
              to predict your next best-selling product launch.
            </p>
          </div>

          {/* Only show action buttons when data is sufficient */}
          {isDataSufficient && !nextHitBlocked && (
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
                Filter
              </Button>

              <form action={generateNextHit}>
                <Button type="submit" className="gap-2 px-8 py-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-black font-clash font-bold text-sm shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Predictions
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Data Insufficient - Show Progress Dashboard */}
        {(!isDataSufficient || nextHitBlocked) && sufficiency && (
          <DataProgressDashboard
            sufficiency={{
              ...sufficiency,
              blockers: sufficiency.blockers.map(b => ({
                ...b,
                estimatedReadyDate: b.estimatedReadyDate?.toISOString(),
              })),
            }}
          />
        )}

        {/* Strategy Recommendation Banner */}
        {isDataSufficient && !nextHitBlocked && strategyInfo && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-clash font-bold text-[var(--foreground)]">
                    Recommended Strategy: {strategyInfo.name}
                  </h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none">
                    {Math.round((strategyRecommendation?.confidence ?? 0) * 100)}% Confidence
                  </Badge>
                </div>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {strategyInfo.description}
                </p>
                {strategyRecommendation?.reasoning && strategyRecommendation.reasoning.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {strategyRecommendation.reasoning.map((reason: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DNA Completeness Alert - Show when data is sufficient but DNA incomplete */}
        {isDataSufficient && !nextHitBlocked && dnaCompleteness && (
          <DNACompletenessSection
            overallScore={dnaCompleteness.overallScore}
            isActionable={dnaCompleteness.isActionable}
            userActionRequired={dnaCompleteness.userActionRequired}
          />
        )}

        {/* Main Content - Only show when data is sufficient */}
        {isDataSufficient && !nextHitBlocked && (
          <>
            {/* Hero Section - Top Ranked Hit */}
            {topCandidate ? (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <HeroSection topCandidate={topCandidate as any} />
              </section>
            ) : (
              <div className="py-32 rounded-[2.5rem] bg-[var(--background-card)] border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
                  <TrendingUp className="w-10 h-10 opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-clash font-bold text-[var(--foreground)]">No Predictions Generated</h3>
                  <p className="text-[var(--muted-foreground)] max-w-sm mx-auto italic">
                    Our engine is ready to analyze your store data. Click regenerate to identify your next market opportunities.
                  </p>
                </div>
                <form action={generateNextHit}>
                  <Button className="px-8 py-4 bg-[var(--primary)] text-black font-clash font-bold rounded-2xl hover:bg-[var(--primary)]/90 transition-all shadow-xl">
                    Generate Initial Analysis
                  </Button>
                </form>
              </div>
            )}

            {/* Secondary Hits Grid */}
            {secondaryHits.length > 0 && (
              <div className="space-y-8 pt-8">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                  <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
                    <ChevronRight className="w-6 h-6 text-[var(--primary)]" />
                    Secondary Opportunities
                  </h2>
                  <span className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-widest">{secondaryHits.length} Candidates Identified</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {secondaryHits.map((candidate, idx) => (
                    <div
                      key={candidate.id}
                      className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      <HitCard candidate={candidate as any} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
}

