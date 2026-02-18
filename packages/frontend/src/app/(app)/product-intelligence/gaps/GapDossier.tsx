"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    Target,
    Zap,
    ShieldAlert,
    ArrowUpRight,
    Search,
    BrainCircuit
} from "lucide-react";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";
import { formatCurrency } from "@/lib/formatter";
import { EvidenceModal, EvidenceListItem } from "@/components/evidence/EvidenceModal";

interface GapDossierProps {
    gap: any;
    currencyCode: string;
}

export function GapDossier({ gap, currencyCode }: GapDossierProps) {
    const [isOpen, setIsOpen] = useState(false);

    const typeConfigs: Record<string, { icon: React.ReactNode, variant: any }> = {
        price_gap: {
            icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
            variant: "blue"
        },
        category_gap: {
            icon: <Target className="w-6 h-6 text-purple-400" />,
            variant: "purple"
        },
        variant_gap: {
            icon: <Zap className="w-6 h-6 text-emerald-400" />,
            variant: "emerald"
        },
        seasonal_gap: {
            icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
            variant: "rose"
        },
    };

    const config = typeConfigs[gap.gapType] || typeConfigs.category_gap;

    // Helper to flatten gapData into displayable items
    const getEvidenceItems = () => {
        const items = [];
        const data = gap.gapData as Record<string, any>;

        if (!data) return [];

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                // Should do recursive or better formatting, but for now just stringify
                items.push({
                    key,
                    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    value: JSON.stringify(value),
                    icon: <BrainCircuit className="w-4 h-4" />
                });
            } else {
                items.push({
                    key,
                    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    value: String(value),
                    icon: <Search className="w-4 h-4" />
                });
            }
        }
        return items;
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer h-full">
                <ExecutiveCard
                    title={gap.gapType === "price_gap" ? "Pricing Exposure" : "Strategic Gap"}
                    subtitle={`Dossier Node: ${gap.id.substring(0, 8)}`}
                    icon={config.icon}
                    badge={`${Math.round(gap.confidence * 100)}% Confidence`}
                >
                    <div className="space-y-6 flex flex-col h-full">
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <ExecutiveBadge variant={config.variant === 'gold' ? 'gold' : config.variant}>
                                    {gap.gapType.split('_')[0].toUpperCase()}
                                </ExecutiveBadge>
                                {(gap.potentialRevenue || 0) > 10000 && <ExecutiveBadge variant="gold">High Impact</ExecutiveBadge>}
                            </div>
                            <h3 className="text-[var(--foreground)] font-clash font-bold text-lg leading-snug">
                                {gap.description || "Unidentified Opportunity"}
                            </h3>
                        </div>

                        <div className="p-4 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest">Suggested Action</span>
                            <p className="text-sm text-slate-300 italic leading-relaxed">
                                {gap.suggestedAction}
                            </p>
                        </div>

                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--border)]">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest block mb-1">Impact Potential</span>
                                <span className="text-xl font-clash font-bold text-emerald-400">
                                    {gap.potentialRevenue ? formatCurrency(gap.potentialRevenue, currencyCode) : "Market Fit"}
                                </span>
                            </div>

                            <button className="p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] hover:bg-white/10 transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)] group/btn">
                                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </ExecutiveCard>
            </div>

            <EvidenceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Gap Analysis & Evidence"
                subtitle="Data points and reasoning behind this strategic gap identification."
            >
                <div className="space-y-3">
                    {getEvidenceItems().map((item) => (
                        <EvidenceListItem
                            key={item.key}
                            title={item.label}
                            value={String(item.value).length > 50 ? "View Details" : String(item.value)}
                            subtitle={String(item.value).length > 50 ? String(item.value) : undefined}
                            icon={item.icon}
                        />
                    ))}
                    {getEvidenceItems().length === 0 && (
                        <div className="text-center py-8 text-[var(--muted-foreground)] italic">
                            No drill-down evidence available for this gap.
                        </div>
                    )}
                </div>
            </EvidenceModal>
        </>
    );
}
