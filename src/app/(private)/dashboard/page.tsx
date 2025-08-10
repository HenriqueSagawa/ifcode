import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "./_components/dashboard-content";
import { getUserPosts } from "./(pages)/publicacoes/_actions/get-posts";
import { getUserRankingStats, getUserRecentActivity } from "./_actions/get-ranking-stats";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id as string;

    // Buscar dados em paralelo para melhor performance
    const [posts, rankingStats, recentActivity] = await Promise.all([
        getUserPosts(userId),
        getUserRankingStats(userId),
        getUserRecentActivity(userId)
    ]);

    const recentPosts = posts.slice(-5);

    return (
        <div className="">
            <DashboardContent 
                user={session?.user} 
                recentPosts={recentPosts}
                rankingStats={rankingStats}
                recentActivity={recentActivity}
            />
        </div>
    );
}