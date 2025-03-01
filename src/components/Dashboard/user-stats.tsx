"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PenSquare, MessageSquare, ThumbsUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
};

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
          {trend && (
            <p className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.positive ? '+' : ''}{trend.value}% desde o último mês
            </p>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function UserStats() {
  const stats = [
    {
      title: "Total de Posts",
      value: 147,
      icon: <PenSquare className="h-5 w-5 text-primary" />,
      trend: { value: 12.4, positive: true }
    },
    {
      title: "Comentários",
      value: 842,
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      trend: { value: 8.2, positive: true }
    },
    {
      title: "Curtidas Recebidas",
      value: 3254,
      icon: <ThumbsUp className="h-5 w-5 text-primary" />,
      trend: { value: 24.1, positive: true }
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Estatísticas do Usuário</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}