import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarWithNotifications } from "./_components/sidebar-with-notifications"
import { DashboardHeader } from "./_components/dashboard-header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-background">
                    <SidebarWithNotifications userId={session.user?.id || ""} />
                    <div className="flex-1 flex flex-col">
                        <DashboardHeader user={session.user} />
                        <main className="flex-1 p-6">{children}</main>
                    </div>
                </div>
            </SidebarProvider>
        </>
    )
}