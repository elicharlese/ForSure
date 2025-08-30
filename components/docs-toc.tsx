'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Find all headings in the document
    const elements = Array.from(document.querySelectorAll('h2, h3'))

    const items: TocItem[] = elements.map(element => {
      // Ensure each heading has an id
      if (!element.id) {
        element.id =
          element.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      }

      return {
        id: element.id,
        text: element.textContent || '',
        level: Number.parseInt(element.tagName.substring(1)),
      }
    })

    setHeadings(items)

    // Set up intersection observer to highlight active section
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '0px 0px -80% 0px',
      }
    )

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <>
      <button
        className="fixed right-0 top-1/4 z-50 bg-primary text-primary-foreground p-2 rounded-l-md shadow-md"
        onClick={() => {
          const toc = document.getElementById('toc-content')
          toc?.classList.toggle('translate-x-full')
          toc?.classList.toggle('translate-x-0')
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>
      </button>
      <div
        id="toc-content"
        className={cn(
          'fixed right-0 top-1/4 z-40 bg-card text-card-foreground p-4 rounded-l-md shadow-lg w-64 max-h-[70vh] overflow-y-auto transform translate-x-full transition-transform duration-300 ease-in-out',
          className
        )}
      >
        <h4 className="mb-4 text-sm font-semibold">On This Page</h4>
        <ul className="space-y-2 text-sm">
          {headings.map(heading => (
            <li key={heading.id} className={cn(heading.level === 3 && 'ml-4')}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  'inline-block transition-colors hover:text-foreground',
                  activeId === heading.id
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                  })
                  // Update URL without full page reload
                  window.history.pushState(null, '', `#${heading.id}`)

                  // Hide the TOC after clicking on mobile
                  if (window.innerWidth < 1024) {
                    const toc = document.getElementById('toc-content')
                    toc?.classList.add('translate-x-full')
                    toc?.classList.remove('translate-x-0')
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
