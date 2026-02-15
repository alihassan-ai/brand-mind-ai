"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Activity,
    ShieldCheck,
    ChevronLeft
} from "lucide-react";

const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Shops', href: '/admin/shops', icon: ShoppingBag },
    { name: 'System Health', href: '/admin/health', icon: Activity },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-[var(--border)] bg-[var(--background-card)] flex flex-col sticky top-0 h-screen">
            <div className="p-6 border-b border-[var(--border)]">
                <Link href="/" className="flex items-center gap-2">
                    <BrandLogo size="default" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-tighter self-center">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-primary)]'
                                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[var(--border)]">
                <Link
                    href="/command-center"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Terminal
                </Link>
                <div className="mt-4 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                    <div className="flex items-center gap-2 text-violet-400 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Admin Access</span>
                    </div>
                    <p className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                        Elevated privileges enabled for system oversight.
                    </p>
                </div>
            </div>
        </aside>
    );
}
