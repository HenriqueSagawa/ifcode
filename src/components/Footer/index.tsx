import { Code, Github, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import Logo from "../../../public/img/logo ifcode.webp"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo and Description */}
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <Image src={Logo} alt="IFCode Logo" width={35} height={35} />
              <span className="text-xl font-light">IFCode</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Uma plataforma para desenvolvedores compartilharem conhecimento, resolverem problemas e se conectarem com a comunidade. Junte-se a nós e faça parte da revolução do código!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col space-y-3">
              <h3 className="font-medium text-white text-sm">Plataforma</h3>
              <Link href="/posts" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Perguntas e respostas
              </Link>
              <Link href="/chat" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Converse com a IA
              </Link>
            </div>

            <div className="flex flex-col space-y-3">
              <h3 className="font-medium text-white text-sm">Suporte</h3>
              <Link href="/contato" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Contato
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="font-medium text-white text-sm mb-3">Redes Sociais</h3>
            <div className="flex items-center space-x-4">
              <Link href="github.com/ifcode" target="_blank" className="text-gray-500 hover:text-green-500 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="mailto:ifcodeprojeto@gmail.com" target="_blank" className="text-gray-500 hover:text-green-500 transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-900">
          <p className="text-gray-600 font-light text-sm mb-4 md:mb-0">Copyright © {new Date().getFullYear()} IFCode. Feito com muito café pela equipe do IFCode.</p>
        </div>
      </div>
    </footer>
  )
}
