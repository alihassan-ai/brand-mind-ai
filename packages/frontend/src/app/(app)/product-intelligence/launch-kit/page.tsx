import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import {
  ExecutiveCard,
  ExecutiveBadge
} from "@/components/ExecutiveUI";
import { DataProgressDashboard } from "@/components/FeatureGate";
import { getDataSufficiency } from "@brandmind/brain";
import {
  Rocket,
  Type,
  Mail,
  Instagram,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { formatCurrency } from "@/lib/formatter";
import { CreateLaunchKitForm } from "@/components/launch-kit/CreateLaunchKitForm";

export default async function LaunchKitPage() {
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
  const isBlocked = sufficiency?.blockers.some(
    b => b.feature === "nextHitPredictions" || b.feature === "all"
  );

  const launchKits = isBlocked ? [] : await prisma.launchKit.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  const currencyCode = (shop as any).currencyCode || "USD";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--primary-border)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <Rocket className="w-3 h-3" />
            Intelligence Module / Launch Kit
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight text-[var(--foreground)]">
            Creative <span className="text-[var(--primary)]">Board</span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed italic">
            Automated creative assets, pricing safeguards, and rollout strategies for predicted product hits.
          </p>
        </div>
        {!isBlocked && <CreateLaunchKitForm />}
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

      {/* Main Content */}
      {!isBlocked && launchKits.length > 0 ? (
        <div className="space-y-20">
          {launchKits.map((kit) => (
            <LaunchKitDossier key={kit.id} kit={kit} currencyCode={currencyCode} />
          ))}
        </div>
      ) : !isBlocked && (
        <div className="space-y-8">
          <CreateLaunchKitForm />
          <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-[2.5rem] p-24 text-center space-y-6">
            <Rocket className="w-16 h-16 text-slate-700 mx-auto" />
            <div className="space-y-2">
              <p className="text-xl font-clash font-bold text-[var(--foreground)]">No Launch Kits Yet</p>
              <p className="text-slate-500 max-w-sm mx-auto italic">
                Create a launch kit for any product using the form above, or approve a Next Hit prediction to auto-generate one.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LaunchKitDossier({ kit, currencyCode }: { kit: any, currencyCode: string }) {
  const copy = kit.copyAssets as any || {};
  const pricing = kit.pricingStrategy as any || {};
  const strategy = kit.launchStrategy as any || {};

  return (
    <div className="space-y-10 group">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.25rem] bg-amber-500 flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)]">
            <Sparkles className="w-8 h-8 text-black fill-black" />
          </div>
          <div>
            <h2 className="text-3xl font-clash font-bold text-[var(--foreground)] uppercase tracking-tight">{kit.productName}</h2>
            <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <span>{kit.productType}</span>
              <span>•</span>
              <span>ID: {kit.id.substring(0, 8)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ExecutiveBadge variant="gold">Predicted Hit</ExecutiveBadge>
          <button className="px-6 py-3 rounded-xl bg-white text-black font-clash font-bold text-sm hover:bg-slate-200 transition-all">
            Execute Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Ad Assets */}
        <ExecutiveCard
          title="Social Concept"
          subtitle="Multi-channel creative sweep"
          icon={<Instagram className="w-6 h-6 text-rose-400" />}
        >
          <div className="space-y-6 pt-2">
            <div className="aspect-[4/5] rounded-3xl bg-[#121820] border border-white/10 overflow-hidden relative p-6 flex flex-col justify-end gap-3 group/ad">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <div className="w-12 h-1 rounded-full bg-amber-500/50" />
                <p className="text-[var(--foreground)] font-clash font-bold text-lg leading-tight uppercase">{copy.headline}</p>
                <p className="text-slate-300 text-xs font-medium italic">&quot;{copy.tagline}&quot;</p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest">Shop Now</span>
                <ChevronRight className="w-4 h-4 text-[var(--foreground)]" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Caption Sequences</span>
              {(copy.socialPosts || []).slice(0, 2).map((post: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[var(--muted-foreground)] italic">
                  {post}
                </div>
              ))}
            </div>
          </div>
        </ExecutiveCard>

        {/* Email Sequence */}
        <ExecutiveCard
          title="Retention Direct"
          subtitle="Email rollout draft"
          icon={<Mail className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-6 pt-2">
            <div className="p-6 rounded-3xl bg-[#121820] border border-white/10 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-600 tracking-tighter">Subject Line</span>
                <p className="text-sm font-bold text-[var(--foreground)]">{copy.emailSubject}</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed italic">{copy.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Target Segment</span>
                <span className="text-xs font-bold text-[var(--foreground)] uppercase">Champions</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Trigger</span>
                <span className="text-xs font-bold text-[var(--foreground)] uppercase">Pre-Launch</span>
              </div>
            </div>
          </div>
        </ExecutiveCard>

        {/* Pricing Shield & Strategy */}
        <ExecutiveCard
          title="Pricing Shield"
          subtitle="Competitive guardrails"
          icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
          badge="Optimized"
        >
          <div className="space-y-8 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entry MSRP</span>
                <div className="text-3xl font-clash font-bold text-[var(--foreground)]">
                  {formatCurrency(Number(kit.targetPrice), currencyCode, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intro Price</span>
                <div className="text-3xl font-clash font-bold text-[var(--primary)]">
                  {formatCurrency(Number(pricing.introPrice || 0), currencyCode, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 space-y-4">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Timing Protocol</span>
              </div>
              <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                {strategy?.timing?.recommendedLaunch || "Launch during peak momentum"}
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Primary Channel</span>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <Type className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-[var(--foreground)] uppercase tracking-tight">{strategy?.channels?.primary || "Digital Direct"}</span>
              </div>
            </div>
          </div>
        </ExecutiveCard>

      </div>
    </div>
  );
}
