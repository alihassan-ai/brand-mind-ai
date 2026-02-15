"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Globe,
    ArrowRight,
    Sparkles,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Target
} from "lucide-react";

export function PublicDemo() {
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domain) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const resp = await fetch("/api/public/analyze", {
                method: "POST",
                body: JSON.stringify({ domain }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || "Analysis failed");

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative group overflow-hidden rounded-[2.5rem] border border-[var(--border-hover)] bg-[var(--background-card)] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                <div className="relative p-8 md:p-12 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-clash font-bold text-white flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-amber-500" />
                                Public Brand Preview
                            </h3>
                            <p className="text-slate-400 text-sm font-medium italic">Enter any public domain to see the Intelligence Engine in action.</p>
                        </div>

                        <form onSubmit={handleAnalyze} className="flex-1 max-w-md w-full relative">
                            <input
                                type="text"
                                placeholder="e.g. apple.com"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 pr-14 text-white font-medium focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-all disabled:opacity-50 shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    </div>

                    {/* Result Area */}
                    <div className="min-h-[200px] flex items-center justify-center border border-white/5 bg-black/20 rounded-3xl p-8">
                        {loading ? (
                            <div className="text-center space-y-4">
                                <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mx-auto" />
                                <p className="text-slate-400 font-medium animate-pulse">Scraping storefront data and generating intelligence...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center space-y-3">
                                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                                <p className="text-white font-bold">{error}</p>
                                <button onClick={() => setError("")} className="text-xs text-slate-500 hover:text-white uppercase tracking-widest font-bold">Clear Error</button>
                            </div>
                        ) : result ? (
                            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-6">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">Live Report</span>
                                            <h4 className="text-3xl font-clash font-bold text-white mt-1">{result.brandName}</h4>
                                            <p className="text-slate-400 font-medium mt-2 leading-relaxed italic">&quot;{result.description}&quot;</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Health Score</span>
                                                <div className="text-xl font-clash font-bold text-emerald-400">{result.healthScore}%</div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Est. Revenue</span>
                                                <div className="text-xl font-clash font-bold text-white">{result.estimatedRevenue}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Target className="w-3.5 h-3.5 text-blue-400" />
                                                Top Opportunities
                                            </h5>
                                            <ul className="space-y-2">
                                                {result.topOpportunities.map((opt: string, i: number) => (
                                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                        {opt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Activity className="w-3.5 h-3.5 text-rose-400" />
                                                Risk Signals
                                            </h5>
                                            <ul className="space-y-2">
                                                {result.riskSignals.map((risk: string, i: number) => (
                                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                        <div className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center mt-0.5 shrink-0">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                        </div>
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4 text-center">
                                    <p className="text-slate-500 text-xs font-medium">To see complete Store DNA and Next Hit projections, connect your storefront.</p>
                                    <Link
                                        href="/auth/signup"
                                        className="px-8 py-3 bg-white text-black font-clash font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                                    >
                                        Unlock Full Executive Terminal
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-500 font-clash font-bold text-xl">Ready for Analysis</p>
                                    <p className="text-slate-600 text-sm max-w-xs mx-auto">Input your store domain above to see how BrandMindAI perceives your brand architecture.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Activity({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
