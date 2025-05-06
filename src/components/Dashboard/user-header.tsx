// Diretiva do Next.js para Client Component, necessária para useState e interações (Dialog, botões).
"use client";

import { useState } from "react"; // Hook do React para gerenciar o estado (ex: modo de edição).
// Importações de componentes UI (presumivelmente Shadcn/ui ou similar)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Componentes para modal de edição
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Importações de ícones da biblioteca lucide-react
import { ShareIcon, PencilIcon, GithubIcon, PhoneIcon } from "lucide-react";

/**
 * Interface que define a estrutura dos dados do usuário esperados pelo componente.
 * @typedef {object} UserData
 * @property {string} id - Identificador único do usuário.
 * @property {string} name - Primeiro nome do usuário.
 * @property {string} email - Endereço de email do usuário.
 * @property {string} [bio] - Biografia curta do usuário (opcional).
 * @property {string} [birthDate] - Data de nascimento (opcional, não usado neste componente visualmente).
 * @property {string} createdAt - Data de criação da conta do usuário (formatada como string).
 * @property {string} [github] - Nome de usuário ou URL do GitHub (opcional).
 * @property {string} lastName - Sobrenome do usuário (não usado diretamente neste componente visualmente, mas parte da interface).
 * @property {string} [phone] - Número de telefone do usuário (opcional).
 * @property {string} [profileImage] - URL da imagem de perfil do usuário (opcional).
 * @property {any} [fullData] - Campo genérico para dados adicionais (opcional, tipo 'any' deve ser usado com cautela).
 */
interface UserData {
  id: string,
  name: string,
  email: string,
  bio?: string,
  birthDate?: string, // Não exibido diretamente neste componente
  createdAt: string, // Exibido como "Membro desde"
  github?: string,
  lastName: string, // Não exibido diretamente neste componente
  phone?: string,
  profileImage?: string,
  fullData?: any // Para dados extras não estruturados
}

/**
 * Props para o componente UserHeader.
 * @typedef {object} UserHeaderProps
 * @property {UserData} user - O objeto contendo os dados do usuário a serem exibidos.
 */
interface UserHeaderProps {
  user: UserData;
}

/**
 * Componente que exibe o cabeçalho do perfil de um usuário.
 * Mostra avatar, nome, email, bio, links sociais (GitHub), telefone,
 * data de entrada e ID. Inclui botões para compartilhar o perfil
 * e para editar as informações (abre um Dialog/Modal).
 *
 * @component
 * @param {UserHeaderProps} props - As propriedades do componente, contendo os dados do usuário.
 * @returns {JSX.Element} O elemento JSX que renderiza o cabeçalho do perfil do usuário.
 */
export function UserHeader({ user }: UserHeaderProps) {
  // Estado para controlar se o Dialog de edição está aberto ou fechado.
  const [isEditing, setIsEditing] = useState(false);
  // Estado para armazenar os dados do usuário enquanto estão sendo editados no Dialog.
  // Inicializado com os dados recebidos via props.
  const [editedUser, setEditedUser] = useState(user);

  /**
   * Função chamada ao clicar no botão "Salvar Alterações" no Dialog de edição.
   * TODO: Implementar a lógica para enviar os dados de `editedUser` para a API
   * e atualizar os dados do usuário permanentemente.
   * Atualmente, apenas fecha o Dialog.
   */
  const handleSave = () => {
    // Aqui você chamaria sua API para salvar os dados em `editedUser`
    console.log("Salvando alterações (simulação):", editedUser);
    // Após salvar (ou se der erro, tratar), fecha o dialog.
    setIsEditing(false);
    // Opcionalmente, atualizar o estado `user` original se a edição for bem-sucedida
    // (depende de como os dados são gerenciados na página pai).
  };

  /**
   * Função chamada ao clicar no botão "Compartilhar".
   * Copia um link (atualmente hardcoded) para a área de transferência.
   * Exibe um alerta simples de confirmação.
   */
  const handleShareProfile = () => {
    // TODO: Substituir a URL hardcoded pela URL real do perfil.
    const profileUrl = `${window.location.origin}/perfil/${user.id}`; // Usa a origem atual + /perfil/id
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        // Idealmente, usar um Toast em vez de alert.
        alert("Link do perfil copiado para a área de transferência!");
      })
      .catch(err => {
        console.error("Erro ao copiar link:", err);
        alert("Não foi possível copiar o link.");
      });
  };

  // Logs para depuração durante o desenvolvimento. Podem ser removidos em produção.
  // console.log("Objeto user recebido:", user);

  // Renderização do JSX
  return (
    // Card principal
    <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-md">
      <CardContent className="p-6">
        {/* Layout flexível para responsividade (coluna em mobile, linha em desktop) */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Seção Esquerda: Avatar e Informações Básicas */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            {/* Avatar do usuário */}
            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src={user.profileImage} alt={user.name} />
              {/* Fallback com a inicial do nome se a imagem não carregar */}
              <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
            {/* Informações de ID e Data de Criação */}
            <div className="mt-4 text-center md:text-left space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Membro desde {user.createdAt}</p>
            </div>
          </div>

          {/* Seção Central: Detalhes Principais do Usuário */}
          <div className="flex-grow space-y-4">
            {/* Nome e Email */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name} {user.lastName}</h2> {/* Exibe nome completo */}
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>

            {/* Bio e Links/Contato */}
            <div className="space-y-2">
              {/* Exibe a bio se existir */}
              {user.bio && (
                 <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
              )}
               {/* Container para links/contato */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                 {/* Exibe GitHub se existir */}
                {user.github && (
                  <a
                    href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub</span> {/* Ou mostrar user.github se for só o nome */}
                  </a>
                )}
                 {/* Exibe Telefone se existir */}
                {user.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção Direita: Botões de Ação */}
          {/* `md:self-start` alinha os botões ao topo em telas maiores */}
          <div className="flex gap-2 mt-4 md:mt-0 md:self-start flex-shrink-0">
             {/* Botão Compartilhar */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProfile}
              className="flex items-center gap-1"
              aria-label="Compartilhar perfil"
            >
              <ShareIcon className="h-4 w-4" />
              Compartilhar
            </Button>

            {/* Dialog (Modal) para Edição de Perfil */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              {/* Botão que abre o Dialog */}
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center gap-1" aria-label="Editar perfil">
                  <PencilIcon className="h-4 w-4" />
                  Editar
                </Button>
              </DialogTrigger>
              {/* Conteúdo do Dialog */}
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                {/* Formulário de Edição (dentro do Dialog) */}
                <div className="grid gap-4 py-4">
                  {/* Campo Nome */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editedUser.name || ''} // Controlado pelo estado editedUser
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} // Atualiza estado ao digitar
                      className="col-span-3"
                    />
                  </div>
                   {/* Campo Sobrenome */}
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-lastName" className="text-right">Sobrenome</Label>
                    <Input
                      id="edit-lastName"
                      value={editedUser.lastName || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  {/* Campo Email */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">Email</Label>
                    <Input
                      id="edit-email"
                      type="email" // Tipo email para validação básica
                      value={editedUser.email || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  {/* Campo Bio */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-bio" className="text-right">Bio</Label>
                    <Textarea
                      id="edit-bio"
                      value={editedUser.bio || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                      className="col-span-3"
                      placeholder="Fale um pouco sobre você..."
                    />
                  </div>
                  {/* Campo GitHub */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-github" className="text-right">GitHub</Label>
                    <Input
                      id="edit-github"
                      value={editedUser.github || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, github: e.target.value })}
                      className="col-span-3"
                      placeholder="username ou https://github.com/username"
                    />
                  </div>
                  {/* Campo Telefone */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">Telefone</Label>
                    <Input
                      id="edit-phone"
                      type="tel" // Tipo telefone
                      value={editedUser.phone || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="col-span-3"
                      placeholder="(XX) XXXXX-XXXX"
                    />
                  </div>
                   {/* TODO: Adicionar campo para editar profileImage (URL ou upload) */}
                </div>
                 {/* Rodapé do Dialog com botões de Ação */}
                <div className="flex justify-end pt-4">
                  {/* Botão Cancelar */}
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                    Cancelar
                  </Button>
                  {/* Botão Salvar Alterações */}
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