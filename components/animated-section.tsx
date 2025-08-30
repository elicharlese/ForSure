'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
  /** @deprecated Use `amount` instead. Will be removed after deprecation window. */
  threshold?: number
  amount?: 'some' | 'all' | number
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
  threshold,
  amount,
}: AnimatedSectionProps) {
  const { ref, isInView } = useScrollAnimation({ once, threshold, amount })

  const getDirectionVariants = (): Variants => {
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }
      case 'down':
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 },
        }
      case 'left':
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 },
        }
      case 'right':
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 },
        }
      case 'none':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
    }
  }

  const easing: [number, number, number, number] = [0.16, 1, 0.3, 1]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getDirectionVariants()}
      transition={{ duration, delay, ease: easing }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
