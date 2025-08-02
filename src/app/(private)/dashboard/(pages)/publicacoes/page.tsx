import { PostsDashboardContent } from "./_components/profile-dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PostsDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    console.log("usuário aqui ó: ", user.id);

    return (
        <div>
            <PostsDashboardContent userId={user?.id || ""} />
        </div>
    )
}