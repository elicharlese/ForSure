'use client'

import React from 'react'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

type AnimatedListProps = {
  children: ReactNode
  className?: string
  childClassName?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
  /** @deprecated Use `amount` instead. Will be removed after deprecation window. */
  threshold?: number
  amount?: 'some' | 'all' | number
}

export function AnimatedList({
  children,
  className,
  childClassName,
  staggerDelay = 0.1,
  direction = 'up',
  duration = 0.5,
  once = true,
  threshold,
  amount,
}: AnimatedListProps) {
  const { ref, isInView } = useScrollAnimation({ once, threshold, amount })
  const prefersReducedMotion = useReducedMotion()

  const getDirectionVariants = (): Variants => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    }
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
  const effectiveDuration = prefersReducedMotion ? 0 : duration
  const effectiveStagger = prefersReducedMotion ? 0 : staggerDelay

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: effectiveStagger,
      },
    },
  }

  // Clone children and wrap each in a motion.div
  const animatedChildren = React.Children.map(children, (child, index) => {
    const key =
      React.isValidElement(child) && child.key != null ? child.key : index
    return (
      <motion.div
        key={key}
        variants={getDirectionVariants()}
        transition={{ duration: effectiveDuration, ease: easing }}
        className={childClassName}
      >
        {child}
      </motion.div>
    )
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(className)}
    >
      {animatedChildren}
    </motion.div>
  )
}
