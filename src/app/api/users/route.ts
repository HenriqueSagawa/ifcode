import { NextResponse } from "next/server";
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Dados recebidos"); // Log sem expor dados sensíveis

        // Verifica se os campos obrigatórios existem
        if (!body.email || !body.password || !body.name) {
            console.log("Dados incompletos");
            return NextResponse.json({
                error: "Dados incompletos. Nome, email e senha são obrigatórios."
            }, { status: 400 });
        }

        const usersRef = collection(db, "users");

        // Verifica se o email já existe
        const q = query(usersRef, where("email", "==", body.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log("Email já cadastrado");
            return NextResponse.json({
                error: "Email já está em uso"
            }, { status: 400 });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const newUser = {
            name: body.name,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        }

        console.log("Tentando criar usuário");

        const docRef = await addDoc(usersRef, newUser);
        console.log("Usuário criado com ID:", docRef.id);

        // Retorna os dados sem a senha
        const { password, ...userWithoutPassword } = newUser;
        return NextResponse.json({
            id: docRef.id,
            ...userWithoutPassword
        }, { status: 201 })
    } catch (error: any) {
        console.error("Erro detalhado ao criar usuário:", error);
        return NextResponse.json({
            error: "Erro ao criar usuário",
            details: error.message
        }, { status: 500 })
    }
}

