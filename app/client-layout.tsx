"use client"

import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ScrollToAnchor } from "@/components/scroll-to-anchor"
import { AuthProvider } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <ScrollToAnchor />
            <div className="flex min-h-screen flex-col">
              <Header />
              {children}
              <FooterWrapper />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

function FooterWrapper() {
  const pathname = usePathname()
  const isAppRoute = pathname?.startsWith("/app")

  if (isAppRoute) {
    return null
  }

  return <Footer />
}
