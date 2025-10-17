'use client'

import { useAccessibility } from '@/hooks/useAccessibility'

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  useAccessibility()
  
  return <>{children}</>
}

