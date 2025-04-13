import { NextResponse } from "next/server";
import { ChatService, ChatMessage } from "@/services/gemini/chat.service";

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 }
      );
    }

    const chatService = new ChatService(model);
    const response = await chatService.sendMessage(messages as ChatMessage[]);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Erro na API de chat:", error);
    return NextResponse.json(
      { error: "Erro ao processar a mensagem" },
      { status: 500 }
    );
  }
} 