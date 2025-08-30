'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowRight,
  Code,
  FileText,
  FolderTree,
  Copy,
  Check,
  BookOpen,
  Lightbulb,
  Zap,
  RefreshCw,
  Download,
  ExternalLink,
  Search,
  Info,
  HelpCircle,
  Bookmark,
} from 'lucide-react'
import CodeExample from '@/components/code-example'
import AnimateOnScroll from '@/components/animate-on-scroll'
import ForSureInteractiveDemo from '@/components/forsure-interactive-demo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function LanguagePage() {
  const [openSection, setOpenSection] = useState<string | null>('syntax')
  const [copied, setCopied] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showTip, setShowTip] = useState(0)
  const tipInterval = useRef<NodeJS.Timeout | null>(null)

  const languageTips = [
    'Use indentation to represent nesting in your file structure',
    'Add metadata tags to document your files and directories',
    'Import common structures with @import directives',
    'Use comments with # to add notes to your ForSure files',
    'Create templates for reusable project structures',
  ]

  useEffect(() => {
    tipInterval.current = setInterval(() => {
      setShowTip(prev => (prev + 1) % languageTips.length)
    }, 8000)

    return () => {
      if (tipInterval.current) {
        clearInterval(tipInterval.current)
      }
    }
  }, [])

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null)
    } else {
      setOpenSection(section)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container py-12">
      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 border-primary/30 bg-primary/5 text-primary"
            >
              <Code className="h-3.5 w-3.5 mr-1" />
              ForSure Language
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Define file structures{' '}
              <span className="text-primary">with confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mb-6">
              A human-readable language for defining and documenting file
              structures with rich metadata, designed for clarity and
              maintainability.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/docs/language" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Documentation
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/examples" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Examples
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary/20 to-transparent opacity-70 blur-xl rounded-full"></div>
            <Card className="border border-primary/20 shadow-lg overflow-hidden">
              <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3">
                <div className="flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-3 text-xs font-medium opacity-70">
                    project.forsure
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CodeExample
                  code={`root:
  - Type: Directory
  - Path: ./src
  <description>
  Source code directory for the application.
  </description>

  - Type: Directory
    - Name: components/
    <description>
    React components used throughout the app.
    </description>

    - Type: File
      - Name: Button.tsx
      <description>
      Reusable button component with variants.
      </description>

  - Type: Directory
    - Name: utils/
    <description>
    Utility functions and helpers.
    </description>

    - Type: File
      - Name: formatters.ts
      <description>
      Data formatting utilities.
      </description>`}
                  language="forsure"
                  className="border-0"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Language Overview Tabs */}
        <section className="bg-white dark:bg-secondary-dark/20 rounded-lg shadow-sm border border-primary/10 overflow-hidden">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-primary/10">
              <TabsList className="bg-transparent h-auto p-0">
                <div className="flex w-full overflow-x-auto">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="syntax"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    Syntax
                  </TabsTrigger>
                  <TabsTrigger
                    value="metadata"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    Metadata
                  </TabsTrigger>
                  <TabsTrigger
                    value="imports"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    Imports
                  </TabsTrigger>
                  <TabsTrigger
                    value="examples"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    Examples
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What is ForSure?</h2>
                  <p className="mb-4 text-muted-foreground">
                    ForSure is a declarative language designed to define,
                    document, and generate file structures for software
                    projects. It provides a human-readable way to specify
                    directories, files, and their relationships, along with rich
                    metadata.
                  </p>

                  <h3 className="text-xl font-bold mt-6 mb-3">Key Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Self-documenting</span> -
                        Structures include built-in documentation
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Reusable</span> - Import
                        common structures across projects
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Maintainable</span> - Easy
                        to update and evolve over time
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Generative</span> -
                        Automatically create file structures from definitions
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="bg-muted p-5 rounded-lg border border-primary/10 mb-6">
                    <div className="flex items-center mb-3">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-semibold">ForSure Tip</h3>
                    </div>
                    <div className="relative h-16 overflow-hidden">
                      {languageTips.map((tip, index) => (
                        <p
                          key={index}
                          className={`absolute transition-all duration-500 ease-in-out text-muted-foreground ${
                            index === showTip
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-8 opacity-0'
                          }`}
                        >
                          {tip}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowTip(prev => (prev + 1) % languageTips.length)
                        }
                        className="h-8 text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Next Tip
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <hr className="flex-1 border-primary/10" />
                    <span className="text-sm text-muted-foreground">
                      Get Started
                    </span>
                    <hr className="flex-1 border-primary/10" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/docs/installation" className="block">
                      <Card className="h-full hover:border-primary/30 transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Download className="h-4 w-4 mr-2 text-primary" />
                            Installation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Install the ForSure CLI to start generating file
                            structures
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/docs/language" className="block">
                      <Card className="h-full hover:border-primary/30 transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                            Documentation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Learn the ForSure language with comprehensive guides
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="syntax" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Basic Syntax</h2>
                  <p className="mb-4 text-muted-foreground">
                    ForSure uses a hierarchical structure with indentation to
                    represent nesting. Each entry starts with a hyphen and has
                    properties like Type and Name.
                  </p>

                  <h3 className="text-xl font-bold mt-6 mb-3">Core Concepts</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-primary/10">
                        <span className="h-4 w-4 text-xs font-bold flex items-center justify-center text-primary">
                          1
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Root Declaration</span> -
                        Every ForSure file starts with a root declaration
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-primary/10">
                        <span className="h-4 w-4 text-xs font-bold flex items-center justify-center text-primary">
                          2
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Entries</span> - Files and
                        directories are defined as entries with a hyphen prefix
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-primary/10">
                        <span className="h-4 w-4 text-xs font-bold flex items-center justify-center text-primary">
                          3
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Properties</span> - Each
                        entry has properties like Type and Name
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-primary/10">
                        <span className="h-4 w-4 text-xs font-bold flex items-center justify-center text-primary">
                          4
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Metadata</span> -
                        Additional information is enclosed in angle brackets
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-primary/10">
                        <span className="h-4 w-4 text-xs font-bold flex items-center justify-center text-primary">
                          5
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Indentation</span> -
                        Nesting is represented by indentation (2 spaces
                        recommended)
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="sticky top-4">
                    <Card className="border border-primary/20 shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="ml-3 text-xs font-medium opacity-70">
                            basic-syntax.forsure
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(basicSyntaxExample, 'syntax')
                          }
                          className="h-8"
                        >
                          {copied === 'syntax' ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <CodeExample
                          code={basicSyntaxExample}
                          language="forsure"
                          className="border-0"
                        />
                      </CardContent>
                    </Card>

                    <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            Indentation is significant in ForSure. Use
                            consistent indentation (2 spaces recommended) to
                            indicate nesting levels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Metadata Tags</h2>
                  <p className="mb-4 text-muted-foreground">
                    ForSure supports various metadata tags to document your file
                    structure. Metadata is enclosed in angle brackets and can
                    span multiple lines.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse mb-6">
                      <thead>
                        <tr className="border-b border-primary/10">
                          <th className="text-left py-2 px-4 font-semibold">
                            Tag
                          </th>
                          <th className="text-left py-2 px-4 font-semibold">
                            Description
                          </th>
                          <th className="text-left py-2 px-4 font-semibold">
                            Usage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-primary/10">
                          <td className="py-3 px-4 font-mono text-sm">
                            &lt;description&gt;
                          </td>
                          <td className="py-3 px-4">General description</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            For all entries
                          </td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="py-3 px-4 font-mono text-sm">
                            &lt;purpose&gt;
                          </td>
                          <td className="py-3 px-4">Purpose or role</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            For all entries
                          </td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="py-3 px-4 font-mono text-sm">
                            &lt;author&gt;
                          </td>
                          <td className="py-3 px-4">Author information</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            For all entries
                          </td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="py-3 px-4 font-mono text-sm">
                            &lt;version&gt;
                          </td>
                          <td className="py-3 px-4">Version information</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            For all entries
                          </td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="py-3 px-4 font-mono text-sm">
                            &lt;content&gt;
                          </td>
                          <td className="py-3 px-4">File content</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            For files only
                          </td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="py-3 px-4 font-mono text-sm">
                            &lt;dependencies&gt;
                          </td>
                          <td className="py-3 px-4">Dependencies</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            For project roots
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                      Custom Metadata
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      ForSure also supports custom metadata tags. Simply use any
                      tag name enclosed in angle brackets:
                    </p>
                    <pre className="mt-2 bg-secondary/5 p-2 rounded text-xs overflow-x-auto">
                      &lt;team&gt;Frontend&lt;/team&gt;
                    </pre>
                  </div>
                </div>

                <div>
                  <Card className="border border-primary/20 shadow-sm overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="ml-3 text-xs font-medium opacity-70">
                          metadata-example.forsure
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(metadataExample, 'metadata')
                        }
                        className="h-8"
                      >
                        {copied === 'metadata' ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CodeExample
                        code={metadataExample}
                        language="forsure"
                        className="border-0"
                      />
                    </CardContent>
                  </Card>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-bold">
                      Metadata Best Practices
                    </h3>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value="item-1"
                        className="border-primary/10"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-4 py-2 rounded-md">
                          <span className="text-base font-medium">
                            Be Consistent
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 text-muted-foreground">
                          Use the same metadata tags consistently across your
                          project. This makes it easier to parse and understand
                          your file structure.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-2"
                        className="border-primary/10"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-4 py-2 rounded-md">
                          <span className="text-base font-medium">
                            Be Concise
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 text-muted-foreground">
                          Keep metadata descriptions concise and to the point.
                          Long descriptions can make your ForSure files harder
                          to read.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-3"
                        className="border-primary/10"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-4 py-2 rounded-md">
                          <span className="text-base font-medium">
                            Use Custom Tags
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 text-muted-foreground">
                          Don't hesitate to create custom metadata tags for your
                          specific needs. ForSure is designed to be extensible.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="imports" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Import Directives</h2>
                  <p className="mb-4 text-muted-foreground">
                    ForSure allows you to import other ForSure files to reuse
                    common structures. This promotes modularity and
                    maintainability.
                  </p>

                  <h3 className="text-xl font-bold mt-6 mb-3">Import Syntax</h3>
                  <div className="bg-secondary/5 p-4 rounded-lg font-mono text-sm mb-6">
                    @import 'path/to/file.forsure'
                  </div>

                  <h3 className="text-xl font-bold mt-6 mb-3">
                    Benefits of Imports
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Reusability</span> - Reuse
                        common file structures across projects
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Modularity</span> - Break
                        down large structures into manageable files
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Standardization</span> -
                        Create libraries of standard project templates
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">Consistency</span> -
                        Maintain consistency across multiple projects
                      </div>
                    </li>
                  </ul>

                  <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Imports are resolved relative to the current file. You
                          can also use absolute paths starting with a slash (/).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="border border-primary/20 shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="ml-3 text-xs font-medium opacity-70">
                            components.forsure
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(componentsExample, 'components')
                          }
                          className="h-8"
                        >
                          {copied === 'components' ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <CodeExample
                          code={componentsExample}
                          language="forsure"
                          className="border-0"
                        />
                      </CardContent>
                    </Card>

                    <Card className="border border-primary/20 shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="ml-3 text-xs font-medium opacity-70">
                            main.forsure
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(mainExample, 'main')}
                          className="h-8"
                        >
                          {copied === 'main' ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <CodeExample
                          code={mainExample}
                          language="forsure"
                          className="border-0"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">
                      Advanced Import Techniques
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value="item-1"
                        className="border-primary/10"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-4 py-2 rounded-md">
                          <span className="text-base font-medium">
                            Conditional Imports
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <p className="text-muted-foreground mb-2">
                            You can use environment variables to conditionally
                            import files:
                          </p>
                          <pre className="bg-secondary/5 p-2 rounded text-xs overflow-x-auto">
                            # Import development configuration in dev mode
                            @import '$
                            {'{ENV === "development" ? "dev" : "prod"}'}
                            .forsure'
                          </pre>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-2"
                        className="border-primary/10"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-4 py-2 rounded-md">
                          <span className="text-base font-medium">
                            Import with Namespace
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <p className="text-muted-foreground mb-2">
                            You can import files with a namespace to avoid
                            conflicts:
                          </p>
                          <pre className="bg-secondary/5 p-2 rounded text-xs overflow-x-auto">
                            # Import with namespace @import 'components.forsure'
                            as components
                          </pre>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-3"
                        className="border-primary/10"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-4 py-2 rounded-md">
                          <span className="text-base font-medium">
                            Remote Imports
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <p className="text-muted-foreground mb-2">
                            You can import files from remote locations:
                          </p>
                          <pre className="bg-secondary/5 p-2 rounded text-xs overflow-x-auto">
                            # Import from a remote location @import
                            'https://example.com/templates/react-app.forsure'
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="p-6">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Common Patterns</h2>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search examples..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Here are some common patterns and examples for different
                    project types. Use these as starting points for your own
                    ForSure files.
                  </p>

                  <Tabs defaultValue="react" className="w-full">
                    <TabsList className="w-full justify-start mb-6 bg-secondary/5 p-1 rounded-lg">
                      <TabsTrigger
                        value="react"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary-dark rounded-md"
                      >
                        React
                      </TabsTrigger>
                      <TabsTrigger
                        value="nextjs"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary-dark rounded-md"
                      >
                        Next.js
                      </TabsTrigger>
                      <TabsTrigger
                        value="node"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary-dark rounded-md"
                      >
                        Node.js
                      </TabsTrigger>
                      <TabsTrigger
                        value="python"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary-dark rounded-md"
                      >
                        Python
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="react" className="mt-0">
                      <Card className="border border-primary/20 shadow-sm overflow-hidden">
                        <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex space-x-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-3 text-xs font-medium opacity-70">
                              react-project.forsure
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(reactComponentCode, 'react')
                            }
                            className="h-8"
                          >
                            {copied === 'react' ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                          <CodeExample
                            code={reactComponentCode}
                            language="forsure"
                            className="border-0"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="nextjs" className="mt-0">
                      <Card className="border border-primary/20 shadow-sm overflow-hidden">
                        <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex space-x-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-3 text-xs font-medium opacity-70">
                              nextjs-project.forsure
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(nextjsExample, 'nextjs')
                            }
                            className="h-8"
                          >
                            {copied === 'nextjs' ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                          <CodeExample
                            code={nextjsExample}
                            language="forsure"
                            className="border-0"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="node" className="mt-0">
                      <Card className="border border-primary/20 shadow-sm overflow-hidden">
                        <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex space-x-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-3 text-xs font-medium opacity-70">
                              api-project.forsure
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(apiProjectCode, 'node')
                            }
                            className="h-8"
                          >
                            {copied === 'node' ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                          <CodeExample
                            code={apiProjectCode}
                            language="forsure"
                            className="border-0"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="python" className="mt-0">
                      <Card className="border border-primary/20 shadow-sm overflow-hidden">
                        <CardHeader className="bg-secondary/10 border-b border-primary/10 py-3 flex flex-row items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex space-x-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-3 text-xs font-medium opacity-70">
                              python-project.forsure
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(pythonExample, 'python')
                            }
                            className="h-8"
                          >
                            {copied === 'python' ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                          <CodeExample
                            code={pythonExample}
                            language="forsure"
                            className="border-0"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Best Practices</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium">
                            Use descriptive names
                          </span>{' '}
                          - Choose clear, descriptive names for files and
                          directories
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium">Add metadata</span> -
                          Include relevant metadata for all entries
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium">Use imports</span> -
                          Break down large structures into smaller, reusable
                          files
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium">Be consistent</span> -
                          Maintain consistent formatting and structure
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium">Version control</span> -
                          Store ForSure files in version control
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Common Mistakes</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-red-100 dark:bg-red-900/30">
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
                            className="h-4 w-4 text-red-600 dark:text-red-400"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">
                            Inconsistent indentation
                          </span>{' '}
                          - Mixing tabs and spaces or using inconsistent
                          indentation
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-red-100 dark:bg-red-900/30">
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
                            className="h-4 w-4 text-red-600 dark:text-red-400"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Missing metadata</span>{' '}
                          - Not including essential metadata for entries
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-red-100 dark:bg-red-900/30">
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
                            className="h-4 w-4 text-red-600 dark:text-red-400"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Circular imports</span>{' '}
                          - Creating circular dependencies between imported
                          files
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1 p-1 rounded-full bg-red-100 dark:bg-red-900/30">
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
                            className="h-4 w-4 text-red-600 dark:text-red-400"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">
                            Overly complex structures
                          </span>{' '}
                          - Creating unnecessarily deep or complex hierarchies
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Interactive Demo Section */}
        <section className="bg-secondary dark:bg-secondary-dark text-white rounded-lg overflow-hidden shadow-lg border border-primary/20">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Code className="h-6 w-6 mr-3 text-primary" />
              <h2 className="text-2xl font-bold">Try ForSure Language</h2>
            </div>
            <p className="mb-6 text-white/90 max-w-3xl">
              Edit the ForSure code below to see how the language works. The
              visualization will update in real-time to show the resulting file
              structure.
            </p>
          </div>

          <ForSureInteractiveDemo />

          <div className="p-6 md:p-8 bg-secondary-dark/50 border-t border-primary/20">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-secondary-dark"
              >
                <Link href="/docs/language" className="flex items-center">
                  Language Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white"
              >
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
                <h3 className="text-xl font-bold mb-2">
                  Hierarchical Structure
                </h3>
                <p className="text-secondary/80 dark:text-primary-light/70">
                  Define nested directories and files with a clear,
                  indentation-based syntax that mirrors the actual file system
                  structure.
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
                  Add descriptions, purposes, authors, and other metadata to
                  document your file structure and make it self-explanatory.
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
                  Reuse common file structures across projects with import
                  directives, making your definitions modular and maintainable.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="bg-white dark:bg-secondary-dark/20 rounded-lg p-8 shadow-sm border border-primary/10">
          <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-amber-500" />
                  Template Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use variables in your ForSure files to create dynamic
                  templates that can be customized at generation time.
                </p>
                <div className="mt-3 bg-secondary/5 p-2 rounded text-xs font-mono overflow-x-auto">
                  ${'{'}'PROJECT_NAME'{'}'}/src/
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2 text-green-500"
                  >
                    <path d="M12 2H2v10h10V2z"></path>
                    <path d="M12 12H2v10h10V12z"></path>
                    <path d="M22 2h-10v10h10V2z"></path>
                    <path d="M22 12h-10v10h10V12z"></path>
                  </svg>
                  Content Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Define file content templates with placeholders that can be
                  filled in during generation.
                </p>
                <div className="mt-3 bg-secondary/5 p-2 rounded text-xs font-mono overflow-x-auto">
                  &lt;content&gt; export const ${'{COMPONENT_NAME}'} = () =&gt;{' '}
                  {'{'}
                  // ...
                  {'}'}
                  &lt;/content&gt;
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Conditional Logic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use conditional logic to include or exclude files and
                  directories based on variables.
                </p>
                <div className="mt-3 bg-secondary/5 p-2 rounded text-xs font-mono overflow-x-auto">
                  # Only include if using TypeScript @if(TYPESCRIPT) - Type:
                  File - Name: tsconfig.json @endif
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/docs/advanced">
                <BookOpen className="h-4 w-4" />
                <span>View Advanced Documentation</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Community & Resources */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Community & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
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
                    className="h-5 w-5 mr-2 text-primary"
                  >
                    <path d="M17 6.1H3"></path>
                    <path d="M21 12.1H3"></path>
                    <path d="M15.1 18H3"></path>
                  </svg>
                  Community Templates
                </CardTitle>
                <CardDescription>
                  Explore and use templates created by the ForSure community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
                      <Bookmark className="h-4 w-4 mr-2 text-primary" />
                      <span>React Component Library</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        Popular
                      </Badge>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
                      <Bookmark className="h-4 w-4 mr-2 text-primary" />
                      <span>Next.js App Router Project</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
                      <Bookmark className="h-4 w-4 mr-2 text-primary" />
                      <span>Express API with MongoDB</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
                      <Bookmark className="h-4 w-4 mr-2 text-primary" />
                      <span>Django Web Application</span>
                    </Link>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/templates">
                    <span>Browse All Templates</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
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
                    className="h-5 w-5 mr-2 text-primary"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Community & Support
                </CardTitle>
                <CardDescription>
                  Connect with other ForSure users and get help
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="https://github.com/forsure-lang/forsure"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
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
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      <span>GitHub Repository</span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://discord.gg/forsure"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
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
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M18 4a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z"></path>
                        <path d="M6 4a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z"></path>
                        <path d="M13 15h-2a4 4 0 0 0-4 4v2h10v-2a4 4 0 0 0-4-4Z"></path>
                        <path d="M2 14v.5a5.5 5.5 0 0 0 5.5 5.5H9"></path>
                        <path d="M22 14v.5a5.5 5.5 0 0 1-5.5 5.5H15"></path>
                      </svg>
                      <span>Discord Community</span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://twitter.com/forsure_lang"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
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
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <span>Twitter</span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/docs/faq"
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      <span>FAQ & Troubleshooting</span>
                    </Link>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">
                    <span>Contact Support</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-muted dark:bg-muted/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/docs/language"
              className="block p-4 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="font-semibold text-lg mb-2 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Read the Documentation
              </div>
              <div className="text-secondary/80 dark:text-primary-light/70 text-sm">
                Explore the complete language reference with detailed examples
                and best practices.
              </div>
            </Link>
            <Link
              href="/download"
              className="block p-4 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="font-semibold text-lg mb-2 flex items-center">
                <Download className="h-5 w-5 mr-2 text-primary" />
                Download ForSure CLI
              </div>
              <div className="text-secondary/80 dark:text-primary-light/70 text-sm">
                Get the command-line tool to start generating file structures
                from your ForSure files.
              </div>
            </Link>
            <Link
              href="/examples"
              className="block p-4 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="font-semibold text-lg mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Browse Examples
              </div>
              <div className="text-secondary/80 dark:text-primary-light/70 text-sm">
                See real-world examples of ForSure files for different project
                types and use cases.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

const basicSyntaxExample = `root:
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

  - Type: File
    - Name: README.md
    <description>
    Project documentation.
    </description>`

const metadataExample = `- Type: File
  - Name: config.js
  <description>
  Configuration file for the application.
  </description>
  <purpose>
  Stores environment-specific settings and feature flags.
  </purpose>
  <author>
  John Doe (john@example.com)
  </author>
  <version>
  1.2.0
  </version>
  <content>
  module.exports = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    debug: process.env.DEBUG === 'true',
    features: {
      newDashboard: true,
      betaFeatures: false
    }
  }
  </content>`

const componentsExample = `# components.forsure
root:
  - Type: Directory
  - Path: ./components
  <description>
  Reusable UI components.
  </description>

  - Type: Directory
    - Name: Button/
    <description>
    Button component with variants.
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

  - Type: Directory
    - Name: Card/
    <description>
    Card component for displaying content.
    </description>

    - Type: File
      - Name: Card.tsx
      <description>
      Card component implementation.
      </description>`

const mainExample = `# main.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the project.
  </description>

  # Import components structure
  @import 'components.forsure'
  
  - Type: Directory
    - Name: pages/
    <description>
    Application pages.
    </description>

    - Type: File
      - Name: index.tsx
      <description>
      Home page of the application.
      </description>

  - Type: File
    - Name: package.json
    <description>
    Project dependencies and scripts.
    </description>`

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

const nextjsExample = `# nextjs-project.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Next.js project.
  </description>

  - Type: Directory
    - Name: app/
    <description>
    App Router directory structure.
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
      - Name: about/
      <description>
      About page route.
      </description>

      - Type: File
        - Name: page.tsx
        <description>
        About page component.
        </description>

  - Type: Directory
    - Name: components/
    <description>
    Reusable UI components.
    </description>

    - Type: File
      - Name: header.tsx
      <description>
      Header component.
      </description>

  - Type: File
    - Name: next.config.js
    <description>
    Next.js configuration file.
    </description>`

const pythonExample = `# python-project.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Python project.
  </description>

  - Type: File
    - Name: requirements.txt
    <description>
    Python dependencies.
    </description>

  - Type: Directory
    - Name: app/
    <description>
    Main application package.
    </description>

    - Type: File
      - Name: __init__.py
      <description>
      Package initialization file.
      </description>

    - Type: File
      - Name: main.py
      <description>
      Application entry point.
      </description>

    - Type: Directory
      - Name: models/
      <description>
      Data models.
      </description>

      - Type: File
        - Name: __init__.py
        <description>
        Package initialization file.
        </description>

      - Type: File
        - Name: user.py
        <description>
        User model.
        </description>

  - Type: Directory
    - Name: tests/
    <description>
    Test suite.
    </description>

    - Type: File
      - Name: __init__.py
      <description>
      Package initialization file.
      </description>

    - Type: File
      - Name: test_main.py
      <description>
      Tests for main.py.
      </description>`
