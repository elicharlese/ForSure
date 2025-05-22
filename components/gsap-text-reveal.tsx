"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

interface GSAPTextRevealProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
}

export default function GSAPTextReveal({
  text,
  className,
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
}: GSAPTextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const textElement = textRef.current
    if (!textElement) return

    // Make sure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger)

    // Split text into words
    const words = text.split(" ")
    textElement.innerHTML = ""

    const wordElements: HTMLElement[] = []

    words.forEach((word, index) => {
      const wordSpan = document.createElement("span")
      wordSpan.textContent = word
      wordSpan.style.display = "inline-block"
      wordSpan.style.opacity = "0"
      wordSpan.style.transform = "translateY(20px)"
      textElement.appendChild(wordSpan)
      wordElements.push(wordSpan)

      // Add space after word except for last word
      if (index < words.length - 1) {
        const spaceSpan = document.createElement("span")
        spaceSpan.innerHTML = "&nbsp;"
        textElement.appendChild(spaceSpan)
      }
    })

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textElement,
        start: "top bottom-=10%",
        toggleActions: "play none none none",
      },
    })

    tl.to(wordElements, {
      y: 0,
      opacity: 1,
      stagger: stagger,
      duration: duration,
      delay: delay,
      ease: "power2.out",
    })

    return () => {
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === textElement) {
          trigger.kill()
        }
      })
    }
  }, [text, stagger, duration, delay])

  return (
    <div ref={textRef} className={className}>
      {text}
    </div>
  )
}
