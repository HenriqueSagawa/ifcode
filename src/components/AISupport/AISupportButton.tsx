'use client';

import { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { AISupportModal } from './AISupportModal';

export function AISupportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-4 right-4 z-40 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-green-400/20 hover:border-green-300/40"
        title="Suporte IA"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
      </button>

      <AISupportModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
