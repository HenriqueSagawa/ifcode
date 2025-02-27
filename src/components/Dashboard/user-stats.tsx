// components/dashboard/user-stats.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenSquare, MessageSquare, Heart } from "lucide-react";

// Dados de exemplo - em um ambiente real, viriam da API
const userStats = {
  posts: 42,
  comments: 128,
  likes: 560,
  views: 12450,
  postGrowth: 12,
  commentGrowth: -5,
  likeGrowth: 25,
};

export function UserStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon={<PenSquare className="h-5 w-5" />}
            title="Publicações"
            value={userStats.posts}
            trend={userStats.postGrowth}
            color="blue"
          />
          
          <StatCard 
            icon={<MessageSquare className="h-5 w-5" />}
            title="Comentários" 
            value={userStats.comments}
            trend={userStats.commentGrowth}
            color="green"
          />
          
          <StatCard 
            icon={<Heart className="h-5 w-5" />}
            title="Curtidas"
            value={userStats.likes}
            trend={userStats.likeGrowth}
            color="red"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  trend: number;
  color: "blue" | "green" | "red";
}

function StatCard({ icon, title, value, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    red: "bg-red-50 text-red-500",
  };

  const trendColorClass = trend >= 0 ? "text-green-500" : "text-red-500";
  const trendArrow = trend >= 0 ? "↑" : "↓";
  
  return (
    <div className="flex items-center p-4 rounded-lg border">
      <div className={`p-3 rounded-full ${colorClasses[color]} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold">{value.toLocaleString()}</h4>
          <span className={`text-xs font-medium ${trendColorClass}`}>
            {trendArrow} {Math.abs(trend)}%
          </span>
        </div>
      </div>
    </div>
  );
}