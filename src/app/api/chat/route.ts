import { NextResponse } from "next/server";
import { ChatService } from "@/services/gemini/chat.service";
import { ChatMessage } from "@/services/gemini/chat.service";

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 }
      );
    }

    const chatService = ChatService.getInstance();
    if (model) {
      chatService.setModel(model);
    }
    
    const response = await chatService.sendMessage(messages as ChatMessage[]);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Erro ao processar a mensagem:", error);
    return NextResponse.json(
      { error: "Erro ao processar a mensagem" },
      { status: 500 }
    );
  }
} 