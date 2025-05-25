import { NextResponse } from "next/server";
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Dados recebidos"); 

        if (!body.email || !body.password || !body.name) {
            console.log("Dados incompletos");
            return NextResponse.json({
                error: "Dados incompletos. Nome, email e senha são obrigatórios."
            }, { status: 400 });
        }

        const usersRef = collection(db, "users");

        const q = query(usersRef, where("email", "==", body.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log("Email já cadastrado");
            return NextResponse.json({
                error: "Email já está em uso"
            }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const newUser = {
            name: body.name,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            fullData: false
        }

        console.log("Tentando criar usuário");

        const docRef = await addDoc(usersRef, newUser);
        console.log("Usuário criado com ID:", docRef.id);

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

export async function GET() {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        
        const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const { password, ...userWithoutPassword } = data;
            return {
                id: doc.id,
                ...userWithoutPassword
            };
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error("Erro ao buscar usuários:", error);
        return NextResponse.json({
            error: "Erro ao buscar usuários",
            details: error.message
        }, { status: 500 });
    }
}