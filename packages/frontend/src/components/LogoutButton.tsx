"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all duration-200"
      title="Sign out"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:inline">Sign Out</span>
    </button>
  );
}
