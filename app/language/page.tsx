"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, ChevronDown, ChevronRight, FileText, FolderTree, Copy, Check } from "lucide-react"
import CodeExample from "@/components/code-example"
import AnimateOnScroll from "@/components/animate-on-scroll"
import ForSureInteractiveDemo from "@/components/forsure-interactive-demo"

export default function LanguagePage() {
  const [openSection, setOpenSection] = useState<string | null>("syntax")
  const [copied, setCopied] = useState(false)

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null)
    } else {
      setOpenSection(section)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-12">
      <div className="space-y-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">ForSure Language</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            A human-readable language for defining and documenting file structures with rich metadata, designed for
            clarity and maintainability.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <section className="bg-secondary dark:bg-secondary-dark text-white rounded-lg overflow-hidden shadow-lg border border-primary/20">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Code className="h-6 w-6 mr-3 text-primary" />
              <h2 className="text-2xl font-bold">Try ForSure Language</h2>
            </div>
            <p className="mb-6 text-white/90 max-w-3xl">
              Edit the ForSure code below to see how the language works. The visualization will update in real-time to
              show the resulting file structure.
            </p>
          </div>

          <ForSureInteractiveDemo />

          <div className="p-6 md:p-8 bg-secondary-dark/50 border-t border-primary/20">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-secondary-dark">
                <Link href="/docs/language" className="flex items-center">
                  Language Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white">
                <Link href="/download" className="flex items-center">
                  Download ForSure CLI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Language Features */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Language Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimateOnScroll type="slideUp" delay={0.1}>
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 h-full">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <FolderTree className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hierarchical Structure</h3>
                <p className="text-secondary/80 dark:text-primary-light/70">
                  Define nested directories and files with a clear, indentation-based syntax that mirrors the actual
                  file system structure.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp" delay={0.2}>
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 h-full">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rich Metadata</h3>
                <p className="text-secondary/80 dark:text-primary-light/70">
                  Add descriptions, purposes, authors, and other metadata to document your file structure and make it
                  self-explanatory.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp" delay={0.3}>
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 h-full">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M16 18a4 4 0 0 0-8 0" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M17.8 18h.2a4 4 0 1 0 0-8h-.2" />
                    <path d="M6.2 10h-.2a4 4 0 1 0 0 8h.2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Import Directives</h3>
                <p className="text-secondary/80 dark:text-primary-light/70">
                  Reuse common file structures across projects with import directives, making your definitions modular
                  and maintainable.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Syntax Reference */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold mb-6">Syntax Reference</h2>

          <AnimateOnScroll type="slideUp">
            <div className="border rounded-lg overflow-hidden">
              <button
                className={`w-full flex items-center justify-between p-4 text-left font-semibold ${
                  openSection === "syntax" ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => toggleSection("syntax")}
              >
                <span>Basic Syntax</span>
                {openSection === "syntax" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              {openSection === "syntax" && (
                <div className="p-6 border-t">
                  <p className="mb-4">ForSure files use a hierarchical structure with the following syntax:</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Each ForSure file starts with a root declaration</li>
                        <li>Entries are prefixed with a hyphen (-)</li>
                        <li>Type and Name properties define the entry</li>
                        <li>Metadata is specified in angle brackets &lt;&gt;</li>
                        <li>Indentation indicates nesting levels</li>
                      </ul>
                    </div>
                    <div>
                      <CodeExample
                        code={`root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory description.
  </description>

  - Type: File
    - Name: example.txt
    <description>
    Example file description.
    </description>`}
                        language="forsure"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.1}>
            <div className="border rounded-lg overflow-hidden">
              <button
                className={`w-full flex items-center justify-between p-4 text-left font-semibold ${
                  openSection === "metadata" ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => toggleSection("metadata")}
              >
                <span>Metadata Tags</span>
                {openSection === "metadata" ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
              {openSection === "metadata" && (
                <div className="p-6 border-t">
                  <p className="mb-4">ForSure supports various metadata tags to document your file structure:</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <table className="w-full border-collapse mb-4">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Tag</th>
                            <th className="text-left py-2 px-4">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">&lt;description&gt;</td>
                            <td className="py-2 px-4">General description of the file or directory</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">&lt;purpose&gt;</td>
                            <td className="py-2 px-4">The purpose or role of the file or directory</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">&lt;author&gt;</td>
                            <td className="py-2 px-4">Author information</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">&lt;version&gt;</td>
                            <td className="py-2 px-4">Version information</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <CodeExample
                        code={`- Type: File
  - Name: config.js
  <description>
  Configuration file for the application.
  </description>
  <purpose>
  Stores environment-specific settings.
  </purpose>
  <author>
  John Doe (john@example.com)
  </author>`}
                        language="forsure"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.2}>
            <div className="border rounded-lg overflow-hidden">
              <button
                className={`w-full flex items-center justify-between p-4 text-left font-semibold ${
                  openSection === "imports" ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => toggleSection("imports")}
              >
                <span>Import Directives</span>
                {openSection === "imports" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              {openSection === "imports" && (
                <div className="p-6 border-t">
                  <p className="mb-4">ForSure allows you to import other ForSure files to reuse common structures:</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <p className="mb-4">Import directives are useful for:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Reusing common file structures across projects</li>
                        <li>Breaking down large structures into manageable files</li>
                        <li>Creating libraries of standard project templates</li>
                        <li>Maintaining consistency across multiple projects</li>
                      </ul>
                    </div>
                    <div>
                      <CodeExample
                        code={`# main.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the project.
  </description>

  # Import common components structure
  @import 'components.forsure'
  
  # Import utilities structure
  @import 'utils.forsure'`}
                        language="forsure"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </section>

        {/* Code Snippets */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Common Patterns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimateOnScroll type="slideUp" delay={0.1}>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-secondary/10 dark:bg-primary/10 border-b border-primary/10 flex justify-between items-center">
                  <span className="font-medium">React Component Structure</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(reactComponentCode)}
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
                <CodeExample code={reactComponentCode} language="forsure" className="border-0" />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp" delay={0.2}>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-secondary/10 dark:bg-primary/10 border-b border-primary/10 flex justify-between items-center">
                  <span className="font-medium">API Project Structure</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiProjectCode)}
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
                <CodeExample code={apiProjectCode} language="forsure" className="border-0" />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-muted dark:bg-muted/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/docs/language"
              className="block p-4 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="font-semibold text-lg mb-2">Read the Full Documentation</div>
              <div className="text-secondary/80 dark:text-primary-light/70">
                Explore the complete language reference with detailed examples and best practices.
              </div>
            </Link>
            <Link
              href="/download"
              className="block p-4 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="font-semibold text-lg mb-2">Download ForSure CLI</div>
              <div className="text-secondary/80 dark:text-primary-light/70">
                Get the command-line tool to start generating file structures from your ForSure files.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

const reactComponentCode = `# react-component.forsure
root:
  - Type: Directory
  - Path: ./components
  <description>
  Contains reusable React components.
  </description>

  - Type: Directory
    - Name: Button/
    <description>
    Button component with its related files.
    </description>

    - Type: File
      - Name: Button.tsx
      <description>
      Main Button component implementation.
      </description>

    - Type: File
      - Name: Button.module.css
      <description>
      Styles for the Button component.
      </description>

    - Type: File
      - Name: Button.test.tsx
      <description>
      Unit tests for the Button component.
      </description>

    - Type: File
      - Name: index.ts
      <description>
      Exports the Button component.
      </description>
      <content>
      export { default } from './Button';
      </content>`

const apiProjectCode = `# api-project.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the API project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies and scripts.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Source code directory.
    </description>

    - Type: File
      - Name: index.ts
      <description>
      Entry point for the API.
      </description>

    - Type: Directory
      - Name: controllers/
      <description>
      Contains API route controllers.
      </description>

      - Type: File
        - Name: userController.ts
        <description>
        Controller for user-related endpoints.
        </description>

    - Type: Directory
      - Name: models/
      <description>
      Contains data models.
      </description>

      - Type: File
        - Name: userModel.ts
        <description>
        User data model.
        </description>

    - Type: Directory
      - Name: routes/
      <description>
      Contains API route definitions.
      </description>

      - Type: File
        - Name: userRoutes.ts
        <description>
        Routes for user-related endpoints.
        </description>`
