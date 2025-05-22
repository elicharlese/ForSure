import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { ConditionalFooter } from "@/components/conditional-footer"
import { ScrollToAnchor } from "@/components/scroll-to-anchor"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ForSure - File Structure Definition Language",
  description: "Define, document, and generate project structures with a powerful language and CLI tool.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
            storageKey="forsure-theme"
          >
            <ScrollToAnchor />
            <div className="flex min-h-screen flex-col">
              <Header />
              {children}
              <ConditionalFooter />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
