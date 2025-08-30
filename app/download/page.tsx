import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Terminal, Download, Github, ArrowRight } from 'lucide-react'
import CodeExample from '@/components/code-example'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function DownloadPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Download ForSure CLI
          </h1>
          <p className="text-xl text-muted-foreground">
            Get started with ForSure by installing our command-line interface
            tool.
          </p>
        </div>

        {/* Main Download Section */}
        <section className="bg-secondary dark:bg-secondary-dark text-white rounded-lg p-8 my-8">
          <div className="flex items-center mb-6">
            <Terminal className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">ForSure CLI</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-4">Installation</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-white/90">Using npm (Recommended):</p>
                  <CodeExample
                    code="npm install -g forsure-cli"
                    language="bash"
                  />
                </div>
                <div>
                  <p className="mb-2 text-white/90">Using yarn:</p>
                  <CodeExample
                    code="yarn global add forsure-cli"
                    language="bash"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4">Direct Download</h3>
                <p className="mb-4 text-white/90">
                  Download the binary for your platform:
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start" size="lg">
                    <a href="#" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" /> macOS (Intel/Apple
                      Silicon)
                    </a>
                  </Button>
                  <Button asChild className="w-full justify-start" size="lg">
                    <a href="#" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" /> Windows (64-bit)
                    </a>
                  </Button>
                  <Button asChild className="w-full justify-start" size="lg">
                    <a href="#" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" /> Linux (64-bit)
                    </a>
                  </Button>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="mt-4 border-white/20"
              >
                <a
                  href="https://github.com/elicharlese/ForSure/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-5 w-5" /> All releases on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Verification Section */}
        <AnimateOnScroll type="slideUp">
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Verify Installation</h2>
            <p className="mb-4">
              After installation, verify that the ForSure CLI is working
              correctly by running:
            </p>
            <CodeExample code="forsure --version" language="bash" />
            <p className="mt-4">
              You should see the version number of the ForSure CLI that you
              installed.
            </p>
          </section>
        </AnimateOnScroll>

        {/* Getting Started Section */}
        <AnimateOnScroll type="slideUp" delay={0.1}>
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="mb-4">
              Create your first ForSure file and generate a project structure:
            </p>
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-medium">1. Create a ForSure file:</p>
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
                  language="forsure"
                />
              </div>

              <div>
                <p className="mb-2 font-medium">
                  2. Generate the project structure:
                </p>
                <CodeExample
                  code="forsure generate project.forsure --output ./my-project"
                  language="bash"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button asChild>
                <Link href="/docs/quick-start" className="flex items-center">
                  Quick Start Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </AnimateOnScroll>

        {/* System Requirements */}
        <AnimateOnScroll type="slideUp" delay={0.2}>
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Node.js</h3>
                <p className="text-sm text-muted-foreground">
                  Node.js v14.0.0 or higher is required for the npm installation
                  method.
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Operating Systems</h3>
                <p className="text-sm text-muted-foreground">
                  Windows 10/11, macOS 10.15+, or Linux (Ubuntu, Debian, CentOS,
                  etc.)
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Disk Space</h3>
                <p className="text-sm text-muted-foreground">
                  Approximately 50MB of free disk space is required.
                </p>
              </div>
            </div>
          </section>
        </AnimateOnScroll>

        {/* Next Steps */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/docs"
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-semibold">Read the Documentation</div>
              <div className="text-sm text-muted-foreground">
                Learn how to use ForSure effectively
              </div>
            </Link>
            <Link
              href="/cli"
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-semibold">Explore CLI Commands</div>
              <div className="text-sm text-muted-foreground">
                Discover all available CLI commands and options
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
