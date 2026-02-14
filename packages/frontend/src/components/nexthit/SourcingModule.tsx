"use client";

import React, { useState } from "react";
import {
    Building2,
    Search,
    MapPin,
    Star,
    CheckCircle2,
    ExternalLink,
    ShieldCheck,
    PackageSearch
} from "lucide-react";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";
import { formatCurrency } from "@/lib/formatter";

interface SourcingModuleProps {
    candidate: any;
    currencyCode: string;
}

export function SourcingModule({ candidate, currencyCode }: SourcingModuleProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const mockProviders = [
        {
            name: "Summit Manufacturing",
            location: "Guangdong, CN",
            moq: 100,
            price: 12.50,
            rating: 4.8,
            verified: true
        },
        {
            name: "Harbor Goods Co.",
            location: "New Jersey, US",
            moq: 250,
            price: 18.20,
            rating: 4.9,
            verified: true
        },
        {
            name: "Direct Source Labs",
            location: "Istanbul, TR",
            moq: 50,
            price: 14.80,
            rating: 4.6,
            verified: false
        }
    ];

    const handleSearch = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-clash font-bold text-[var(--foreground)] flex items-center gap-3">
                    <PackageSearch className="w-6 h-6 text-blue-400" />
                    Sourcing Module
                </h2>
                <ExecutiveBadge variant="gold">Provider Network Active</ExecutiveBadge>
            </div>

            {!showResults ? (
                <div className="bg-[var(--background-card)] border border-dashed border-white/10 rounded-[2.5rem] p-24 text-center space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Search className={`w-8 h-8 text-[var(--muted-foreground)] ${isSearching ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-clash font-bold text-[var(--foreground)]">Find Verified Providers</h3>
                        <p className="text-[var(--muted-foreground)] max-w-sm mx-auto italic leading-relaxed text-sm">
                            Search our verified network for manufacturers matching the {candidate.productType || "category"} requirements.
                        </p>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-10 py-4 rounded-2xl bg-white text-black font-clash font-bold text-sm hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        {isSearching ? "Searching Network..." : "Initialize Provider Search"}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockProviders.map((provider, i) => (
                        <ExecutiveCard
                            key={i}
                            title={provider.name}
                            subtitle={provider.location}
                            icon={<Building2 className="w-6 h-6 text-blue-400" />}
                        >
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span className="text-sm font-bold">{provider.rating}</span>
                                    </div>
                                    {provider.verified && (
                                        <div className="flex items-center gap-1 text-emerald-400">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-glow-emerald">Verified</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] block mb-1">Unit Price</span>
                                        <span className="text-lg font-clash font-bold text-[var(--foreground)]">{formatCurrency(provider.price, currencyCode)}</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] block mb-1">MOQ</span>
                                        <span className="text-lg font-clash font-bold text-[var(--foreground)]">{provider.moq} units</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[var(--foreground)] font-bold text-xs transition-all flex items-center justify-center gap-2 group">
                                    View Provider Profile
                                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </ExecutiveCard>
                    ))}
                </div>
            )}
        </div>
    );
}
