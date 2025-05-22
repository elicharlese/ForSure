import type React from "react"
import { DemoBanner } from "@/components/demo-banner"
import { ProtectedRoute } from "@/components/protected-route"
import { SecondaryNavbar } from "./components/secondary-navbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <DemoBanner />
        <SecondaryNavbar />
        {children}
      </div>
    </ProtectedRoute>
  )
}
