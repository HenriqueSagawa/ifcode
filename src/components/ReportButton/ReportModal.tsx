"use client";

import { useState } from "react";
import { createReport } from "@/actions/reports";
import { ReportReason } from "@/types/reports";
import { addToast } from "@heroui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: "post" | "comment";
}

const reportReasons: { value: ReportReason; label: string; description: string }[] = [
  {
    value: "spam",
    label: "Spam",
    description: "Conteúdo repetitivo, promocional ou irrelevante"
  },
  {
    value: "offensive_language",
    label: "Linguagem Ofensiva",
    description: "Uso de palavrões, insultos ou linguagem inadequada"
  },
  {
    value: "harassment",
    label: "Assédio",
    description: "Comportamento que intimida, ameaça ou persegue outros usuários"
  },
  {
    value: "inappropriate_content",
    label: "Conteúdo Inadequado",
    description: "Conteúdo sexual, violento ou inadequado para a plataforma"
  },
  {
    value: "misinformation",
    label: "Desinformação",
    description: "Informações falsas, enganosas ou sem fundamento"
  },
  {
    value: "copyright_violation",
    label: "Violação de Direitos Autorais",
    description: "Uso não autorizado de material protegido por direitos autorais"
  },
  {
    value: "other",
    label: "Outro",
    description: "Outro motivo não listado acima"
  }
];

export function ReportModal({ isOpen, onClose, contentId, contentType }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      addToast({
        title: "Erro",
        description: "Por favor, selecione um motivo para a denúncia.",
        color: "danger",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReport(
        contentId,
        contentType,
        selectedReason as ReportReason,
        description.trim() || undefined
      );

      if (result.success) {
        addToast({
          title: "Sucesso",
          description: result.message,
          color: "success",
        });
        onClose();
        setSelectedReason("");
        setDescription("");
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
        description: "Ocorreu um erro ao enviar a denúncia. Tente novamente.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedReason("");
      setDescription("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-red-500">🚩</span>
            Denunciar {contentType === "post" ? "Post" : "Comentário"}
          </DialogTitle>
          <DialogDescription>
            Ajude-nos a manter a comunidade segura e respeitosa. 
            Sua denúncia será analisada por nossa equipe de moderação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Motivo da denúncia *
            </Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={(value) => setSelectedReason(value as ReportReason)}
              className="space-y-3"
            >
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={reason.value} 
                    id={reason.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={reason.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {reason.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição adicional (opcional)
            </Label>
            <Textarea
              id="description"
              placeholder="Forneça mais detalhes sobre o problema, se necessário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? "Enviando..." : "Enviar Denúncia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
