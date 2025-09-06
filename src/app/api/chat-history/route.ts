import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, orderBy, limit } from "firebase/firestore";
import { ChatHistory, ChatMessage } from "@/types/chatHistory";

export const dynamic = 'force-dynamic';

// GET - Buscar histórico de conversas do usuário
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário não fornecido" }, { status: 400 });
    }

    const chatHistoryRef = collection(db, "chatHistory");
    const q = query(
      chatHistoryRef, 
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const chatHistories: ChatHistory[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      chatHistories.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
        messages: data.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp)
        }))
      } as ChatHistory);
    });

    return NextResponse.json({ chatHistories }, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar histórico de conversas:", error);
    return NextResponse.json({ error: "Erro ao buscar histórico" }, { status: 500 });
  }
}

// POST - Criar nova conversa
export async function POST(request: Request) {
  try {
    const { userId, title, messages } = await request.json();

    if (!userId || !title || !messages) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 });
    }

    const chatHistoryRef = collection(db, "chatHistory");
    const newChatHistory = {
      userId,
      title,
      messages: messages.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date()
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(chatHistoryRef, newChatHistory);

    return NextResponse.json({ 
      id: docRef.id, 
      message: "Conversa salva com sucesso" 
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao salvar conversa:", error);
    return NextResponse.json({ error: "Erro ao salvar conversa" }, { status: 500 });
  }
}

// PUT - Atualizar conversa existente
export async function PUT(request: Request) {
  try {
    const { id, title, messages } = await request.json();

    if (!id || !messages) {
      return NextResponse.json({ error: "ID e mensagens são obrigatórios" }, { status: 400 });
    }

    const chatHistoryRef = doc(db, "chatHistory", id);
    const chatHistoryDoc = await getDoc(chatHistoryRef);

    if (!chatHistoryDoc.exists()) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    }

    const updateData: any = {
      messages: messages.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date()
      })),
      updatedAt: new Date()
    };

    if (title) {
      updateData.title = title;
    }

    await updateDoc(chatHistoryRef, updateData);

    return NextResponse.json({ message: "Conversa atualizada com sucesso" }, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar conversa:", error);
    return NextResponse.json({ error: "Erro ao atualizar conversa" }, { status: 500 });
  }
}

// DELETE - Deletar conversa
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID da conversa não fornecido" }, { status: 400 });
    }

    const chatHistoryRef = doc(db, "chatHistory", id);
    const chatHistoryDoc = await getDoc(chatHistoryRef);

    if (!chatHistoryDoc.exists()) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    }

    await deleteDoc(chatHistoryRef);

    return NextResponse.json({ message: "Conversa deletada com sucesso" }, { status: 200 });

  } catch (error) {
    console.error("Erro ao deletar conversa:", error);
    return NextResponse.json({ error: "Erro ao deletar conversa" }, { status: 500 });
  }
}
