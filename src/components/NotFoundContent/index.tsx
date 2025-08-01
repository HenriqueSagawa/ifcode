"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, ArrowLeft, MessageSquare, Code, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFoundContent() {
    const router = useRouter()

    const quickLinks = [
        {
            icon: MessageSquare,
            title: "Encontre dúvidas",
            description: "Explore nossa comunidade",
            href: "/posts",
        },
        {
            icon: Code,
            title: "Converse com a IA",
            description: "Consiga ajuda da nossa IA",
            href: "/chat",
        },
    ]

    return (
        <section className="min-h-screen flex items-center justify-center px-6 relative pt-20">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse-glow"></div>
                <div className="absolute bottom-32 left-16 w-32 h-32 bg-green-400/5 rounded-full blur-2xl animate-float"></div>
                <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-green-300/15 rounded-full blur-lg animate-drift"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
                            backgroundSize: "60px 60px",
                        }}
                    ></div>
                </div>
            </div>

            {/* Content */}
            <div className="text-center max-w-4xl mx-auto relative z-10">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-8xl md:text-9xl font-bold text-green-500 mb-4 animate-pulse-glow">404</h1>
                    <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                </div>

                {/* Main Message */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Oops! Página não encontrada</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        A página que você procura não existe ou foi movida. Mas não se preocupe, há muito o que explorar!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        voltar
                    </Button>
                    <Link href="/">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-500 px-8 py-4 text-lg bg-transparent transition-all duration-200 hover:scale-[1.02]"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Página Inicial
                        </Button>
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-8 text-gray-300">Ou explore nossas seções:</h3>
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {quickLinks.map((link, index) => {
                            const Icon = link.icon
                            return (
                                <Link key={link.title} href={link.href}>
                                    <Card className="bg-gray-900/30 border-gray-800 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group cursor-pointer">
                                        <CardContent className="p-6 text-center">
                                            <Icon className="h-8 w-8 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-semibold text-white mb-2 group-hover:text-green-500 transition-colors">
                                                {link.title}
                                            </h4>
                                            <p className="text-sm text-gray-400">{link.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
