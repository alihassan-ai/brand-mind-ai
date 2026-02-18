"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronRight, UserX, Loader2 } from "lucide-react";
import { EvidenceModal, EvidenceListItem } from "@/components/evidence/EvidenceModal";
import { getAtRiskCustomers } from "@/app/actions/evidence";
import { formatCurrency } from "@/lib/formatter";

interface ChurnRiskBannerProps {
    count: number;
    revenue: number;
    currencyCode: string;
}

export function ChurnRiskBanner({ count, revenue, currencyCode }: ChurnRiskBannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    const handleViewCustomers = async () => {
        setIsOpen(true);
        if (customers.length === 0) {
            setIsLoading(true);
            try {
                const data = await getAtRiskCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch at-risk customers", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (count === 0) return null;

    return (
        <>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 group cursor-pointer hover:bg-rose-500/15 transition-all" onClick={handleViewCustomers}>
                <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
                    <div>
                        <p className="font-clash font-bold text-lg group-hover:text-rose-400 transition-colors">
                            {count} customers at risk of churning
                        </p>
                        <p className="text-[var(--muted-foreground)] text-sm">
                            Representing {formatCurrency(revenue, currencyCode)} in historical revenue
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider group-hover:bg-rose-500/20 transition-all">
                    View List <ChevronRight className="w-4 h-4" />
                </div>
            </div>

            <EvidenceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="At-Risk Customer List"
                subtitle={`Top 50 customers by value identified as at-risk or hibernating.`}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Loading customer data...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {customers.map((customer) => (
                            <EvidenceListItem
                                key={customer.id}
                                title={customer.name}
                                subtitle={customer.email}
                                value={formatCurrency(customer.totalSpent, currencyCode)}
                                status={customer.segment.replace(/_/g, " ")}
                                icon={<UserX className="w-4 h-4" />}
                            />
                        ))}
                    </div>
                )}
            </EvidenceModal>
        </>
    );
}
