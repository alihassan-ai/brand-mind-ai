"use client";

import React from "react";
import {
    Sparkles,
    Target,
    Users,
    Megaphone,
    Zap,
    ChevronRight,
    TrendingUp,
    Palette,
    Package,
    DollarSign
} from "lucide-react";
import type { InsightsDashboardData } from "@/app/actions/insights";

export function ExecutiveInsights({ data }: { data: InsightsDashboardData }) {
    const { catalogHealth, patternInsights, customerCohorts, marketingMoments } = data;

    return (
        <div className="space-y-12">
            {/* 4-Domain Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Domain 1: Product Intelligence (Catalog Health) */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-3xl p-8 hover:border-blue-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-clash font-bold flex items-center gap-3">
                            <Package className="w-6 h-6 text-blue-400" />
                            Product Intelligence
                        </h3>
                        <div className={`px-4 py-1.5 rounded-xl font-clash font-black text-xl bg-gradient-to-br ${getGradeGradient(catalogHealth.grade)} text-[var(--foreground)] shadow-lg`}>
                            {catalogHealth.grade}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-sm text-[var(--muted-foreground)] mb-1">Catalog Health Score</div>
                                <div className="text-4xl font-clash font-bold text-[var(--foreground)] tracking-tight">
                                    {catalogHealth.overallScore}<span className="text-lg text-[var(--muted-foreground)]">/100</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1 text-right">Status</div>
                                <div className="text-emerald-400 font-bold">Optimized</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(catalogHealth.metrics).slice(0, 4).map(([key, metric]: [string, any]) => (
                                <div key={key} className="bg-[var(--foreground)]/5 rounded-2xl p-4 border border-[var(--border)]">
                                    <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{metric.label}</div>
                                    <div className="text-lg font-clash font-bold text-[var(--foreground)]">{metric.score}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Domain 2: Customer Intelligence (Segments) */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-3xl p-8 hover:border-purple-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-clash font-bold flex items-center gap-3">
                            <Users className="w-6 h-6 text-purple-400" />
                            Customer Intelligence
                        </h3>
                        <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                            {customerCohorts.reduce((s, c) => s + c.count, 0).toLocaleString()} Active
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="h-4 w-full bg-[var(--foreground)]/5 rounded-full overflow-hidden flex shadow-inner">
                            {customerCohorts.map((cohort) => (
                                <div
                                    key={cohort.name}
                                    className="h-full transition-all duration-1000"
                                    style={{
                                        width: `${cohort.percentage}%`,
                                        backgroundColor: cohort.color
                                    }}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customerCohorts.slice(0, 4).map((cohort) => (
                                <div key={cohort.name} className="flex items-center gap-3 p-3 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--border)]">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cohort.color }} />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-[var(--foreground)]">{cohort.name}</span>
                                            <span className="text-xs font-mono text-[var(--muted-foreground)]">{cohort.percentage.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Domain 3: Growth Engine (Marketing Moments) */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-3xl p-8 hover:border-pink-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-clash font-bold flex items-center gap-3">
                            <Megaphone className="w-6 h-6 text-pink-400" />
                            Growth Engine
                        </h3>
                        <span className="px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold text-pink-500 uppercase">
                            {marketingMoments.length} Moments
                        </span>
                    </div>

                    <div className="space-y-4">
                        {marketingMoments.slice(0, 3).map((moment) => (
                            <div key={moment.id} className="group relative bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-pink-500/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{moment.timing}</span>
                                    <div className="text-emerald-400 text-[10px] font-bold">{moment.expectedImpact}</div>
                                </div>
                                <h4 className="text-[var(--foreground)] font-bold mb-1">{moment.title}</h4>
                                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{moment.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Domain 4: Business Intelligence (Winning Patterns) */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-3xl p-8 hover:border-amber-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-clash font-bold flex items-center gap-3">
                            <Zap className="w-6 h-6 text-amber-500" />
                            Business Intelligence
                        </h3>
                        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                            Live Patterns
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {patternInsights.slice(0, 3).map((insight) => (
                            <div key={insight.id} className="flex items-center gap-5 p-5 bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl hover:border-amber-500/30 transition-all">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                                    {getInsightIcon(insight.icon)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">{insight.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[var(--muted-foreground)] italic">{insight.action}</span>
                                        <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">
                                            {Math.round(insight.confidence * 100)}% Conf
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}

function getGradeGradient(grade: string) {
    const map: Record<string, string> = {
        A: "from-emerald-500 to-emerald-600",
        B: "from-blue-500 to-blue-600",
        C: "from-amber-500 to-amber-600",
        D: "from-orange-500 to-orange-600",
        F: "from-red-500 to-red-600",
    };
    return map[grade] || "from-slate-500 to-slate-600";
}

function getInsightIcon(icon: string) {
    switch (icon) {
        case 'palette': return <Palette className="w-5 h-5" />;
        case 'package': return <Package className="w-5 h-5" />;
        case 'dollar-sign': return <DollarSign className="w-5 h-5" />;
        case 'trending-up': return <TrendingUp className="w-5 h-5" />;
        default: return <Sparkles className="w-5 h-5" />;
    }
}
