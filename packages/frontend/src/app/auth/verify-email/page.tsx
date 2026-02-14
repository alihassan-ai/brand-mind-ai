"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md relative animate-slide-up text-center">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <Link href="/">
                        <BrandLogo size="lg" />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-10 space-y-8">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                            <Mail className="w-10 h-10 text-[var(--primary)] text-glow-amber" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-clash font-bold text-[var(--foreground)] tracking-tight">Confirm your email</h1>
                        <p className="text-[var(--muted-foreground)] leading-relaxed">
                            We&apos;ve sent a verification link to your email address.
                            Please click the link to activate your BrandMindAI account.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors group"
                        >
                            Return to Login
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-xs text-[var(--muted-foreground)] uppercase tracking-widest font-bold opacity-50">
                    Industry Standard Security Protocol Enforced
                </p>
            </div>
        </div>
    );
}
