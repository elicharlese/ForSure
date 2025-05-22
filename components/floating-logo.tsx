"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"

interface FloatingLogoProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function FloatingLogo({ src, alt, width, height, className }: FloatingLogoProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="relative"
    >
      {/* Glow effect - different for light and dark modes */}
      <div
        className={`absolute inset-0 rounded-full blur-xl ${isDark ? "bg-primary/20" : "bg-primary/10"} scale-125`}
        style={{ width, height }}
      />
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{
          filter: isDark
            ? "drop-shadow(0 0 12px rgba(140, 255, 230, 0.3))"
            : "drop-shadow(0 0 8px rgba(140, 255, 230, 0.2))",
        }}
      />
    </motion.div>
  )
}
