"use client";

import React from "react";
import Link from "next/link";
import {
    ArrowRight,
    TrendingUp,
    Sparkles,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface HeroSectionProps {
    topCandidate: {
        id: string;
        title: string;
        description: string;
        patternSource: string;
        patternEvidence: any;
        confidence: number;
        hitType: string;
        status: string;
        scores: any;
    } | null;
}

export function HeroSection({ topCandidate }: HeroSectionProps) {
    if (!topCandidate) return null;

    const confidenceScore = Math.round(topCandidate.confidence * 100);

    return (
        <Card className="relative group overflow-hidden rounded-[2rem] border-[var(--border)] bg-[var(--background)]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/10 blur-[120px] rounded-full -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-[var(--primary)]/20" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -ml-24 -mb-24" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-12 p-8 lg:p-16 items-center">
                {/* Left Side: Content */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Badge variant="default" className="gap-2 px-4 py-1.5 uppercase tracking-[0.2em]">
                            <Sparkles className="w-3 h-3" />
                            Primary Opportunity
                        </Badge>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <TrendingUp className="w-4 h-4" />
                            {confidenceScore}% Market Confidence
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-clash font-bold text-[var(--foreground)] leading-[1.1]">
                            {topCandidate.title}
                        </h1>
                        <p className="text-xl text-[var(--muted-foreground)] font-medium leading-relaxed max-w-xl">
                            {topCandidate.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-base font-bold shadow-lg shadow-amber-500/20">
                            <Link href={`/nexthits/${topCandidate.id}`}>
                                Analyze Full Strategy
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>

                        <Button variant="secondary" size="lg" className="rounded-2xl px-8 py-6 text-base font-bold group/btn2 bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                            <BarChart3 className="w-5 h-5 mr-2 text-slate-400 group-hover/btn2:text-white transition-colors" />
                            View Simulations
                        </Button>
                    </div>

                    {/* Evidence Section - The "Why" */}
                    <div className="pt-6 border-t border-[var(--border)] space-y-4">
                        <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold">Why This Recommendation</div>
                        <div className="flex flex-wrap gap-2">
                            {topCandidate.patternEvidence?.color && (
                                <Badge variant="secondary" className="px-3 py-1.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                    {topCandidate.patternEvidence.color} {topCandidate.patternEvidence.colorSuccessRate || '+92%'}
                                </Badge>
                            )}
                            {topCandidate.patternEvidence?.productType && (
                                <Badge variant="secondary" className="px-3 py-1.5 bg-blue-500/10 border-blue-500/20 text-blue-400">
                                    {topCandidate.patternEvidence.productType} {topCandidate.patternEvidence.productTypeShare ? `${topCandidate.patternEvidence.productTypeShare.toFixed(0)}% revenue` : ''}
                                </Badge>
                            )}
                            {topCandidate.patternEvidence?.coOccurrenceCount && (
                                <Badge variant="secondary" className="px-3 py-1.5 bg-amber-500/10 border-amber-500/20 text-amber-400">
                                    {topCandidate.patternEvidence.coOccurrenceCount} buy together
                                </Badge>
                            )}
                            {topCandidate.patternEvidence?.growthRate && (
                                <Badge variant="secondary" className="px-3 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-400">
                                    +{topCandidate.patternEvidence.growthRate.toFixed(0)}% growth
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 pt-4">
                        <div className="space-y-1">
                            <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold">Strategy</div>
                            <div className="text-sm text-[var(--foreground)] font-medium capitalize">{topCandidate.patternSource.replace(/_/g, ' ')}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold">Risk</div>
                            <div className={`text-sm font-medium uppercase ${topCandidate.hitType === 'safe' ? 'text-emerald-400' :
                                    topCandidate.hitType === 'bold' ? 'text-amber-400' : 'text-blue-400'
                                }`}>{topCandidate.hitType}</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual/Preview */}
                <div className="relative group/visual">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--primary)]/20 via-transparent to-blue-500/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover/visual:opacity-100 transition duration-700" />

                    <div className="relative aspect-[4/3] rounded-[2rem] bg-slate-900 overflow-hidden border border-[var(--border)] shadow-2xl">
                        {/* Visual placeholder for prediction analysis */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#121820] to-[#0A0E14]">
                            <div className="w-24 h-24 rounded-3xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center mb-6 group-hover/visual:scale-110 group-hover/visual:border-[var(--primary)]/40 transition-all duration-700 text-[var(--primary)]">
                                <BarChart3 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-clash font-bold text-white mb-2 tracking-tight">Intelligence Forecast</h3>
                            <p className="text-slate-400 text-sm max-w-[240px] leading-relaxed italic">
                                Visual demand analysis and stock velocity prediction engine.
                            </p>

                            {/* Decorative Dashboard UI Elements */}
                            <div className="absolute top-8 right-8 flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                                <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                            </div>

                            <div className="absolute bottom-12 inset-x-8 h-24 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-4 flex flex-col justify-end">
                                <div className="flex gap-1 items-end h-full">
                                    {[40, 60, 45, 75, 55, 90, 85, 95].map((val, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-[var(--primary)]/20 rounded-t-sm group-hover/visual:bg-[var(--primary)]/40 transition-all duration-1000"
                                            style={{ height: `${val}%`, transitionDelay: `${i * 100}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
