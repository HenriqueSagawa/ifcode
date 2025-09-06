"use client";

import { useModerationPermissions } from "@/hooks/useModerationPermissions";
import { Loader } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield } from "lucide-react";

interface ModerationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ModerationGuard({ children, fallback }: ModerationGuardProps) {
  const { canModerate, loading, isAuthenticated } = useModerationPermissions();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-muted/50 border-gray-700 max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <CardTitle className="text-white">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar esta área.
            </p>
            <p className="text-sm text-muted-foreground">
              Faça login para continuar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canModerate) {
    return fallback || (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-muted/50 border-gray-700 max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <CardTitle className="text-white">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para acessar o painel de moderação.
            </p>
            <p className="text-sm text-muted-foreground">
              Apenas moderadores, administradores e super administradores podem acessar esta área.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
