"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface DocsTocProps {
  className?: string
}

export default function DocsToc({ className }: DocsTocProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Find all headings in the document
    const elements = Array.from(document.querySelectorAll("h2, h3"))

    const items: TocItem[] = elements.map((element) => {
      // Ensure each heading has an id
      if (!element.id) {
        element.id = element.textContent?.toLowerCase().replace(/\s+/g, "-") || ""
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: Number.parseInt(element.tagName.substring(1)),
      }
    })

    setHeadings(items)

    // Set up intersection observer to highlight active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "0px 0px -80% 0px",
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className={cn("hidden lg:block", className)}>
      <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto pt-6">
        <h4 className="mb-4 text-sm font-semibold">On This Page</h4>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className={cn(heading.level === 3 && "ml-4")}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "inline-block transition-colors hover:text-foreground",
                  activeId === heading.id ? "font-medium text-primary" : "text-muted-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                  })
                  // Update URL without full page reload
                  window.history.pushState(null, "", `#${heading.id}`)
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
