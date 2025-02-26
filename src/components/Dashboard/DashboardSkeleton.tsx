"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function DashboardSkeleton() {
  return (
    <main className="flex-1 p-6 space-y-8 animate-pulse">
      {/* Perfil do Usuário - Skeleton */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-primary/5" />
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row items-center gap-6 relative">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="w-full md:w-2/3 text-center md:text-left">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-36 mb-4" />
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-full max-w-sm mt-2" />
              </div>
              <div className="flex gap-4 mt-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 md:ml-auto" />
          </div>
        </CardContent>
      </Card>

      {/* Nova Publicação - Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas - Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Últimas Atividades - Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    {i === 2 && <Skeleton className="w-8 h-8 rounded-full" />}
                    <div className="flex-1">
                      <Skeleton className="h-5 w-4/5 mb-2" />
                      <Skeleton className="h-4 w-full max-w-md mb-2" />
                      <div className="flex items-center gap-4 mt-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}