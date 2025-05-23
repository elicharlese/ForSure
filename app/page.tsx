"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Terminal,
  Code,
  ArrowRight,
  Download,
  Copy,
  Check,
  ChevronRight,
  FileText,
  Edit3,
  Layers,
  Sparkles,
  Cpu,
  Globe,
  Brain,
  Fingerprint,
  Zap,
} from "lucide-react"
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
                    ForSure: The Prompting Programming Language
                  </h1>
                </AnimateOnScroll>

                <AnimateOnScroll type="slideUp" delay={0.3} duration={0.8}>
                  <p className="text-white/90 md:text-xl">
                    ForSure is a powerful prompting programming language with both a CLI and web app for defining,
                    documenting, and generating project structures across your entire tech stack.
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
                        <Download className="mr-2 h-5 w-5" /> Download CLI
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Link href="/app" className="flex items-center">
                        <Globe className="mr-2 h-5 w-5" /> Try Web App
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
                A Prompting Language for Project Structure
              </h2>
              <p className="mt-4 text-secondary/80 dark:text-primary-light/80 md:text-lg max-w-3xl mx-auto">
                ForSure provides a unified prompting programming language to define and document project structures
                across your entire tech stack.
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
                    Generate project structures from ForSure prompts with a powerful command-line interface. Automate
                    your project setup and maintain consistency.
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
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    Prompting Language
                  </h3>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed max-w-xs mx-auto">
                    A human-readable prompting language for defining and documenting file structures with rich metadata.
                    Simple syntax, powerful capabilities.
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
                    <Globe className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Web Application</h3>
                  <p className="text-secondary/80 dark:text-primary-light/70 mb-5 leading-relaxed max-w-xs mx-auto">
                    Access ForSure's prompting capabilities through our intuitive web interface. Create, manage, and
                    share your project structures from anywhere.
                  </p>
                  <div className="mt-auto pt-2 border-t border-primary/10">
                    <Link
                      href="/app"
                      className="text-primary font-medium inline-flex items-center hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      Try the web app <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Neural Network Feature Section */}
            <div className="mt-16">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">
                  NEW FEATURE
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-secondary dark:text-primary">
                  Adaptive Neural Network
                </h2>
                <p className="mt-3 text-secondary/80 dark:text-primary-light/80 md:text-lg max-w-2xl mx-auto">
                  Our advanced neural network learns from your coding style and project patterns to deliver increasingly
                  personalized results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <AnimateOnScroll type="slideRight" duration={0.8}>
                  <div className="bg-white dark:bg-secondary-dark/20 rounded-xl p-6 shadow-md border border-primary/10 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                    <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-primary/10 rounded-full"></div>

                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className="p-3 bg-primary/10 rounded-full mr-4">
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary dark:text-primary">Style Learning Engine</h3>
                      </div>

                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                          <div className="p-1 bg-primary/10 rounded-full mr-3 mt-1">
                            <Fingerprint className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-secondary dark:text-primary">Personalized Patterns</span>
                            <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                              Identifies your unique coding patterns and architectural preferences
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 bg-primary/10 rounded-full mr-3 mt-1">
                            <Zap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-secondary dark:text-primary">Adaptive Suggestions</span>
                            <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                              Provides increasingly relevant structure suggestions as you build more projects
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 bg-primary/10 rounded-full mr-3 mt-1">
                            <Cpu className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-secondary dark:text-primary">Continuous Learning</span>
                            <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                              Evolves with your development style across projects and technologies
                            </p>
                          </div>
                        </li>
                      </ul>

                      <Button asChild className="mt-2 bg-primary hover:bg-primary/90">
                        <Link href="/ai-features" className="flex items-center">
                          Learn more about our AI features <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll type="slideLeft" duration={0.8} delay={0.2}>
                  <div className="bg-gradient-to-br from-secondary/5 to-primary/10 dark:from-secondary-dark/30 dark:to-primary/20 rounded-xl p-6 border border-primary/10 shadow-md">
                    <h4 className="text-lg font-semibold mb-4 text-secondary dark:text-primary">How It Works</h4>

                    <div className="space-y-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                          <span className="font-bold text-primary">1</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-secondary dark:text-primary">Initial Analysis</h5>
                          <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                            Our neural network analyzes your existing projects and coding patterns
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                          <span className="font-bold text-primary">2</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-secondary dark:text-primary">Pattern Recognition</h5>
                          <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                            Identifies your preferred naming conventions, structure patterns, and organization style
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                          <span className="font-bold text-primary">3</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-secondary dark:text-primary">Adaptive Learning</h5>
                          <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                            Continuously improves suggestions based on your feedback and project evolution
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                          <span className="font-bold text-primary">4</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-secondary dark:text-primary">Personalized Output</h5>
                          <p className="text-sm text-secondary/70 dark:text-primary-light/70">
                            Generates project structures that match your style and follow your established patterns
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sparkles className="h-5 w-5 text-primary mr-2" />
                          <span className="text-sm font-medium text-secondary dark:text-primary">
                            Powered by advanced machine learning
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Beta
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 bg-muted dark:bg-muted/10 relative" id="how-it-works">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-secondary dark:text-primary">
                How ForSure Prompting Works
              </h2>
              <p className="mt-4 text-secondary/80 dark:text-primary-light/80 md:text-lg max-w-3xl mx-auto">
                A streamlined workflow to define, document, and generate project structures using our prompting
                programming language
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
                    <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-primary">Write Prompts</h3>
                  </div>

                  <p className="text-secondary/80 dark:text-primary-light/70 mb-4 sm:mb-6 text-base sm:text-lg">
                    Create a .forsure file using our prompting programming language that describes your project
                    structure with rich metadata. Define directories, files, and their relationships in a clear,
                    hierarchical format.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Intuitive Syntax
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Describe directories and files with an intuitive, easy-to-learn prompting syntax
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
                        <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Style Learning
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Our neural network learns your style and adapts to your preferences over time
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 sm:pt-4">
                    <Link
                      href="/language"
                      className="inline-flex items-center text-primary text-sm sm:text-base font-medium hover:underline"
                    >
                      Learn more about the ForSure prompting language{" "}
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
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
                        ForSure Prompting Syntax
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
                    Use the ForSure CLI or web app to generate the actual file structure from your prompts. Our tools
                    create all directories and files according to your specification, saving you time and ensuring
                    consistency.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          CLI Tool
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Generate structures with a powerful command-line interface
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Web Application
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Create and manage projects through our intuitive web interface
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                        <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary dark:text-primary-light mb-0.5 sm:mb-1 text-sm sm:text-base">
                          Neural Network
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary/70 dark:text-primary-light/70">
                          Adapts to your style and generates personalized project structures
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
                      Learn more about the ForSure tools <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
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
                        <div className="flex items-center text-blue-400 mb-1">
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
                          <span>Analyzing your coding style...</span>
                        </div>
                        <div className="flex items-center text-blue-400 mb-1">
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
                          <span>Applying neural network optimizations</span>
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
                    Ready to Try Our Prompting Programming Language?
                  </h2>
                  <p className="mx-auto max-w-[700px] md:text-xl text-white/90">
                    Join the growing community of developers using ForSure to define, document, and generate project
                    structures with our powerful prompting language and neural network technology.
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
                      <Download className="mr-2 h-5 w-5" /> Download CLI
                    </Link>
                  </Button>

                  <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link href="/app" className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" /> Try Web App
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
