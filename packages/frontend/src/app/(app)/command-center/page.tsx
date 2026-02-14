import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import {
  calculateExecutiveKPIs,
  generateExecutiveBrief
} from "@brandmind/brain";
import { getInsightsDashboard } from "@/app/actions/insights";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";
import { ExecutiveInsights } from "@/components/dashboard/ExecutiveInsights";
import { SyncLogs } from "@/components/dashboard/SyncLogs";
import { GoalManager } from "@/components/goals/GoalManager";
import { NewGoalButton } from "@/components/goals/NewGoalButton";
/*
- [x] Fix dead "New Goal" button in Command Center
- [x] Implement Goal creation modal interactivity
- [x] Optimize auto-sync frequency for better performance
*/
import { triggerAutoSync } from "@brandmind/backend/sync/auto-sync";
import {
  Plus,
  Network,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  LayoutGrid
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const shopDomain = await getConnectedShop();

  if (!user) {
    redirect("/auth/login");
  }

  if (!shopDomain) {
    redirect("/onboarding");
  }

  const shop = await prisma.shop.findUnique({
    where: { shopDomain }
  });

  if (!shop) {
    redirect("/onboarding");
  }

  // Trigger auto-sync in background (non-blocking)
  triggerAutoSync(shop.id).catch(console.error);

  // Calculate Executive KPIs and AI Brief
  const kpis = await calculateExecutiveKPIs(shop.id);
  const [brief, insights, syncLogs] = await Promise.all([
    generateExecutiveBrief(shop.id, kpis),
    getInsightsDashboard(),
    prisma.syncEvent.findMany({
      where: { shopId: shop.id },
      orderBy: { startedAt: "desc" },
      take: 10
    })
  ]);

  return (
    <div className="space-y-12">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--primary-border)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Module 1 — Command Center
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
            Command <span className="text-[var(--primary)] text-glow-amber">Center</span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed">
            Proprietary operating system for {shop.shopDomain}.
            AI-prioritized insights for rapid executive decision making.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <NewGoalButton />
        </div>
      </div>

      {/* Layer 1-3: Executive Dashboard */}
      <ExecutiveDashboard kpis={kpis} brief={brief} catalogHealth={insights?.catalogHealth} />

      {/* Strategic Goals Section */}
      <div className="pt-12 border-t border-[var(--border)]">
        <GoalManager />
      </div>

      {/* Layer 4: Unified Multi-Domain Intelligence (Merged from Store Insights) */}
      <div className="space-y-8 pt-12 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-clash font-bold flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-[var(--primary)]" />
            Unified Intelligence
          </h2>
          <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest bg-[var(--foreground)]/5 px-4 py-2 rounded-xl border border-[var(--border-hover)]">
            Analyzing 4 Segments
          </div>
        </div>
        {insights && <ExecutiveInsights data={insights} />}
      </div>

      {/* Module Access Area */}
      <div className="space-y-8 pt-12 border-t border-[var(--border)]">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <ChevronRight className="w-6 h-6 text-[var(--primary)]" />
          Module Access
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Product Intelligence"
            description="Next Hit predictions, Store DNA, market gaps, and launch strategies."
            href="/product-intelligence"
            icon={<Network className="w-6 h-6 text-blue-400" />}
          />
          <QuickActionCard
            title="Growth Engine"
            description="Campaign analytics, creative intelligence, and AI ad generation."
            href="/growth-engine"
            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
          />
          <QuickActionCard
            title="Customer Intelligence"
            description="RFM segments, churn prediction, VIP tracking, and retention."
            href="/customer-intelligence"
            icon={<Target className="w-6 h-6 text-purple-400" />}
          />
          <QuickActionCard
            title="Business Intelligence"
            description="Revenue analytics, margin tracking, and financial forecasting."
            href="/business-intelligence"
            icon={<Zap className="w-6 h-6 text-pink-400" />}
          />
        </div>
      </div>

      {/* Sync History Audit Trail */}
      <SyncLogs logs={syncLogs as any} />

    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary-muted)] to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border-hover)] transition-all duration-300 flex flex-col h-full">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-clash font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">{title}</h3>
        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 flex-1 italic">{description}</p>

        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
          Access Module
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

