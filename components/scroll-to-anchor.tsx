"use client"

import { useEffect } from "react"

export function ScrollToAnchor() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()
        const href = target.getAttribute("href") as string

        // Extract the ID without the # and find the element by ID instead of using querySelector with #
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80 // Adjust for header height
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })

          // Update URL without reload
          history.pushState(null, "", href)
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)

    // Handle initial load with hash
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1)
      const targetElement = document.getElementById(targetId)
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
