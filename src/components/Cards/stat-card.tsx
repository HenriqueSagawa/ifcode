interface StatCardProps {
    value: string
    label: string
    delay: number
  }
  
  export default function StatCard({ value, label, delay }: StatCardProps) {
    return (
      <div className="scroll-animate" style={{ animationDelay: `${delay}s` }}>
        <div className="text-4xl md:text-5xl font-extralight text-green-500 mb-3">{value}</div>
        <div className="text-gray-500 font-light">{label}</div>
      </div>
    )
  }
  