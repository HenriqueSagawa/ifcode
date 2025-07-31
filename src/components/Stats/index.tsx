import StatCard from "@/components/Cards/stat-card"
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Stats() {
  const statsAnimation = useScrollAnimation({ threshold: 0.2 });

  const stats = [
    { value: "50K+", label: "Questions Solved" },
    { value: "15K+", label: "Active Developers" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "AI Support" },
  ]

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto">
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