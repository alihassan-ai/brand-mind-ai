"use client";

import React, { useState } from "react";
import { AlertCircle, UserX, Loader2, Info } from "lucide-react";
import { EvidenceModal, EvidenceListItem } from "@/components/evidence/EvidenceModal";
import { getRevenueExposureCustomers } from "@/app/actions/evidence";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";
import { formatCurrency } from "@/lib/formatter";

interface RetentionRevenueCardProps {
    revenue: number;
    currencyCode: string;
}

export function RetentionRevenueCard({ revenue, currencyCode }: RetentionRevenueCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    const handleViewExposure = async () => {
        setIsOpen(true);
        if (customers.length === 0) {
            setIsLoading(true);
            try {
                const data = await getRevenueExposureCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch exposure data", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <div onClick={handleViewExposure} className="cursor-pointer">
                <ExecutiveCard
                    title="Revenue Exposure"
                    subtitle="Value at risk from churn"
                    icon={<AlertCircle className="w-6 h-6 text-rose-400" />}
                    badge="High Risk"
                >
                    <div className="space-y-8 py-4 group">
                        <div className="text-center">
                            <span className="text-5xl font-clash font-bold text-[var(--foreground)] leading-none group-hover:text-rose-400 transition-colors">
                                {formatCurrency(revenue, currencyCode, { maximumFractionDigits: 0 })}
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
                                Aggregated Risk Value
                                <Info className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                        </div>
                        <div className="pt-6 border-t border-[var(--border)] space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--muted-foreground)] font-medium italic">Detection Node</span>
                                <ExecutiveBadge variant="rose">Active Phase</ExecutiveBadge>
                            </div>
                        </div>
                    </div>
                </ExecutiveCard>
            </div>

            <EvidenceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Revenue Exposure Breakdown"
                subtitle={`Top 50 high-value customers contributing to the $${revenue.toLocaleString()} risk.`}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Loading exposure data...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {customers.map((customer) => (
                            <EvidenceListItem
                                key={customer.id}
                                title={customer.name}
                                subtitle={`${customer.segment.replace(/_/g, " ")} • Last Order: ${new Date(customer.lastOrderDate).toLocaleDateString()}`}
                                value={formatCurrency(customer.totalSpent, currencyCode)}
                                status="At Risk"
                                icon={<AlertCircle className="w-4 h-4 text-rose-400" />}
                            />
                        ))}
                    </div>
                )}
            </EvidenceModal>
        </>
    );
}
