import { NextResponse } from "next/server";
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { PostsProps } from "@/types/posts";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const postsRef = collection(db, "posts");

        // Create the post object with the correct field structure
        const newPost = {
            title: body.title,
            content: body.content,
            createdAt: new Date(), // This will be stored as a Firestore timestamp
            codeContent: body.codeContent || "",
            codeLenguage: body.codeLenguage || "",
            type: body.type, // Make sure this matches the SelectItem values in your form
            images: body.images || [],
            id: body.idUser, // Note: this becomes userId in GET response
            email: body.emailUser,
            author: body.author,
            likes: 0,
            userImage: body.userImage || "",
            authorImage: body.userImage || "", // Add this to match the GET response structure
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

        const posts: PostsProps[] = [];

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
                codeContent: data.codeContent || "",
                codeLenguage: data.codeLenguage || "",
                type: data.type || "",
                images: data.images || [],
                email: data.email || "",
                author: data.author || "",
                authorImage: data.authorImage || data.userImage || "",
                likes: data.likes || 0,
            });
        });

        return NextResponse.json({ posts }, { status: 200 });
    } catch (err) {
        console.error("Erro ao buscar posts", err);
        return NextResponse.json({ error: "Falha ao buscar posts" }, { status: 500 });
    }
}