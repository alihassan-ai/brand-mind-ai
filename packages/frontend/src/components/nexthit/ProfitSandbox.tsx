"use client";

import React, { useState, useEffect } from "react";
import {
    TrendingUp,
    DollarSign,
    Percent,
    BarChart3,
    Zap,
    Info,
    RotateCcw
} from "lucide-react";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";
import { formatCurrency } from "@/lib/formatter";

interface ProfitSandboxProps {
    candidate: any;
    currencyCode: string;
}

export function ProfitSandbox({ candidate, currencyCode }: ProfitSandboxProps) {
    const [sellingPrice, setSellingPrice] = useState(candidate.targetPrice || 50);
    const [sourcingCost, setSourcingCost] = useState(sellingPrice * 0.3);
    const [marketingSpend, setMarketingSpend] = useState(sellingPrice * 0.2);
    const [otherCogs, setOtherCogs] = useState(sellingPrice * 0.1);
    const [projectedUnits] = useState(100);

    // Derived metrics
    const totalCogs = Number(sourcingCost) + Number(otherCogs);
    const contributionMargin = sellingPrice - totalCogs;
    const netProfit = (contributionMargin * projectedUnits) - (marketingSpend * projectedUnits);
    const marginPercentage = (contributionMargin / sellingPrice) * 100;

    const reset = () => {
        setSellingPrice(candidate.targetPrice || 50);
        setSourcingCost((candidate.targetPrice || 50) * 0.3);
        setMarketingSpend((candidate.targetPrice || 50) * 0.2);
        setOtherCogs((candidate.targetPrice || 50) * 0.1);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-clash font-bold text-white flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    Profit Sandbox
                </h2>
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset AI Defaults
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <ExecutiveCard title="Input Parameters" subtitle="Adjust variables for scenario modeling">
                        <div className="space-y-8 py-4">
                            <SliderControl
                                label="Target MSRP"
                                value={sellingPrice}
                                onChange={setSellingPrice}
                                min={1} max={sellingPrice * 3}
                                currencyCode={currencyCode}
                            />
                            <SliderControl
                                label="AI Sourcing Cost"
                                value={sourcingCost}
                                onChange={setSourcingCost}
                                min={1} max={sellingPrice}
                                currencyCode={currencyCode}
                            />
                            <SliderControl
                                label="Marketing CAC (per unit)"
                                value={marketingSpend}
                                onChange={setMarketingSpend}
                                min={0} max={sellingPrice}
                                currencyCode={currencyCode}
                            />
                            <div className="pt-4 flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest italic">
                                <Info className="w-3 h-3" />
                                AI adjusts projections based on your historical catalog performance.
                            </div>
                        </div>
                    </ExecutiveCard>
                </div>

                {/* Projections */}
                <div className="space-y-6">
                    <ExecutiveCard
                        title="Next Hit Value"
                        subtitle="Projected Net Outcome"
                        badge="Calculated"
                    >
                        <div className="space-y-10 py-6 text-center">
                            <div className="space-y-2">
                                <span className="text-5xl font-clash font-bold text-white leading-none tracking-tighter">
                                    {formatCurrency(netProfit, currencyCode, { maximumFractionDigits: 0 })}
                                </span>
                                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    {Math.round(marginPercentage)}% Margin
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Unit Contribution</span>
                                    <span className="text-xl font-clash font-bold text-white">
                                        {formatCurrency(contributionMargin, currencyCode)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Breakeven</span>
                                    <span className="text-xl font-clash font-bold text-white">
                                        {Math.ceil((marketingSpend * projectedUnits) / contributionMargin) || 0} units
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-left">
                                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                                <div>
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">AI Verdict</p>
                                    <p className="text-xs text-slate-300 font-medium italic">
                                        {marginPercentage > 50 ? "High viability structure" : "Thin margins detected - optimize sourcing"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ExecutiveCard>
                </div>
            </div>
        </div>
    );
}

function SliderControl({ label, value, onChange, min, max, currencyCode }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number, currencyCode: string }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                <span className="text-lg font-clash font-bold text-white">{formatCurrency(value, currencyCode)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
        </div>
    );
}
