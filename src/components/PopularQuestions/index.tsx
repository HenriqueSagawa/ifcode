'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const questions = [
  {
    id: 1,
    title: 'Como implementar autenticação JWT em Node.js com refresh tokens?',
    author: 'João Silva',
    avatar: 'J',
    votes: 45,
    answers: 12,
    solved: true,
    tags: ['Node.js', 'JWT', 'Autenticação'],
    time: '2h atrás'
  },
  {
    id: 2,
    title: 'Diferença entre useState e useReducer no React - quando usar cada um?',
    author: 'Maria Santos',
    avatar: 'M',
    votes: 38,
    answers: 8,
    solved: true,
    tags: ['React', 'Hooks'],
    time: '4h atrás'
  },
  {
    id: 3,
    title: 'Como otimizar consultas SQL com JOIN múltiplos em bancos grandes?',
    author: 'Pedro Oliveira',
    avatar: 'P',
    votes: 52,
    answers: 15,
    solved: false,
    tags: ['SQL', 'Performance', 'Database'],
    time: '6h atrás'
  },
  {
    id: 4,
    title: 'Melhores práticas para deploy com Docker em produção',
    author: 'Ana Costa',
    avatar: 'A',
    votes: 67,
    answers: 20,
    solved: true,
    tags: ['Docker', 'DevOps', 'Deploy'],
    time: '1 dia atrás'
  }
];

export default function PopularQuestions() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === headerRef.current) {
              entry.target.classList.add('animate-fade-in-up');
            } else if (entry.target === questionsRef.current) {
              const questionCards = entry.target.querySelectorAll('.question-card');
              questionCards.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add('animate-slide-up');
                }, index * 200);
              });
            } else if (entry.target === ctaRef.current) {
              entry.target.classList.add('animate-fade-in');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px'
      }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (questionsRef.current) observer.observe(questionsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden transition-colors duration-300 bg-white dark:bg-black"
    >
      {/* Efeito de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-3xl bg-green-500/10 dark:bg-green-500/20"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div ref={headerRef} className="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-4 bg-green-100 border border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400">
            <i className="ri-question-mark text-lg"></i>
            Perguntas em Destaque
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Discussões <span className="text-green-500">Populares</span>
          </h2>
          
          <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            As perguntas mais votadas e discutidas pela nossa comunidade
          </p>
        </div>

        <div ref={questionsRef} className="flex flex-col gap-2 max-w-5xl mx-auto">
          {questions.map((question) => (
            <Link key={question.id} href={`/#`}>
              <div className="question-card opacity-0 translate-y-10 transition-all duration-700 group rounded-2xl p-6 cursor-pointer hover:scale-[1.02] bg-white border border-gray-200 hover:border-green-500/50 shadow-lg hover:shadow-xl dark:bg-gray-900 dark:border-gray-700 dark:hover:border-green-500/50 dark:shadow-none">
                {/* Header da pergunta */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {question.avatar}
                    </div>
                    <div>
                      <p className="text-green-500 font-semibold">{question.author}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{question.time}</p>
                    </div>
                  </div>

                  {question.solved && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                      <i className="ri-check-double-line"></i>
                      Resolvida
                    </div>
                  )}
                </div>

                {/* Título da pergunta */}
                <h3 className="text-xl font-bold mb-4 group-hover:text-green-500 transition-colors duration-300 leading-relaxed text-gray-900 dark:text-gray-100">
                  {question.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-500/20 dark:hover:text-green-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Estatísticas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-green-500">
                      <i className="ri-arrow-up-line"></i>
                      <span className="font-semibold">{question.votes}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">votos</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-blue-500">
                      <i className="ri-chat-3-line"></i>
                      <span className="font-semibold">{question.answers}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">respostas</span>
                    </div>
                  </div>

                  <i className="ri-arrow-right-line text-green-500 group-hover:translate-x-2 transition-transform duration-300 text-lg"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div ref={ctaRef} className="text-center mt-12 opacity-0 transition-all duration-700">
          <Link href="/posts">
            <button className="px-8 py-4 rounded-xl font-bold transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-green-500/30 hover:shadow-green-500/50 dark:shadow-green-500/25 dark:hover:shadow-green-500/40">
              Ver Todas as Perguntas
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .animate-slide-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .animate-fade-in {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}