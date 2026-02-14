import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import {
  ExecutiveCard,
  DistributionChart,
  ExecutiveBadge
} from "@/components/ExecutiveUI";
import { DataProgressDashboard } from "@/components/FeatureGate";
import { DNACompletenessSection } from "@/components/nexthit/DNACompletenessSection";
import { getDataSufficiency, checkDNACompleteness, seedDNAFromShopify } from "@brandmind/brain";
import {
  Tag,
  Layers,
  Users,
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { getCurrencySymbol, formatCurrency } from "@/lib/formatter";

export default async function StoreDNAPage() {
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
  const isBlocked = sufficiency?.blockers.some(b => b.feature === "all");

  // Check DNA completeness
  const dnaCompleteness = await checkDNACompleteness(shop.id);

  // If DNA doesn't exist but we have data, try to seed it
  let dna = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });
  if (!dna && !isBlocked) {
    await seedDNAFromShopify(shop.id);
    dna = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });
  }

  const currencyCode = (shop as any).currencyCode || "USD";
  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <Layers className="w-3 h-3" />
            Intelligence Module / DNA
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight text-[var(--foreground)]">
            Store <span className="text-[var(--primary)]">DNA</span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed italic">
            Structural analysis of your brand&apos;s operational core. Mapping price velocity, customer segments, and seasonality.
          </p>
        </div>

        {!isBlocked && (
          <form action="/api/intelligence/store-dna" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border)] hover:bg-[var(--foreground)]/10 text-[var(--foreground)] font-clash font-bold text-sm transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              {dna ? "Refresh Spectrum" : "Analyze Store DNA"}
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

      {/* DNA Completeness Section - Allow users to fill missing fields */}
      {!isBlocked && dnaCompleteness && (
        <DNACompletenessSection
          overallScore={dnaCompleteness.overallScore}
          isActionable={dnaCompleteness.isActionable}
          userActionRequired={dnaCompleteness.userActionRequired}
        />
      )}

      {!isBlocked && dna ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <ExecutiveCard
            title="Price Distribution"
            subtitle="Market positioning across bands"
            icon={<Tag className="w-6 h-6 text-blue-400" />}
            badge="Spectral"
          >
            <DistributionChart
              unit={currencySymbol}
              items={
                Array.isArray(dna.priceBands)
                  ? (dna.priceBands as any[]).map(b => ({
                    label: b.band,
                    value: b.count || b.orders || 0,
                    color: "bg-blue-500"
                  }))
                  : dna.priceBands
                    ? [
                      { label: "Budget", value: (dna.priceBands as any).low || 0, color: "bg-blue-400" },
                      { label: "Mid-Range", value: (dna.priceBands as any).mid || 0, color: "bg-blue-500" },
                      { label: "Premium", value: (dna.priceBands as any).high || 0, color: "bg-blue-600" },
                    ]
                    : []
              }
            />
          </ExecutiveCard>

          <ExecutiveCard
            title="Product Classification"
            subtitle="Catalog volume by category"
            icon={<Layers className="w-6 h-6 text-purple-400" />}
          >
            <DistributionChart
              items={(dna.topPerformingTypes as any[] || []).slice(0, 5).map(t => ({
                label: t.type || "Other",
                value: Math.round(t.revenue || 0),
                color: "bg-purple-500"
              }))}
              unit={currencySymbol}
            />
          </ExecutiveCard>

          <ExecutiveCard
            title="Entity Performance"
            subtitle="HHI / Vendor concentration"
            icon={<BarChart3 className="w-6 h-6 text-emerald-400" />}
          >
            <div className="space-y-6 py-4 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
                <div className="text-2xl font-clash font-bold text-emerald-400">
                  {Math.round((1 - (dna.vendorConcentration || 0)) * 100)}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[var(--foreground)] font-clash font-bold text-lg uppercase">Vendor Diversity</p>
                <p className="text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  {(dna.vendorConcentration || 0) < 0.25 ? "Healthy supply chain redundancy" : "High dependency on specific nodes"}
                </p>
              </div>
            </div>
          </ExecutiveCard>

          <ExecutiveCard
            title="Revenue Seasonality"
            subtitle="Trailing 12-month pulse"
            icon={<Calendar className="w-6 h-6 text-[var(--primary)]" />}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 h-48 items-end pt-8">
              {(dna.seasonalityCurve as any[] || []).map((m, i) => (
                <div key={i} className="space-y-2 group/bar">
                  <div
                    className="w-full bg-[var(--foreground)]/5 group-hover/bar:bg-[var(--primary)]/40 border border-[var(--border)] rounded-t-lg transition-all duration-700"
                    style={{ height: `${Math.max(10, Math.min(100, m.revenueIndex * 80))}%` }}
                  />
                  <div className="text-[8px] font-bold text-[var(--muted-foreground)] text-center uppercase tracking-tighter">{m.monthName}</div>
                </div>
              ))}
            </div>
          </ExecutiveCard>

          <ExecutiveCard
            title="Brand Health Aura"
            subtitle="Composite analysis signal"
            icon={<Sparkles className="w-6 h-6 text-pink-400" />}
          >
            <div className="space-y-8 py-4">
              <div className="space-y-2 text-center">
                <div className="text-5xl font-clash font-bold text-[var(--foreground)] tracking-tighter">
                  {Math.round(((dna.catalogHealthScore || 0) + (dna.customerHealthScore || 0)) / 2)}
                </div>
                <ExecutiveBadge variant="gold">Optimal State</ExecutiveBadge>
              </div>
              <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-tighter">Catalog</div>
                  <div className="text-lg font-clash font-bold text-[var(--foreground)]">{dna.catalogHealthScore || 0}%</div>
                </div>
                <div className="text-center border-l border-[var(--border)]">
                  <div className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-tighter">Engagement</div>
                  <div className="text-lg font-clash font-bold text-[var(--foreground)]">{dna.customerHealthScore || 0}%</div>
                </div>
              </div>
            </div>
          </ExecutiveCard>

        </div>
      ) : !isBlocked && (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-[2.5rem] p-24 text-center space-y-6">
          <Layers className="w-16 h-16 text-slate-700 mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-clash font-bold text-[var(--foreground)]">Baseline Data Required</p>
            <p className="text-[var(--muted-foreground)] max-w-sm mx-auto italic">Intelligence is currently offline. Analyze store data to populate your brand&apos;s genetic spectrum.</p>
          </div>
        </div>
      )}
    </div>
  );
}
