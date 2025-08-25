"use server"

import { adminDb } from "@/lib/firebase-admin"

export interface PlatformStats {
  posts: number
  users: number
  comments: number
}

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const [postsSnap, usersSnap, commentsSnap] = await Promise.all([
      adminDb.collection("posts").count().get(),
      adminDb.collection("users").count().get(),
      adminDb.collection("comments").count().get(),
    ])

    return {
      posts: postsSnap.data().count || 0,
      users: usersSnap.data().count || 0,
      comments: commentsSnap.data().count || 0,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas da plataforma:", error)
    return { posts: 0, users: 0, comments: 0 }
  }
}

