import { getCurrentUser, getCurrentShop } from "@brandmind/backend/auth/session";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { SettingsForms } from "@/components/settings/SettingsForms";
import { prisma } from "@brandmind/shared";

export default async function SettingsPage() {
    const user = await getCurrentUser();
    const shop = await getCurrentShop();

    const metaAccount = shop ? await prisma.metaAccount.findUnique({
        where: { shopId: shop.id },
        select: { status: true, name: true }
    }) : null;

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--primary-border)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
                    <Settings className="w-3 h-3" />
                    System Settings
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    Account <span className="text-[var(--primary)]">Settings</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed">
                    Manage your personal information, security preferences, and connected shop configurations.
                </p>
            </div>

            <SettingsForms
                user={user}
                shop={shop}
                metaConnected={metaAccount?.status === 'active'}
                metaAdAccountName={metaAccount?.name}
            />
        </div>
    );
}
