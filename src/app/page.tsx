'use client'

import React, { useEffect } from "react";
import { Hero } from "@/components/Hero";
import { GeminiSection } from "@/components/GeminiSection";
import { Feature } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { CardFeature } from "@/components/CardFeature";
import { motion } from "motion/react";

import { useUser } from "@/hooks/useUser";
import { usePosts } from "@/hooks/usePosts";
import { useComment } from "@/hooks/useComment";

import { useState } from "react";
import { UserData } from "@/types/userData";
import { PostsProps } from "@/types/posts";

import { Timestamp } from "firebase/firestore";

import dynamic from "next/dynamic";

const DynamicGeminiSection = dynamic(() =>
  import('@/components/GeminiSection').then(mod => mod.GeminiSection),
  { loading: () => <p></p> } 
);

const DynamicCardFeature = dynamic(() =>
  import('@/components/CardFeature').then(mod => mod.CardFeature),
  { loading: () => <p></p> }
);

const DynamicStats = dynamic(() =>
  import('@/components/Stats').then(mod => mod.Stats),
  { loading: () => <p></p> }
);

const DynamicFeature = dynamic(() =>
  import('@/components/Features').then(mod => mod.Feature),
  { loading: () => <p></p> }
);

export interface CommentData {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorImage?: string | null;
  content: string;
  createdAt: Timestamp;
}

export default function Home() {

  const { getUsers } = useUser();
  const { getPosts } = usePosts();
  const { getAllComments } = useComment();

  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);

  async function fetchData() {
    const usersFetch = await getUsers();
    const postsFetch = await getPosts();
    const commentsFetch = await getAllComments();
    if (postsFetch) {
      setPosts(postsFetch);
    }
    if (usersFetch) {
      setUsers(usersFetch);
    }
    if (commentsFetch) {
      setComments(commentsFetch);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="relative">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{
        duration: 4,
      }} className="!w-full !h-screen -top-[500px] md:-top-[1000px] !blur-[1000px] !z-0 bg-green-600 rounded-full shadow-green-400 shadow-2xl absolute" />

      <Hero />

      <DynamicFeature />

      <DynamicStats users={users} posts={posts} comments={comments} />

      <DynamicCardFeature />

      <DynamicGeminiSection />

    </div>
  );
}
