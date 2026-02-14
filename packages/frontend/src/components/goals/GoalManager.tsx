"use client";

import { useState } from "react";
import {
    Target,
    TrendingUp,
    Users,
    ShoppingBag,
    Clock,
    X,
    Plus
} from "lucide-react";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";

const GOAL_TYPES = [
    { id: 'revenue', name: 'Revenue Growth', icon: TrendingUp, description: 'Increase total sales within a specific timeframe.' },
    { id: 'retention', name: 'Customer Retention', icon: Users, description: 'Improve repeat purchase rate and loyalty.' },
    { id: 'catalog', name: 'Catalog Expansion', icon: ShoppingBag, description: 'Launch new products or categories.' },
];

import { useGoalStore } from "@/store/goalStore";

export function GoalManager() {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const isCreating = useGoalStore((state: { isModalOpen: boolean }) => state.isModalOpen);
    const setIsCreating = (open: boolean) => {
        if (open) useGoalStore.getState().openModal();
        else useGoalStore.getState().closeModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-clash font-bold">Strategic Goals</h2>
                <button
                    onClick={() => {
                        setSelectedType(null);
                        setIsCreating(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-bold font-clash"
                >
                    <Plus className="w-4 h-4" />
                    Create Intelligence Goal
                </button>
            </div>

            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
                            <div>
                                <ExecutiveBadge variant="gold">Strategic Initialization</ExecutiveBadge>
                                <h3 className="text-2xl font-clash font-bold mt-2">Initialize New Goal</h3>
                            </div>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="p-2 rounded-lg hover:bg-[var(--foreground)]/5 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 gap-4">
                                {GOAL_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${selectedType === type.id
                                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                                            : 'border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl transition-colors ${selectedType === type.id
                                            ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                                            : 'bg-[var(--foreground)]/5 group-hover:bg-[var(--primary)]/10 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'
                                            }`}>
                                            <type.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold transition-colors ${selectedType === type.id ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'
                                                }`}>{type.name}</h4>
                                            <p className="text-sm text-[var(--muted-foreground)] italic">{type.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className={`px-8 py-3 rounded-xl text-sm font-bold font-clash transition-all ${selectedType
                                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-primary)] hover:scale-105 active:scale-95'
                                        : 'bg-[var(--primary)]/20 text-[var(--primary-foreground)]/40 cursor-not-allowed'
                                        }`}
                                    disabled={!selectedType}
                                >
                                    Confirm Parameters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExecutiveCard title="Active Directives" subtitle="High-priority strategic goals">
                    <div className="pt-4 space-y-4">
                        <div className="p-4 rounded-2xl bg-[var(--foreground)]/[0.02] border border-[var(--border)]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-bold">Revenue Optimization</span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">Healthy</span>
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)] italic mb-4">Leveraging AI to identify and expand high-margin product segments.</p>
                            <div className="w-full h-1 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                                <div className="w-[65%] h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[var(--foreground)]/[0.02] border border-[var(--border)] opacity-60">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-bold">VIP Retention</span>
                            </div>
                            <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Awaiting Segment Freshness</p>
                        </div>
                    </div>
                </ExecutiveCard>

                <ExecutiveCard title="Intelligence Feed" subtitle="Real-time status updates">
                    <div className="h-48 flex items-center justify-center border border-dashed border-[var(--border)] rounded-2xl text-[var(--muted)]/50 text-xs font-bold uppercase tracking-widest">
                        Awaiting Directives
                    </div>
                </ExecutiveCard>
            </div>
        </div>
    );
}
