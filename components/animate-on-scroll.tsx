"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationType = "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale"

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  type?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
}

export default function AnimateOnScroll({
  children,
  className,
  type = "fade",
  delay = 0,
  duration = 0.6,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px 0px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  // Define animation variants based on type
  const getVariants = () => {
    switch (type) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
      case "slideUp":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
      case "slideDown":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
      case "slideLeft":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
      case "slideRight":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, delay, ease: "easeOut" },
          },
        }
    }
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={getVariants()} className={cn(className)}>
      {children}
    </motion.div>
  )
}
