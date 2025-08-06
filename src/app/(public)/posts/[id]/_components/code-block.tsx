"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: "#F7DF1E",
      typescript: "#3178C6",
      python: "#3776AB",
      java: "#ED8B00",
      csharp: "#239120",
      php: "#777BB4",
      sql: "#336791",
      jsx: "#61DAFB",
      tsx: "#61DAFB",
      nodejs: "#339933",
      css: "#1572B6",
      html: "#E34F26",
      json: "#000000",
      bash: "#4EAA25",
      shell: "#4EAA25",
    }
    return colors[lang] || "#10b981"
  }

  // Mapear nomes de linguagens para os identificadores corretos do SyntaxHighlighter
  const getLanguageId = (lang: string) => {
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      py: "python",
      rb: "ruby",
      go: "go",
      rs: "rust",
      php: "php",
      java: "java",
      csharp: "csharp",
      cpp: "cpp",
      c: "c",
      sql: "sql",
      css: "css",
      html: "html",
      xml: "xml",
      json: "json",
      yaml: "yaml",
      yml: "yaml",
      bash: "bash",
      shell: "bash",
      sh: "bash",
      powershell: "powershell",
      dockerfile: "dockerfile",
      markdown: "markdown",
      md: "markdown",
    }
    return languageMap[lang.toLowerCase()] || lang.toLowerCase()
  }

  const customStyle = {
    margin: 0,
    padding: '1rem',
    background: 'transparent',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(language) }} />
          <span className="text-sm text-gray-400 capitalize font-medium">{language}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>

      {/* Code Content com Syntax Highlighting */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={getLanguageId(language)}
          style={vscDarkPlus}
          customStyle={customStyle}
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}