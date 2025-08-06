import { NextResponse } from "next/server";
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { PostProps } from "@/types/posts";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const postsRef = collection(db, "posts");

        const newPost = {
            title: body.title,
            content: body.content,
            createdAt: new Date(), 
            codeContent: body.codeContent || "",
            codeLenguage: body.codeLenguage || "",
            type: body.type,
            images: body.images || [],
            id: body.idUser,
            email: body.emailUser,
            author: body.author,
            likes: 0,
            authorImage: body.userImage || "",
        }

        const docRef = await addDoc(postsRef, newPost);

        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (err) {
        console.error("Error creating post:", err);
        return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef);

        const querySnapshot = await getDocs(q);

        const posts: PostProps[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            const createdAt = data.createdAt instanceof Date 
                ? data.createdAt.toISOString() 
                : data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString();
            
            posts.push({
                id: doc.id,
                userId: data.id,
                title: data.title || "",
                content: data.content || "",
                createdAt: createdAt,
                codeSnippet: data.codeContent || "",
                programmingLanguage: data.codeLenguage || "",
                type: data.type || "",
                imagesUrls: data.images || [],
                likes: data.likes || 0,
                status: "published",
                updatedAt: createdAt
            });
        });

        return NextResponse.json({ posts }, { status: 200 });
    } catch (err) {
        console.error("Erro ao buscar posts", err);
        return NextResponse.json({ error: "Falha ao buscar posts" }, { status: 500 });
    }
}