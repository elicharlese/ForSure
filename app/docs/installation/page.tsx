import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function InstallationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Installation</h1>
        <p className="text-lg text-muted-foreground">
          How to install and set up ForSure on your system.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Prerequisites</h2>
        <p>
          Before installing ForSure, ensure you have the following
          prerequisites:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Git</li>
          <li>Node.js (recommended for some features)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Installation Steps
        </h2>

        <h3 className="text-xl font-medium">1. Clone the Repository</h3>
        <p>Start by cloning the ForSure repository from GitHub:</p>
        <DocsCodeBlock
          code={`git clone https://github.com/elicharlese/ForSure.git
cd ForSure`}
          language="bash"
        />

        <h3 className="text-xl font-medium">2. Explore the Repository</h3>
        <p>
          The repository contains sample .forsure files that you can review to
          understand the syntax and structure:
        </p>
        <DocsCodeBlock
          code={`ls -la
# Review the sample files and documentation`}
          language="bash"
        />

        <h3 className="text-xl font-medium">
          3. Optional: Set up for Development
        </h3>
        <p>
          If you want to contribute to ForSure or use its advanced features, you
          might need to install dependencies:
        </p>
        <DocsCodeBlock
          code={`# If there's a package.json file
npm install

# Or if you're using yarn
yarn install`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Verifying Installation
        </h2>
        <p>
          To verify that ForSure is properly installed, you can try creating a
          simple .forsure file and processing it:
        </p>
        <DocsCodeBlock
          code={`# Create a test file
echo "root:\n  - test.txt" > test.forsure

# Process the file (command may vary based on implementation)
./forsure generate test.forsure --output ./test-output`}
          language="bash"
        />
        <p>
          If the installation is successful, this should create a test.txt file
          in the test-output directory.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Now that you have ForSure installed, you can:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link
              href="/docs/quick-start"
              className="text-primary hover:underline"
            >
              Follow the Quick Start guide
            </Link>{' '}
            to create your first ForSure file
          </li>
          <li>
            <Link href="/docs/syntax" className="text-primary hover:underline">
              Learn the ForSure syntax
            </Link>{' '}
            in detail
          </li>
          <li>
            <Link
              href="/docs/examples"
              className="text-primary hover:underline"
            >
              Explore examples
            </Link>{' '}
            to see ForSure in action
          </li>
        </ul>
      </div>
    </div>
  )
}
