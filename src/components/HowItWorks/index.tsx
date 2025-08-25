'use client'

import { StepCard } from "@/components/Cards/step-card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function HowItWorks() {
    const titleAnimation = useScrollAnimation({ threshold: 0.2 });
    const stepsAnimation = useScrollAnimation({ threshold: 0.1 });

    const steps = [
        {
            number: 1,
            title: "Faça Sua Pergunta",
            description: "Publique seu problema de programação com contexto detalhado, trechos de código e o que você já tentou."
        },
        {
            number: 2,
            title: "Receba Ajuda Imediata",
            description: "Aguarde que alguém da comunidade veja sua pergunta e ofereça uma solução ou orientação.",
        },
        {
            number: 3,
            title: "Aprenda e Compartilhe",
            description: "Aprenda com as explicações e ajude outras pessoas com problemas semelhantes."
        }
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
                        Como <span className="text-green-500">funciona</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Três passos simples para obter ajuda com seus problemas
                    </p>
                </div>

                <div 
                    ref={stepsAnimation.ref}
                    className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto"
                >
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className={`transition-all duration-700 ${
                                stepsAnimation.isVisible 
                                    ? 'opacity-100 transform translate-y-0' 
                                    : 'opacity-0 transform translate-y-12'
                            }`}
                            style={{ 
                                transitionDelay: stepsAnimation.isVisible ? `${index * 150}ms` : '0ms' 
                            }}
                        >
                            <StepCard
                                number={step.number}
                                title={step.title}
                                description={step.description}
                                delay={index * 0.1}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}