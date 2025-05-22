import type React from "react"
import ClientRootLayout from "./client-layout"

export const metadata = {
  title: "ForSure - File Structure Definition Language",
  description: "Define, document, and generate project structures with a powerful language and CLI tool.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'