'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to safely handle hydration mismatches caused by browser extensions
 * Returns true only after the component has hydrated on the client
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook to detect if browser extensions are modifying the DOM
 * Useful for debugging hydration issues
 */
export function useBrowserExtensionDetection() {
  const [hasExtensions, setHasExtensions] = useState(false)
  const [detectedExtensions, setDetectedExtensions] = useState<string[]>([])

  useEffect(() => {
    // Check for common extension-added classes/attributes
    const extensionIndicators = [
      'clickup-chrome-ext_installed',
      'grammarly-extension',
      'lastpass-extension',
      'adblock-extension',
      'honey-extension'
    ]

    const detected: string[] = []
    
    // Check body classes
    const bodyClasses = document.body.className
    extensionIndicators.forEach(indicator => {
      if (bodyClasses.includes(indicator)) {
        detected.push(indicator)
      }
    })

    // Check for extension-specific DOM modifications
    const hasExtensionElements = document.querySelector('[data-extension]') !== null
    
    if (detected.length > 0 || hasExtensionElements) {
      setHasExtensions(true)
      setDetectedExtensions(detected)
      
      // Log for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Browser extensions detected:', detected)
        console.log('💡 If you see hydration warnings, this might be the cause')
      }
    }
  }, [])

  return { hasExtensions, detectedExtensions }
}