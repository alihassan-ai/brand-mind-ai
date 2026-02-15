"use client";

import React, { useState } from "react";
import {
  Activity,
  Package,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Zap,
  ChevronRight,
  Sparkles,
  BarChart3,
  Target,
  Layers,
  ShoppingBag,
  RefreshCw,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Award,
  Clock,
  Palette,
  Tag
} from "lucide-react";
import type { InsightsDashboardData } from "@/app/actions/insights";

interface Props {
  data: InsightsDashboardData;
  shopDomain: string;
}

export function InsightsDashboardClient({ data, shopDomain }: Props) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "opportunities", label: "Opportunities", icon: Target },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Intelligence Hub
            </div>
            <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
              Store <span className="text-purple-400">Insights</span>
            </h1>
            <p className="text-[var(--muted-foreground)] max-w-lg text-lg">
              AI-powered intelligence from your {shopDomain} data.
            </p>
          </div>

          {/* Health Score Badge */}
          <div className="flex items-center gap-6">
            <CatalogHealthBadge health={data.catalogHealth} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-clash font-bold text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? "bg-purple-500 text-black shadow-[0_10px_30px_-10px_rgba(168,85,247,0.4)]"
                  : "bg-[var(--foreground)]/5 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)]"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          {activeSection === "overview" && (
            <OverviewSection data={data} />
          )}
          {activeSection === "products" && (
            <ProductsSection data={data} />
          )}
          {activeSection === "customers" && (
            <CustomersSection data={data} />
          )}
          {activeSection === "opportunities" && (
            <OpportunitiesSection data={data} />
          )}
          {activeSection === "calendar" && (
            <CalendarSection data={data} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// CATALOG HEALTH BADGE
// ============================================

function CatalogHealthBadge({ health }: { health: InsightsDashboardData["catalogHealth"] }) {
  const gradeColors: Record<string, string> = {
    A: "from-emerald-500 to-emerald-600",
    B: "from-blue-500 to-blue-600",
    C: "from-amber-500 to-amber-600",
    D: "from-orange-500 to-orange-600",
    F: "from-red-500 to-red-600",
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition" />
      <div className="relative bg-[var(--background-card)] border border-white/10 rounded-2xl p-6 flex items-center gap-6">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradeColors[health.grade]} flex items-center justify-center shadow-lg`}>
          <span className="text-4xl font-clash font-black text-[var(--foreground)]">{health.grade}</span>
        </div>
        <div>
          <div className="text-sm text-[var(--muted-foreground)] mb-1">Catalog Health</div>
          <div className="text-3xl font-clash font-bold text-[var(--foreground)]">{health.overallScore}<span className="text-lg text-[var(--muted-foreground)]">/100</span></div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OVERVIEW SECTION
// ============================================

function OverviewSection({ data }: { data: InsightsDashboardData }) {
  return (
    <div className="space-y-10">
      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(data.catalogHealth.metrics).map(([key, metric]) => (
          <MetricCard
            key={key}
            label={metric.label}
            score={metric.score}
            detail={metric.detail}
          />
        ))}
      </div>

      {/* Pattern Insights */}
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-500" />
          Pattern Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.patternInsights.slice(0, 6).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Marketing Moments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-pink-500" />
          Marketing Moments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.marketingMoments.slice(0, 4).map((moment) => (
            <MarketingMomentCard key={moment.id} moment={moment} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {data.catalogHealth.recommendations.length > 0 && (
        <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl p-6">
          <h3 className="text-lg font-clash font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {data.catalogHealth.recommendations.map((rec, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <ChevronRight className="w-4 h-4 text-amber-500" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================
// PRODUCTS SECTION
// ============================================

function ProductsSection({ data }: { data: InsightsDashboardData }) {
  return (
    <div className="space-y-10">
      {/* Product Grades */}
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-500" />
          Product Performance
        </h2>
        <div className="bg-[var(--background-card)] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Velocity</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Trend</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.topProducts.map((product) => (
                <ProductRow key={product.productId} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Alerts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-blue-500" />
          Restock Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.restockAlerts.slice(0, 6).map((alert) => (
            <RestockCard key={alert.productId} alert={alert} />
          ))}
          {data.restockAlerts.length === 0 && (
            <div className="col-span-full bg-[var(--background-card)] border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-[var(--muted-foreground)]">No urgent restock alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Cannibalization */}
      {data.cannibalization.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
            <Layers className="w-6 h-6 text-orange-500" />
            Cannibalization Risk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.cannibalization.slice(0, 4).map((pair, i) => (
              <CannibalizationCard key={i} pair={pair} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// CUSTOMERS SECTION
// ============================================

function CustomersSection({ data }: { data: InsightsDashboardData }) {
  const totalCustomers = data.customerCohorts.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-10">
      {/* Cohort Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie-ish Visual */}
        <div className="bg-[var(--background-card)] border border-white/5 rounded-2xl p-8">
          <h3 className="text-lg font-clash font-bold mb-6">Customer Segments</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {data.customerCohorts.map((cohort) => (
              <div
                key={cohort.name}
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: cohort.color + "20" }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cohort.color }}
                />
                <span className="text-sm font-bold text-[var(--foreground)]">{cohort.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">{cohort.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="h-4 rounded-full overflow-hidden flex bg-[var(--foreground)]/5">
            {data.customerCohorts.map((cohort) => (
              <div
                key={cohort.name}
                className="h-full transition-all"
                style={{
                  width: `${cohort.percentage}%`,
                  backgroundColor: cohort.color
                }}
              />
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-3xl font-clash font-bold">{totalCustomers.toLocaleString()}</span>
            <span className="text-[var(--muted-foreground)] ml-2">total customers</span>
          </div>
        </div>

        {/* Cohort Details */}
        <div className="space-y-4">
          {data.customerCohorts.map((cohort) => (
            <CohortCard key={cohort.name} cohort={cohort} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPPORTUNITIES SECTION
// ============================================

function OpportunitiesSection({ data }: { data: InsightsDashboardData }) {
  return (
    <div className="space-y-10">
      {/* Bundle Suggestions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-emerald-500" />
          Bundle Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
          {data.bundles.length === 0 && (
            <div className="col-span-full bg-[var(--background-card)] border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-[var(--muted-foreground)]">No bundle opportunities detected yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Alerts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-amber-500" />
          Price Optimization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.priceAlerts.slice(0, 6).map((alert) => (
            <PriceAlertCard key={alert.productId} alert={alert} />
          ))}
          {data.priceAlerts.length === 0 && (
            <div className="col-span-full bg-[var(--background-card)] border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-[var(--muted-foreground)]">All products optimally priced</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// CALENDAR SECTION
// ============================================

function CalendarSection({ data }: { data: InsightsDashboardData }) {
  const maxRevenue = Math.max(...data.seasonalCalendar.map(m => m.revenueIndex));

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-500" />
          Seasonal Performance
        </h2>

        {/* Calendar Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.seasonalCalendar.map((month) => (
            <MonthCard key={month.month} month={month} maxRevenue={maxRevenue} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500" />
            <span className="text-sm text-[var(--muted-foreground)]">Peak Month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm text-[var(--muted-foreground)]">Slow Month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-500" />
            <span className="text-sm text-[var(--muted-foreground)]">Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CARD COMPONENTS
// ============================================

function MetricCard({ label, score, detail }: { label: string; score: number; detail: string }) {
  const color = score >= 70 ? "emerald" : score >= 40 ? "amber" : "red";

  return (
    <div className="bg-[var(--background-card)] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{label}</span>
        <span className={`text-lg font-clash font-bold text-${color}-500`}>{score}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--foreground)]/5 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full bg-${color}-500 transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">{detail}</p>
    </div>
  );
}

function InsightCard({ insight }: { insight: InsightsDashboardData["patternInsights"][0] }) {
  const iconMap: Record<string, React.ReactNode> = {
    palette: <Palette className="w-5 h-5" />,
    package: <Package className="w-5 h-5" />,
    "dollar-sign": <DollarSign className="w-5 h-5" />,
    "trending-up": <TrendingUp className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
  };

  const impactColors = {
    high: "border-emerald-500/30 bg-emerald-500/5",
    medium: "border-blue-500/30 bg-blue-500/5",
    low: "border-slate-500/30 bg-slate-500/5",
  };

  return (
    <div className={`rounded-2xl border p-5 ${impactColors[insight.impact]} hover:border-opacity-50 transition`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[var(--foreground)]/5">
          {iconMap[insight.icon] || <Zap className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className="font-clash font-bold text-[var(--foreground)] mb-1">{insight.title}</h4>
          <p className="text-sm text-[var(--muted-foreground)] mb-3">{insight.detail}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400 font-bold">{insight.action}</span>
            <span className="text-[10px] text-[var(--muted-foreground)]">{Math.round(insight.confidence * 100)}% conf</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingMomentCard({ moment }: { moment: InsightsDashboardData["marketingMoments"][0] }) {
  const priorityColors = {
    high: "border-pink-500/30 bg-pink-500/5",
    medium: "border-blue-500/30 bg-blue-500/5",
    low: "border-slate-500/30 bg-slate-500/5",
  };

  return (
    <div className={`rounded-2xl border p-5 ${priorityColors[moment.priority]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{moment.timing}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          moment.priority === "high" ? "bg-pink-500/20 text-pink-400" : "bg-slate-500/20 text-[var(--muted-foreground)]"
        }`}>
          {moment.priority}
        </span>
      </div>
      <h4 className="font-clash font-bold text-[var(--foreground)] mb-2">{moment.title}</h4>
      <p className="text-sm text-[var(--muted-foreground)] mb-3">{moment.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--muted-foreground)]">{moment.targetAudience}</span>
        <span className="text-emerald-400 font-bold">{moment.expectedImpact}</span>
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: InsightsDashboardData["topProducts"][0] }) {
  const gradeColors: Record<string, string> = {
    A: "bg-emerald-500",
    B: "bg-blue-500",
    C: "bg-amber-500",
    D: "bg-orange-500",
    F: "bg-red-500",
  };

  const trendIcons = {
    up: <ArrowUpRight className="w-4 h-4 text-emerald-500" />,
    down: <ArrowDownRight className="w-4 h-4 text-red-500" />,
    stable: <Minus className="w-4 h-4 text-[var(--muted-foreground)]" />,
  };

  return (
    <tr className="hover:bg-white/[0.02] transition">
      <td className="px-6 py-4">
        <span className="font-medium text-[var(--foreground)]">{product.title.slice(0, 40)}{product.title.length > 40 ? "..." : ""}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg ${gradeColors[product.grade]} text-[var(--foreground)] font-clash font-bold text-sm`}>
          {product.grade}
        </span>
      </td>
      <td className="px-6 py-4 text-right font-mono text-[var(--foreground)]">
        {product.metrics.revenue.toFixed(0)}
      </td>
      <td className="px-6 py-4 text-right font-mono text-[var(--muted-foreground)]">
        {product.metrics.velocity.toFixed(1)}/day
      </td>
      <td className="px-6 py-4 text-center">
        {trendIcons[product.trend]}
      </td>
      <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
        {product.recommendation}
      </td>
    </tr>
  );
}

function RestockCard({ alert }: { alert: InsightsDashboardData["restockAlerts"][0] }) {
  const urgencyColors = {
    critical: "border-red-500/30 bg-red-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    ok: "border-slate-500/30 bg-slate-500/5",
  };

  return (
    <div className={`rounded-2xl border p-5 ${urgencyColors[alert.urgency]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          alert.urgency === "critical" ? "bg-red-500/20 text-red-400" :
          alert.urgency === "warning" ? "bg-amber-500/20 text-amber-400" :
          "bg-slate-500/20 text-[var(--muted-foreground)]"
        }`}>
          {alert.urgency}
        </span>
        <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
      </div>
      <h4 className="font-clash font-bold text-[var(--foreground)] mb-2 text-sm">{alert.productTitle.slice(0, 35)}...</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-[var(--muted-foreground)] text-xs">Current Stock</div>
          <div className="font-bold text-[var(--foreground)]">{alert.currentStock}</div>
        </div>
        <div>
          <div className="text-[var(--muted-foreground)] text-xs">Days Left</div>
          <div className={`font-bold ${alert.daysUntilStockout < 7 ? "text-red-400" : "text-[var(--foreground)]"}`}>
            {alert.daysUntilStockout}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/5">
        <span className="text-xs text-[var(--muted-foreground)]">Suggested reorder: </span>
        <span className="text-xs font-bold text-emerald-400">{alert.suggestedReorder} units</span>
      </div>
    </div>
  );
}

function CannibalizationCard({ pair }: { pair: InsightsDashboardData["cannibalization"][0] }) {
  return (
    <div className="bg-[var(--background-card)] border border-orange-500/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
          {pair.similarity}% Similar
        </span>
        <AlertTriangle className="w-4 h-4 text-orange-500" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="text-sm font-medium text-[var(--foreground)]">{pair.product1.title.slice(0, 40)}...</div>
        <div className="text-center text-[var(--muted-foreground)]">vs</div>
        <div className="text-sm font-medium text-[var(--foreground)]">{pair.product2.title.slice(0, 40)}...</div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {pair.sharedAttributes.map((attr, i) => (
          <span key={i} className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px]">
            {attr}
          </span>
        ))}
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">{pair.recommendation}</p>
    </div>
  );
}

function CohortCard({ cohort }: { cohort: InsightsDashboardData["customerCohorts"][0] }) {
  return (
    <div
      className="bg-[var(--background-card)] border rounded-xl p-4 flex items-center gap-4"
      style={{ borderColor: cohort.color + "40" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-[var(--foreground)] font-clash font-bold"
        style={{ backgroundColor: cohort.color + "30" }}
      >
        {cohort.count}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-clash font-bold text-[var(--foreground)]">{cohort.name}</h4>
          <span className="text-sm font-mono text-[var(--muted-foreground)]">
            {cohort.totalRevenue.toFixed(0)}
          </span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">{cohort.action}</p>
      </div>
    </div>
  );
}

function BundleCard({ bundle }: { bundle: InsightsDashboardData["bundles"][0] }) {
  return (
    <div className="bg-[var(--background-card)] border border-emerald-500/20 rounded-2xl p-5 hover:border-emerald-500/40 transition">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          {bundle.coOccurrences} co-purchases
        </span>
        <Package className="w-4 h-4 text-emerald-500" />
      </div>
      <h4 className="font-clash font-bold text-[var(--foreground)] mb-3">{bundle.bundleName}</h4>
      <div className="space-y-1 mb-4">
        {bundle.products.slice(0, 2).map((p, i) => (
          <div key={i} className="text-sm text-[var(--muted-foreground)] truncate">+ {p}</div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-xs text-[var(--muted-foreground)]">Suggested: {bundle.suggestedDiscount}% off</span>
        <span className="text-xs font-bold text-emerald-400">+{bundle.estimatedUplift}/mo</span>
      </div>
    </div>
  );
}

function PriceAlertCard({ alert }: { alert: InsightsDashboardData["priceAlerts"][0] }) {
  return (
    <div className="bg-[var(--background-card)] border border-[var(--primary)]/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Price Mismatch</span>
        <Tag className="w-4 h-4 text-amber-500" />
      </div>
      <h4 className="font-clash font-bold text-[var(--foreground)] mb-2 text-sm">{alert.productTitle.slice(0, 40)}...</h4>
      <div className="flex items-center gap-3 mb-3">
        <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-mono">
          {alert.currentBand}
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-mono">
          {alert.optimalBand}
        </div>
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">{alert.suggestion}</p>
      <p className="text-xs text-emerald-400 mt-2">{alert.potentialUplift}</p>
    </div>
  );
}

function MonthCard({ month, maxRevenue }: { month: InsightsDashboardData["seasonalCalendar"][0]; maxRevenue: number }) {
  const height = maxRevenue > 0 ? (month.revenueIndex / maxRevenue) * 100 : 50;

  return (
    <div className={`rounded-2xl border p-4 text-center ${
      month.isPeak ? "border-emerald-500/30 bg-emerald-500/5" :
      month.isSlow ? "border-red-500/30 bg-red-500/5" :
      "border-white/5 bg-[var(--background-card)]"
    }`}>
      <div className="text-sm font-clash font-bold text-[var(--foreground)] mb-3">{month.month}</div>
      <div className="h-20 flex items-end justify-center mb-3">
        <div
          className={`w-8 rounded-t-lg transition-all ${
            month.isPeak ? "bg-emerald-500" :
            month.isSlow ? "bg-red-500" :
            "bg-slate-600"
          }`}
          style={{ height: `${Math.max(10, height)}%` }}
        />
      </div>
      <div className="text-xs text-[var(--muted-foreground)]">{(month.revenueIndex * 100).toFixed(0)}%</div>
    </div>
  );
}
