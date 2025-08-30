'use client'

import { type ReactNode, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { cn } from '@/lib/utils'

interface HorizontalScrollSectionProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  id?: string
}

export default function HorizontalScrollSection({
  children,
  className,
  contentClassName,
  id,
}: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return

    // Make sure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger)

    // Calculate the width of the content
    const contentWidth = content.scrollWidth
    const sectionWidth = section.offsetWidth

    // Only create animation if content is wider than container
    if (contentWidth <= sectionWidth) return

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: `+=${contentWidth - sectionWidth + 100}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        id,
      },
    })

    tl.to(content, {
      x: -(contentWidth - sectionWidth),
      ease: 'none',
    })

    return () => {
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <div ref={sectionRef} className={cn('overflow-hidden', className)} id={id}>
      <div ref={contentRef} className={cn('flex', contentClassName)}>
        {children}
      </div>
    </div>
  )
}
