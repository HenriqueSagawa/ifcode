'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function UnderDevelopment() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    setMounted(true);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Em Desenvolvimento | Nosso Site</title>
        <meta name="description" content="Esta página está em desenvolvimento. Volte em breve para ver as novidades!" />
      </Head>

      <div className="min-h-screen w-full bg-black text-white flex flex-col items-center p-4">
        {/* Loader */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        <main className={`container mx-auto max-w-4xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mt-24">
            {/* Vídeo */}
            <div className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-2xl border border-gray-800">
              <video 
                autoPlay 
                loop 
                playsInline
                className="w-full h-auto"
              >
                <source src="/img/video-desenvolvimento.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos HTML5.
              </video>
            </div>

            {/* Texto */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Site em <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Desenvolvimento</span>
              </h1>
              
              <div className="w-16 h-1 bg-white/20 mx-auto md:mx-0 rounded-full my-6" />
              
              <p className="text-gray-400 text-lg mb-8">
                Estamos trabalhando duro para trazer uma experiência incrível para você. 
                Volte em breve para ver as novidades!
              </p>
              
              {/* Contador */}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">LANÇAMENTO PREVISTO PARA</p>
                <div className="flex justify-center md:justify-start gap-4 text-2xl font-mono">
                  <div className="flex flex-col items-center">
                    <span className="text-white">30/04/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}