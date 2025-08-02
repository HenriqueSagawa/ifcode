import type React from "react"
import {
  DiJavascript1,
  DiPython,
  DiJava,
  DiPhp,
  DiRuby,
  DiGo,
  DiSwift,
  DiHtml5,
  DiCss3,
  DiDatabase,
  DiDotnet,
  DiReact,
  DiNodejs,
  DiDjango,
  DiBootstrap,
  DiSass,
  DiMongodb,
  DiPostgresql,
  DiGit,
  DiDocker,
  DiAngularSimple,
} from "react-icons/di"
import {
  SiTypescript,
  SiRust,
  SiKotlin,
  SiDart,
  SiNextdotjs,
  SiVuedotjs,
  SiTailwindcss,
  SiExpress,
  SiLaravel,
  SiSpringboot,
  SiFlask,
  SiSvelte,
  SiMui,
  SiRedis,
  SiGraphql,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiNetlify,
} from "react-icons/si"

interface LanguageIconProps {
  language: string
  className?: string
}

const languageConfig: Record<string, { icon: React.ComponentType<any>; color: string }> = {
  // Linguagens de Programação
  javascript: { icon: DiJavascript1, color: "#F7DF1E" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  python: { icon: DiPython, color: "#3776AB" },
  java: { icon: DiJava, color: "#ED8B00" },
  csharp: { icon: DiDotnet, color: "#239120" },
  php: { icon: DiPhp, color: "#777BB4" },
  ruby: { icon: DiRuby, color: "#CC342D" },
  go: { icon: DiGo, color: "#00ADD8" },
  rust: { icon: SiRust, color: "#CE422B" },
  swift: { icon: DiSwift, color: "#FA7343" },
  kotlin: { icon: SiKotlin, color: "#7F52FF" },
  dart: { icon: SiDart, color: "#0175C2" },
  html: { icon: DiHtml5, color: "#E34F26" },
  css: { icon: DiCss3, color: "#1572B6" },
  sql: { icon: DiDatabase, color: "#336791" },

  // Frameworks Frontend
  react: { icon: DiReact, color: "#61DAFB" },
  nextjs: { icon: SiNextdotjs, color: "#000000" },
  vue: { icon: SiVuedotjs, color: "#4FC08D" },
  angular: { icon: DiAngularSimple, color: "#DD0031" },
  svelte: { icon: SiSvelte, color: "#FF3E00" },

  // Runtime/Backend
  nodejs: { icon: DiNodejs, color: "#339933" },
  django: { icon: DiDjango, color: "#092E20" },
  express: { icon: SiExpress, color: "#000000" },
  laravel: { icon: SiLaravel, color: "#FF2D20" },
  springboot: { icon: SiSpringboot, color: "#6DB33F" },
  flask: { icon: SiFlask, color: "#000000" },

  // CSS Frameworks
  tailwindcss: { icon: SiTailwindcss, color: "#06B6D4" },
  bootstrap: { icon: DiBootstrap, color: "#7952B3" },
  sass: { icon: DiSass, color: "#CC6699" },
  scss: { icon: DiSass, color: "#CC6699" },
  mui: { icon: SiMui, color: "#007FFF" },

  // Bancos de Dados
  mongodb: { icon: DiMongodb, color: "#47A248" },
  postgresql: { icon: DiPostgresql, color: "#336791" },
  mysql: { icon: DiDatabase, color: "#4479A1" },
  redis: { icon: SiRedis, color: "#DC382D" },

  // Ferramentas e Outros
  git: { icon: DiGit, color: "#F05032" },
  docker: { icon: DiDocker, color: "#2496ED" },
  graphql: { icon: SiGraphql, color: "#E10098" },
  firebase: { icon: SiFirebase, color: "#FFCA28" },
  supabase: { icon: SiSupabase, color: "#3ECF8E" },
  vercel: { icon: SiVercel, color: "#000000" },
  netlify: { icon: SiNetlify, color: "#00C7B7" },
}

export function LanguageIcon({ language, className = "" }: LanguageIconProps) {
  const config = languageConfig[language.toLowerCase()]

  if (!config) {
    return (
      <div className={`w-4 h-4 rounded bg-muted flex items-center justify-center text-xs font-bold ${className}`}>
        {language.charAt(0).toUpperCase()}
      </div>
    )
  }

  const IconComponent = config.icon

  return <IconComponent className={`w-4 h-4 ${className}`} style={{ color: config.color }} />
}
