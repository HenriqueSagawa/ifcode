import { NextResponse } from "next/server";
import { db } from "@/services/firebaseConnection";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.email) {
            return NextResponse.json({ error: "Email não fornecido" }, { status: 400 });
        }

        // Primeiro, encontrar o documento do usuário pelo email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", data.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Pegar o ID do primeiro (e único) documento encontrado
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);

        // Atualizar o documento com os novos dados
        await updateDoc(userRef, {
            birthDate: data.birthDate,
            phone: data.phone,
            course: data.course,
            period: data.period,
            registration: data.registration,
            github: data.github,
            linkedin: data.linkedin,
            bio: data.bio,
            profileImage: data.profileImage,
            fullData: true
        });

        return NextResponse.json({ 
            message: "Usuário atualizado com sucesso",
            userId: userDoc.id 
        });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar usuário" },
            { status: 500 }
        );
    }
} 