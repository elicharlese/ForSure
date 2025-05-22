"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Terminal, Code, FileText } from "lucide-react"
import ScrollProgress from "@/components/scroll-progress"
import { useTheme } from "next-themes"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { isAuthenticated, enterDemoMode } = useAuth()
  const pathname = usePathname()

  // If we're in the /app route, don't render the header content
  if (pathname?.startsWith("/app")) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollProgress />
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <div
                className={`absolute inset-0 rounded-full blur-lg ${
                  isDark ? "bg-primary/15" : "bg-primary/10"
                } scale-125`}
              />
              <Image
                src="/fs-logo.png"
                alt="ForSure Logo"
                width={40}
                height={40}
                className="h-10 w-10"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 0 8px rgba(140, 255, 230, 0.25))"
                    : "drop-shadow(0 0 6px rgba(140, 255, 230, 0.15))",
                }}
              />
            </div>
            <span className={`font-bold text-2xl ${isDark ? "text-primary" : "text-secondary"}`}>ForSure</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cli" className="flex items-center gap-1 group mr-4">
            <Terminal className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">CLI</span>
          </Link>
          <Link href="/language" className="flex items-center gap-1 group mr-4">
            <Code className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Language</span>
          </Link>
          <Link href="/docs" className="flex items-center gap-1 group mr-4">
            <FileText className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Documentation</span>
          </Link>

          {isAuthenticated ? (
            <UserNav />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="ml-[-8px]">
                <Button variant="default" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container flex flex-col py-4 gap-4">
              <Link href="/cli" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                <Terminal className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">CLI</span>
              </Link>
              <Link href="/language" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                <Code className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Language</span>
              </Link>
              <Link href="/docs" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                <FileText className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Documentation</span>
              </Link>

              <div className="flex items-center gap-4 px-4">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
                <ModeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
