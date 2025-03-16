import { db } from "@/services/firebaseConnection";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

interface NotificationData {
  type: 'like' | "comment";
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  receiverId: string;
  postId: string;
  postTitle?: string;
  commentContent?: string;
  createdAt?: any;
  read: boolean;
}

type Data =
  | { success: boolean; message: string; notificationId?: string }
  | { error: string };

  export async function POST(req: Request, res: NextApiResponse<Data>) {
    try {
      const body = await req.json(); // Extrai o corpo da requisição
  
      const {
        type,
        senderId,
        senderName,
        senderAvatar,
        receiverId,
        postId,
        postTitle,
      } = body;
  
      if (!type || !senderId || !receiverId || !postId) {
        return new Response(JSON.stringify({ error: "Dados incompletos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      if (type !== "like" && type !== "comment") {
        return new Response(JSON.stringify({ error: "Tipo de notificação inválido" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const notificationData = {
        type,
        senderId,
        senderName,
        senderAvatar,
        receiverId,
        postId,
        postTitle,
        createdAt: serverTimestamp(),
        read: false,
      };
  
      const notificationRef = collection(db, "notifications");
      const docRef = await addDoc(notificationRef, notificationData);
  
      return new Response(
        JSON.stringify({
          success: true,
          message: "Notificação criada com sucesso",
          notificationId: docRef.id,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      return new Response(JSON.stringify({ error: "Erro ao processar a solicitação" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }