import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "./_components/dashboard-content";
import { getUserPosts } from "./(pages)/publicacoes/_actions/get-posts";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const posts = await getUserPosts(session.user?.id as string);
    const recentPosts = posts.slice(-5)

    return (
        <div className="">
            <DashboardContent user={session?.user} recentPosts={recentPosts} />
        </div>
    )
}