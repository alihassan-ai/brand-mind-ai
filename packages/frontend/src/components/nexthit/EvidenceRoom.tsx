"use client";

import React from "react";
import {
    Dna,
    Globe,
    CheckCircle2,
    ArrowUpRight,
    Info,
    Layers,
    Sparkles
} from "lucide-react";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";

interface Reason {
    level: 'low' | 'moderate' | 'high';
    score: number;
    evidence: string;
    confidence: number;
    category: 'internal' | 'external';
    label: string;
}

interface EvidenceRoomProps {
    analysis: any;
}

export function EvidenceRoom({ analysis }: EvidenceRoomProps) {
    const getReasons = (): Reason[] => {
        const reasons: Reason[] = [];
        if (analysis.demandRisk) reasons.push({ ...analysis.demandRisk, label: 'Demand Signal' });
        if (analysis.brandRisk) reasons.push({ ...analysis.brandRisk, label: 'Brand Alignment' });
        if (analysis.operationalRisk) reasons.push({ ...analysis.operationalRisk, label: 'Operational Fit' });
        if (analysis.refundRisk) reasons.push({ ...analysis.refundRisk, label: 'Quality Floor' });
        if (analysis.cannibalizationRisk) reasons.push({ ...analysis.cannibalizationRisk, label: 'Catalog Synergy' });
        return reasons;
    };

    const allReasons = getReasons();
    const internalReasons = allReasons.filter(r => r.category === 'internal');
    const externalReasons = allReasons.filter(r => r.category === 'external');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-clash font-bold text-white flex items-center gap-3">
                    <Layers className="w-6 h-6 text-amber-500" />
                    Evidence Room
                </h2>
                <div className="flex gap-2">
                    <ExecutiveBadge variant="gold">AI Grounded</ExecutiveBadge>
                    <ExecutiveBadge variant="blue">Data Pulse Active</ExecutiveBadge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Internal Reasons */}
                <ExecutiveCard
                    title="Internal Intelligence"
                    subtitle="Store DNA & Historical Patterns"
                    icon={<Dna className="w-6 h-6 text-blue-400" />}
                >
                    <div className="space-y-4 pt-4">
                        {internalReasons.map((reason, i) => (
                            <ReasonNode key={i} reason={reason} />
                        ))}
                        {internalReasons.length === 0 && (
                            <p className="text-slate-500 italic text-sm">No internal DNA signals detected for this candidate.</p>
                        )}
                    </div>
                </ExecutiveCard>

                {/* External Reasons */}
                <ExecutiveCard
                    title="Market Context"
                    subtitle="Trends & Category Dynamics"
                    icon={<Globe className="w-6 h-6 text-purple-400" />}
                >
                    <div className="space-y-4 pt-4">
                        {externalReasons.map((reason, i) => (
                            <ReasonNode key={i} reason={reason} />
                        ))}
                        {externalReasons.length === 0 && (
                            <p className="text-slate-500 italic text-sm">No external market factors weighted in this analysis.</p>
                        )}
                    </div>
                </ExecutiveCard>
            </div>
        </div>
    );
}

function ReasonNode({ reason }: { reason: Reason }) {
    const isGood = reason.level === 'low';
    const isMed = reason.level === 'moderate';

    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group/node">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isGood ? 'bg-emerald-500' : isMed ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <span className="text-xs font-bold text-white uppercase tracking-tight">{reason.label}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {Math.round(reason.confidence * 100)}% Conf
                </span>
            </div>
            <p className="text-sm text-slate-400 italic leading-relaxed group-hover/node:text-slate-200 transition-colors">
                &quot;{reason.evidence}&quot;
            </p>
        </div>
    );
}
