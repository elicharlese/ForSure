import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Code, Terminal, Github } from "lucide-react"
import DocsCodeBlock from "@/components/docs-code-block"
import VSCodePreview from "@/components/vscode-preview"

export default function DownloadPage() {
  return (
    <div className="space-y-8 max-w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Downloads</h1>
        <p className="text-lg text-muted-foreground">
          Download and install ForSure tools for your development environment.
        </p>
      </div>

      {/* CLI Download Section */}
      <section className="space-y-4 border rounded-lg p-6 bg-card">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
            <Terminal className="h-8 w-8" />
          </div>
          <div className="w-full">
            <h2 className="text-2xl font-semibold tracking-tight">ForSure CLI</h2>
            <p className="text-muted-foreground mb-4">
              Command-line interface for generating and validating file structures.
            </p>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="border rounded-md p-4 flex flex-col">
                <h3 className="font-medium mb-2">npm</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Install globally via npm package manager.
                </p>
                <DocsCodeBlock code={`npm install -g forsure-cli`} language="bash" className="overflow-x-auto" />
              </div>

              <div className="border rounded-md p-4 flex flex-col">
                <h3 className="font-medium mb-2">Binary (macOS/Linux)</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Download and install the binary directly.
                </p>
                <Button className="w-full h-auto py-2 px-4 whitespace-normal">
                  <Download className="mr-2 h-4 w-4 shrink-0" />
                  <span>Download for macOS/Linux</span>
                </Button>
              </div>

              <div className="border rounded-md p-4 flex flex-col">
                <h3 className="font-medium mb-2">Binary (Windows)</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Download and install the Windows executable.
                </p>
                <Button className="w-full h-auto py-2 px-4 whitespace-normal">
                  <Download className="mr-2 h-4 w-4 shrink-0" />
                  <span>Download for Windows</span>
                </Button>
              </div>
            </div>

            <h3 className="text-xl font-medium mb-2">Installation Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">From npm</h4>
                <DocsCodeBlock
                  code={`# Install globally
npm install -g forsure-cli

# Verify installation
forsure --version`}
                  language="bash"
                  className="overflow-x-auto"
                />
              </div>

              <div>
                <h4 className="font-medium">From Binary (macOS/Linux)</h4>
                <DocsCodeBlock
                  code={`# Download the binary
curl -L https://github.com/elicharlese/ForSure/releases/latest/download/forsure-cli-linux -o forsure

# Make it executable
chmod +x forsure

# Move to a directory in your PATH
sudo mv forsure /usr/local/bin/`}
                  language="bash"
                  className="overflow-x-auto"
                />
              </div>

              <div>
                <h4 className="font-medium">From Binary (Windows)</h4>
                <p className="text-sm text-muted-foreground mb-2">1. Download the Windows executable</p>
                <p className="text-sm text-muted-foreground mb-2">
                  2. Add the executable location to your PATH environment variable
                </p>
                <p className="text-sm text-muted-foreground">
                  3. Open a new command prompt and verify with <code>forsure --version</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VS Code Extension Section */}
      <section className="space-y-4 border rounded-lg p-6 bg-card">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
            <Code className="h-8 w-8" />
          </div>
          <div className="w-full">
            <h2 className="text-2xl font-semibold tracking-tight">VS Code Extension</h2>
            <p className="text-muted-foreground mb-4">
              Enhance your development experience with syntax highlighting, snippets, and more.
            </p>

            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="flex-1 border rounded-md overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-2">ForSure for VS Code</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Official VS Code extension with syntax highlighting, snippets, and validation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild className="h-auto py-2 px-4 whitespace-normal">
                      <a
                        href="https://marketplace.visualstudio.com/items?itemName=forsure.forsure-vscode"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Install from Marketplace
                      </a>
                    </Button>
                    <Button variant="outline" asChild className="h-auto py-2 px-4 whitespace-normal">
                      <a href="https://github.com/elicharlese/ForSure-vscode" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4 shrink-0" /> View Source
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="border-t p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Syntax highlighting for .forsure files</li>
                    <li>Code snippets for common patterns</li>
                    <li>Real-time validation and error checking</li>
                    <li>Preview file structure in VS Code</li>
                    <li>Integration with ForSure CLI</li>
                  </ul>
                </div>
              </div>

              <div className="flex-1 border rounded-md overflow-hidden">
                <div className="p-4 h-full flex flex-col">
                  <h3 className="font-medium mb-2">Installation</h3>
                  <p className="text-sm text-muted-foreground mb-4">Install directly from VS Code:</p>
                  <ol className="text-sm space-y-2 list-decimal pl-5 flex-grow">
                    <li>Open VS Code</li>
                    <li>Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)</li>
                    <li>Search for "ForSure"</li>
                    <li>Click "Install"</li>
                  </ol>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Or install from VSIX file:</p>
                    <Button variant="outline" className="mt-2 w-full h-auto py-2 px-4 whitespace-normal">
                      <Download className="mr-2 h-4 w-4 shrink-0" /> Download VSIX
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Extension Preview</h3>
              <VSCodePreview className="w-full max-w-full overflow-hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* Syntax Highlighting Section */}
      <section className="space-y-4 border rounded-lg p-6 bg-card">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
            <Code className="h-8 w-8" />
          </div>
          <div className="w-full">
            <h2 className="text-2xl font-semibold tracking-tight">Syntax Highlighting</h2>
            <p className="text-muted-foreground mb-4">Syntax highlighting for various text editors and IDEs.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Sublime Text</h3>
                <p className="text-sm text-muted-foreground mb-4">Syntax highlighting package for Sublime Text.</p>
                <Button className="w-full h-auto py-2 px-4 whitespace-normal">
                  <Download className="mr-2 h-4 w-4 shrink-0" /> Download Package
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Atom</h3>
                <p className="text-sm text-muted-foreground mb-4">Syntax highlighting package for Atom editor.</p>
                <Button className="w-full h-auto py-2 px-4 whitespace-normal">
                  <Download className="mr-2 h-4 w-4 shrink-0" /> Download Package
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">JetBrains IDEs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Plugin for IntelliJ, WebStorm, and other JetBrains IDEs.
                </p>
                <Button className="w-full h-auto py-2 px-4 whitespace-normal">
                  <Download className="mr-2 h-4 w-4 shrink-0" /> Download Plugin
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">Manual Configuration</h3>
              <p>If your editor doesn't have a dedicated package, you can manually configure syntax highlighting:</p>

              <div>
                <h4 className="font-medium">Vim</h4>
                <DocsCodeBlock
                  code={`" Add to your .vimrc
au BufRead,BufNewFile *.forsure set filetype=yaml
au BufRead,BufNewFile *.fs set filetype=yaml`}
                  language="vim"
                  className="overflow-x-auto"
                />
              </div>

              <div>
                <h4 className="font-medium">Emacs</h4>
                <DocsCodeBlock
                  code={`;; Add to your .emacs or init.el
(add-to-list 'auto-mode-alist '("\\.forsure\\'" . yaml-mode))
(add-to-list 'auto-mode-alist '("\\.fs\\'" . yaml-mode))`}
                  language="lisp"
                  className="overflow-x-auto"
                />
              </div>

              <div>
                <h4 className="font-medium">TextMate/BBEdit</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Associate .forsure and .fs files with YAML syntax highlighting in your editor preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Now that you've installed the ForSure tools, you can:</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/docs/quick-start" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
            <div className="font-semibold">Quick Start Guide</div>
            <div className="text-sm text-muted-foreground">Create your first ForSure file</div>
          </Link>
          <Link href="/docs/examples" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
            <div className="font-semibold">Examples</div>
            <div className="text-sm text-muted-foreground">See ForSure in action with practical examples</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
