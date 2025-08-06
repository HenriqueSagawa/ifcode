import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiGo,
  SiRust,
  SiPhp,
  SiSwift,
  SiKotlin,
} from 'react-icons/si'
import { FaCode, FaJava } from 'react-icons/fa'

interface LanguageCardProps {
  language: string
  delay?: number // Tornando delay opcional
}

const languageIcons: { [key: string]: React.ElementType } = {
  JavaScript: SiJavascript,
  Python: SiPython,
  Java: FaJava,
  'C++': SiCplusplus,
  React: SiReact,
  'Node.js': SiNodedotjs,
  TypeScript: SiTypescript,
  Go: SiGo,
  Rust: SiRust,
  PHP: SiPhp,
  Swift: SiSwift,
  Kotlin: SiKotlin,
}

export default function LanguageCard({ language, delay = 0 }: LanguageCardProps) {
  const IconComponent = languageIcons[language] || FaCode

  return (
    <div
      className="scroll-animate group text-center p-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center bg-white/70 border border-gray-200 hover:border-green-500/30 shadow-md hover:shadow-lg backdrop-blur-sm dark:bg-gray-900/30 dark:border-gray-800 dark:hover:border-green-500/30"
      style={{ animationDelay: `${delay}s` }}
    >
      <IconComponent 
        className="text-4xl mb-3 transition-colors duration-300 text-gray-500 group-hover:text-green-500 dark:text-gray-400 dark:group-hover:text-green-500" 
      />
      <div className="text-md font-medium text-gray-900 dark:text-white">
        {language}
      </div>
    </div>
  )
}