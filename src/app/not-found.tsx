// app/not-found.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [counter, setCounter] = useState(10);
  
  useEffect(() => {
    setMounted(true);
    
    // Contador regressivo para redirecionamento
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      window.location.href = '/';
    }
    
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/5 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 300}px`,
              height: `${Math.random() * 300}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.05 + Math.random() * 0.1,
              transform: `scale(${0.5 + Math.random()})`,
            }}
          />
        ))}
      </div>
      
      {/* Conteúdo principal */}
      <div className={`relative z-10 max-w-xl bg-black/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex flex-col items-center text-center">
          {/* Número 404 animado */}
          <div className="relative mb-6">
            <h1 className="text-[10rem] leading-none font-extrabold text-white">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-30">
              <h1 className="text-[10rem] leading-none font-extrabold text-white">
                404
              </h1>
            </div>
          </div>
          
          {/* Texto de erro */}
          <h2 className="text-3xl font-bold text-white mb-4">Página não encontrada</h2>
          <p className="text-gray-400 text-lg mb-8">
            O caminho que você está procurando parece ter se perdido no espaço digital.
          </p>
          
          {/* Linha decorativa */}
          <div className="w-16 h-1 bg-white/20 rounded-full mb-8" />
          
          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/"
              className="flex-1 py-3 px-6 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all group"
            >
              <Home size={18} className="group-hover:scale-110 transition-transform" />
              <span>Página Inicial</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-3 px-6 bg-transparent border border-white/30 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:translate-x-[-4px] transition-transform" />
              <span>Voltar</span>
            </button>
          </div>
          
          {/* Contador regressivo */}
          <p className="mt-8 text-gray-500 text-sm">
            Redirecionando para a página inicial em <span className="font-bold text-white">{counter}</span> segundos.
          </p>
        </div>
      </div>
    </div>
  );
}