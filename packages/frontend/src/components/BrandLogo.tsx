import React from "react";
import { Sparkles } from "lucide-react";

export function BrandLogo({ className = "", size = "default" }: { className?: string; size?: "default" | "lg" }) {
    const iconSize = size === "lg" ? "w-6 h-6" : "w-5 h-5";
    const containerSize = size === "lg" ? "w-11 h-11" : "w-9 h-9";
    const textSize = size === "lg" ? "text-2xl" : "text-lg";

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className={`${containerSize} bg-gradient-to-br from-violet-600/20 to-violet-900/30 border border-violet-500/30 rounded-xl flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.2)]`}>
                <Sparkles className={`${iconSize} text-violet-400`} />
            </div>
            <span className={`${textSize} font-bold tracking-tight text-[var(--foreground)]`}>
                BrandMind<span className="text-gradient-violet">AI</span>
            </span>
        </div>
    );
}
