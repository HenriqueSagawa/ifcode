import { ChatHistory, ChatMessage } from '@/types/chatHistory';

export class ChatHistoryService {
  private static instance: ChatHistoryService;

  private constructor() {}

  public static getInstance(): ChatHistoryService {
    if (!ChatHistoryService.instance) {
      ChatHistoryService.instance = new ChatHistoryService();
    }
    return ChatHistoryService.instance;
  }

  // Salvar nova conversa
  async saveConversation(userId: string, title: string, messages: ChatMessage[]): Promise<string> {
    try {
      const response = await fetch('/api/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar conversa');
      }

      return data.id;
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
      throw error;
    }
  }

  // Atualizar conversa existente
  async updateConversation(conversationId: string, title?: string, messages?: ChatMessage[]): Promise<void> {
    try {
      const response = await fetch('/api/chat-history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: conversationId,
          title,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar conversa');
      }
    } catch (error) {
      console.error('Erro ao atualizar conversa:', error);
      throw error;
    }
  }

  // Buscar histórico de conversas do usuário
  async getChatHistories(userId: string): Promise<ChatHistory[]> {
    try {
      const response = await fetch(`/api/chat-history?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar histórico');
      }

      return data.chatHistories;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }

  // Deletar conversa
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`/api/chat-history?id=${conversationId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar conversa');
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      throw error;
    }
  }

  // Gerar título automático baseado na primeira mensagem
  generateTitle(firstMessage: string): string {
    const maxLength = 50;
    const cleanMessage = firstMessage.trim();
    
    if (cleanMessage.length <= maxLength) {
      return cleanMessage;
    }
    
    // Tenta cortar em uma palavra completa
    const truncated = cleanMessage.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  }
}
