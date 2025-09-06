"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Shield, 
  UserPlus,
  Search,
  Crown
} from "lucide-react";
import { promoteUserToAdmin, searchUserByEmail } from "@/actions/userManagement";
import { addToast } from "@heroui/toast";
import { useSession } from "next-auth/react";

export function ModerationDashboard() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearchUser = async () => {
    if (!email.trim()) {
      addToast({
        title: "Erro",
        description: "Por favor, digite um email válido",
        color: "danger",
      });
      return;
    }

    setSearching(true);
    try {
      const result = await searchUserByEmail(email);
      if (result.success) {
        setSearchResult(result.user);
      } else {
        addToast({
          title: "Erro",
          description: result.message,
          color: "danger",
        });
        setSearchResult(null);
      }
    } catch (error) {
      addToast({
        title: "Erro",
        description: "Erro ao buscar usuário",
        color: "danger",
      });
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  const handlePromoteUser = async () => {
    if (!searchResult) return;

    setPromoting(true);
    try {
      const result = await promoteUserToAdmin(searchResult.id);
      if (result.success) {
        addToast({
          title: "Sucesso",
          description: `Usuário ${searchResult.name} foi promovido a administrador`,
          color: "success",
        });
        setSearchResult(null);
        setEmail("");
      } else {
        addToast({
          title: "Erro",
          description: result.message,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Erro",
        description: "Erro ao promover usuário",
        color: "danger",
      });
    } finally {
      setPromoting(false);
    }
  };

  const canPromoteUsers = session?.user?.role === "admin" || session?.user?.role === "superadmin";

  return (
    <div className="space-y-6">
      {/* Gerenciar Usuários */}
      {canPromoteUsers && (
        <Card className="bg-muted/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" />
              Gerenciar Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">Promover usuário a administrador</Label>
              <div className="flex gap-2">
                <Input
                  id="user-email"
                  type="email"
                  placeholder="Digite o email do usuário"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearchUser}
                  disabled={searching}
                  variant="outline"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {searching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>

            {searchResult && (
              <div className="p-4 bg-muted/30 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {searchResult.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{searchResult.name}</p>
                      <p className="text-sm text-muted-foreground">{searchResult.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Role atual: {searchResult.role || "user"}
                      </p>
                    </div>
                  </div>
                  
                  {searchResult.role === "superadmin" ? (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Super Admin</span>
                    </div>
                  ) : searchResult.role === "admin" ? (
                    <div className="flex items-center gap-2 text-blue-500">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Já é Admin</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handlePromoteUser}
                      disabled={promoting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {promoting ? "Promovendo..." : "Promover a Admin"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card className="bg-muted/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <Users className="w-4 h-4 mr-2" />
            Atualizar Dados
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            size="sm"
            onClick={() => window.open('/moderation', '_blank')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Abrir em Nova Aba
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
