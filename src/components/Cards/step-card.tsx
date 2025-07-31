interface StepCardProps {
    number: number
    title: string
    description: string
    delay: number
  }
  
  export function StepCard({ number, title, description, delay }: StepCardProps) {
    return (
      <div className="text-center scroll-animate" style={{ animationDelay: `${delay}s` }}>
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
          <span className="text-2xl font-bold text-green-500">{number}</span>
        </div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    )
  }
  