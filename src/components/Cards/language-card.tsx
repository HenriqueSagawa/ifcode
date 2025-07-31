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
    delay: number
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
  
  export default function LanguageCard({ language, delay }: LanguageCardProps) {
    const IconComponent = languageIcons[language] || FaCode
  
    return (
      <div
        className="scroll-animate group text-center p-4 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-green-500/30 transition-all duration-300 flex flex-col items-center justify-center"
        style={{ animationDelay: `${delay}s` }}
      >
        <IconComponent className="text-4xl mb-3 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
        <div className="text-md font-medium text-white">{language}</div>
      </div>
    )
  }