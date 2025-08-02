import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { DashboardHeader } from "./_components/dashboard-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-background">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                        <DashboardHeader />
                        <main className="flex-1 p-6">{children}</main>
                    </div>
                </div>
            </SidebarProvider>
        </>
    )
}