"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, X } from "lucide-react"

interface DocsSidebarNavProps {
  items: {
    title: string
    href: string
    items?: {
      title: string
      href: string
    }[]
  }[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMobileMenuOpen && !target.closest('[data-sidebar="true"]')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex lg:hidden items-center justify-between py-4 px-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar-menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="ml-2">Menu</span>
        </Button>
      </div>

      {/* Sidebar for desktop and mobile */}
      <div
        data-sidebar="true"
        id="sidebar-menu"
        className={cn(
          "fixed inset-0 z-40 bg-background flex-col border-r w-72 lg:sticky lg:top-16 lg:flex",
          isMobileMenuOpen ? "flex" : "hidden lg:flex",
        )}
      >
        <div className="flex justify-end p-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-6 px-4">
          {items.map((item, index) => (
            <div key={index} className="pb-6">
              <h4 className="mb-2 text-sm font-semibold text-primary">{item.title}</h4>
              {item.items?.length && (
                <div className="grid grid-flow-row auto-rows-max">
                  {item.items.map((subItem, idx) => (
                    <Link
                      key={idx}
                      href={subItem.href}
                      className={cn(
                        "flex w-full items-center rounded-md py-2 text-sm",
                        pathname === subItem.href
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  )
}

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const sidebarItems = [
    {
      title: "Getting Started",
      href: "/docs",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
        },
        {
          title: "Downloads",
          href: "/docs/download",
        },
      ],
    },
    {
      title: "Syntax",
      href: "/docs/syntax",
      items: [
        {
          title: "Basic Syntax",
          href: "/docs/syntax",
        },
        {
          title: "File Structure",
          href: "/docs/syntax/file-structure",
        },
        {
          title: "Comments",
          href: "/docs/syntax/comments",
        },
        {
          title: "Attributes",
          href: "/docs/syntax/attributes",
        },
        {
          title: "Import Directives",
          href: "/docs/syntax/import-directives",
        },
      ],
    },
    {
      title: "Examples",
      href: "/docs/examples",
      items: [
        {
          title: "Basic Examples",
          href: "/docs/examples",
        },
        {
          title: "Intermediate Examples",
          href: "/docs/examples/intermediate",
        },
        {
          title: "Advanced Examples",
          href: "/docs/examples/advanced",
        },
      ],
    },
    {
      title: "CLI Reference",
      href: "/docs/cli",
      items: [
        {
          title: "Commands",
          href: "/docs/cli",
        },
        {
          title: "Options",
          href: "/docs/cli/options",
        },
        {
          title: "Configuration",
          href: "/docs/cli/configuration",
        },
      ],
    },
    {
      title: "API Reference",
      href: "/docs/api",
      items: [
        {
          title: "Overview",
          href: "/docs/api",
        },
        {
          title: "Node API",
          href: "/docs/api/node",
        },
        {
          title: "Programmatic Usage",
          href: "/docs/api/programmatic-usage",
        },
      ],
    },
    {
      title: "Tools & Extensions",
      href: "/docs/tools",
      items: [
        {
          title: "VS Code Extension",
          href: "/docs/tools/vscode",
        },
        {
          title: "Syntax Highlighting",
          href: "/docs/tools/syntax-highlighting",
        },
        {
          title: "Editor Integrations",
          href: "/docs/tools/editor-integrations",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <DocsSidebarNav items={sidebarItems} />
        <main className="flex-1 py-6 px-4 lg:px-8 max-w-full w-full overflow-hidden">
          <div className="max-w-3xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
