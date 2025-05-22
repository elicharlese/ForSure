"use client"

import { useScroll, motion } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-primary/20">
      <motion.div className="h-full bg-primary origin-left" style={{ scaleX: scrollYProgress }} />
    </div>
  )
}
