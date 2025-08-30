'use client'

import { type ReactNode, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { cn } from '@/lib/utils'

interface GSAPScrollTriggerProps {
  children: ReactNode
  className?: string
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scale'
  duration?: number
  delay?: number
  id?: string
}

export default function GSAPScrollTrigger({
  children,
  className,
  animation = 'fadeIn',
  duration = 1,
  delay = 0,
  id,
}: GSAPScrollTriggerProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const element = elementRef.current
    if (!element) return

    // Make sure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger)

    let initialProps = {}
    let animationProps = {}

    // Set animation properties based on animation type
    switch (animation) {
      case 'fadeIn':
        initialProps = { opacity: 0 }
        animationProps = { opacity: 1 }
        break
      case 'slideUp':
        initialProps = { opacity: 0, y: 50 }
        animationProps = { opacity: 1, y: 0 }
        break
      case 'slideDown':
        initialProps = { opacity: 0, y: -50 }
        animationProps = { opacity: 1, y: 0 }
        break
      case 'slideLeft':
        initialProps = { opacity: 0, x: 50 }
        animationProps = { opacity: 1, x: 0 }
        break
      case 'slideRight':
        initialProps = { opacity: 0, x: -50 }
        animationProps = { opacity: 1, x: 0 }
        break
      case 'scale':
        initialProps = { opacity: 0, scale: 0.8 }
        animationProps = { opacity: 1, scale: 1 }
        break
      default:
        initialProps = { opacity: 0 }
        animationProps = { opacity: 1 }
    }

    // Set initial state
    gsap.set(element, initialProps)

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=10%',
        toggleActions: 'play none none none',
        id,
      },
    })

    tl.to(element, {
      ...animationProps,
      duration,
      delay,
      ease: 'power2.out',
    })

    return () => {
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [animation, duration, delay, id])

  return (
    <div ref={elementRef} className={cn(className)}>
      {children}
    </div>
  )
}
