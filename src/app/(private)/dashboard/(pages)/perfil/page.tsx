import { ProfileDashboardContent } from "./_components/profile-content"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardProfile() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
        return;
    }

    const userData = {
        id: session?.user?.id,
        name: session.user.name,
        email: session.user.email,
        bio: session.user.bio,
        birthDate: session.user.birthDate,
        createdAt: session.user.createdAt,
        github: session.user.github,
        phone: session.user.phone,
        image: session.user.image,
        bannerImage: session.user.bannerImage,
        skills: session.user.skills || []
    }

    console.log("Essa é minha foto de perfil:", userData.image);


    return (
        <div>
            <ProfileDashboardContent userData={session?.user} />
        </div>
    )
}