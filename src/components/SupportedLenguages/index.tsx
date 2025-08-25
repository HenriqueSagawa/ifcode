'use client'

import LanguageCard from '@/components/Cards/language-card'
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function SupportedLanguages() {
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });
  const languagesAnimation = useScrollAnimation({ threshold: 0.1 });

  const languages = [
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'React',
    'Node.js',
    'TypeScript',
    'Go',
    'Rust',
    'PHP',
    'Swift',
    'Kotlin',
  ]

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-20 transition-all duration-700 ${
            titleAnimation.isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extralight mb-6">
            Todas as <span className="text-green-500">linguagens</span>{' '}
            disponíveis
          </h2>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Encontre ajuda em qualquer linguagem de programação, desde as mais
            populares até as mais recentes.
          </p>
        </div>

        <div 
          ref={languagesAnimation.ref}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto"
        >
          {languages.map((language, index) => (
            <div
              key={language}
              className={`transition-all duration-600 ${
                languagesAnimation.isVisible 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-6 scale-95'
              }`}
              style={{ 
                transitionDelay: languagesAnimation.isVisible ? `${index * 80}ms` : '0ms' 
              }}
            >
              <LanguageCard
                language={language}
                delay={index * 0.05}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}