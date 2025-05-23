"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Star, Eye, Copy, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Extended component list (you can expand this)
const allComponents = [
  // ... (include all the featured components plus many more)
  {
    id: "blog-template",
    name: "Blog Template",
    description: "Complete blog with posts, categories, and comments",
    category: "layout",
    tags: ["blog", "cms", "posts"],
    downloads: 456,
    stars: 23,
    preview: "/placeholder.svg?height=200&width=300&text=Blog+Template",
    prompt: `blog:
  pages:
    - home
    - post-detail
    - category-page
    - author-page
  components:
    - post-card
    - comment-system
    - sidebar`,
  },
  {
    id: "e-commerce",
    name: "E-commerce Kit",
    description: "Product catalog, cart, and checkout components",
    category: "layout",
    tags: ["ecommerce", "shop", "cart"],
    downloads: 789,
    stars: 56,
    preview: "/placeholder.svg?height=200&width=300&text=E-commerce+Kit",
    prompt: `ecommerce:
  pages:
    - product-catalog
    - product-detail
    - shopping-cart
    - checkout
  features:
    - payment-integration
    - inventory-management`,
  },
  // Add more components here...
]

export default function AllComponentsClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Component Library
          </Link>

          <h1 className="text-3xl font-bold mb-4">All Components</h1>
          <p className="text-muted-foreground mb-6">
            Browse our complete collection of ForSure components and templates.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search components..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ComponentCard({ component }: { component: (typeof allComponents)[0] }) {
  const copyPrompt = () => {
    navigator.clipboard.writeText(component.prompt)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img src={component.preview || "/placeholder.svg"} alt={component.name} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="secondary" onClick={copyPrompt}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-base">{component.name}</CardTitle>
        <CardDescription className="text-sm">{component.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {component.downloads.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {component.stars}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
