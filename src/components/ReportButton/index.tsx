"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { ReportModal } from "./ReportModal";
import { ReportableContentType } from "@/types/reports";

interface ReportButtonProps {
  contentId: string;
  contentType: ReportableContentType;
  hasReported?: boolean;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ReportButton({ 
  contentId, 
  contentType, 
  hasReported = false,
  className = "",
  variant = "ghost",
  size = "sm"
}: ReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReport = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleReport}
        disabled={hasReported}
        className={`text-muted-foreground hover:text-red-500 hover:bg-red-500/5 px-3 py-1.5 h-auto rounded-full transition-all ${
          hasReported ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <Flag className="w-4 h-4 mr-1.5" />
        <span className="text-xs font-medium">
          {hasReported ? "Denunciado" : "Denunciar"}
        </span>
      </Button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentId={contentId}
        contentType={contentType}
      />
    </>
  );
}
