"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Settings,
  Share2,
  Github,
  BellIcon as Vercel,
  GitFork,
  Download,
  Tag,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function SecondaryNavbar() {
  const { user, isDemoMode, exitDemoMode } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === "/app") return [{ label: "Dashboard", href: "/app" }]

    const paths = pathname.split("/").filter(Boolean)
    let currentPath = ""

    return paths.map((path, i) => {
      currentPath += `/${path}`
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
      return {
        label: i === 0 ? "Dashboard" : label,
        href: currentPath,
      }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="sticky top-0 z-30 border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        {/* Left side - Logo and breadcrumbs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/app" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image src="/fs-logo.png" alt="ForSure Logo" width={32} height={32} className="h-8 w-8" />
              </div>
              <span className="font-semibold text-lg hidden sm:inline-block">ForSure</span>
            </Link>
            {isDemoMode && (
              <Badge
                variant="outline"
                className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800"
              >
                Demo
              </Badge>
            )}
          </div>

          <div className="hidden md:flex items-center">
            <nav className="flex items-center text-sm">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Right side - Action buttons */}
        <div className="hidden md:flex items-center gap-1">
          {isDemoMode && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs mr-2 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800 dark:hover:bg-yellow-900/50"
              onClick={exitDemoMode}
            >
              Exit Demo
            </Button>
          )}
          <Button variant="ghost" size="icon" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Share">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="GitHub">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Deploy to Vercel">
            <Vercel className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Fork Chat">
            <GitFork className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Version">
            <Tag className="h-4 w-4" />
          </Button>

          <div className="pl-4 border-l ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                {isDemoMode && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exitDemoMode}>
                      <X className="mr-2 h-4 w-4" />
                      <span>Exit Demo Mode</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              {isDemoMode && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800 dark:hover:bg-yellow-900/50"
                  onClick={exitDemoMode}
                >
                  Exit Demo Mode
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Vercel className="h-3.5 w-3.5" />
                <span>Deploy</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                <span>Fork</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                <span>Version</span>
              </Button>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
