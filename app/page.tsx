"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Terminal, Code, ArrowRight, Download, Copy, Check, ChevronRight, FileText, Edit3, Layers } from "lucide-react"
import CodeExample from "@/components/code-example"
import AnimateOnScroll from "@/components/animate-on-scroll"
import FloatingLogo from "@/components/floating-logo"
import { useTheme } from "next-themes"

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
              <div className="flex-1 space-y-8 pl-8">
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
                <AnimateOnScroll type="slideUp" delay={0.9} duration={0.8}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-secondary-dark font-semibold"
                    >
                      <Link href="/download" className="flex items-center">
                        <Download className="mr-2 h-5 w-5" /> Download Now
                      </Link>
                    </Button>
                    <Link href="/docs" className="text-white/90 hover:text-white flex items-center transition-colors">
                      <ArrowRight className="mr-2 h-4 w-4" /> Read the Documentation
                    </Link>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimateOnScroll type="slideUp" delay={0.1} duration={0.6}>
                <div className="group bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mb-5 group-hover:bg-primary/20 transition-all group-hover:scale-110 transform">
                    <Terminal className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">CLI Tool</h3>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed max-w-xs mx-auto">
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
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed max-w-xs mx-auto">
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
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed max-w-xs mx-auto">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Step 1: Define */}
              <AnimateOnScroll type="slideUp" delay={0.1} duration={0.6}>
                <div className="flex flex-col h-full bg-white dark:bg-secondary-dark/20 rounded-xl p-4 sm:p-6 shadow-md border border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-inner border border-primary/10">
                      <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-primary">Define</h3>
                  </div>

                  <p className="text-secondary/80 dark:text-primary-light/70 mb-4 sm:mb-6 text-base sm:text-lg">
                    Create a .forsure file that describes your project structure with rich metadata. Define directories,
                    files, and their relationships in a clear, hierarchical format.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Simple Syntax
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Describe directories and files with an intuitive, easy-to-learn syntax
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Rich Metadata
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Add descriptions, purposes, and other metadata to document your structure
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Hierarchical
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Use indentation to represent nesting and relationships between files
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
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
                          className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                        >
                          <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                          <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                          <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Reusable
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Create templates for common structures that can be reused across projects
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 sm:pt-4">
                    <Link
                      href="/language"
                      className="inline-flex items-center text-primary text-sm sm:text-base font-medium hover:underline"
                    >
                      Learn more about the ForSure language <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.2} duration={0.6}>
                <div className="bg-white dark:bg-secondary-dark/30 rounded-lg shadow-md border border-primary/10 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
                  <div className="bg-secondary/10 dark:bg-primary/10 px-4 py-2 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary mr-1.5"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="font-mono text-sm text-secondary dark:text-primary">project.forsure</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-secondary/70 dark:text-primary/70 hover:text-secondary dark:hover:text-primary p-1 rounded-md hover:bg-secondary/10 dark:hover:bg-primary/10 transition-colors"
                        aria-label="Copy code"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                      <button
                        className="text-secondary/70 dark:text-primary/70 hover:text-secondary dark:hover:text-primary p-1 rounded-md hover:bg-secondary/10 dark:hover:bg-primary/10 transition-colors"
                        aria-label="Download file"
                        title="Download file"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-0 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center pt-2 text-xs font-mono text-secondary/40 dark:text-primary/40 select-none bg-secondary/5 dark:bg-primary/5 border-r border-primary/5">
                      <div>1</div>
                      <div>2</div>
                      <div>3</div>
                      <div>4</div>
                      <div>5</div>
                      <div>6</div>
                      <div>7</div>
                      <div>8</div>
                      <div>9</div>
                      <div>10</div>
                      <div>11</div>
                      <div>12</div>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          className="bg-primary text-white text-xs px-2 py-1 rounded hover:bg-primary/90 transition-colors flex items-center"
                          title="Try this example"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Try it
                        </button>
                      </div>
                      <CodeExample
                        code={`# Define a basic web project structure
root:
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
      </description>
      
  - Type: Directory
    - Name: public/
    <description>
    Static assets directory.
    </description>`}
                        language="forsure"
                        className="text-left border-0 pl-10"
                      />
                    </div>
                  </div>
                  <div className="bg-secondary/5 dark:bg-primary/5 border-t border-primary/10 px-4 py-2 flex justify-between items-center text-xs text-secondary/70 dark:text-primary/70">
                    <div className="flex items-center">
                      <span className="inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M12 2H2v10h10V2z"></path>
                          <path d="M12 12H2v10h10V12z"></path>
                          <path d="M22 2h-10v10h10V2z"></path>
                          <path d="M22 12h-10v10h10V12z"></path>
                        </svg>
                        ForSure Syntax
                      </span>
                    </div>
                    <Link href="/language" className="hover:text-primary transition-colors inline-flex items-center">
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Step 3: Generate */}
              <AnimateOnScroll type="slideUp" delay={0.3} duration={0.6}>
                <div className="flex flex-col h-full bg-white dark:bg-secondary-dark/20 rounded-xl p-4 sm:p-6 shadow-md border border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-inner border border-primary/10">
                      <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-primary">Generate</h3>
                  </div>

                  <p className="text-secondary/80 dark:text-primary-light/70 mb-4 sm:mb-6 text-base sm:text-lg">
                    Use the ForSure CLI to generate the actual file structure from your definition. The CLI creates all
                    directories and files according to your specification, saving you time and ensuring consistency.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
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
                          className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          One Command
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Generate entire project structures with a single CLI command
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
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
                          className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Validation
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Validate your structure before generation to catch errors early
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
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
                          className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Consistency
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Ensure consistent structure across multiple projects and teams
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
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
                          className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Time-Saving
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Automate repetitive setup tasks and focus on actual development
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 sm:pt-4">
                    <Link
                      href="/cli"
                      className="inline-flex items-center text-primary text-sm sm:text-base font-medium hover:underline"
                    >
                      Learn more about the ForSure CLI <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll type="slideUp" delay={0.6} duration={0.6}>
                <div className="bg-white dark:bg-secondary-dark/30 rounded-lg shadow-md border border-primary/10 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
                  <div className="bg-secondary/10 dark:bg-primary/10 px-4 py-2 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary mr-1.5"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M8 10l4 4 4-4" />
                          <path d="M12 14v-7" />
                        </svg>
                        <span className="font-mono text-sm text-secondary dark:text-primary">Terminal</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-secondary/70 dark:text-primary/70 hover:text-secondary dark:hover:text-primary p-1 rounded-md hover:bg-secondary/10 dark:hover:bg-primary/10 transition-colors"
                        aria-label="Copy commands"
                        title="Copy commands"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                      <button
                        className="text-secondary/70 dark:text-primary/70 hover:text-secondary dark:hover:text-primary p-1 rounded-md hover:bg-secondary/10 dark:hover:bg-primary/10 transition-colors"
                        aria-label="Open in terminal"
                        title="Open in terminal"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-0 flex-1 relative">
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        className="bg-primary text-white text-xs px-2 py-1 rounded hover:bg-primary/90 transition-colors flex items-center"
                        title="Try in CLI playground"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Try it
                      </button>
                    </div>
                    <div className="bg-black text-white font-mono text-sm p-4 h-full overflow-auto">
                      <div className="flex items-center text-green-400 mb-2">
                        <span className="mr-2">$</span>
                        <span className="text-white">forsure generate project.forsure --output ./my-project</span>
                      </div>

                      <div className="mt-3 text-gray-300">
                        <div className="flex items-center text-green-400 mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span>Parsing project.forsure</span>
                        </div>
                        <div className="flex items-center text-green-400 mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span>Validating structure</span>
                        </div>
                        <div className="flex items-center text-green-400 mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span>Creating directories (3)</span>
                        </div>
                        <div className="flex items-center text-green-400 mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span>Creating files (2)</span>
                        </div>
                        <div className="flex items-center text-green-400 mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span>Structure created successfully!</span>
                        </div>

                        <div className="text-blue-400 mb-2">
                          <span className="text-green-400 mr-2">$</span>
                          <span>ls -la my-project/</span>
                        </div>

                        <div className="text-gray-400">
                          <div>total 8</div>
                          <div className="grid grid-cols-5">
                            <span className="text-blue-300">drwxr-xr-x</span>
                            <span>4</span>
                            <span>user</span>
                            <span>staff</span>
                            <span>128</span>
                            <span className="col-span-5">
                              May 21 13:30 <span className="text-blue-300">.</span>
                            </span>

                            <span className="text-blue-300">drwxr-xr-x</span>
                            <span>3</span>
                            <span>user</span>
                            <span>staff</span>
                            <span>96</span>
                            <span className="col-span-5">
                              May 21 13:30 <span className="text-blue-300">..</span>
                            </span>

                            <span className="text-blue-300">drwxr-xr-x</span>
                            <span>3</span>
                            <span>user</span>
                            <span>staff</span>
                            <span>96</span>
                            <span className="col-span-5">
                              May 21 13:30 <span className="text-blue-300">src</span>
                            </span>

                            <span className="text-blue-300">drwxr-xr-x</span>
                            <span>2</span>
                            <span>user</span>
                            <span>staff</span>
                            <span>64</span>
                            <span className="col-span-5">
                              May 21 13:30 <span className="text-blue-300">public</span>
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center">
                          <span className="text-green-400 mr-2">$</span>
                          <span className="relative">
                            <span className="animate-pulse">▌</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary/5 dark:bg-primary/5 border-t border-primary/10 px-4 py-2 flex justify-between items-center text-xs text-secondary/70 dark:text-primary/70">
                    <div className="flex items-center">
                      <span className="inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m9 10-2 2 2 2" />
                          <path d="m15 10 2 2-2 2" />
                        </svg>
                        ForSure CLI
                      </span>
                    </div>
                    <Link href="/cli" className="hover:text-primary transition-colors inline-flex items-center">
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Link>
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
