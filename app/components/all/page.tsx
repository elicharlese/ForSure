import type { Metadata } from 'next'
import AllComponentsClientPage from './AllComponentsClientPage'

export const metadata: Metadata = {
  title: 'All Components - ForSure',
  description: 'Browse all available components in the ForSure library',
}

export default function AllComponentsPage() {
  return <AllComponentsClientPage />
}
