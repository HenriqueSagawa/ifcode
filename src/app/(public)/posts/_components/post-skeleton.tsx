import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <Card className="bg-muted dark:bg-zinc-950 border-border/40 overflow-hidden">
      <CardContent className="p-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <Skeleton className="w-11 h-11 rounded-full" />
            <div className="text-left space-y-1">
              {/* Author name skeleton */}
              <Skeleton className="h-4 w-24" />
              {/* Date skeleton */}
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          {/* Badge skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Content Skeleton */}
        <div className="mb-4">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 mb-2" />
          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Code snippet skeleton */}
        <div className="mb-4">
          <div className="bg-muted rounded-lg p-3 border border-border/60">
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>

        {/* Language skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 border border-border">
            <Skeleton className="w-3.5 h-3.5" />
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-1">
            {/* Like button skeleton */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-3 w-4" />
            </div>
            {/* Comment button skeleton */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          {/* Share button skeleton */}
          <div className="p-2 rounded-full">
            <Skeleton className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PostsPageSkeleton() {
  return (
    <div className="min-h-screen bg-muted dark:bg-zinc-950 text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-400">IFCode</h1>
              <p className="text-muted-foreground text-sm">Comunidade de desenvolvedores</p>
            </div>

            {/* Search Bar Skeleton */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Skeleton */}
          <div className="w-80 flex-shrink-0">
            <Card className="bg-muted dark:bg-zinc-950 border border-border/40">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Filter sections skeleton */}
                  {[1, 2, 3, 4].map((section) => (
                    <div key={section} className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <div className="space-y-1">
                        {[1, 2, 3].map((item) => (
                          <Skeleton key={item} className="h-4 w-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Results Info Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Posts Skeletons */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((post) => (
                <PostSkeleton key={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}