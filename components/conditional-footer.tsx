"use client"

import { usePathname } from "next/navigation"
import Footer from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  // Hide footer on login, register, and app pages
  const hideFooterPaths = ["/login", "/register"]
  const isAppPath = pathname?.startsWith("/app")
  const shouldHideFooter = hideFooterPaths.includes(pathname || "") || isAppPath

  if (shouldHideFooter) {
    return null
  }

  return <Footer />
}
