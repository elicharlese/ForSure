"use client"

import { type ReactNode, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  id?: string
}

export default function ParallaxSection({ children, className, speed = 0.1, id }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return

    // Make sure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    tl.to(content, {
      y: () => section.offsetHeight * speed,
      ease: "none",
    })

    return () => {
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [speed])

  return (
    <div ref={sectionRef} className={cn("overflow-hidden relative", className)} id={id}>
      <div ref={contentRef} className="w-full h-full">
        {children}
      </div>
    </div>
  )
}
