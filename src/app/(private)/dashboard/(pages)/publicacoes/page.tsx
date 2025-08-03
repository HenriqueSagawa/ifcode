import { PostsDashboardContent } from "./_components/posts-dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPosts } from "./_actions/get-posts"; // Ajuste o caminho conforme necessário

export default async function PostsDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    const userPosts = await getUserPosts(user?.id || "");

    return (
        <div>
            <PostsDashboardContent userId={user?.id || ""} initialPosts={userPosts} />
        </div>
    )
}