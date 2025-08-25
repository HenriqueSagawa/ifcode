'use client'

import StatCard from "@/components/Cards/stat-card"
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface StatsProps {
  posts: number
  comments: number
  users: number
}

export default function Stats({ posts, comments, users }: StatsProps) {
  const statsAnimation = useScrollAnimation({ threshold: 0.2 });
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });

  function formatApproximate(value: number): string {
    if (value < 1000) {
      return `${value}+`
    }
    const units = ["K", "M", "B", "T"]
    let unitIndex = -1
    let num = value
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000
      unitIndex++
    }
    const rounded = num >= 100 ? Math.round(num) : Math.round(num * 10) / 10
    return `${rounded}${units[unitIndex]}+`
  }

  const stats = [
    { value: formatApproximate(posts), label: "Posts" },
    { value: formatApproximate(comments), label: "Comentários" },
    { value: formatApproximate(users), label: "Usuários" },
    { value: "24/7", label: "Serviço 24/7" },
  ]

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto">
        <h2
          ref={titleAnimation.ref}
          className={`text-4xl md:text-5xl font-extralight text-center mb-24 transition-all duration-700 ${
            titleAnimation.isVisible
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-8'
          }`}
        >
          Impulso da comunidade em <span className="text-green-500">números</span>
        </h2>
        <div 
          ref={statsAnimation.ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`transition-all duration-700 ${
                statsAnimation.isVisible 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-8 scale-95'
              }`}
              style={{ 
                transitionDelay: statsAnimation.isVisible ? `${index * 100}ms` : '0ms' 
              }}
            >
              <StatCard 
                value={stat.value} 
                label={stat.label} 
                delay={index * 0.1} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}