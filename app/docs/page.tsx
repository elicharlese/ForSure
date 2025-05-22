import Link from "next/link"
import DocsCodeBlock from "@/components/docs-code-block"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">ForSure Documentation</h1>
        <p className="text-lg text-muted-foreground">
          A language for describing and documenting file structures in a clear and concise manner.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
        <p>
          ForSure is a language designed to simplify projects by using a flat-file-like structured
          language/compiler/cli/converter system. It allows you to describe and document file structures in a clear and
          concise manner, similar to how you would write a Dockerfile for a container.
        </p>
        <p>
          ForSure uses a simple, human-readable syntax to represent directories, files, and their relationships, making
          it easy to understand and maintain project structures.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Hierarchical Structure:</strong> Mimics the natural file system's hierarchy for intuitive
            organization.
          </li>
          <li>
            <strong>Comments and Annotations:</strong> Offers inline commenting and metadata association for better
            documentation.
          </li>
          <li>
            <strong>@import Directives:</strong> Facilitates file inclusion for reusable structures across projects.
          </li>
          <li>
            <strong>Custom Attributes:</strong> Extends elements with user-defined attributes like permissions and
            sizes.
          </li>
          <li>
            <strong>Readable and Simple:</strong> A clean syntax prioritizing user understanding and ease of use.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Example</h2>
        <p>Here's a basic example of what a .forsure file looks like:</p>
        <DocsCodeBlock
          code={`root:
  # Main source code directory
  - src:
      - main.js { entry: true }
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
  - README.md`}
          fileName="basic-example.forsure"
          showLineNumbers={true}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Getting Started</h2>
        <p>To start using ForSure, follow these steps:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <Link href="/docs/installation" className="text-primary hover:underline">
              Install ForSure
            </Link>{" "}
            by cloning the repository
          </li>
          <li>
            <Link href="/docs/quick-start" className="text-primary hover:underline">
              Create your first ForSure file
            </Link>{" "}
            using any text editor
          </li>
          <li>Review the sample .forsure files included in the repository</li>
          <li>
            <Link href="/docs/syntax" className="text-primary hover:underline">
              Learn the syntax
            </Link>{" "}
            to create more complex file structures
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Explore the documentation to learn more about ForSure:</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li>
            <Link href="/docs/syntax" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
              <div className="font-semibold">Syntax Reference</div>
              <div className="text-sm text-muted-foreground">Learn the ForSure syntax in detail</div>
            </Link>
          </li>
          <li>
            <Link href="/docs/examples" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
              <div className="font-semibold">Examples</div>
              <div className="text-sm text-muted-foreground">See ForSure in action with practical examples</div>
            </Link>
          </li>
          <li>
            <Link href="/docs/cli" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
              <div className="font-semibold">CLI Reference</div>
              <div className="text-sm text-muted-foreground">Learn how to use the ForSure command-line interface</div>
            </Link>
          </li>
          <li>
            <Link href="/docs/api" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
              <div className="font-semibold">API Reference</div>
              <div className="text-sm text-muted-foreground">Use ForSure programmatically in your projects</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
