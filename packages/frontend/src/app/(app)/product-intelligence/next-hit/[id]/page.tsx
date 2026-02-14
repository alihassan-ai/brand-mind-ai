import { prisma } from "@brandmind/shared";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
  Search,
  PackageSearch,
  CheckCircle2
} from "lucide-react";
import { ExecutiveBadge } from "@/components/ExecutiveUI";
import { FactsFiguresRoom } from "@/components/nexthit/FactsFiguresRoom";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    redirect("/onboarding");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });
  if (!shop) {
    redirect("/onboarding");
  }

  const candidate = await prisma.nextHitCandidate.findUnique({
    where: { id },
    include: {
      analysis: true,
    },
  });

  if (!candidate) {
    notFound();
  }

  const currencyCode = (shop as any).currencyCode || "USD";

  return (
    <div className="space-y-12">
      {/* Header & Back Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-4">
          <Link
            href="/nexthits"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Prediction Pipeline
          </Link>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Next Hit Intelligence</span>
              <ExecutiveBadge variant="gold">Spectral Prediction v1.3</ExecutiveBadge>
            </div>
            <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight text-white mb-2">
              {candidate.title}
            </h1>
          </div>

          <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed italic">
            &quot;{candidate.description}&quot;
          </p>
        </div>

        <div className="flex items-center gap-6 pb-2">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Confidence Rating</span>
            <div className="flex items-center gap-2 justify-end">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-3xl font-clash font-bold text-white tracking-tighter">
                {Math.round(candidate.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Engine - Facts & Figures Room */}
      <div className="bg-[var(--background-card)]/40 border border-white/5 rounded-[3rem] p-8 lg:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <FactsFiguresRoom candidate={candidate} currencyCode={currencyCode} />
      </div>

      {/* System Status Footnote */}
      <div className="flex items-center justify-center gap-8 py-8 border-t border-white/5 opacity-30 grayscale hover:grayscale-0 hover:opacity-70 transition-all duration-700">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scoring Engine Active</span>
        </div>
        <div className="flex items-center gap-2">
          <PackageSearch className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Network Pipeline Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Margin Protection Online</span>
        </div>
      </div>
    </div>
  );
}
