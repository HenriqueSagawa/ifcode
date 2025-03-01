import { db } from "@/services/firebaseConnection"; // Adapte o caminho se necessário
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email não fornecido" }, { status: 400 });
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ user: null, message: "Usuário não encontrado" }, { status: 404 });
    }

    // Assumindo que só haverá um usuário com esse email (o que deve ser o caso).
    const userData = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;

    return NextResponse.json({ user: { id: userId, ...userData } }, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error);
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
  }
}