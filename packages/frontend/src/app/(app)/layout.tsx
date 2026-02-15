import Link from "next/link";
import { getCurrentUser } from "@brandmind/backend/auth/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNav } from "@/components/MobileNav";
import {
  LayoutDashboard,
  ShoppingBag,
  Megaphone,
  Users,
  BarChart3,
  Settings,
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

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const userInitial = user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-[var(--primary)]/10 relative overflow-hidden">
        {/* Violet accent line at very top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/command-center" className="group shrink-0">
            <BrandLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {modules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all duration-200 group/nav"
              >
                <mod.icon className={`w-4 h-4 ${mod.color} opacity-70 group-hover/nav:opacity-100 transition-opacity`} />
                <span className="hidden xl:inline">{mod.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side: User menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/settings"
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500/20 to-violet-700/20 border border-violet-500/25 rounded-lg flex items-center justify-center text-xs font-bold text-violet-400 shadow-[0_0_12px_rgba(124,58,237,0.15)]">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-[var(--muted-foreground)] max-w-[120px] truncate hidden md:block">
                {user.name || user.email}
              </span>
            </div>

            <LogoutButton />

            {/* Mobile Nav Toggle */}
            <MobileNav userName={user.name || user.email} userInitial={userInitial || "U"} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <span>&copy; 2026 BrandMindAI</span>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:text-[var(--foreground)] transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
