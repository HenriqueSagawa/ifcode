"use client";

import { useState } from "react";
import { suspendUser, unsuspendUser, removeUserSuspension } from "@/actions/userSuspension";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addToast } from "@heroui/toast";

export function UserSuspensionPanel() {
  const [userId, setUserId] = useState("");
  const [hours, setHours] = useState("24");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const doSuspend = async () => {
    setLoading(true);
    try {
      const res = await suspendUser(userId.trim(), Number(hours) || 24, reason.trim());
      if (!res.success) throw new Error(res.message);
      addToast({ title: "Sucesso", description: "Usuário suspenso", color: "success" });
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Falha ao suspender", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const doUnsuspend = async () => {
    setLoading(true);
    try {
      const res = await unsuspendUser(userId.trim());
      if (!res.success) throw new Error(res.message);
      addToast({ title: "Sucesso", description: "Usuário reativado", color: "success" });
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Falha ao reativar", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const doRemoveSuspension = async () => {
    setLoading(true);
    try {
      const res = await removeUserSuspension(userId.trim());
      if (!res.success) throw new Error(res.message);
      addToast({ title: "Sucesso", description: "Suspensão removida", color: "success" });
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Falha ao remover suspensão", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-muted/50 border-gray-700">
      <CardHeader>
        <CardTitle>Suspender Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <Input placeholder="horas" type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
        <Input placeholder="motivo (opcional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          <Button disabled={loading || !userId.trim()} onClick={doSuspend}>Suspender</Button>
          <Button variant="secondary" disabled={loading || !userId.trim()} onClick={doUnsuspend}>Reativar</Button>
          <Button variant="outline" disabled={loading || !userId.trim()} onClick={doRemoveSuspension}>Remover Suspensão</Button>
        </div>
      </CardContent>
    </Card>
  );
}


