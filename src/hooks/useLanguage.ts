'use client'

import { useState, useEffect } from 'react'

export interface LanguageSettings {
  language: 'pt-BR' | 'en-US' | 'es-ES'
  timezone: 'America/Sao_Paulo' | 'America/New_York' | 'Europe/London'
}

const defaultLanguageSettings: LanguageSettings = {
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo'
}

export const useLanguage = () => {
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language-settings')
      return saved ? JSON.parse(saved) : defaultLanguageSettings
    }
    return defaultLanguageSettings
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language-settings', JSON.stringify(languageSettings))
      applyLanguageSettings(languageSettings)
    }
  }, [languageSettings])

  return { languageSettings, setLanguageSettings }
}

export const applyLanguageSettings = (settings: LanguageSettings) => {
  if (typeof window === 'undefined') return

  // Update document language
  document.documentElement.lang = settings.language

  // Update timezone (this would typically be handled by your date formatting library)
  // For now, we'll just store it for future use
  document.documentElement.setAttribute('data-timezone', settings.timezone)
}

export const getLanguageSettings = (): LanguageSettings => {
  if (typeof window === 'undefined') return defaultLanguageSettings
  
  const saved = localStorage.getItem('language-settings')
  return saved ? JSON.parse(saved) : defaultLanguageSettings
}

export const updateLanguageSettings = (settings: LanguageSettings) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('language-settings', JSON.stringify(settings))
  applyLanguageSettings(settings)
}

