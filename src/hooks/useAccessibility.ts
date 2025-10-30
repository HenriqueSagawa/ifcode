'use client'

import { useEffect } from 'react'

export interface AccessibilitySettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  highContrast: boolean
  reduceAnimations: boolean
  underlineLinks: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'md',
  highContrast: false,
  reduceAnimations: false,
  underlineLinks: false
}

export const useAccessibility = () => {
  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings
    
    // Apply settings to document (this ensures consistency after hydration)
    applyAccessibilitySettings(settings)
  }, [])
}

export const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
  const root = document.documentElement
  
  // Remove existing accessibility classes
  root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl')
  root.classList.remove('high-contrast')
  root.classList.remove('reduce-motion')
  root.classList.remove('underline-links')
  
  // Apply font size
  switch (settings.fontSize) {
    case 'sm':
      root.classList.add('text-sm')
      break
    case 'md':
      root.classList.add('text-base')
      break
    case 'lg':
      root.classList.add('text-lg')
      break
    case 'xl':
      root.classList.add('text-xl')
      break
  }
  
  // Apply high contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast')
  }
  
  // Apply reduced animations
  if (settings.reduceAnimations) {
    root.classList.add('reduce-motion')
  }
  
  // Apply underlined links
  if (settings.underlineLinks) {
    root.classList.add('underline-links')
  }
}

export const getAccessibilitySettings = (): AccessibilitySettings => {
  if (typeof window === 'undefined') return defaultSettings
  
  const savedSettings = localStorage.getItem('accessibility-settings')
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings
}

export const updateAccessibilitySettings = (settings: AccessibilitySettings) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  applyAccessibilitySettings(settings)
}
