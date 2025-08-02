import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";
import { DashboardContent } from "./_components/dashboard-content";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="">
            <DashboardContent />
        </div>
    )
}