import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import {
  ExecutiveCard,
  ExecutiveBadge
} from "@/components/ExecutiveUI";
import {
  Target,
  Zap,
  ShieldAlert,
  TrendingUp,
  ScanSearch,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { formatCurrency } from "@/lib/formatter";

export default async function GapsPage() {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    redirect("/onboarding");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    redirect("/onboarding");
  }

  const gaps = await prisma.catalogGap.findMany({
    where: { shopId: shop.id, status: "active" },
    orderBy: { confidence: "desc" },
  });

  const currencyCode = (shop as any).currencyCode || "USD";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--primary-border)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <ScanSearch className="w-3 h-3" />
            Intelligence Module / Gap Detection
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight text-[var(--foreground)]">
            Market <span className="text-[var(--primary)] text-glow-amber">Gaps</span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed italic">
            Identifying underserved pricing bands and category adjacencies where your catalog is structurally exposed or missing volume.
          </p>
        </div>

        <form action="/api/intelligence/gaps" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-clash font-bold text-sm transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]"
          >
            <ScanSearch className="w-4 h-4" />
            Initialize Deep Scan
          </button>
        </form>
      </div>

      {gaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gaps.map((gap) => (
            <GapDossier key={gap.id} gap={gap} currencyCode={currencyCode} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-[2.5rem] p-24 text-center space-y-6">
          <Target className="w-16 h-16 text-[var(--muted)] mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-clash font-bold text-[var(--foreground)]">No Strategic Gaps Identified</p>
            <p className="text-[var(--muted-foreground)] max-w-sm mx-auto italic">Your current catalog architecture is aligned with detected market patterns. Run a fresh scan to check for new volatility.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GapDossier({ gap, currencyCode }: { gap: any, currencyCode: string }) {
  const typeConfigs: Record<string, { icon: React.ReactNode, variant: any }> = {
    price_gap: {
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      variant: "blue"
    },
    category_gap: {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      variant: "purple"
    },
    variant_gap: {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      variant: "emerald"
    },
    seasonal_gap: {
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      variant: "rose"
    },
  };

  const config = typeConfigs[gap.gapType] || typeConfigs.category_gap;

  return (
    <ExecutiveCard
      title={gap.gapType === "price_gap" ? "Pricing Exposure" : "Strategic Gap"}
      subtitle={`Dossier Node: ${gap.id.substring(0, 8)}`}
      icon={config.icon}
      badge={`${Math.round(gap.confidence * 100)}% Confidence`}
    >
      <div className="space-y-6 flex flex-col h-full">
        <div className="space-y-3">
          <div className="flex gap-2">
            <ExecutiveBadge variant={config.variant === 'gold' ? 'gold' : config.variant}>
              {gap.gapType.split('_')[0].toUpperCase()}
            </ExecutiveBadge>
            {gap.potentialRevenue > 10000 && <ExecutiveBadge variant="gold">High Impact</ExecutiveBadge>}
          </div>
          <h3 className="text-[var(--foreground)] font-clash font-bold text-lg leading-snug">
            {gap.description || "Unidentified Opportunity"}
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest">Suggested Action</span>
          <p className="text-sm text-slate-300 italic leading-relaxed">
            {gap.suggestedAction}
          </p>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--border)]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest block mb-1">Impact Potential</span>
            <span className="text-xl font-clash font-bold text-emerald-400">
              {gap.potentialRevenue ? formatCurrency(gap.potentialRevenue, currencyCode) : "Market Fit"}
            </span>
          </div>

          <button className="p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] hover:bg-white/10 transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)] group/btn">
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </ExecutiveCard>
  );
}
