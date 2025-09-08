import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NavbarComponent } from "@/components/Navbar";
import { ModerationPostsPanel } from "@/app/(private)/moderation/_components/ModerationPostsPanel";
import { ModerationCommentsPanel } from "@/app/(private)/moderation/_components/ModerationCommentsPanel";
import { UserSuspensionPanel } from "@/app/(private)/moderation/_components/UserSuspensionPanel";

export default async function ModerationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <NavbarComponent/>
            {children}
            {/* Painéis de moderação adicionais */}
            <div className="container mx-auto px-4 py-8 space-y-6">
                <ModerationPostsPanel/>
                <ModerationCommentsPanel/>
                <UserSuspensionPanel/>
            </div>
        </div>
    )
}