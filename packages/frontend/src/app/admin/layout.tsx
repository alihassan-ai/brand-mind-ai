import { getCurrentUser } from "@brandmind/backend/auth/session";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    // Strict Admin Check
    if (!user || user.role !== "admin") {
        redirect("/command-center");
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-10 lg:px-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
