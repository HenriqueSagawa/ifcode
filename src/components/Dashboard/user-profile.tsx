// components/dashboard/user-profile.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Edit, Github, Phone, User, Mail, Calendar } from "lucide-react";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  bio: string;
  github: string;
  phone: string;
};

// Mock data - em produção, você buscaria esses dados da API
const profileData: ProfileData = {
  id: "usr_12345",
  name: "João Silva",
  email: "joao.silva@email.com",
  avatar: "/api/placeholder/150/150",
  memberSince: "Janeiro 2023",
  bio: "Desenvolvedor Full Stack com experiência em React, Next.js e Node.js. Apaixonado por criar interfaces de usuário elegantes e funcionais.",
  github: "github.com/joaosilva",
  phone: "+55 (11) 98765-4321",
};

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const handleShare = () => {
    // Implementar funcionalidade de compartilhamento
    navigator.clipboard.writeText(`https://seusite.com/perfil/${profileData.id}`);
    alert("Link do perfil copiado para a área de transferência!");
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Perfil do Usuário</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm" 
            onClick={toggleEditMode}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Salvar" : "Editar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image 
                src={profileData.avatar} 
                alt={profileData.name}
                fill
                className="object-cover" 
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {profileData.id}</p>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profileData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Membro desde: {profileData.memberSince}</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profileData.github}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profileData.phone}</span>
            </div>
            <div className="col-span-1 md:col-span-2 mt-4">
              <h4 className="text-sm font-medium mb-2">Biografia</h4>
              <p className="text-sm text-muted-foreground">{profileData.bio}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}