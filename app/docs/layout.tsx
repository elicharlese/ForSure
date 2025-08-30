import type React from 'react'
import DocsLayout from '@/components/docs-layout'

export const metadata = {
  title: 'ForSure Documentation',
  description: 'Documentation for the ForSure file structure language',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>
}
