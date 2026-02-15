"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Settings, LogOut,
  LayoutDashboard, ShoppingBag, Megaphone, Users, BarChart3
} from "lucide-react";

const modules = [
  {
    label: "Command Center",
    href: "/command-center",
    icon: LayoutDashboard,
    color: "text-amber-400",
    activeColor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
  {
    label: "Product Intelligence",
    href: "/product-intelligence",
    icon: ShoppingBag,
    color: "text-blue-400",
    activeColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    label: "Growth Engine",
    href: "/growth-engine",
    icon: Megaphone,
    color: "text-emerald-400",
    activeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    label: "Customer Intelligence",
    href: "/customer-intelligence",
    icon: Users,
    color: "text-purple-400",
    activeColor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
  {
    label: "Business Intelligence",
    href: "/business-intelligence",
    icon: BarChart3,
    color: "text-pink-400",
    activeColor: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  },
];

interface MobileNavProps {
  userName: string;
  userInitial: string;
}

export function MobileNav({ userName, userInitial }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
        aria-label="Toggle menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-16 right-0 bottom-0 w-72 bg-[var(--background-card)] border-l border-[var(--border)] z-50 flex flex-col animate-slide-down overflow-y-auto">
            {/* User info */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/25 rounded-lg flex items-center justify-center text-sm font-bold text-violet-400">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{userName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Active</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
              {modules.map((mod) => {
                const isActive = pathname === mod.href || pathname.startsWith(mod.href + "/");
                return (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? `${mod.activeColor} border`
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                    }`}
                  >
                    <mod.icon className={`w-4 h-4 ${mod.color}`} />
                    {mod.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-[var(--border)] space-y-1">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-rose-400 hover:bg-rose-500/5 transition-all w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
