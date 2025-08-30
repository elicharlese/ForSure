import type React from 'react'
import { DemoBanner } from '@/components/demo-banner'
import { ProtectedRoute } from '@/components/protected-route'
import { SecondaryNavbar } from './components/secondary-navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col overflow-hidden">
        <DemoBanner />
        <SecondaryNavbar />
        {children}
      </div>
    </ProtectedRoute>
  )
}
