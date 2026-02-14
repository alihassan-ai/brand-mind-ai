import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import {
  ExecutiveCard,
  DistributionChart,
  ExecutiveBadge
} from "@/components/ExecutiveUI";
import { DataProgressDashboard } from "@/components/FeatureGate";
import { getDataSufficiency } from "@brandmind/brain";
import {
  Users,
  TrendingDown,
  Zap,
  Crown,
  AlertCircle,
  Mail,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { formatCurrency } from "@/lib/formatter";

export default async function RetentionPage() {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    redirect("/onboarding");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    redirect("/onboarding");
  }

  // Check data sufficiency for customer segmentation
  const sufficiency = await getDataSufficiency(shop.id);
  const isBlocked = sufficiency?.blockers.some(
    b => b.feature === "customerSegmentation" || b.feature === "all"
  );

  const insights = isBlocked ? [] : await prisma.retentionInsight.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const rfmStats = isBlocked ? [] : await prisma.customerRFM.groupBy({
    by: ["rfmSegment"],
    where: { shopId: shop.id },
    _count: true,
    _sum: {
      totalSpent: true
    }
  });

  const totalCustomers = rfmStats.reduce((sum, s) => sum + s._count, 0);
  const currencyCode = (shop as any).currencyCode || "USD";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--primary-border)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <Users className="w-3 h-3" />
            Intelligence Module / Retention
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight text-[var(--foreground)]">
            Customer <span className="text-[var(--primary)] text-glow-amber">Portfolio</span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed italic">
            Analyzing customer lifetime value distribution and churn risk. Deploying AI-powered win-back and VIP maintenance strategies.
          </p>
        </div>

        {!isBlocked && (
          <form action="/api/agents/retention" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-[var(--foreground)] font-clash font-bold text-sm transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Analysis
            </button>
          </form>
        )}
      </div>

      {/* Data Insufficient - Show Progress Dashboard */}
      {isBlocked && sufficiency && (
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

      {!isBlocked && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExecutiveCard
              title="Segment Mix"
              subtitle="Customer volume by RFM tier"
              icon={<Users className="w-6 h-6 text-blue-400" />}
              badge={`${totalCustomers} Profiles`}
              className="md:col-span-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
                <DistributionChart
                  items={rfmStats.slice(0, 5).map(s => ({
                    label: s.rfmSegment.replace('_', ' '),
                    value: s._count,
                    color: getSegmentColor(s.rfmSegment)
                  }))}
                />
                <DistributionChart
                  items={rfmStats.slice(5).map(s => ({
                    label: s.rfmSegment.replace('_', ' '),
                    value: s._count,
                    color: getSegmentColor(s.rfmSegment)
                  }))}
                />
              </div>
            </ExecutiveCard>

            <ExecutiveCard
              title="Revenue Exposure"
              subtitle="Value at risk from churn"
              icon={<AlertCircle className="w-6 h-6 text-rose-400" />}
              badge="High Risk"
            >
              <div className="space-y-8 py-4">
                <div className="text-center">
                  <span className="text-5xl font-clash font-bold text-[var(--foreground)] leading-none">
                    {formatCurrency(
                      rfmStats.filter(s => ['at_risk', 'hibernating', 'lost'].includes(s.rfmSegment)).reduce((sum, s) => sum + (Number(s._sum.totalSpent) || 0), 0),
                      currencyCode,
                      { maximumFractionDigits: 0 }
                    )}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">Aggregated Risk Value</p>
                </div>
                <div className="pt-6 border-t border-[var(--border)] space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--muted-foreground)] font-medium italic">Detection Node</span>
                    <ExecutiveBadge variant="rose">Active Phase</ExecutiveBadge>
                  </div>
                </div>
              </div>
            </ExecutiveCard>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-clash font-bold text-[var(--foreground)] flex items-center gap-3">
              <Zap className="w-6 h-6 text-[var(--primary)]" />
              Strategic Playbooks
            </h2>

            {insights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {insights.map((insight) => (
                  <InsightPlaybook key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-[2.5rem] p-24 text-center space-y-6">
                <AlertCircle className="w-16 h-16 text-slate-700 mx-auto" />
                <div className="space-y-2">
                  <p className="text-xl font-clash font-bold text-[var(--foreground)]">No Active Playbooks</p>
                  <p className="text-slate-500 max-w-sm mx-auto italic">Intelligence is currently monitoring customer flow. Run a refresh to initialize win-back campaigns.</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function InsightPlaybook({ insight }: { insight: any }) {
  const isVIP = insight.segmentType === 'vip';
  const isLoss = insight.segmentType === 'at_risk' || insight.segmentType === 'dormant';

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 group bg-[var(--background-card)] flex flex-col h-full ${isVIP ? 'border-amber-500/20 hover:border-amber-500/40' :
        isLoss ? 'border-rose-500/20 hover:border-rose-500/40' :
          'border-[var(--border)] hover:border-white/10'
      }`}>
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10`}>
            {isVIP ? <Crown className="w-6 h-6 text-[var(--primary)]" /> :
              isLoss ? <TrendingDown className="w-6 h-6 text-rose-400" /> :
                <Zap className="w-6 h-6 text-blue-400" />}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{insight.segmentType.replace('_', ' ')} strategy</span>
            <h3 className="text-xl font-clash font-bold text-[var(--foreground)] mt-1">
              {insight.recommendedAction.split('with')[0]}
            </h3>
          </div>
        </div>
        <ExecutiveBadge variant={isVIP ? "gold" : isLoss ? "rose" : "blue"}>
          {Math.round(insight.confidence * 100)}% Confidence
        </ExecutiveBadge>
      </div>

      <div className="mb-8 flex-1">
        <p className="text-[var(--muted-foreground)] font-medium italic mb-6 leading-relaxed">&quot;{insight.recommendedAction}&quot;</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Impact Potential</span>
            <div className="text-lg font-clash font-bold text-emerald-400">+{Math.round(insight.expectedLift * 100)}% Lift</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Cohort Size</span>
            <div className="text-lg font-clash font-bold text-[var(--foreground)]">{insight.customerCount}</div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <Mail className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Email Channel</span>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[var(--foreground)] font-clash font-bold text-xs transition-all group-hover:bg-amber-500 group-hover:text-black">
          Deploy Campaign
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function getSegmentColor(segment: string): string {
  const colors: Record<string, string> = {
    champions: "bg-emerald-500",
    loyal: "bg-emerald-400",
    vip: "bg-amber-500",
    at_risk: "bg-rose-400",
    hibernating: "bg-rose-600",
    lost: "bg-slate-700",
    new: "bg-blue-400"
  };
  return colors[segment] || "bg-slate-500";
}
