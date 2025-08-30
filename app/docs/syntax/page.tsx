import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function SyntaxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Basic Syntax</h1>
        <p className="text-lg text-muted-foreground">
          Learn the fundamental syntax of the ForSure language.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          File Structure
        </h2>
        <p>
          ForSure files use a hierarchical structure to represent directories
          and files. The basic syntax follows these rules:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Each ForSure file starts with a root declaration</li>
          <li>Indentation is used to indicate nesting levels</li>
          <li>Directories and files are prefixed with a hyphen (-)</li>
          <li>Attributes are specified in curly braces {`{}`}</li>
        </ul>

        <DocsCodeBlock
          code={`root:
  - directory_name:
      - file_name.ext { attribute: "value" }`}
          showLineNumbers={true}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Root Declaration
        </h2>
        <p>
          Every ForSure file must start with a root declaration, which
          represents the top-level directory:
        </p>
        <DocsCodeBlock
          code={`root:
  # Contents go here`}
        />
        <p>The root declaration can also include attributes:</p>
        <DocsCodeBlock
          code={`root { name: "my-project", version: "1.0.0" }:
  # Contents go here`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Directories and Files
        </h2>
        <p>
          Directories and files are defined using a hyphen (-) followed by the
          name:
        </p>
        <DocsCodeBlock
          code={`root:
  - src:              # This is a directory
      - index.js      # This is a file
      - components:   # This is a nested directory
          - header.js # This is a file inside a nested directory`}
          showLineNumbers={true}
        />
        <p>
          The presence of a colon (:) after the name indicates that it's a
          directory. Without a colon, it's treated as a file.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Comments</h2>
        <p>ForSure supports comments using the hash symbol (#):</p>
        <DocsCodeBlock
          code={`root:
  # This is a comment
  - src:
      # This is another comment
      - index.js  # Inline comment`}
        />
        <p>
          Comments are useful for documenting the purpose of files and
          directories or providing additional context.
        </p>
        <Link
          href="/docs/syntax/comments"
          className="text-primary hover:underline"
        >
          Learn more about comments →
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Attributes</h2>
        <p>
          Attributes provide additional information about files and directories.
          They are specified in curly braces {`{}`}:
        </p>
        <DocsCodeBlock
          code={`root:
  - src:
      - index.js { entry: true, permissions: "644" }
      - config.json { env: "production" }`}
        />
        <p>
          Attributes can be strings, booleans, numbers, or even nested objects.
        </p>
        <Link
          href="/docs/syntax/attributes"
          className="text-primary hover:underline"
        >
          Learn more about attributes →
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Import Directives
        </h2>
        <p>
          ForSure allows you to import other ForSure files using the @import
          directive:
        </p>
        <DocsCodeBlock
          code={`root:
  - src:
      @import 'common-files.fs'
      - index.js`}
        />
        <p>
          This is useful for reusing common file structures across projects.
        </p>
        <Link
          href="/docs/syntax/import-directives"
          className="text-primary hover:underline"
        >
          Learn more about import directives →
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Complete Example
        </h2>
        <p>Here's a complete example that demonstrates the basic syntax:</p>
        <DocsCodeBlock
          code={`root { name: "my-project", version: "1.0.0" }:
  # Source code directory
  - src:
      @import 'common-components.fs'
      - index.js { entry: true, permissions: "644" }
      - utils:
          # Utility functions
          - helpers.js
          - date.js { timezone: "UTC" }
  
  # Assets directory
  - assets:
      - images:
          - logo.png
          - banner.jpg
      - styles:
          - main.css { minify: true }
  
  # Configuration files
  - config.json { env: "production" }
  - .gitignore
  
  # Documentation
  - README.md`}
          fileName="complete-example.forsure"
          showLineNumbers={true}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Now that you understand the basic syntax, you can:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link
              href="/docs/syntax/file-structure"
              className="text-primary hover:underline"
            >
              Learn more about file structure
            </Link>
          </li>
          <li>
            <Link
              href="/docs/syntax/attributes"
              className="text-primary hover:underline"
            >
              Explore advanced attributes
            </Link>
          </li>
          <li>
            <Link
              href="/docs/examples"
              className="text-primary hover:underline"
            >
              See more examples
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
