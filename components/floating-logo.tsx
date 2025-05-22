"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface FloatingLogoProps {
  src?: string
  alt: string
  width: number
  height: number
  className?: string
  containerClassName?: string
}

export default function FloatingLogo({
  src,
  alt,
  width,
  height,
  className = "",
  containerClassName = "",
}: FloatingLogoProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
      className={`relative ${containerClassName}`}
    >
      <Image src={src || "/fs-logo.png"} alt={alt} width={width} height={height} className={`${className}`} priority />
    </motion.div>
  )
}
