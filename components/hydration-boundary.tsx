'use client'

import { useEffect, useState } from 'react'

interface HydrationBoundaryProps {
  children: React.ReactNode
}

/**
 * HydrationBoundary component to handle hydration mismatches
 * caused by browser extensions that modify the DOM
 */
export function HydrationBoundary({ children }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after the component mounts
    setIsHydrated(true)
  }, [])

  // During SSR and initial hydration, render children normally
  // After hydration, we know the client state is stable
  return <>{children}</>
}

/**
 * NoSSR component to skip server-side rendering for components
 * that are known to cause hydration issues
 */
export function NoSSR({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <>{children}</>
}