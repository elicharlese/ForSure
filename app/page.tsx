"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Terminal, Code, ArrowRight, Download, Copy, Check, ChevronRight, ChevronLeft } from "lucide-react"
import CodeExample from "@/components/code-example"
import AnimateOnScroll from "@/components/animate-on-scroll"
import FloatingLogo from "@/components/floating-logo"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [currentSlide, setCurrentSlide] = useState(0)
  const [copied, setCopied] = useState(false)

  // Example slides data
  const slides = [
    {
      title: "Web Application Structure",
      code: `# frontend.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the frontend project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the main source code for the Next.js application.
    </description>

    - Type: Directory
      - Name: app/
      <description>
      Contains the app router structure for pages and layouts.
      </description>

      - Type: File
        - Name: page.tsx
        <description>
        The main landing page component.
        </description>`,
    },
    {
      title: "Backend API Structure",
      code: `# backend.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the backend API project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the main source code for the API.
    </description>

    - Type: Directory
      - Name: controllers/
      <description>
      Contains API route controllers.
      </description>

    - Type: Directory
      - Name: models/
      <description>
      Contains data models and schemas.
      </description>`,
    },
    {
      title: "Mobile App Structure",
      code: `# mobile.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the React Native mobile app.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the main source code for the mobile app.
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
      </description>`,
    },
  ]

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("npm install -g forsure-cli")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary dark:bg-secondary-dark relative overflow-hidden">
          {/* Only show the gradient overlay in dark mode */}
          {isDark && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>}

          {/* Only show the cyber grid in dark mode */}
          {isDark ? (
            <div className="absolute inset-0 pointer-events-none">
              <div className="cyber-grid-bg opacity-30 w-full h-[200%]"></div>
            </div>
          ) : (
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{ backgroundSize: "20px 20px" }}></div>
            </div>
          )}

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-8">
                <AnimateOnScroll type="fade" duration={0.8}>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                    Define Your Project Structure with Confidence
                  </h1>
                </AnimateOnScroll>

                <AnimateOnScroll type="slideUp" delay={0.3} duration={0.8}>
                  <p className="text-white/90 md:text-xl">
                    ForSure is a powerful language and CLI tool for defining, documenting, and generating project
                    structures across your entire tech stack.
                  </p>
                </AnimateOnScroll>

                <AnimateOnScroll type="slideUp" delay={0.7} duration={0.8}>
                  <div className="bg-secondary-dark/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white/70 font-mono">Install via npm</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyInstallCommand}
                        className="h-8 text-primary hover:text-white hover:bg-secondary"
                      >
                        {copied ? (
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
                    <pre className="bg-black/30 p-3 rounded text-white font-mono text-sm overflow-x-auto">
                      npm install -g forsure-cli
                    </pre>
                  </div>
                </AnimateOnScroll>
              </div>

              <div className="flex-1 flex justify-center">
                <AnimateOnScroll type="scale" duration={1.2}>
                  <div className="relative">
                    <FloatingLogo
                      src="/fs-logo.png"
                      alt="ForSure Logo"
                      width={240}
                      height={240}
                      className="h-60 w-60"
                    />
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary-dark/70 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
                      <span className="text-primary font-mono text-sm">v1.0.0</span>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-background relative" id="features">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary dark:text-primary">
                One Language, Multiple Use Cases
              </h2>
              <p className="mt-4 text-secondary/80 dark:text-primary-light/80 md:text-lg max-w-3xl mx-auto">
                ForSure provides a unified way to define and document project structures across your entire tech stack.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimateOnScroll type="slideUp" delay={0.1} duration={0.6}>
                <div className="group bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mb-5 group-hover:bg-primary/20 transition-all group-hover:scale-110 transform">
                    <Terminal className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">CLI Tool</h3>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed">
                    Generate project structures from ForSure files with a powerful command-line interface. Automate your
                    project setup and maintain consistency.
                  </p>
                  <div className="mt-auto pt-2 border-t border-primary/10">
                    <Link
                      href="/cli"
                      className="text-primary font-medium inline-flex items-center hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      Learn more <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.2} duration={0.6}>
                <div className="group bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mb-5 group-hover:bg-primary/20 transition-all group-hover:scale-110 transform">
                    <Code className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Language</h3>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed">
                    A human-readable language for defining and documenting file structures with rich metadata. Simple
                    syntax, powerful capabilities.
                  </p>
                  <div className="mt-auto pt-2 border-t border-primary/10">
                    <Link
                      href="/language"
                      className="text-primary font-medium inline-flex items-center hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      Learn more <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.3} duration={0.6}>
                <div className="group bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mb-5 group-hover:bg-primary/20 transition-all group-hover:scale-110 transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-7 w-7 text-primary"
                    >
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                      <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                      <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Templates</h3>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed">
                    Ready-to-use templates for common project structures across various frameworks and languages. Start
                    your projects faster.
                  </p>
                  <div className="mt-auto pt-2 border-t border-primary/10">
                    <Link
                      href="/templates"
                      className="text-primary font-medium inline-flex items-center hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      Learn more <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Code Examples Section - Now with Slideshow */}
        <section className="w-full py-12 md:py-24 cyber-ocean-gradient text-white" id="examples">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AnimateOnScroll type="fade" duration={0.8}>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Define Any Project Structure
                  </h2>
                  <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                    ForSure works with any tech stack, from web applications to mobile apps and backend services.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Desktop Slideshow */}
              <div className="w-full max-w-4xl py-12 hidden lg:block">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                    >
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold">{slides[currentSlide].title}</h3>
                        <CodeExample code={slides[currentSlide].code} />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-primary/20 hover:bg-primary/40 text-white rounded-full p-2 transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-primary/20 hover:bg-primary/40 text-white rounded-full p-2 transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Slide indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === index ? "w-8 bg-primary" : "w-2 bg-white/30"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile stacked examples */}
              <div className="w-full max-w-4xl space-y-8 pt-8 lg:hidden">
                <AnimateOnScroll type="slideLeft" duration={0.8}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{slides[0].title}</h3>
                    <CodeExample code={slides[0].code} />
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll type="slideLeft" delay={0.2} duration={0.8}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{slides[1].title}</h3>
                    <CodeExample code={slides[1].code} />
                  </div>
                </AnimateOnScroll>
              </div>
              {/* Action buttons */}
              <AnimateOnScroll type="slideUp" delay={0.5} duration={0.8}>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold">
                    <Link href="/download" className="flex items-center text-white">
                      <Download className="mr-2 h-5 w-5 text-white" /> Get Started
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white">
                    <Link href="/docs" className="flex items-center text-white">
                      Read the Docs <ArrowRight className="ml-2 h-5 w-5 text-white" />
                    </Link>
                  </Button>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 bg-muted dark:bg-muted/10 relative" id="how-it-works">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-secondary dark:text-primary">
                How It Works
              </h2>
              <p className="mt-4 text-secondary/80 dark:text-primary-light/80 md:text-lg max-w-3xl mx-auto">
                A streamlined workflow to define, document, and generate project structures
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Step 1: Define */}
              <AnimateOnScroll type="slideUp" delay={0.1} duration={0.6}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="text-2xl font-bold">Define</h3>
                  </div>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                    Create a .forsure file that describes your project structure with rich metadata. Define directories,
                    files, and their relationships in a clear, hierarchical format.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-secondary/80 dark:text-primary-light/70 mb-6">
                    <li>Describe directories and files with a simple syntax</li>
                    <li>Add metadata like descriptions and purposes</li>
                    <li>Use indentation to represent nesting</li>
                    <li>Create reusable templates for common structures</li>
                  </ul>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.2} duration={0.6}>
                <div className="bg-white dark:bg-secondary-dark/30 rounded-lg shadow-md border border-primary/10 overflow-hidden h-full">
                  <div className="bg-secondary/10 dark:bg-primary/10 px-4 py-2 border-b border-primary/10">
                    <span className="font-mono text-sm text-secondary dark:text-primary">project.forsure</span>
                  </div>
                  <div className="p-0">
                    <CodeExample
                      code={`root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the project.
  </description>

  - Type: Directory
    - Name: src/
    <description>
    Source code directory.
    </description>

    - Type: File
      - Name: index.js
      <description>
      Entry point for the application.
      </description>`}
                      language="forsure"
                      className="text-left border-0"
                    />
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Step 2: Document */}
              <AnimateOnScroll type="slideUp" delay={0.3} duration={0.6}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="text-2xl font-bold">Document</h3>
                  </div>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                    Add detailed descriptions, purposes, and other metadata to document your project structure. This
                    makes it easier for team members to understand the purpose of each file and directory.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-secondary/80 dark:text-primary-light/70 mb-6">
                    <li>Document the purpose of each file and directory</li>
                    <li>Add author information and version details</li>
                    <li>Include usage examples and dependencies</li>
                    <li>Make your codebase self-documenting</li>
                  </ul>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.4} duration={0.6}>
                <div className="bg-white dark:bg-secondary-dark/30 rounded-lg shadow-md border border-primary/10 overflow-hidden h-full">
                  <div className="bg-secondary/10 dark:bg-primary/10 px-4 py-2 border-b border-primary/10">
                    <span className="font-mono text-sm text-secondary dark:text-primary">components.forsure</span>
                  </div>
                  <div className="p-0">
                    <CodeExample
                      code={`- Type: Directory
  - Name: components/
  <description>
  Contains reusable UI components.
  </description>
  <purpose>
  Promotes code reusability and maintainability.
  </purpose>

  - Type: File
    - Name: Button.jsx
    <description>
    Reusable button component with various styles.
    </description>
    <author>
    Jane Doe (jane@example.com)
    </author>`}
                      language="forsure"
                      className="text-left border-0"
                    />
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Step 3: Generate */}
              <AnimateOnScroll type="slideUp" delay={0.5} duration={0.6}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <h3 className="text-2xl font-bold">Generate</h3>
                  </div>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                    Use the ForSure CLI to generate the actual file structure from your definition. The CLI creates all
                    directories and files according to your specification, saving you time and ensuring consistency.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-secondary/80 dark:text-primary-light/70 mb-6">
                    <li>Generate entire project structures with a single command</li>
                    <li>Ensure consistency across multiple projects</li>
                    <li>Save time on repetitive setup tasks</li>
                    <li>Validate your structure before generation</li>
                  </ul>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.6} duration={0.6}>
                <div className="bg-white dark:bg-secondary-dark/30 rounded-lg shadow-md border border-primary/10 overflow-hidden h-full">
                  <div className="bg-secondary/10 dark:bg-primary/10 px-4 py-2 border-b border-primary/10">
                    <span className="font-mono text-sm text-secondary dark:text-primary">Terminal</span>
                  </div>
                  <div className="p-0">
                    <CodeExample
                      code={`# Generate project structure
$ forsure generate project.forsure --output ./my-project

✓ Parsing project.forsure
✓ Validating structure
✓ Creating directories
✓ Creating files
✓ Structure created successfully!

$ ls -la my-project/
total 8
drwxr-xr-x  4 user  staff  128 May 21 13:30 .
drwxr-xr-x  3 user  staff   96 May 21 13:30 ..
drwxr-xr-x  3 user  staff   96 May 21 13:30 src`}
                      language="bash"
                      className="text-left border-0"
                    />
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-secondary dark:bg-secondary-dark text-white">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AnimateOnScroll type="scale" duration={1}>
                <div className="mb-6">
                  <FloatingLogo src="/fs-logo.png" alt="ForSure Logo" width={96} height={96} className="h-24 w-24" />
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="fade" delay={0.2} duration={0.8}>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Streamline Your Project Structure?
                  </h2>
                  <p className="mx-auto max-w-[700px] md:text-xl text-white/90">
                    Join the growing community of developers using ForSure to define, document, and generate project
                    structures.
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.4} duration={0.8}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-secondary-dark font-semibold"
                  >
                    <Link href="/download" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" /> Download Now
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white">
                    <Link href="/docs" className="flex items-center">
                      Read the Docs <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
