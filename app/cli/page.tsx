"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Terminal, ArrowRight, Copy, Check, ChevronDown, ChevronRight } from "lucide-react"
import CodeExample from "@/components/code-example"
import AnimateOnScroll from "@/components/animate-on-scroll"

export default function CLIPage() {
  const [copied, setCopied] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>("installation")

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("npm install -g forsure-cli")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null)
    } else {
      setOpenSection(section)
    }
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">ForSure CLI</h1>
          <p className="text-xl text-muted-foreground">
            A powerful command-line interface for generating project structures from ForSure files.
          </p>
        </div>

        <div className="bg-secondary dark:bg-secondary-dark text-white rounded-lg p-8 my-8">
          <div className="flex items-center mb-4">
            <Terminal className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">Installation</h2>
          </div>
          <p className="mb-4">Install the ForSure CLI globally using npm:</p>
          <div className="bg-black/30 rounded-md p-4 flex items-center justify-between">
            <code className="font-mono">npm install -g forsure-cli</code>
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
        </div>

        <div className="space-y-8 mt-8">
          <AnimateOnScroll type="slideUp">
            <div className="border rounded-lg overflow-hidden">
              <button
                className={`w-full flex items-center justify-between p-4 text-left font-semibold ${
                  openSection === "installation" ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => toggleSection("installation")}
              >
                <span>Getting Started</span>
                {openSection === "installation" ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
              {openSection === "installation" && (
                <div className="p-4 border-t">
                  <p className="mb-4">After installation, verify that the CLI is working correctly:</p>
                  <CodeExample code={`forsure --version`} language="bash" />
                  <p className="mt-4 mb-2">Create your first ForSure file:</p>
                  <CodeExample
                    code={`# project.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the project.
  </description>

  - Type: File
    - Name: README.md
    <description>
    Project documentation.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Source code directory.
    </description>`}
                  />
                </div>
              )}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.1}>
            <div className="border rounded-lg overflow-hidden">
              <button
                className={`w-full flex items-center justify-between p-4 text-left font-semibold ${
                  openSection === "commands" ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => toggleSection("commands")}
              >
                <span>Commands</span>
                {openSection === "commands" ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
              {openSection === "commands" && (
                <div className="p-4 border-t">
                  <p className="mb-4">The ForSure CLI provides several commands:</p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Generate</h3>
                      <p className="text-sm mb-2">Generate a file structure from a ForSure file:</p>
                      <CodeExample code={`forsure generate project.forsure --output ./my-project`} language="bash" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Validate</h3>
                      <p className="text-sm mb-2">Validate a ForSure file without generating the structure:</p>
                      <CodeExample code={`forsure validate project.forsure`} language="bash" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Init</h3>
                      <p className="text-sm mb-2">Create a new ForSure file with a basic structure:</p>
                      <CodeExample code={`forsure init my-project.forsure`} language="bash" />
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
                  openSection === "options" ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => toggleSection("options")}
              >
                <span>Options</span>
                {openSection === "options" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              {openSection === "options" && (
                <div className="p-4 border-t">
                  <p className="mb-4">Common options for ForSure CLI commands:</p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Option</th>
                        <th className="text-left py-2 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono text-sm">--output, -o</td>
                        <td className="py-2 px-4">Specify the output directory</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono text-sm">--force, -f</td>
                        <td className="py-2 px-4">Overwrite existing files</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono text-sm">--dry-run, -d</td>
                        <td className="py-2 px-4">Show what would be generated without creating files</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono text-sm">--verbose, -v</td>
                        <td className="py-2 px-4">Show detailed output</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/download" className="flex items-center">
              Download CLI <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/cli" className="flex items-center">
              CLI Documentation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
