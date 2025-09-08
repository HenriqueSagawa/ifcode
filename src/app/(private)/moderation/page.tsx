import { Suspense } from "react";
import { ModerationDashboard } from "@/app/(private)/moderation/_components/ModerationDashboard";
import { ModerationStats } from "@/app/(private)/moderation/_components/ModerationStats";
import { ModerationQueue } from "@/app/(private)/moderation/_components/ModerationQueue";
import { ModerationGuard } from "@/components/ModerationGuard";
import { Loader } from "@/components/Loader";
import { BackButton } from "@/components/BackButton";

export default function ModerationPage() {
  return (
    <ModerationGuard>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <BackButton className="mb-4" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Painel de Moderação</h1>
          <p className="text-muted-foreground">
            Gerencie denúncias e mantenha a comunidade segura
          </p>
        </div>

        <Suspense fallback={<Loader />}>
          <ModerationStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<Loader />}>
              <ModerationQueue />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<Loader />}>
              <ModerationDashboard />
            </Suspense>
          </div>
        </div>
      </div>
    </ModerationGuard>
  );
}
