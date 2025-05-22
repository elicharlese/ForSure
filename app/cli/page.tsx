"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Terminal,
  ArrowRight,
  Copy,
  Check,
  Code,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  BookOpen,
  Lightbulb,
} from "lucide-react"
import CodeExample from "@/components/code-example"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CLIPage() {
  const [copied, setCopied] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>("installation")
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<{ command: string; output: string }[]>([])
  const [activeTip, setActiveTip] = useState(0)

  const tips = [
    "Use --dry-run to preview changes without making them",
    "The CLI supports environment variables via .env files",
    "Use the --verbose flag for detailed logging",
    "Create templates with the 'forsure template' command",
    "Export your project structure with 'forsure export'",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!terminalInput.trim()) return

    let output = ""

    if (terminalInput === "help" || terminalInput === "forsure help") {
      output =
        "Available commands:\n  - forsure --version\n  - forsure generate <file>\n  - forsure validate <file>\n  - forsure init <file>\n  - forsure template <name>\n  - forsure export <project>"
    } else if (terminalInput === "forsure --version") {
      output = "forsure-cli v1.2.0"
    } else if (terminalInput.startsWith("forsure init")) {
      output = "✅ Created new ForSure file template"
    } else if (terminalInput.startsWith("forsure validate")) {
      output = "✅ File structure is valid"
    } else if (terminalInput.startsWith("forsure generate")) {
      output = "Generating file structure...\n✅ Created 12 files\n✅ Created 5 directories\n✅ Generation complete"
    } else if (terminalInput === "clear") {
      setTerminalHistory([])
      setTerminalInput("")
      return
    } else {
      output = `Command not found: ${terminalInput}\nType 'help' for available commands`
    }

    setTerminalHistory((prev) => [...prev, { command: terminalInput, output }])
    setTerminalInput("")

    // Scroll to bottom of terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 0)
  }

  return (
    <div className="container py-12 max-w-5xl">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">ForSure CLI</h1>
              <Badge variant="outline" className="ml-2">
                v1.2.0
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground">
              A powerful command-line interface for generating project structures from ForSure files.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/download" className="flex items-center">
                Download CLI <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/cli" className="flex items-center">
                Documentation <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
              <CardDescription>Get up and running with ForSure CLI in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">1. Install the CLI</h3>
                  <div className="bg-secondary/20 dark:bg-secondary-dark/30 rounded-md p-4 flex items-center justify-between">
                    <code className="font-mono text-sm">npm install -g forsure-cli</code>
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

                <div>
                  <h3 className="text-sm font-semibold mb-2">2. Create a ForSure file</h3>
                  <CodeExample code={`forsure init my-project.forsure`} language="bash" className="mb-2" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">3. Generate your project structure</h3>
                  <CodeExample code={`forsure generate my-project.forsure --output ./my-project`} language="bash" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                <p className="italic">Tip: {tips[activeTip]}</p>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Try It Out
              </CardTitle>
              <CardDescription>Interactive CLI simulator</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={terminalRef}
                className="bg-black rounded-md p-3 h-[220px] overflow-y-auto font-mono text-xs text-white"
              >
                <div className="mb-2 text-primary">ForSure CLI Simulator</div>
                <div className="mb-2 text-gray-400">Type 'help' for available commands</div>

                {terminalHistory.map((entry, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex">
                      <span className="text-green-400 mr-1">$</span>
                      <span>{entry.command}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-300 ml-2">{entry.output}</div>
                  </div>
                ))}

                <form onSubmit={handleTerminalSubmit} className="flex items-center">
                  <span className="text-green-400 mr-1">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Type a command..."
                  />
                </form>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
              Try: forsure --version, forsure init, forsure generate, help, clear
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="commands" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="commands" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Commands</span>
            </TabsTrigger>
            <TabsTrigger value="options" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Options</span>
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Examples</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CLI Commands</CardTitle>
                <CardDescription>Core commands available in the ForSure CLI</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="generate">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          generate
                        </Badge>
                        <span>Generate a file structure from a ForSure file</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Creates directories and files based on the structure defined in your ForSure file.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure generate <file> [options]`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Example:</h4>
                          <CodeExample
                            code={`forsure generate project.forsure --output ./my-project`}
                            language="bash"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="validate">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          validate
                        </Badge>
                        <span>Validate a ForSure file</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Checks if a ForSure file is valid without generating the structure.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure validate <file>`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Example:</h4>
                          <CodeExample code={`forsure validate project.forsure`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="init">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          init
                        </Badge>
                        <span>Create a new ForSure file</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Creates a new ForSure file with a basic structure template.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure init <file>`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Example:</h4>
                          <CodeExample code={`forsure init my-project.forsure`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="template">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          template
                        </Badge>
                        <span>Work with templates</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Create, list, and apply templates for reusable project structures.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure template <command> [options]`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Example:</h4>
                          <CodeExample
                            code={`forsure template create react-app --from project.forsure`}
                            language="bash"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="export">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          export
                        </Badge>
                        <span>Export existing project structure</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Creates a ForSure file from an existing project structure.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure export <directory> [options]`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Example:</h4>
                          <CodeExample code={`forsure export ./my-project --output project.forsure`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CLI Options</CardTitle>
                <CardDescription>Common options that can be used with ForSure CLI commands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Option</th>
                        <th className="text-left py-2 px-4">Description</th>
                        <th className="text-left py-2 px-4">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--output, -o</td>
                        <td className="py-3 px-4">Specify the output directory or file</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--output ./my-project</code>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--force, -f</td>
                        <td className="py-3 px-4">Overwrite existing files</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--force</code>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--dry-run, -d</td>
                        <td className="py-3 px-4">Show what would be generated without creating files</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--dry-run</code>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--verbose, -v</td>
                        <td className="py-3 px-4">Show detailed output</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--verbose</code>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--ignore, -i</td>
                        <td className="py-3 px-4">Ignore specific files or patterns</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--ignore "node_modules/**"</code>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--template, -t</td>
                        <td className="py-3 px-4">Use a specific template</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--template react-app</code>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">--config, -c</td>
                        <td className="py-3 px-4">Specify a configuration file</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <code>--config .forsurerc</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Example Workflows</CardTitle>
                <CardDescription>Common workflows and examples using the ForSure CLI</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="react-app">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span>Creating a React application structure</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Generate a standard React application structure with components, pages, and assets.
                        </p>
                        <CodeExample
                          code={`# react-app.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  React application root directory.
  </description>

  - Type: File
    - Name: package.json
    <description>
    NPM package configuration.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Source code directory.
    </description>

    - Type: File
      - Name: index.js
      <description>
      Application entry point.
      </description>

    - Type: Directory
      - Name: components/
      <description>
      React components.
      </description>

    - Type: Directory
      - Name: pages/
      <description>
      Page components.
      </description>

    - Type: Directory
      - Name: assets/
      <description>
      Static assets like images and fonts.
      </description>`}
                          language="forsure"
                          className="mb-4"
                        />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Generate the structure:</h4>
                          <CodeExample
                            code={`forsure generate react-app.forsure --output ./my-react-app`}
                            language="bash"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="nextjs-app">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span>Setting up a Next.js project</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Generate a Next.js application structure with app directory, components, and API routes.
                        </p>
                        <CodeExample
                          code={`# nextjs-app.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Next.js application root directory.
  </description>

  - Type: File
    - Name: package.json
    <description>
    NPM package configuration.
    </description>

  - Type: File
    - Name: next.config.js
    <description>
    Next.js configuration file.
    </description>

  - Type: Directory
    - Name: app/
    <description>
    App directory for Next.js 13+ App Router.
    </description>

    - Type: File
      - Name: layout.tsx
      <description>
      Root layout component.
      </description>

    - Type: File
      - Name: page.tsx
      <description>
      Home page component.
      </description>

  - Type: Directory
    - Name: components/
    <description>
    Reusable React components.
    </description>

  - Type: Directory
    - Name: public/
    <description>
    Static files served at the root.
    </description>`}
                          language="forsure"
                          className="mb-4"
                        />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Generate the structure:</h4>
                          <CodeExample
                            code={`forsure generate nextjs-app.forsure --output ./my-nextjs-app`}
                            language="bash"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="node-api">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span>Building a Node.js API</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Generate a Node.js API structure with routes, controllers, and models.
                        </p>
                        <CodeExample
                          code={`# node-api.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Node.js API root directory.
  </description>

  - Type: File
    - Name: package.json
    <description>
    NPM package configuration.
    </description>

  - Type: File
    - Name: server.js
    <description>
    API entry point.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Source code directory.
    </description>

    - Type: Directory
      - Name: routes/
      <description>
      API route definitions.
      </description>

    - Type: Directory
      - Name: controllers/
      <description>
      Request handlers.
      </description>

    - Type: Directory
      - Name: models/
      <description>
      Data models.
      </description>

    - Type: Directory
      - Name: middleware/
      <description>
      Express middleware.
      </description>

  - Type: Directory
    - Name: config/
    <description>
    Configuration files.
    </description>`}
                          language="forsure"
                          className="mb-4"
                        />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Generate the structure:</h4>
                          <CodeExample
                            code={`forsure generate node-api.forsure --output ./my-node-api`}
                            language="bash"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about the ForSure CLI</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is">
                    <AccordionTrigger className="hover:no-underline">What is ForSure CLI?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        ForSure CLI is a command-line tool that allows you to define project structures in a declarative
                        way using ForSure files. It can generate directories and files based on these definitions,
                        making it easy to scaffold new projects or maintain consistent structures across multiple
                        projects.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="vs-others">
                    <AccordionTrigger className="hover:no-underline">
                      How is ForSure different from other scaffolding tools?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Unlike other scaffolding tools that focus on specific frameworks or technologies, ForSure is
                        framework-agnostic and can be used for any type of project. It also provides rich metadata and
                        documentation capabilities, allowing you to describe the purpose and relationships of files and
                        directories in your project.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="templates">
                    <AccordionTrigger className="hover:no-underline">
                      Can I create and share templates?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Yes! ForSure CLI supports creating, sharing, and applying templates. You can create a template
                        from an existing ForSure file using the{" "}
                        <code className="text-xs font-mono">forsure template create</code> command, and then share it
                        with others. Templates can be applied using the{" "}
                        <code className="text-xs font-mono">forsure template apply</code> command.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="existing">
                    <AccordionTrigger className="hover:no-underline">
                      Can I generate a ForSure file from an existing project?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Yes, you can use the <code className="text-xs font-mono">forsure export</code> command to
                        generate a ForSure file from an existing project structure. This is useful for documenting
                        existing projects or creating templates based on them.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ci-cd">
                    <AccordionTrigger className="hover:no-underline">
                      Can I use ForSure in CI/CD pipelines?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Absolutely! ForSure CLI is designed to be used in automated environments like CI/CD pipelines.
                        You can use it to validate project structures, generate scaffolding, or ensure consistency
                        across projects. The <code className="text-xs font-mono">--dry-run</code>
                        option is particularly useful for validation without making changes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-6 mt-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Learn More
              </h2>
              <p className="text-muted-foreground">
                Explore our comprehensive documentation to learn all about ForSure CLI and how to use it effectively.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/docs/cli" className="flex items-center">
                  Full Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/examples" className="flex items-center">
                  View Examples <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
