"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { canUserModerate } from "@/actions/reports";

export function useModerationPermissions() {
  const { data: session, status } = useSession();
  const [canModerate, setCanModerate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermissions() {
      if (status === "loading") {
        return;
      }

      if (!session?.user?.id) {
        setCanModerate(false);
        setLoading(false);
        return;
      }

      try {
        const hasPermission = await canUserModerate();
        setCanModerate(hasPermission);
      } catch (error) {
        console.error("Erro ao verificar permissões de moderação:", error);
        setCanModerate(false);
      } finally {
        setLoading(false);
      }
    }

    checkPermissions();
  }, [session, status]);

  return {
    canModerate,
    loading,
    isAuthenticated: !!session?.user?.id,
    user: session?.user
  };
}
