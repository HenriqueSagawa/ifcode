"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShareIcon, PencilIcon, GithubIcon, PhoneIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UserData {
  id: string,
  name: string,
  email: string,
  bio?: string,
  birthDate?: string,
  createdAt: string,
  github?: string,
  lastName: string,
  phone?: string,
  profileImage?: string,
  fullData?: any
}

interface UserHeaderProps {
  user: UserData;
}

export function UserHeader({ user }: UserHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleShareProfile = () => {
    // Implementar funcionalidade para compartilhar perfil
    navigator.clipboard.writeText(`https://seusite.com/perfil/${user.id}`);
    alert("Link do perfil copiado para a área de transferência!");
  };

  console.log("esse é o objeto");
  console.log(user);

  return (
    <Card className="overflow-hidden bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar e informações básicas */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center md:text-left">
              <p className="text-xs text-gray-500">ID: {user.id}</p>
              <p className="text-xs text-gray-500">Membro desde {user.createdAt}</p>
            </div>
          </div>

          {/* Detalhes do usuário */}
          <div className="flex-grow space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">{user.bio}</p>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GithubIcon className="h-4 w-4" />
                  {user.github}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  {user.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 mt-4 md:mt-0 md:self-start">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProfile}
              className="flex items-center gap-1"
            >
              <ShareIcon className="h-4 w-4" />
              Compartilhar
            </Button>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center gap-1">
                  <PencilIcon className="h-4 w-4" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nome</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedUser.bio}
                      onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="github" className="text-right">GitHub</Label>
                    <Input
                      id="github"
                      value={editedUser.github}
                      onChange={(e) => setEditedUser({ ...editedUser, github: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Telefone</Label>
                    <Input
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    Salvar Alterações
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}