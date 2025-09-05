import { Suspense } from "react"
import { ProfileDashboardContent } from "./_components/profile-content"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BackButton } from "@/components/BackButton"

function ProfileSkeleton() {
  return (
    <div className="min-h-screen p-4 bg-transparent transition-colors duration-300">
      <div className="mb-6">
        <BackButton fallbackUrl="/dashboard" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Coluna Esquerda - Perfil Principal */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-800 h-fit">
            <div className="relative">
              {/* Banner Skeleton */}
              <Skeleton className="h-48 w-full rounded-none" />
              
              {/* Avatar Skeleton */}
              <div className="absolute -bottom-16 left-8">
                <Skeleton className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-700" />
              </div>
            </div>

            <CardContent className="pt-20 pb-8">
              <div className="space-y-6">
                {/* Nome e Action Buttons */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between sm:flex-row flex-col sm:space-x-4">
                    <div className="flex-1">
                      <Skeleton className="h-9 w-64 mb-2" />
                    </div>
                    
                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded" />
                    <Skeleton className="h-5 w-48" />
                  </div>

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Biografia Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Informações Pessoais e Habilidades */}
        <div className="space-y-6">

          {/* Informações Pessoais Skeleton */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Data de Nascimento */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades Skeleton */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-18 rounded-full" />
                <Skeleton className="h-7 w-22 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

async function ProfileData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
    return null;
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
      <div className="mb-6">
        <BackButton fallbackUrl="/dashboard" />
      </div>
      <ProfileDashboardContent userData={session?.user} />
    </div>
  )
}

export default function DashboardProfile() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData />
    </Suspense>
  )
}