"use client"

import { useEffect } from "react"

export function ScrollToAnchor() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()
        const targetId = target.getAttribute("href")
        const targetElement = document.querySelector(targetId as string)

        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80 // Adjust for header height
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })

          // Update URL without reload
          history.pushState(null, "", targetId)
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)

    // Handle initial load with hash
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash)
      if (targetElement) {
        setTimeout(() => {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }, 100)
      }
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick)
    }
  }, [])

  return null
}
