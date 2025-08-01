"use client"

import NotFoundContent from "@/components/NotFoundContent"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(10px) rotate(90deg); }
          50% { transform: translateX(-5px) rotate(180deg); }
          75% { transform: translateX(-10px) rotate(270deg); }
          100% { transform: translateX(0px) rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        .animate-drift {
          animation: drift 8s linear infinite;
        }
      `}</style>

      <NotFoundContent />
    </div>
  )
}
