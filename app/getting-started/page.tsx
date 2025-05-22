import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"
import CodeExample from "@/components/code-example"

export default function GettingStartedPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Getting Started with ForSure</h1>
          <p className="text-xl text-muted-foreground">
            Follow these simple steps to start using ForSure in your projects.
          </p>
        </div>

        <div className="space-y-8 mt-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Installation</h2>
            <p>Start by cloning the ForSure repository from GitHub:</p>
            <CodeExample
              code={`# Clone the repository
git clone https://github.com/elicharlese/ForSure.git
cd ForSure`}
              language="bash"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Create Your First ForSure File</h2>
            <p>Create a new file with a .forsure extension and define your project structure:</p>
            <CodeExample
              code={`# project.forsure
root:
  - src:
      - index.js
      - components:
          - header.js
          - footer.js
  - public:
      - index.html
      - styles.css
  - README.md`}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Review Sample Files</h2>
            <p>
              Review the sample .forsure files included in the repository to get a better understanding of the syntax.
            </p>
            <CodeExample
              code={`# You can use any text editor to write and edit your ForSure files
# Start by reviewing the samples in the repository to understand the structure`}
              language="bash"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Next Steps</h2>
            <p>Now that you've created your first ForSure file, you can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Explore the{" "}
                <Link href="/docs/syntax" className="text-primary hover:underline">
                  syntax documentation
                </Link>{" "}
                to learn more about ForSure
              </li>
              <li>
                Check out{" "}
                <Link href="/docs/examples" className="text-primary hover:underline">
                  examples
                </Link>{" "}
                to see ForSure in action
              </li>
              <li>
                Learn about the{" "}
                <Link href="/docs/cli" className="text-primary hover:underline">
                  CLI commands
                </Link>{" "}
                to generate file structures
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button asChild>
              <Link href="/docs" className="flex items-center">
                View Documentation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="https://github.com/elicharlese/ForSure"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="mr-2 h-4 w-4" /> GitHub Repository
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
