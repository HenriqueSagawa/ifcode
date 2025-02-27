'use client'

import { UserProfile } from "@/components/Dashboard/user-profile";
import { CreatePost } from "@/components/Dashboard/create-post";
import { UserStats } from "@/components/Dashboard/user-stats";
import { RecentActivity } from "@/components/Dashboard/recent-activity";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <UserProfile />
        <CreatePost />
        <UserStats />
        <RecentActivity />
      </div>
    </div>
  );
}