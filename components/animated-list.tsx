"use client"

import React from "react"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

type AnimatedListProps = {
  children: ReactNode
  className?: string
  childClassName?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
  once?: boolean
  threshold?: number
}

export default function AnimatedList({
  children,
  className,
  childClassName,
  staggerDelay = 0.1,
  direction = "up",
  duration = 0.5,
  once = true,
  threshold = 0.1,
}: AnimatedListProps) {
  const { ref, isInView } = useScrollAnimation({ once, threshold })

  const getDirectionVariants = () => {
    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }
      case "down":
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 },
        }
      case "left":
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 },
        }
      case "right":
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 },
        }
      case "none":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  // Clone children and wrap each in a motion.div
  const animatedChildren = React.Children.map(children, (child, index) => {
    return (
      <motion.div
        variants={getDirectionVariants()}
        transition={{ duration, ease: "easeOut" }}
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
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(className)}
    >
      {animatedChildren}
    </motion.div>
  )
}
