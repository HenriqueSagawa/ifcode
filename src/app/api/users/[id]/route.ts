import { db } from "@/services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { UserData } from "@/types/userData";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const userData: UserData = userSnap.data() as UserData;
        const user: UserData = {
            ...userData,
            id: userSnap.id,
        }

        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }
}
