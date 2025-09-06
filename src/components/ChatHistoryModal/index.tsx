'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, MessageSquare, Calendar, Clock } from 'lucide-react';
import { ChatHistory, ChatMessage } from '@/types/chatHistory';
import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onLoadConversation: (messages: ChatMessage[]) => void;
}

export function ChatHistoryModal({ isOpen, onClose, userId, onLoadConversation }: ChatHistoryModalProps) {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchChatHistories();
    }
  }, [isOpen, userId]);

  const fetchChatHistories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat-history?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        console.log("Chat histories loaded:", data.chatHistories);
        setChatHistories(data.chatHistories);
      } else {
        addToast({
          title: "Erro",
          description: data.error || "Erro ao carregar histórico",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      addToast({
        title: "Erro",
        description: "Erro ao carregar histórico de conversas",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = async (historyId: string) => {
    try {
      const response = await fetch(`/api/chat-history?id=${historyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChatHistories(prev => prev.filter(history => history.id !== historyId));
        addToast({
          title: "Sucesso",
          description: "Conversa deletada com sucesso",
          color: "success",
        });
      } else {
        const data = await response.json();
        addToast({
          title: "Erro",
          description: data.error || "Erro ao deletar conversa",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar conversa:", error);
      addToast({
        title: "Erro",
        description: "Erro ao deletar conversa",
        color: "danger",
      });
    }
  };

  const handleLoadConversation = (history: ChatHistory) => {
    onLoadConversation(history.messages);
    onClose();
  };

  const formatDate = (date: Date | string) => {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  const getPreviewMessage = (messages: ChatMessage[]) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return "Nenhuma mensagem";
    
    const preview = lastMessage.content.substring(0, 100);
    return preview.length < lastMessage.content.length ? `${preview}...` : preview;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Histórico de Conversas
          </DialogTitle>
          <DialogDescription>
            Selecione uma conversa para continuar ou visualizar o histórico
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : chatHistories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma conversa encontrada</p>
              <p className="text-sm">Suas conversas aparecerão aqui</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {chatHistories.map((history) => (
                  <Card
                    key={history.id}
                    className="p-4 cursor-pointer transition-all hover:shadow-md border group border-border hover:border-primary/50"
                    onClick={() => handleLoadConversation(history)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-sm truncate">
                            {history.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {history.messages.length} mensagens
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {getPreviewMessage(history.messages)}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {history.createdAt ? formatDate(history.createdAt) : 'Data não disponível'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {history.updatedAt ? formatDate(history.updatedAt) : 'Data não disponível'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHistory(history.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
