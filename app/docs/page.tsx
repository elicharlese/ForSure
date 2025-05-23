import Link from "next/link"
import {
  ArrowRight,
  Book,
  Code,
  FileText,
  Terminal,
  Lightbulb,
  Layers,
  GitBranch,
  Globe,
  Cpu,
  Brain,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DocsCodeBlock from "@/components/docs-code-block"
import DocsSearch from "@/components/docs-search"
import DocsToc from "@/components/docs-toc"
import DocsFeedback from "@/components/docs-feedback"
import DocsInteractiveDemo from "@/components/docs-interactive-demo"

export default function DocsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 max-w-3xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm font-medium">
                Documentation
              </Badge>
              <Badge variant="secondary" className="text-xs">
                v1.2.0
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">ForSure Documentation</h1>
            <p className="text-xl text-muted-foreground">
              A prompting programming language for describing and documenting file structures in a clear and concise
              manner.
            </p>
            <div className="pt-2">
              <DocsSearch />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Book className="h-5 w-5 mr-2 text-primary" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Learn the basics and get up and running with ForSure quickly.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/installation" className="text-sm text-primary hover:underline flex items-center">
                  Installation Guide
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  Prompting Syntax
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Comprehensive guide to ForSure prompting syntax and features.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/syntax" className="text-sm text-primary hover:underline flex items-center">
                  Learn the syntax
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Terminal className="h-5 w-5 mr-2 text-primary" />
                  CLI & Web App
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Learn how to use the ForSure CLI and web application.</p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/cli" className="text-sm text-primary hover:underline flex items-center">
                  CLI commands
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  Neural Network
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Learn about ForSure's AI capabilities that adapt to your coding style.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/ai" className="text-sm text-primary hover:underline flex items-center">
                  AI documentation
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Introduction */}
          <div className="space-y-4">
            <h2 id="introduction" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Introduction
            </h2>
            <p>
              ForSure is a prompting programming language designed to simplify projects by using a flat-file-like
              structured language/compiler/cli/converter system. It allows you to describe and document file structures
              in a clear and concise manner, similar to how you would write a Dockerfile for a container.
            </p>
            <p>
              ForSure uses a simple, human-readable prompting syntax to represent directories, files, and their
              relationships, making it easy to understand and maintain project structures. Available as both a CLI tool
              and web application.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 my-6 border">
              <div className="flex items-start">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Why ForSure?</h3>
                  <p className="text-muted-foreground">
                    ForSure was created to solve the problem of documenting and sharing project structures in a
                    standardized way. As a prompting programming language, it helps teams maintain consistency across
                    projects and makes onboarding new developers easier.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="space-y-4">
            <h2 id="interactive-demo" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Interactive Demo
            </h2>
            <p>
              Try ForSure's prompting language right in your browser. Edit the code below and see the generated file
              structure.
            </p>

            <DocsInteractiveDemo />
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h2 id="key-features" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Layers className="h-5 w-5 mr-2 text-primary" />
                    Prompting Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A powerful prompting programming language that mimics the natural file system's hierarchy for
                    intuitive organization.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Comments and Annotations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Offers inline commenting and metadata association for better documentation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Terminal className="h-5 w-5 mr-2 text-primary" />
                    CLI Tool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Powerful command-line interface for generating and managing project structures from ForSure prompts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    Web Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Intuitive web interface for creating, managing, and sharing project structures without installing
                    anything.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <GitBranch className="h-5 w-5 mr-2 text-primary" />
                    @import Directives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Facilitates file inclusion for reusable structures across projects.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Cpu className="h-5 w-5 mr-2 text-primary" />
                    AI-Enhanced
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Leverages artificial intelligence to optimize and enhance your project structures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Basic Example */}
          <div className="space-y-4">
            <h2 id="basic-example" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Basic Example
            </h2>
            <p>Here's a basic example of what a .forsure file looks like:</p>

            <Tabs defaultValue="basic">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Basic Example</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Example</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <DocsCodeBlock
                  code={`root:
  # Main source code directory
  - src:
      - main.js { entry: true }
      - utils:
          # Utility scripts
          - helpers.js
          - date.js { timezone: "UTC" }
  # Assets for front-end design
  - assets:
      - logo.svg
      - css:
          # Style sheets
          - theme.css
  # Documentation file
  - README.md`}
                  fileName="basic-example.forsure"
                  showLineNumbers={true}
                />
              </TabsContent>

              <TabsContent value="advanced">
                <DocsCodeBlock
                  code={`root { name: "advanced-project", version: "1.0.0" }:
  # Source code directory with nested components
  - src:
      @import 'common-components.fs'
      - index.js { entry: true, permissions: "644" }
      - utils:
          # Utility functions with special attributes
          - helpers.js { minify: true }
          - date.js { timezone: "UTC", tests: ["unit", "integration"] }
      - api:
          - routes:
              - users.js { auth: true, rate-limit: 100 }
              - products.js { cache: true }
  
  # Assets with various file types
  - assets:
      - images:
          - logo.svg { optimize: true }
          - banner.jpg { compress: true, quality: 85 }
      - fonts:
          - roboto.woff2
      - styles:
          - main.css { minify: true, autoprefixer: true }
          - themes:
              - dark.css
              - light.css
  
  # Configuration files with environment-specific settings
  - config:
      - default.json
      - development.json { env: "development" }
      - production.json { env: "production", secrets: true }
  
  # Documentation with multiple formats
  - docs:
      - api.md
      - getting-started.md
      - examples:
          - basic.md
          - advanced.md
  
  # Project metadata
  - package.json { auto-update: true }
  - .gitignore
  - README.md { generate: true, template: "standard" }`}
                  fileName="advanced-example.forsure"
                  showLineNumbers={true}
                />
              </TabsContent>
            </Tabs>

            <p className="text-sm text-muted-foreground mt-4">
              The example above shows how ForSure's prompting language represents a simple project structure with
              directories, files, comments, and attributes.
            </p>
          </div>

          {/* Getting Started */}
          <div className="space-y-4">
            <h2 id="getting-started" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Getting Started
            </h2>
            <p>To start using ForSure, follow these steps:</p>

            <div className="space-y-4 pl-6">
              <div className="relative border-l pl-6 pb-4">
                <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full border bg-background text-primary font-bold">
                  1
                </div>
                <h3 className="text-lg font-medium mb-2">Install ForSure</h3>
                <p className="text-muted-foreground mb-2">
                  Clone the repository or install via npm to get started with ForSure.
                </p>
                <DocsCodeBlock
                  code={`# Install the CLI
npm install -g forsure-cli

# Or clone the repository
git clone https://github.com/elicharlese/ForSure.git
cd ForSure`}
                  language="bash"
                />
                <div className="mt-2">
                  <Link href="/docs/installation" className="text-sm text-primary hover:underline flex items-center">
                    View detailed installation instructions
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="relative border-l pl-6 pb-4">
                <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full border bg-background text-primary font-bold">
                  2
                </div>
                <h3 className="text-lg font-medium mb-2">Create your first ForSure file</h3>
                <p className="text-muted-foreground mb-2">
                  Create a new .forsure file using our prompting language in any text editor.
                </p>
                <DocsCodeBlock
                  code={`root:
  - src:
      - index.js
  - README.md`}
                  fileName="my-first-project.forsure"
                />
                <div className="mt-2">
                  <Link href="/docs/quick-start" className="text-sm text-primary hover:underline flex items-center">
                    Follow the Quick Start guide
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="relative border-l pl-6 pb-4">
                <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full border bg-background text-primary font-bold">
                  3
                </div>
                <h3 className="text-lg font-medium mb-2">Generate the file structure</h3>
                <p className="text-muted-foreground mb-2">
                  Use the ForSure CLI or web app to generate the file structure from your .forsure file.
                </p>
                <DocsCodeBlock
                  code={`forsure generate my-first-project.forsure --output ./my-project`}
                  language="bash"
                />
                <div className="mt-2">
                  <Link href="/docs/cli" className="text-sm text-primary hover:underline flex items-center">
                    Learn more about the CLI
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full border bg-background text-primary font-bold">
                  4
                </div>
                <h3 className="text-lg font-medium mb-2">Learn the prompting syntax</h3>
                <p className="text-muted-foreground mb-2">
                  Explore the ForSure prompting syntax to create more complex file structures.
                </p>
                <div className="mt-2">
                  <Link href="/docs/syntax" className="text-sm text-primary hover:underline flex items-center">
                    View the syntax reference
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h2 id="next-steps" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Next Steps
            </h2>
            <p>Explore the documentation to learn more about ForSure:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/docs/syntax" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">Prompting Syntax</div>
                </div>
                <div className="text-sm text-muted-foreground">Learn the ForSure prompting syntax in detail</div>
              </Link>

              <Link href="/docs/examples" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">Examples</div>
                </div>
                <div className="text-sm text-muted-foreground">See ForSure in action with practical examples</div>
              </Link>

              <Link href="/docs/cli" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <Terminal className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">CLI Reference</div>
                </div>
                <div className="text-sm text-muted-foreground">Learn how to use the ForSure command-line interface</div>
              </Link>

              <Link href="/docs/web-app" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">Web App Guide</div>
                </div>
                <div className="text-sm text-muted-foreground">Learn how to use the ForSure web application</div>
              </Link>
            </div>
          </div>

          {/* Feedback Section */}
          <DocsFeedback />
        </div>
      </div>

      {/* Table of Contents Sidebar */}
      <DocsToc className="w-64 flex-shrink-0" />
    </div>
  )
}
