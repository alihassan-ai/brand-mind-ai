"use client";

import React, { useState } from "react";
import { EvidenceRoom } from "./EvidenceRoom";
import { ProfitSandbox } from "./ProfitSandbox";
import { SourcingModule } from "./SourcingModule";
import {
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Layers,
    BarChart3,
    PackageSearch
} from "lucide-react";
import { ExecutiveBadge } from "@/components/ExecutiveUI";

interface FactsFiguresRoomProps {
    candidate: any;
    currencyCode: string;
}

export function FactsFiguresRoom({ candidate, currencyCode }: FactsFiguresRoomProps) {
    const [activeTab, setActiveTab] = useState<'evidence' | 'profit' | 'sourcing'>('evidence');
    const [isApproved, setIsApproved] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [kitError, setKitError] = useState<string | null>(null);

    async function handleInitializeLaunchKit() {
        setIsGenerating(true);
        setKitError(null);
        try {
            const res = await fetch('/api/agents/launch-kit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateId: candidate.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate launch kit');
            window.location.href = '/launch-kit';
        } catch (err: any) {
            setKitError(err.message);
        } finally {
            setIsGenerating(false);
        }
    }

    const tabs = [
        { id: 'evidence', label: 'Evidence Room', icon: <Layers className="w-4 h-4" /> },
        { id: 'profit', label: 'Profit Sandbox', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'sourcing', label: 'Sourcing Engine', icon: <PackageSearch className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-12">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border)] pb-8">
                <div className="flex p-1.5 rounded-2xl bg-[var(--background-card)] border border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-clash font-bold text-xs transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-amber-500 text-black shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)]'
                                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {kitError && (
                        <span className="text-xs text-red-400 font-medium">{kitError}</span>
                    )}
                    {isApproved ? (
                        <button
                            onClick={handleInitializeLaunchKit}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-clash font-bold text-sm transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]"
                        >
                            <Sparkles className="w-4 h-4" />
                            {isGenerating ? "Generating..." : "Initialize Launch Kit"}
                            {!isGenerating && <ArrowRight className="w-4 h-4" />}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsApproved(true)}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-clash font-bold text-sm hover:bg-slate-200 transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve Strategy
                        </button>
                    )}
                </div>
            </div>

            {/* Module Viewport */}
            <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'evidence' && <EvidenceRoom analysis={candidate.analysis || {}} />}
                {activeTab === 'profit' && <ProfitSandbox candidate={candidate} currencyCode={currencyCode} />}
                {activeTab === 'sourcing' && <SourcingModule candidate={candidate} currencyCode={currencyCode} />}
            </div>
        </div>
    );
}
