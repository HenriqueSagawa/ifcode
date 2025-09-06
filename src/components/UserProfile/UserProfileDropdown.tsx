"use client"

import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";

// UI Components
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@heroui/dropdown";

// Types
interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "user" | "moderator" | "admin" | "superadmin";
}

interface UserProfileDropdownProps {
  user?: User | null;
  onLogout?: () => void;
}

export function UserProfileDropdown({ 
  user = null, 
  onLogout = () => { signOut() } 
}: UserProfileDropdownProps) {
  const hasSession = user !== null && user !== undefined;
  const canModerate = user?.role === "moderator" || user?.role === "admin" || user?.role === "superadmin";

  if (!hasSession) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar 
          isBordered 
          as="button" 
          className="transition-transform" 
          color="success" 
          name={user?.name || "Usuário"} 
          size="sm" 
          src={user?.image || ""} 
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Conectado como</p>
          <p className="font-semibold">{user?.email || "Email não disponível"}</p>
        </DropdownItem>
        <DropdownItem key="dashboard">
          <Link href="/dashboard" className="block">Dashboard</Link>
        </DropdownItem>
        <DropdownItem key="profile-page">
          <Link href={`/perfil/${user?.id}`} className="block">Meu perfil</Link>
        </DropdownItem>
        {canModerate ? (
          <DropdownItem key="moderation">
            <Link href="/moderation" className="flex items-center gap-2">
              <FaShieldAlt className="w-4 h-4" />
              Painel de Moderação
            </Link>
          </DropdownItem>
        ) : null}
        <DropdownItem key="logout" color="danger">
          <button 
            className="w-full h-full text-left" 
            onClick={onLogout}
          >
            Sair
          </button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
