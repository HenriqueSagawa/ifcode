"use client";

import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-black">
      <div className="flex h-16 items-center justify-end px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
} 