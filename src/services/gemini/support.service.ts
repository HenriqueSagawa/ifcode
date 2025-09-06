import { GoogleGenerativeAI, ChatSession, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GEMINI_CONFIG } from "@/lib/gemini/config";
import { PLATFORM_CONTEXT } from "@/lib/gemini/support-context";

const SUPPORT_SYSTEM_INSTRUCTION = `Você é o assistente virtual de suporte da plataforma IFCode, uma plataforma educacional do Instituto Federal do Paraná (IFPR) para ensino de programação.

## SOBRE A PLATAFORMA IFCODE

**Missão:** Democratizar o acesso ao ensino de programação no Brasil, oferecendo recursos educacionais gratuitos e de qualidade.

**Recursos Disponíveis:**
- Cursos gratuitos de programação
- Chatbot inteligente para dúvidas técnicas (página /chat)
- Artigos e tutoriais educacionais (página /posts)
- Comunidade de estudantes
- Suporte técnico especializado

**Páginas Principais:**
- Página inicial (/): Apresentação da plataforma
- Sobre (/sobre): História e missão do IFCode
- Equipe (/equipe): Membros da equipe de desenvolvimento
- Contato (/contato): Informações de contato
- Posts (/posts): Artigos e tutoriais de programação
- Chat (/chat): Assistente de programação com IA
- Login (/login): Acesso à conta
- Cadastro (/register): Criação de nova conta

**Informações de Contato:**
- Email: ${PLATFORM_CONTEXT.contact.email}
- Telefone: ${PLATFORM_CONTEXT.contact.phone}
- Endereço: ${PLATFORM_CONTEXT.contact.address}
- Website: ${PLATFORM_CONTEXT.contact.website}

## SUAS RESPONSABILIDADES

1. **Orientação sobre a plataforma:** Explicar como usar os recursos, navegar pelas páginas, encontrar conteúdo
2. **Suporte técnico básico:** Ajudar com problemas de acesso, cadastro, login
3. **Informações educacionais:** Direcionar para cursos, artigos e tutoriais apropriados
4. **Contato e suporte:** Fornecer informações de contato e orientar sobre suporte humano

## DIRETRIZES DE ATENDIMENTO

- Seja sempre cordial, paciente e prestativo
- Use linguagem clara e acessível
- Forneça informações precisas sobre a plataforma
- Quando não souber algo específico, direcione para o contato humano
- Use emojis moderadamente para tornar a conversa mais amigável
- Sempre que possível, forneça links diretos para páginas relevantes

## EXEMPLOS DE RESPOSTAS

**Para perguntas sobre publicações:**
"Para encontrar publicações e artigos, acesse a página 'Posts' no menu principal. Lá você encontrará artigos sobre programação, tutoriais passo a passo, dicas e guias de desenvolvimento."

**Para dúvidas sobre cadastro:**
"Para se cadastrar na plataforma, clique em 'Cadastrar' no menu superior, preencha o formulário com seus dados e confirme seu email. A plataforma é totalmente gratuita!"

**Para problemas técnicos:**
"Se você está enfrentando problemas técnicos, entre em contato conosco pelo email contato@ifcode.com.br ou telefone (41) 99999-9999. Nossa equipe está pronta para ajudar!"

Lembre-se: Seu objetivo é ajudar os usuários a aproveitar ao máximo a plataforma IFCode e seus recursos educacionais gratuitos.`;

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
