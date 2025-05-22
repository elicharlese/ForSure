"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, ArrowRight, Check, Copy } from "lucide-react"
import CodeExample from "@/components/code-example"
import AnimateOnScroll from "@/components/animate-on-scroll"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [copied, setCopied] = useState<string | null>(null)

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "web", name: "Web" },
    { id: "backend", name: "Backend" },
    { id: "mobile", name: "Mobile" },
    { id: "fullstack", name: "Full Stack" },
  ]

  const templates = [
    {
      id: "nextjs-app",
      name: "Next.js App Router",
      description: "Modern Next.js project with App Router, TypeScript, and Tailwind CSS.",
      category: "web",
      downloads: 1245,
      code: `# nextjs-app.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Next.js project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: Directory
    - Name: app/
    <description>
    Contains the app router structure for pages and layouts.
    </description>

    - Type: File
      - Name: layout.tsx
      <description>
      Root layout component that wraps all pages.
      </description>

    - Type: File
      - Name: page.tsx
      <description>
      The main landing page component.
      </description>

  - Type: Directory
    - Name: components/
    <description>
    Contains reusable UI components.
    </description>

  - Type: Directory
    - Name: lib/
    <description>
    Contains utility functions and shared code.
    </description>

  - Type: Directory
    - Name: public/
    <description>
    Contains static assets like images and fonts.
    </description>`,
    },
    {
      id: "express-api",
      name: "Express API",
      description: "Node.js API with Express, MongoDB, and JWT authentication.",
      category: "backend",
      downloads: 987,
      code: `# express-api.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Express API project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: File
    - Name: server.js
    <description>
    Entry point for the API server.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the source code for the API.
    </description>

    - Type: Directory
      - Name: controllers/
      <description>
      Contains route controllers.
      </description>

    - Type: Directory
      - Name: models/
      <description>
      Contains data models.
      </description>

    - Type: Directory
      - Name: routes/
      <description>
      Contains API route definitions.
      </description>

    - Type: Directory
      - Name: middleware/
      <description>
      Contains middleware functions.
      </description>

  - Type: Directory
    - Name: config/
    <description>
    Contains configuration files.
    </description>`,
    },
    {
      id: "react-native",
      name: "React Native",
      description: "React Native project with navigation, state management, and API integration.",
      category: "mobile",
      downloads: 756,
      code: `# react-native.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the React Native project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: File
    - Name: App.js
    <description>
    Entry point for the application.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the source code for the application.
    </description>

    - Type: Directory
      - Name: screens/
      <description>
      Contains screen components.
      </description>

    - Type: Directory
      - Name: components/
      <description>
      Contains reusable UI components.
      </description>

    - Type: Directory
      - Name: navigation/
      <description>
      Contains navigation configuration.
      </description>

    - Type: Directory
      - Name: assets/
      <description>
      Contains static assets like images and fonts.
      </description>`,
    },
    {
      id: "fullstack-nextjs",
      name: "Full Stack Next.js",
      description: "Complete Next.js project with API routes, database integration, and authentication.",
      category: "fullstack",
      downloads: 1089,
      code: `# fullstack-nextjs.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Full Stack Next.js project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: Directory
    - Name: app/
    <description>
    Contains the app router structure for pages and layouts.
    </description>

    - Type: File
      - Name: layout.tsx
      <description>
      Root layout component that wraps all pages.
      </description>

    - Type: File
      - Name: page.tsx
      <description>
      The main landing page component.
      </description>

    - Type: Directory
      - Name: api/
      <description>
      Contains API route handlers.
      </description>

  - Type: Directory
    - Name: components/
    <description>
    Contains reusable UI components.
    </description>

  - Type: Directory
    - Name: lib/
    <description>
    Contains utility functions and shared code.
    </description>

  - Type: Directory
    - Name: prisma/
    <description>
    Contains Prisma schema and migrations.
    </description>

    - Type: File
      - Name: schema.prisma
      <description>
      Prisma schema defining the database models.
      </description>`,
    },
    {
      id: "vite-react",
      name: "Vite React",
      description: "React project with Vite, TypeScript, and modern tooling.",
      category: "web",
      downloads: 876,
      code: `# vite-react.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Vite React project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: File
    - Name: vite.config.js
    <description>
    Configuration for Vite bundler.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the source code for the application.
    </description>

    - Type: File
      - Name: main.jsx
      <description>
      Entry point for the application.
      </description>

    - Type: File
      - Name: App.jsx
      <description>
      Root component of the application.
      </description>

    - Type: Directory
      - Name: components/
      <description>
      Contains reusable UI components.
      </description>

    - Type: Directory
      - Name: assets/
      <description>
      Contains static assets like images and styles.
      </description>`,
    },
  ]

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">ForSure Templates</h1>
          <p className="text-xl text-muted-foreground">
            Ready-to-use templates for common project structures across various frameworks and languages.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeCategory === category.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted dark:bg-muted/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Need a Custom Template?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find what you're looking for? Create a custom template or request one from the community.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/contact">Request Template</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10">
                <h3 className="text-xl font-bold mb-2">No templates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter to find what you're looking for.
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <AnimateOnScroll key={template.id} type="slideUp">
                  <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                    <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">{template.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">{template.downloads} downloads</span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/download?template=${template.id}`} className="flex items-center">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Link>
                      </Button>
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground mb-6">{template.description}</p>
                      <div className="relative">
                        <CodeExample code={template.code} language="forsure" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(template.code, template.id)}
                          className="absolute top-4 right-4 h-8 text-primary hover:text-white hover:bg-secondary"
                        >
                          {copied === template.id ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))
            )}
          </div>
        </div>

        <AnimateOnScroll type="fade">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download the ForSure CLI and start using these templates to jumpstart your projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild>
                <Link href="/download" className="flex items-center">
                  Download ForSure CLI
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/docs" className="flex items-center">
                  Read the Docs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
