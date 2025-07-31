import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CTA() {
    const ctaAnimation = useScrollAnimation({ threshold: 0.3 });

    return (
        <section className="py-32 px-6">
            <div className="container mx-auto text-center">
                <div 
                    ref={ctaAnimation.ref}
                    className={`max-w-3xl mx-auto transition-all duration-800 ${
                        ctaAnimation.isVisible 
                            ? 'opacity-100 transform translate-y-0 scale-100' 
                            : 'opacity-0 transform translate-y-12 scale-95'
                    }`}
                >
                    <div className={`transition-all duration-700 ${
                        ctaAnimation.isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        <h2 className="text-4xl md:text-6xl font-extralight mb-8">
                            Pronto para elevar
                            <br />
                            <span className="text-green-500">sua programação?</span>
                        </h2>
                    </div>
                    
                    <div className={`transition-all duration-700 delay-200 ${
                        ctaAnimation.isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        <p className="text-xl text-gray-400 mb-12 font-light">
                            Junte-se aos desenvolvedores que já fazem parte do IF Code
                        </p>
                    </div>
                    
                    <div className={`transition-all duration-700 delay-400 ${
                        ctaAnimation.isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        <Button
                            size="lg"
                            className="!bg-green-500 hover:!bg-green-400 text-black px-12 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 group"
                        >
                            Entrar na Comunidade
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}