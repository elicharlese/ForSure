import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, Code, Github, ArrowRight } from 'lucide-react'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function ExtensionsPage() {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            ForSure IDE Extensions
          </h1>
          <p className="text-xl text-muted-foreground">
            Enhance your development experience with ForSure extensions for your
            favorite code editors.
          </p>
        </div>

        {/* VS Code Extension */}
        <section className="space-y-4 border rounded-lg p-6 bg-card">
          <AnimateOnScroll type="slideUp">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                <Code className="h-8 w-8" />
              </div>
              <div className="w-full">
                <h2 className="text-2xl font-semibold tracking-tight">
                  ForSure for VS Code
                </h2>
                <p className="text-muted-foreground mb-4">
                  Official Visual Studio Code extension with syntax
                  highlighting, snippets, and validation.
                </p>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mb-6">
                  <div className="border rounded-md p-4 flex flex-col">
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground mb-4 flex-grow">
                      <li>Syntax highlighting for .forsure files</li>
                      <li>Code snippets for common patterns</li>
                      <li>Real-time validation and error checking</li>
                      <li>Preview file structure in VS Code</li>
                      <li>Integration with ForSure CLI</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Button asChild className="w-full sm:w-auto">
                        <a
                          href="https://marketplace.visualstudio.com/items?itemName=forsure.forsure-vscode"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" /> Install from
                          Marketplace
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <a
                          href="https://github.com/elicharlese/ForSure-vscode"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Github className="mr-2 h-4 w-4" /> View Source
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Installation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Install directly from VS Code:
                    </p>
                    <ol className="text-sm space-y-2 list-decimal pl-5 text-muted-foreground">
                      <li>Open VS Code</li>
                      <li>Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)</li>
                      <li>Search for "ForSure"</li>
                      <li>Click "Install"</li>
                    </ol>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">
                        Or install from VSIX file:
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <a href="/downloads/forsure-vscode-0.1.0.vsix" download>
                          <Download className="mr-2 h-4 w-4" /> Download VSIX
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-secondary-dark p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-white/70 font-mono flex-1 text-center truncate">
                      project.forsure - Visual Studio Code
                    </div>
                  </div>
                  <div className="bg-secondary p-4">
                    <pre className="text-xs text-white font-mono overflow-x-auto">
                      <code>{`root:
# Main source code directory
- src:
    - index.js { entry: true }
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
- README.md`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* JetBrains Extension */}
        <section className="space-y-4 border rounded-lg p-6 bg-card">
          <AnimateOnScroll type="slideUp" delay={0.1}>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
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
                  className="h-8 w-8"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M12 9h4" />
                  <path d="M12 15h4" />
                  <path d="M8 12h8" />
                  <path d="M8 18h8" />
                  <path d="M8 6h8" />
                </svg>
              </div>
              <div className="w-full">
                <h2 className="text-2xl font-semibold tracking-tight">
                  ForSure for JetBrains IDEs
                </h2>
                <p className="text-muted-foreground mb-4">
                  Plugin for IntelliJ IDEA, WebStorm, PyCharm, and other
                  JetBrains IDEs.
                </p>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mb-6">
                  <div className="border rounded-md p-4 flex flex-col">
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground mb-4 flex-grow">
                      <li>Syntax highlighting for .forsure files</li>
                      <li>Code completion and navigation</li>
                      <li>Structure view for ForSure files</li>
                      <li>Integration with ForSure CLI</li>
                      <li>Project structure visualization</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Button asChild className="w-full sm:w-auto">
                        <a
                          href="https://plugins.jetbrains.com/plugin/12345-forsure"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" /> Install from
                          Marketplace
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <a
                          href="https://github.com/elicharlese/ForSure-jetbrains"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Github className="mr-2 h-4 w-4" /> View Source
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Installation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Install from JetBrains Marketplace:
                    </p>
                    <ol className="text-sm space-y-2 list-decimal pl-5 text-muted-foreground">
                      <li>Open your JetBrains IDE</li>
                      <li>Go to Settings/Preferences</li>
                      <li>Select Plugins</li>
                      <li>Click "Marketplace" and search for "ForSure"</li>
                      <li>Click "Install" and restart the IDE</li>
                    </ol>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">
                        Or install from disk:
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <a
                          href="/downloads/forsure-jetbrains-0.1.0.zip"
                          download
                        >
                          <Download className="mr-2 h-4 w-4" /> Download Plugin
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-secondary-dark p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-white/70 font-mono flex-1 text-center truncate">
                      project.forsure - IntelliJ IDEA
                    </div>
                  </div>
                  <div className="bg-secondary p-4">
                    <div className="flex">
                      <div className="w-48 bg-secondary-dark/90 p-2 text-white/80 text-xs">
                        <div className="mb-2 font-semibold">PROJECT</div>
                        <div className="pl-2">
                          <div className="mb-1">📁 src</div>
                          <div className="pl-2 mb-1">📄 index.js</div>
                          <div className="pl-2 mb-1">📁 utils</div>
                          <div className="mb-1">📁 assets</div>
                          <div className="mb-1">📄 project.forsure</div>
                          <div className="mb-1">📄 README.md</div>
                        </div>
                      </div>
                      <div className="flex-1 bg-secondary-dark/50 p-2 text-white/90 text-xs font-mono">
                        <div className="mb-2 font-semibold">STRUCTURE</div>
                        <div className="pl-2">
                          <div className="mb-1">📁 root</div>
                          <div className="pl-4 mb-1">📁 src</div>
                          <div className="pl-6 mb-1">📄 index.js</div>
                          <div className="pl-6 mb-1">📁 utils</div>
                          <div className="pl-8 mb-1">📄 helpers.js</div>
                          <div className="pl-8 mb-1">📄 date.js</div>
                          <div className="pl-4 mb-1">📁 assets</div>
                          <div className="pl-6 mb-1">📄 logo.svg</div>
                          <div className="pl-6 mb-1">📁 css</div>
                          <div className="pl-8 mb-1">📄 theme.css</div>
                          <div className="pl-4 mb-1">📄 README.md</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Other Extensions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Other Editors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimateOnScroll type="slideUp" delay={0.2}>
              <div className="border rounded-lg p-6 bg-card">
                <div className="p-2 rounded-full bg-primary/10 text-primary w-fit mb-4">
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
                    className="h-6 w-6"
                  >
                    <path d="M18 3v4c0 2-2 4-4 4H2" />
                    <path d="M18 3a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                    <path d="M6 21v-4c0-2 2-4 4-4h12" />
                    <path d="M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Sublime Text</h3>
                <p className="text-muted-foreground mb-4">
                  Syntax highlighting and snippets for Sublime Text editor.
                </p>
                <Button asChild className="w-full">
                  <a href="/downloads/forsure-sublime-0.1.0.zip" download>
                    <Download className="mr-2 h-4 w-4" /> Download Package
                  </a>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp" delay={0.3}>
              <div className="border rounded-lg p-6 bg-card">
                <div className="p-2 rounded-full bg-primary/10 text-primary w-fit mb-4">
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
                    className="h-6 w-6"
                  >
                    <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z" />
                    <path d="M6 8v4" />
                    <path d="M10 7v5" />
                    <path d="M14 7v5" />
                    <path d="M18 8v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Vim/Neovim</h3>
                <p className="text-muted-foreground mb-4">
                  Syntax highlighting and integration for Vim and Neovim.
                </p>
                <Button asChild className="w-full">
                  <a href="/downloads/forsure-vim-0.1.0.zip" download>
                    <Download className="mr-2 h-4 w-4" /> Download Plugin
                  </a>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp" delay={0.4}>
              <div className="border rounded-lg p-6 bg-card">
                <div className="p-2 rounded-full bg-primary/10 text-primary w-fit mb-4">
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
                    className="h-6 w-6"
                  >
                    <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                    <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                    <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Emacs</h3>
                <p className="text-muted-foreground mb-4">
                  Major mode for editing ForSure files in Emacs.
                </p>
                <Button asChild className="w-full">
                  <a href="/downloads/forsure-emacs-0.1.0.el" download>
                    <Download className="mr-2 h-4 w-4" /> Download Mode
                  </a>
                </Button>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Manual Configuration */}
        <AnimateOnScroll type="fade">
          <section className="space-y-4 border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold tracking-tight">
              Manual Configuration
            </h2>
            <p className="text-muted-foreground mb-4">
              If your editor doesn't have a dedicated package, you can manually
              configure syntax highlighting:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Vim</h3>
                <pre className="bg-secondary-dark p-4 rounded-md text-white text-sm font-mono overflow-x-auto">
                  <code>{`" Add to your .vimrc
au BufRead,BufNewFile *.forsure set filetype=yaml
au BufRead,BufNewFile *.fs set filetype=yaml`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Emacs</h3>
                <pre className="bg-secondary-dark p-4 rounded-md text-white text-sm font-mono overflow-x-auto">
                  <code>{`;; Add to your .emacs or init.el
(add-to-list 'auto-mode-alist '("\\.forsure\\'" . yaml-mode))
(add-to-list 'auto-mode-alist '("\\.fs\\'" . yaml-mode))`}</code>
                </pre>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">TextMate/BBEdit</h3>
              <p className="text-muted-foreground">
                Associate .forsure and .fs files with YAML syntax highlighting
                in your editor preferences.
              </p>
            </div>
          </section>
        </AnimateOnScroll>

        {/* Contributing */}
        <AnimateOnScroll type="slideUp">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">Want to Contribute?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We welcome contributions to our editor extensions. If you'd like
              to improve an existing extension or create one for your favorite
              editor, check out our GitHub repositories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild>
                <a
                  href="https://github.com/elicharlese/ForSure/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" /> Contribution Guidelines
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact" className="flex items-center">
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
