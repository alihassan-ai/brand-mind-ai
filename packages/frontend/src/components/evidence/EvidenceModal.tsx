"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface EvidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function EvidenceModal({ isOpen, onClose, title, subtitle, children }: EvidenceModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[var(--background-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-md">
                    <div>
                        <h3 className="text-xl font-clash font-bold text-[var(--foreground)]">{title}</h3>
                        {subtitle && <p className="text-[var(--muted-foreground)] text-sm">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-[var(--foreground)]/10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Helper component for list items
export function EvidenceListItem({
    title,
    subtitle,
    value,
    status,
    icon
}: {
    title: string;
    subtitle?: string;
    value?: string;
    status?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-[var(--foreground)]/10 transition-colors">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="p-2 rounded-lg bg-[var(--foreground)]/5 text-[var(--muted-foreground)]">
                        {icon}
                    </div>
                )}
                <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">{title}</h4>
                    {subtitle && <p className="text-xs text-[var(--muted-foreground)]">{subtitle}</p>}
                </div>
            </div>
            <div className="text-right">
                {value && <div className="text-sm font-bold text-[var(--foreground)]">{value}</div>}
                {status && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
