import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
    {
        variants: {
            variant: {
                default:
                    "border-[var(--primary-border)] bg-[var(--primary-muted)] text-[var(--primary)]",
                secondary:
                    "border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)]",
                destructive:
                    "border-rose-500/20 bg-rose-500/10 text-rose-400",
                outline: "border-[var(--border)] text-[var(--muted-foreground)]",
                blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
                emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
                pink: "border-pink-500/20 bg-pink-500/10 text-pink-400",
                amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
                rose: "border-rose-500/20 bg-rose-500/10 text-rose-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
