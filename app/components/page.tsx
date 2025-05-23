import type { Metadata } from "next"
import ComponentLibraryClientPage from "./ComponentLibraryClientPage"

export const metadata: Metadata = {
  title: "Component Library - ForSure",
  description: "Discover and use pre-built components with ForSure prompting language",
}

export default function ComponentLibraryPage() {
  return <ComponentLibraryClientPage />
}
