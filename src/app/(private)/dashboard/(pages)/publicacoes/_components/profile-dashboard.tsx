"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostStats } from "./post-stats"
import { PostsList } from "./posts-list"
import { PostForm } from "./post-form"
import type { PostProps, NewPost } from "@/types/posts"

export function PostsDashboardContent({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    type: "article",
    language: "",
    code: "",
    images: [],
  })

  const handleSubmit = (data: {
    title: string
    content: string
    type: "article" | "question" | "project" | "tutorial" | "discussion"
    programmingLanguage: string
    imagesUrls: string[]
    codeSnippet?: string
  }) => {
    const post: PostProps = {
      title: data.title,
      content: data.content,
      type: data.type,
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      programmingLanguage: data.programmingLanguage || "unknown",
      codeSnippet: data.codeSnippet || "",
      imagesUrls: data.imagesUrls || [],
      userId: userId,
      status: "published",
    }
    console.log("Post criado:", post)
    setPosts((prev) => [post, ...prev])
    setNewPost({
      title: "",
      content: "",
      type: "article",
      language: "",
      code: "",
      images: [],
    })
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Posts</h1>
          <p className="text-muted-foreground">Gerencie suas publicações e crie novos conteúdos</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="create">Criar Post</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PostStats posts={posts} />
            <PostsList posts={posts} />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <PostForm userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
