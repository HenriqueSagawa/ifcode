'use server';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConnection";

export async function getPosts(id: string) {
    try {
        console.log("chamando")
        const usersRef = collection(db, "posts");
        const q = query(usersRef, where("id", '==', id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("posts", posts)
            return posts;
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
    return null;
}