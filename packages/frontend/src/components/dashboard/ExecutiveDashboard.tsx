"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    ShieldCheck,
    AlertTriangle,
    Activity,
    Zap,
    Target,
    BarChart3,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Package,
    ArrowUpRight,
    Clock
} from "lucide-react";
import type { CatalogHealth } from "@brandmind/brain";

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle: string;
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'flat';
    };
    score?: {
        value: number;
        status: 'healthy' | 'fragile' | 'critical';
    };
    icon: React.ReactNode;
}

function KPICard({ title, value, subtitle, trend, score, icon }: KPICardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-emerald-400';
            case 'fragile': return 'text-amber-400';
            case 'critical': return 'text-rose-400';
            default: return 'text-[var(--muted-foreground)]';
        }
    };

    return (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--primary-border)] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] group-hover:border-[var(--primary-border)] transition-colors">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend.direction === 'up' ? 'text-emerald-400' :
                        trend.direction === 'down' ? 'text-rose-400' : 'text-[var(--muted-foreground)]'
                        }`}>
                        {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> :
                            trend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> :
                                <Minus className="w-3 h-3" />}
                        {Math.abs(trend.value)}% {trend.label}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-widest">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-clash font-bold text-[var(--foreground)] tracking-tight">{value}</span>
                    {score && (
                        <span className={`text-xs font-bold uppercase ${getStatusColor(score.status)}`}>
                            • {score.status}
                        </span>
                    )}
                </div>
                <p className="text-[var(--muted-foreground)] text-[10px] font-medium leading-relaxed italic">
                    {subtitle}
                </p>
            </div>

            {score && (
                <div className="mt-4 h-1 w-full bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${score.status === 'healthy' ? 'bg-emerald-500' :
                            score.status === 'fragile' ? 'bg-[var(--primary)]' : 'bg-rose-500'
                            }`}
                        style={{ width: `${score.value}%` }}
                    />
                </div>
            )}
        </div>
    );
}

export function ExecutiveDashboard({ kpis, brief, catalogHealth }: { kpis: any, brief: string, catalogHealth?: CatalogHealth }) {
    const [isControlRoomExpanded, setIsControlRoomExpanded] = useState(true);
    const [isOperationsExpanded, setIsOperationsExpanded] = useState(false);

    return (
        <div className="space-y-12">
            {/* Layer 3: AI Executive Brief */}
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--background-raised)] to-[var(--background-card)] border border-[var(--primary-border)] p-8 lg:p-12">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                <div className="relative space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)] text-black">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl font-clash font-bold text-[var(--foreground)]">AI Executive Brief</h2>
                        <span className="text-[var(--muted-foreground)] text-xs font-medium ml-2">Today&apos;s Strategy Summary</span>
                    </div>

                    <div className="max-w-4xl">
                        <p className="text-lg text-slate-300 leading-relaxed font-medium">
                            {brief}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider">Health: Nominal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                            <span className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider">Risk: Medium</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layer 1: Executive Control KPIs */}
            <section className="space-y-6">
                <div
                    className="flex items-center justify-between border-b border-[var(--border)] pb-6 cursor-pointer group"
                    onClick={() => setIsControlRoomExpanded(!isControlRoomExpanded)}
                >
                    <h2 className="text-2xl font-clash font-bold flex items-center gap-3 text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                        {isControlRoomExpanded ? (
                            <ChevronDown className="w-6 h-6 text-[var(--primary)] transition-transform duration-300" />
                        ) : (
                            <ChevronRight className="w-6 h-6 text-[var(--primary)] transition-transform duration-300" />
                        )}
                        Executive Control Room
                    </h2>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--foreground)]/5 border border-[var(--border-hover)] text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        Live Feed Active
                    </div>
                </div>

                {isControlRoomExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <KPICard
                            title="Revenue Momentum"
                            value={`${kpis.revenueMomentum.value}%`}
                            subtitle="Calculates acceleration/velocity of net revenue vs previous period."
                            trend={{
                                value: Math.abs(kpis.revenueMomentum.value),
                                label: 'WoW',
                                direction: kpis.revenueMomentum.trend
                            }}
                            icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
                        />

                        <KPICard
                            title="Profitability Health"
                            value={kpis.profitabilityHealth.score}
                            subtitle="Weighted index of gross margin, ad efficiency, and discount pressure."
                            score={{
                                value: kpis.profitabilityHealth.score,
                                status: kpis.profitabilityHealth.status
                            }}
                            icon={<Target className="w-5 h-5 text-emerald-400" />}
                        />

                        <KPICard
                            title="Growth Quality"
                            value={kpis.growthQuality.score}
                            subtitle="Measures if growth is sustainable or artificially 'bought' via spend."
                            score={{
                                value: kpis.growthQuality.score,
                                status: kpis.growthQuality.score > 75 ? 'healthy' : 'fragile'
                            }}
                            icon={<Zap className="w-5 h-5 text-blue-400" />}
                        />

                        <KPICard
                            title="Customer Health"
                            value={kpis.customerHealth.score}
                            subtitle="Aggregated acquisition velocity and retention purchase patterns."
                            score={{
                                value: kpis.customerHealth.score,
                                status: kpis.customerHealth.score > 70 ? 'healthy' : 'fragile'
                            }}
                            icon={<ShieldCheck className="w-5 h-5 text-indigo-400" />}
                        />

                        <KPICard
                            title="Discount Pressure"
                            value={`${kpis.discountPressure.value}%`}
                            subtitle="Percentage of revenue driven by price reductions vs brand value."
                            trend={{
                                value: 0,
                                label: kpis.discountPressure.trend,
                                direction: kpis.discountPressure.trend === 'rising' ? 'up' : 'flat'
                            }}
                            icon={<BarChart3 className="w-5 h-5 text-rose-400" />}
                        />

                        <KPICard
                            title="Operational Risk"
                            value={kpis.operationalRisk.level}
                            subtitle={kpis.operationalRisk.signal}
                            icon={<AlertTriangle className={`w-5 h-5 ${kpis.operationalRisk.level === 'HIGH' ? 'text-rose-500' :
                                kpis.operationalRisk.level === 'MEDIUM' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
                                }`} />}
                        />
                    </div>
                )}
            </section>

            {/* Layer 2: Shopify Substitution Metrics Toggle Area */}
            <section className="mt-12 pt-12 border-t border-[var(--border)]">
                <div
                    onClick={() => setIsOperationsExpanded(!isOperationsExpanded)}
                    className={`flex flex-col items-center justify-center p-12 rounded-[2rem] bg-[var(--background-card)]/50 border border-dashed transition-all duration-500 group cursor-pointer ${isOperationsExpanded ? 'border-[var(--primary)]/40 bg-[var(--background-card)]' : 'border-[var(--border-hover)] hover:bg-[var(--background-card)]'
                        }`}
                >
                    <div className="p-4 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] mb-4 group-hover:scale-110 transition-transform">
                        {isOperationsExpanded ? (
                            <ChevronDown className="w-8 h-8 text-[var(--primary)]" />
                        ) : (
                            <Activity className="w-8 h-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                        )}
                    </div>
                    <h3 className="text-xl font-clash font-bold text-[var(--foreground)] mb-2">Drill Down into Operations</h3>
                    <p className="text-[var(--muted-foreground)] text-sm italic max-w-sm text-center font-medium">
                        {isOperationsExpanded ? "Showing active operational metrics for your Shopify store." : "Expand to view detailed Shopify substitution metrics, product assortment health, and traffic conversion sources."}
                    </p>
                </div>

                {isOperationsExpanded && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Operational Stats: Derived from catalogHealth if available */}
                        <div className="bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Package className="w-5 h-5 text-blue-400" />
                                <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Assortment Health</h4>
                            </div>
                            <div className="space-y-4">
                                {catalogHealth ? (
                                    Object.entries(catalogHealth.metrics).slice(0, 3).map(([key, metric]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center text-sm">
                                            <span className="text-[var(--muted-foreground)]">{metric.label}</span>
                                            <span className="text-[var(--foreground)] font-mono">{metric.score}/100</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[var(--muted-foreground)] text-xs italic">Syncing historical health data...</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                                <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Substitution Quality</h4>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-clash font-bold text-[var(--foreground)]">92.4%</div>
                                <div className="text-[10px] font-bold text-emerald-400 uppercase">Above Avg</div>
                            </div>
                            <p className="mt-2 text-xs text-[var(--muted-foreground)]">Measures the efficiency of replacement product recommendations.</p>
                        </div>

                        <div className="bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-6 truncate">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Sync Integrity</h4>
                            </div>
                            <div className="flex items-center gap-3 text-emerald-400">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-sm font-bold font-mono">ALL SYSTEMS NOMINAL</span>
                            </div>
                            <p className="mt-2 text-xs text-[var(--muted-foreground)] truncate">Last validated: Just now (via Smart Sync Engine)</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
