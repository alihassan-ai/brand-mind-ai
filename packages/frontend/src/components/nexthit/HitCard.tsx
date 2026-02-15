"use client";

import React from "react";
import Link from "next/link";
import {
    ArrowRight,
    TrendingUp,
    Target,
    Sparkles,
    AlertCircle,
    BarChart3,
    Layers,
    Zap
} from "lucide-react";

interface HitCardProps {
    candidate: {
        id: string;
        title: string;
        description: string;
        patternSource: string;
        patternEvidence: any;
        confidence: number;
        hitType: string;
        status: string;
        scores: any;
    };
}

export function HitCard({ candidate }: HitCardProps) {
    const confidenceScore = Math.round(candidate.confidence * 100);

    const getHitTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'bold': return <Sparkles className="w-4 h-4 text-amber-400" />;
            case 'safe': return <Zap className="w-4 h-4 text-blue-400" />;
            case 'moderate': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
            default: return <Target className="w-4 h-4 text-[var(--muted-foreground)]" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'launched': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'shortlisted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-[var(--muted-foreground)] border-slate-500/20';
        }
    };

    return (
        <div className="group relative">
            {/* Card Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-amber-700/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative flex flex-col h-full bg-[var(--background-card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                {/* Header Image Placeholder / Icon area */}
                <div className="h-32 bg-gradient-to-br from-[#121820] to-[#0A0E14] flex items-center justify-center border-b border-[var(--border)]">
                    <div className="p-4 rounded-full bg-[var(--foreground)]/5 border border-white/10 group-hover:scale-110 group-hover:border-amber-500/30 transition-all duration-500 font-clash">
                        {getHitTypeIcon(candidate.hitType)}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${getStatusColor(candidate.status)}`}>
                            {candidate.status}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold text-sm tracking-tight">{confidenceScore}%</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-clash font-semibold text-[var(--foreground)] group-hover:text-amber-400 transition-colors mb-2 line-clamp-1">
                        {candidate.title}
                    </h3>

                    <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-3 line-clamp-2 italic">
                        &quot;{candidate.description}&quot;
                    </p>

                    {/* Quick Evidence Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.patternEvidence?.color && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                                {candidate.patternEvidence.color}
                            </span>
                        )}
                        {candidate.patternEvidence?.productType && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium">
                                {candidate.patternEvidence.productType}
                            </span>
                        )}
                        {candidate.patternEvidence?.coOccurrenceCount && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-medium">
                                {candidate.patternEvidence.coOccurrenceCount} pairs
                            </span>
                        )}
                        {candidate.patternEvidence?.growthRate && (
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-medium">
                                +{candidate.patternEvidence.growthRate.toFixed(0)}%
                            </span>
                        )}
                        {candidate.patternEvidence?.source === 'AI Market Research' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-medium">
                                AI Research
                            </span>
                        )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-bold">
                            <span>Strategy</span>
                            <span className="text-slate-300">{candidate.patternSource.replace('_', ' ')}</span>
                        </div>

                        <Link
                            href={`/nexthits/${candidate.id}`}
                            className="flex items-center justify-center w-full py-2.5 rounded-xl bg-[var(--foreground)]/5 hover:bg-amber-500 text-[var(--foreground)] hover:text-black font-bold text-xs transition-all duration-300 group/btn border border-white/10 hover:border-amber-500"
                        >
                            Analyze Opportunity
                            <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Progress Bar (Confidence) */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-slate-800 w-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                        style={{ width: `${confidenceScore}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
