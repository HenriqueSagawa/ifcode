import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_CONFIG } from "@/lib/gemini/config";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(model: string = GEMINI_CONFIG.defaultModel) {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    this.model = model;
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const result = await model.generateContent({
        contents: formattedMessages,
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erro ao enviar mensagem para o Gemini:", error);
      throw new Error("Falha ao processar a mensagem com o Gemini");
    }
  }

  setModel(model: string) {
    this.model = model;
  }
} 