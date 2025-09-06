import { GoogleGenerativeAI, ChatSession, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GEMINI_CONFIG } from "@/lib/gemini/config";
import { PLATFORM_CONTEXT } from "@/lib/gemini/support-context";
import { ROBUST_SUPPORT_INSTRUCTION } from "@/lib/gemini/robust-support-instruction";

// Usar a system instruction robusta importada
const SUPPORT_SYSTEM_INSTRUCTION = ROBUST_SUPPORT_INSTRUCTION;

export interface SupportMessage {
  role: "user" | "model";
  content: string;
}

export class SupportService {
  private static instance: SupportService;
  private genAI: GoogleGenerativeAI;
  private chatSession: ChatSession | null = null;

  private constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
  }

  public static getInstance(): SupportService {
    if (!SupportService.instance) {
      SupportService.instance = new SupportService();
    }
    return SupportService.instance;
  }

  public async startNewChat(): Promise<void> {
    const model = this.genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.defaultModel,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
    
    this.chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SUPPORT_SYSTEM_INSTRUCTION }],
        },
        {
          role: "model",
          parts: [{ text: "Olá! Sou o assistente virtual do IFCode. Estou aqui para ajudar você com informações sobre nossa plataforma educacional, recursos disponíveis, e qualquer dúvida que possa ter. Como posso te ajudar hoje?" }],
        },
      ],
    });
  }

  async sendMessage(messages: SupportMessage[]): Promise<string> {
    if (!this.chatSession) {
      await this.startNewChat();
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      throw new Error("A última mensagem deve ser do usuário");
    }

    try {
      const result = await this.chatSession!.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Erro ao enviar mensagem para o suporte:", error);
      return "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou entre em contato conosco diretamente.";
    }
  }

  public async resetChat(): Promise<void> {
    this.chatSession = null;
    await this.startNewChat();
  }
}
