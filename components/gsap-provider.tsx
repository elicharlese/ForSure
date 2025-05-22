"use client"

import { type ReactNode, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

interface GSAPProviderProps {
  children: ReactNode
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      // Set up defaults
      gsap.config({
        nullTargetWarn: false,
      })

      // Mark as ready
      setIsReady(true)
    }

    // Clean up ScrollTrigger on unmount
    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        ScrollTrigger.clearMatchMedia()
      }
    }
  }, [])

  return <>{children}</>
}
