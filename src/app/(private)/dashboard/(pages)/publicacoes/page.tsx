import { Suspense } from "react"
import { PostsDashboardContent } from "./_components/posts-dashboard"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserPosts } from "./_actions/get-posts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, User, Eye } from "lucide-react"

function PostsDashboardSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card Total */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>

          {/* Card Recebidos */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-6" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Card Feitos */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>

          {/* Card Pendentes */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-8 w-6" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>

          {/* Card Aprovados */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-18" />
              </div>
            </CardContent>
          </Card>

          {/* Card Rejeitados */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-8 w-6" />
                <Skeleton className="h-4 w-18" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-md">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-md">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-md">
            <User className="h-4 w-4 text-gray-400" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Comments Section */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-80" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Comment Item 1 */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-32" />
                      <div className="flex items-center space-x-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
              
              <div className="space-y-2 ml-13">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="flex items-center space-x-4 ml-13">
                <Skeleton className="h-8 w-20" />
              </div>
            </div>

            {/* Comment Item 2 */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-32" />
                      <div className="flex items-center space-x-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
              
              <div className="space-y-2 ml-13">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="flex items-center space-x-4 ml-13">
                <Skeleton className="h-8 w-20" />
              </div>
            </div>

            {/* Comment Item 3 */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-32" />
                      <div className="flex items-center space-x-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
              
              <div className="space-y-2 ml-13">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="flex items-center space-x-4 ml-13">
                <Skeleton className="h-8 w-20" />
              </div>
            </div>

            {/* Loading more */}
            <div className="text-center py-4">
              <Skeleton className="h-8 w-32 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function PostsData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
    return null;
  }

  const user = session.user;
  const userPosts = await getUserPosts(user?.id || "");

  return <PostsDashboardContent userId={user?.id || ""} initialPosts={userPosts} />
}

export default function PostsDashboardPage() {
  return (
    <Suspense fallback={<PostsDashboardSkeleton />}>
      <PostsData />
    </Suspense>
  )
}