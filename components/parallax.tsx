'use client'

import type React from 'react'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export default function Parallax({
  children,
  className,
  speed = 0.1,
}: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Transform the scroll progress to a y value based on speed
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100])

  return (
    <div ref={ref} className={cn('overflow-hidden relative', className)}>
      <motion.div style={{ y: `${y}%` }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}
