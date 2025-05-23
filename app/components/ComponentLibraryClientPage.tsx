"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Code,
  Palette,
  Layout,
  Database,
  Globe,
  Smartphone,
  Filter,
  Download,
  Star,
  Eye,
  Copy,
  Check,
  Brain,
  Lightbulb,
  Fingerprint,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Lock,
  ShoppingCart,
  BarChart,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const componentCategories = [
  { id: "ui", name: "UI Elements", icon: Palette, count: 24 },
  { id: "forms", name: "Form Controls", icon: Code, count: 18 },
  { id: "layout", name: "Page Layouts", icon: Layout, count: 12 },
  { id: "auth", name: "Authentication", icon: Lock, count: 10 },
  { id: "data", name: "Data Display", icon: Database, count: 15 },
  { id: "navigation", name: "Navigation", icon: Globe, count: 9 },
  { id: "marketing", name: "Marketing", icon: TrendingUp, count: 14 },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, count: 11 },
  { id: "dashboard", name: "Dashboards", icon: BarChart, count: 16 },
  { id: "ai", name: "AI Components", icon: Brain, count: 7 },
  { id: "mobile", name: "Mobile", icon: Smartphone, count: 8 },
  { id: "animation", name: "Animation", icon: Sparkles, count: 13 },
]

const featuredComponents = [
  {
    id: "dashboard-template",
    name: "Dashboard Template",
    description: "Complete admin dashboard with sidebar, charts, and data tables",
    category: "layout",
    tags: ["admin", "dashboard", "charts"],
    downloads: 1247,
    stars: 89,
    preview: "/placeholder.svg?height=200&width=300&text=Dashboard+Template",
    prompt: `dashboard:
  layout: admin-sidebar
  components:
    - navigation-sidebar
    - header-bar
    - main-content
    - chart-widgets
    - data-tables`,
    styleMatch: 94,
    lastUpdated: "2 weeks ago",
  },
  {
    id: "auth-forms",
    name: "Authentication Forms",
    description: "Login, register, and password reset forms with validation",
    category: "forms",
    tags: ["auth", "forms", "validation"],
    downloads: 892,
    stars: 67,
    preview: "/placeholder.svg?height=200&width=300&text=Auth+Forms",
    prompt: `auth-system:
  forms:
    - login-form
    - register-form
    - forgot-password
  validation: zod
  styling: tailwind`,
    styleMatch: 86,
    lastUpdated: "3 days ago",
  },
  {
    id: "landing-page",
    name: "Landing Page Kit",
    description: "Modern landing page with hero, features, and CTA sections",
    category: "layout",
    tags: ["landing", "marketing", "hero"],
    downloads: 1456,
    stars: 112,
    preview: "/placeholder.svg?height=200&width=300&text=Landing+Page",
    prompt: `landing-page:
  sections:
    - hero-section
    - features-grid
    - testimonials
    - pricing-table
    - cta-section
  style: modern`,
    styleMatch: 78,
    lastUpdated: "1 month ago",
  },
  {
    id: "data-table",
    name: "Advanced Data Table",
    description: "Sortable, filterable data table with pagination and search",
    category: "data",
    tags: ["table", "data", "pagination"],
    downloads: 734,
    stars: 45,
    preview: "/placeholder.svg?height=200&width=300&text=Data+Table",
    prompt: `data-table:
  features:
    - sorting
    - filtering
    - pagination
    - search
  data-source: api
  styling: shadcn`,
    styleMatch: 91,
    lastUpdated: "1 week ago",
  },
  {
    id: "chat-interface",
    name: "Chat Interface",
    description: "Real-time chat component with message history and typing indicators",
    category: "ui",
    tags: ["chat", "realtime", "messaging"],
    downloads: 623,
    stars: 78,
    preview: "/placeholder.svg?height=200&width=300&text=Chat+Interface",
    prompt: `chat-interface:
  features:
    - message-list
    - input-field
    - typing-indicator
    - file-upload
  realtime: websocket`,
    styleMatch: 87,
    lastUpdated: "2 days ago",
  },
  {
    id: "api-routes",
    name: "REST API Routes",
    description: "Complete CRUD API routes with authentication and validation",
    category: "backend",
    tags: ["api", "crud", "auth"],
    downloads: 567,
    stars: 34,
    preview: "/placeholder.svg?height=200&width=300&text=API+Routes",
    prompt: `api-routes:
  endpoints:
    - users: [GET, POST, PUT, DELETE]
    - auth: [login, register, refresh]
  middleware:
    - authentication
    - validation
  database: prisma`,
    styleMatch: 82,
    lastUpdated: "3 weeks ago",
  },
  {
    id: "neural-auth",
    name: "Neural Auth Forms",
    description: "AI-enhanced authentication forms that adapt to your app's style",
    category: "ai",
    tags: ["auth", "neural", "adaptive"],
    downloads: 348,
    stars: 56,
    preview: "/placeholder.svg?height=200&width=300&text=Neural+Auth+Forms",
    prompt: `neural-auth:
  forms:
    - login-form
    - register-form
    - forgot-password
  features:
    - style-adaptation
    - field-inference
    - validation-learning
  intelligence: neural-network`,
    styleMatch: 98,
    lastUpdated: "Just released",
    isNew: true,
  },
  {
    id: "smart-dashboard",
    name: "Smart Dashboard",
    description: "AI-powered dashboard that learns from user interactions",
    category: "ai",
    tags: ["dashboard", "neural", "adaptive"],
    downloads: 276,
    stars: 41,
    preview: "/placeholder.svg?height=200&width=300&text=Smart+Dashboard",
    prompt: `smart-dashboard:
  layout: adaptive
  components:
    - neural-sidebar
    - learning-widgets
    - adaptive-charts
  intelligence: neural-network
  learning-rate: 0.05`,
    styleMatch: 95,
    lastUpdated: "4 days ago",
    isNew: true,
  },
]

const trendingComponents = [
  {
    id: "neural-auth",
    name: "Neural Auth Forms",
    description: "AI-enhanced authentication forms that adapt to your app's style",
    category: "ai",
    tags: ["auth", "neural", "adaptive"],
    trendScore: 98,
    styleMatch: 98,
  },
  {
    id: "smart-dashboard",
    name: "Smart Dashboard",
    description: "AI-powered dashboard that learns from user interactions",
    category: "ai",
    tags: ["dashboard", "neural", "adaptive"],
    trendScore: 94,
    styleMatch: 95,
  },
  {
    id: "landing-page",
    name: "Landing Page Kit",
    description: "Modern landing page with hero, features, and CTA sections",
    category: "layout",
    tags: ["landing", "marketing", "hero"],
    trendScore: 89,
    styleMatch: 78,
  },
  {
    id: "data-table",
    name: "Advanced Data Table",
    description: "Sortable, filterable data table with pagination and search",
    category: "data",
    tags: ["table", "data", "pagination"],
    trendScore: 82,
    styleMatch: 91,
  },
]

interface ComponentCardProps {
  component: any
  copied: string | null
  onCopy: (id: string, prompt: string) => void
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, copied, onCopy }) => {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              component.category === "ai" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/10",
            )}
          >
            {component.category === "ai" && <Brain className="h-3 w-3 mr-1" />}
            {component.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="font-medium">{component.stars}</span>
          </div>
        </div>
        <CardTitle className="text-base">{component.name}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">{component.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <img src={component.preview || "/placeholder.svg"} alt={component.name} className="rounded-md mb-3" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Download className="h-3 w-3" />
          <span>{component.downloads} downloads</span>
          <span className="ml-auto">Updated {component.lastUpdated}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-4 w-full">
          <div className="flex gap-1">
            {component.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => onCopy(component.id, component.prompt)}
              disabled={copied === component.id}
            >
              {copied === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === component.id ? "Copied!" : "Copy Prompt"}
            </Button>
            <Link href={`/component/${component.id}`}>
              <Button size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function ComponentLibraryClientPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [styleMatchFilter, setStyleMatchFilter] = useState([70])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredComponents, setFilteredComponents] = useState(featuredComponents)
  const { user } = useAuth()

  // Neural network style match simulation
  const [styleAnalysis, setStyleAnalysis] = useState<null | { complete: boolean; progress: number }>(null)

  useEffect(() => {
    // Only run style analysis if user is signed in
    if (!user) return

    // Simulate style analysis
    setStyleAnalysis({ complete: false, progress: 0 })
    const interval = setInterval(() => {
      setStyleAnalysis((prev) => {
        if (!prev) return { complete: false, progress: 0 }
        const newProgress = prev.progress + 20
        if (newProgress >= 100) {
          clearInterval(interval)
          return { complete: true, progress: 100 }
        }
        return { complete: false, progress: newProgress }
      })
    }, 600)

    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    // Filter components based on search term, category filter, and style match
    const minStyleMatch = styleMatchFilter[0]
    let filtered = featuredComponents

    if (activeTab !== "all") {
      filtered = filtered.filter((component) => component.category === activeTab)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (component) =>
          component.name.toLowerCase().includes(term) ||
          component.description.toLowerCase().includes(term) ||
          component.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    }

    filtered = filtered.filter((component) => component.styleMatch >= minStyleMatch)
    setFilteredComponents(filtered)
  }, [searchTerm, activeTab, styleMatchFilter])

  const copyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopied(id)
    setTimeout(() => {
      setCopied(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container py-8 px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className="text-violet-500 border-violet-500 bg-violet-50 dark:bg-violet-950/20 dark:border-violet-400 dark:text-violet-400"
            >
              <Brain className="h-3 w-3 mr-1 text-violet-500 dark:text-violet-400" /> Neural Network Enhanced
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
            Component Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover and use pre-built components with ForSure prompting language. Our neural network adapts components
            to match your coding style.
          </p>

          {/* Neural Network Status */}
          {user ? (
            <div className="max-w-md mx-auto mb-8 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg p-4 shadow-lg">
              {styleAnalysis?.complete ? (
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-2 rounded-full">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">Style Analysis Complete</h3>
                    <p className="text-sm text-muted-foreground">Components are now adapted to your coding style</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setStyleAnalysis(null)}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Analyzing your coding style...</span>
                    <span className="text-sm text-muted-foreground">{styleAnalysis?.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${styleAnalysis?.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Our neural network is analyzing your projects to enhance component recommendations
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto mb-8 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Neural Network Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign in to unlock personalized component recommendations
                  </p>
                </div>
                <Link href="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setFilterVisible(!filterVisible)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {filterVisible && (
            <div className="max-w-3xl mx-auto mb-8 bg-card rounded-lg border shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Category</h3>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {componentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Sort By</h3>
                  <Select defaultValue="styleMatch">
                    <SelectTrigger>
                      <SelectValue placeholder="Style Match" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="styleMatch">Style Match</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Minimum Style Match</h3>
                    <span className="text-sm text-muted-foreground">{styleMatchFilter[0]}%</span>
                  </div>
                  <Slider
                    defaultValue={[70]}
                    max={100}
                    step={5}
                    value={styleMatchFilter}
                    onValueChange={setStyleMatchFilter}
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => setFilterVisible(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setFilterVisible(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Component Tabs */}
        <Tabs defaultValue="all" className="mb-10" onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-3 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="all" className="text-xs md:text-sm py-2">
              All
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs md:text-sm py-2">
              <Brain className="h-3.5 w-3.5 mr-1 inline" />
              AI
            </TabsTrigger>
            <TabsTrigger value="ui" className="text-xs md:text-sm py-2">
              UI
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs md:text-sm py-2">
              Layout
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs md:text-sm py-2">
              Forms
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Browse by Category
            <span className="bg-muted rounded text-xs py-0.5 px-1.5 font-normal text-muted-foreground ml-2">
              {componentCategories.reduce((acc, cat) => acc + cat.count, 0)} components
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {componentCategories.map((category) => (
              <Card
                key={category.id}
                className={cn(
                  "hover:shadow-md transition-shadow cursor-pointer group border border-transparent",
                  activeTab === category.id && "border-primary bg-primary/5",
                )}
                onClick={() => setActiveTab(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <category.icon
                    className={cn(
                      "h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform",
                      activeTab === category.id ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Neural Components */}
        {activeTab === "all" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-semibold">Neural Components</h2>
                <Badge variant="outline" className="text-primary">
                  New
                </Badge>
              </div>
              <Link href="/components/ai">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <Brain className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Neural Component Matching</h3>
                    <p className="text-muted-foreground mb-4">
                      Our neural network analyzes your coding patterns and adapts components to match your unique style
                      preferences, naming conventions, and architectural patterns.
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                          <Fingerprint className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Style Recognition</h4>
                          <p className="text-xs text-muted-foreground">
                            Identifies your preferred coding patterns and conventions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Adaptive Suggestions</h4>
                          <p className="text-xs text-muted-foreground">
                            Recommends components that best match your development style
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                          <RefreshCw className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Continuous Learning</h4>
                          <p className="text-xs text-muted-foreground">
                            Improves recommendations as you build more projects
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/docs/ai">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {trendingComponents
                      .filter((c) => c.category === "ai")
                      .slice(0, 2)
                      .map((component) => (
                        <Card key={component.id} className="bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                Neural
                              </Badge>
                              <div className="flex items-center gap-1 text-xs">
                                <Fingerprint className="h-3 w-3 text-primary" />
                                <span className="font-medium">{component.styleMatch}% match</span>
                              </div>
                            </div>
                            <CardTitle className="text-base">{component.name}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">{component.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="p-4 pt-0">
                            <div className="flex gap-1">
                              {component.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trending Components */}
        {activeTab === "all" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-semibold">Trending Components</h2>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <Link href="/components/trending">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingComponents.map((component) => (
                <Card key={component.id} className="hover:shadow-md transition-all">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          component.category === "ai"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-secondary/10",
                        )}
                      >
                        {component.category === "ai" && <Brain className="h-3 w-3 mr-1" />}
                        {component.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        <span className="font-medium">{component.trendScore}%</span>
                      </div>
                    </div>
                    <CardTitle className="text-base">{component.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{component.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex justify-between w-full">
                      <div className="flex gap-1">
                        {component.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Fingerprint className="h-3 w-3" />
                        <span>{component.styleMatch}% match</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Components */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {filteredComponents.length > 0
                ? activeTab === "all"
                  ? "Featured Components"
                  : `${
                      componentCategories.find((c) => c.id === activeTab)?.name ||
                      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                    } Components`
                : "No Components Found"}
            </h2>
            {activeTab === "all" && (
              <Link href="/components/all">
                <Button variant="outline">View All</Button>
              </Link>
            )}
          </div>

          {filteredComponents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
                <ComponentCard key={component.id} component={component} copied={copied} onCopy={copyPrompt} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No components found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setActiveTab("all")
                  setStyleMatchFilter([70])
                }}
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Explore our component library and start building your next project with ease.
          </p>
          <Button>Explore Components</Button>
        </div>
      </div>
    </div>
  )
}
