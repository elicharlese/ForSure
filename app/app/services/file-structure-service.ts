import type { ProjectDetails, FileNode } from "@/app/types"

// Add a function to generate sample content based on file name and extension
export function generateSampleContent(fileName: string, projectName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""

  switch (extension) {
    case "js":
      if (fileName === "index.js") {
        return `// Entry point for ${projectName}\n\nconsole.log('Welcome to ${projectName}!');\n\n// Add your code here\n`
      } else if (fileName.includes("config")) {
        return `// Configuration for ${projectName}\n\nmodule.exports = {\n  appName: '${projectName}',\n  version: '1.0.0',\n  environment: process.env.NODE_ENV || 'development',\n  port: process.env.PORT || 3000\n};\n`
      } else if (fileName.includes("util")) {
        return `// Utility functions for ${projectName}\n\n/**\n * Format a date to a readable string\n * @param {Date} date - The date to format\n * @returns {string} Formatted date string\n */\nexport function formatDate(date) {\n  return new Date(date).toLocaleDateString();\n}\n\n/**\n * Generate a random ID\n * @returns {string} Random ID\n */\nexport function generateId() {\n  return Math.random().toString(36).substring(2, 9);\n}\n`
      }
      return `// ${fileName} for ${projectName}\n\n// Add your code here\n`

    case "jsx":
    case "tsx":
      if (fileName.includes("component")) {
        return `// ${fileName.split(".")[0]} component for ${projectName}\n\nimport React from 'react';\n\ninterface Props {\n  title?: string;\n}\n\nexport default function ${fileName.split(".")[0].charAt(0).toUpperCase() + fileName.split(".")[0].slice(1)}({ title = '${projectName}' }: Props) {\n  return (\n    <div className="container">\n      <h1>{title}</h1>\n      <p>Welcome to your new component!</p>\n    </div>\n  );\n}\n`
      } else if (fileName === "index.tsx" || fileName === "index.jsx") {
        return `// Entry point for ${projectName}\n\nimport React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\n\nReactDOM.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n  document.getElementById('root')\n);\n`
      } else if (fileName === "App.tsx" || fileName === "App.jsx") {
        return `// Main App component for ${projectName}\n\nimport React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>${projectName}</h1>\n        <p>\n          Edit <code>${fileName}</code> and save to reload.\n        </p>\n      </header>\n    </div>\n  );\n}\n\nexport default App;\n`
      }
      return `// ${fileName} for ${projectName}\n\nimport React from 'react';\n\nexport default function ${fileName.split(".")[0].charAt(0).toUpperCase() + fileName.split(".")[0].slice(1)}() {\n  return (\n    <div>\n      {/* Add your code here */}\n    </div>\n  );\n}\n`

    case "ts":
      if (fileName.includes("interface") || fileName.includes("type")) {
        return `// Type definitions for ${projectName}\n\nexport interface User {\n  id: string;\n  name: string;\n  email: string;\n  createdAt: Date;\n}\n\nexport interface AppConfig {\n  apiUrl: string;\n  theme: 'light' | 'dark';\n  features: string[];\n}\n`
      } else if (fileName.includes("service")) {
        return `// Service for ${projectName}\n\nimport { User } from './types';\n\nexport class UserService {\n  async getUsers(): Promise<User[]> {\n    // Implement API call here\n    return [];\n  }\n\n  async getUserById(id: string): Promise<User | null> {\n    // Implement API call here\n    return null;\n  }\n}\n`
      }
      return `// ${fileName} for ${projectName}\n\n// Add your TypeScript code here\n`

    case "html":
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${projectName}</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <header>\n    <h1>${projectName}</h1>\n  </header>\n  \n  <main>\n    <p>Welcome to ${projectName}!</p>\n  </main>\n\n  <footer>>\n    <p>&copy; ${new Date().getFullYear()} ${projectName}</p>\n  </footer>\n\n  <script src="script.js"></script>\n</body>\n</html>\n`

    case "css":
      return `/* Styles for ${projectName} */\n\n:root {\n  --primary-color: #3490dc;\n  --secondary-color: #ffed4a;\n  --dark-color: #2d3748;\n  --light-color: #f7fafc;\n}\n\nbody {\n  font-family: 'Arial', sans-serif;\n  line-height: 1.6;\n  color: var(--dark-color);\n  background-color: var(--light-color);\n  margin: 0;\n  padding: 0;\n}\n\nheader {\n  background-color: var(--primary-color);\n  color: white;\n  padding: 1rem;\n  text-align: center;\n}\n\nmain {\n  padding: 2rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\nfooter {\n  background-color: var(--dark-color);\n  color: white;\n  text-align: center;\n  padding: 1rem;\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n}\n`

    case "json":
      if (fileName === "package.json") {
        return `{\n  "name": "${projectName.toLowerCase().replace(/\\s+/g, "-")}",\n  "version": "1.0.0",\n  "description": "A project created with ForSure AI",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "dev": "nodemon index.js",\n    "test": "jest"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "MIT",\n  "dependencies": {},\n  "devDependencies": {}\n}\n`
      } else if (fileName === "tsconfig.json") {
        return `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "esModuleInterop": true,\n    "allowSyntheticDefaultImports": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noFallthroughCasesInSwitch": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx"\n  },\n  "include": ["src"]\n}\n`
      }
      return `{\n  "name": "${projectName}",\n  "version": "1.0.0",\n  "description": "Configuration for ${projectName}"\n}\n`

    case "md":
      return `# ${projectName}\n\n## Overview\n\nThis is the README for ${projectName}.\n\n## Getting Started\n\n### Prerequisites\n\n- Node.js (v14 or higher)\n- npm or yarn\n\n### Installation\n\n\`\`\`bash\nnpm install\n# or\nyarn install\n\`\`\`\n\n### Running the Application\n\n\`\`\`bash\nnpm start\n# or\nyarn start\n\`\`\`\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## License\n\nMIT\n`

    default:
      return `// Content for ${fileName} in ${projectName}\n`
  }
}

// Add the missing getFileStructureForPrompt function
export function getFileStructureForPrompt(prompt: string, details: ProjectDetails): FileNode | null {
  const lowerPrompt = prompt.toLowerCase()

  // Check if the prompt is asking for a file structure
  if (
    (lowerPrompt.includes("structure") ||
      lowerPrompt.includes("files") ||
      lowerPrompt.includes("folders") ||
      lowerPrompt.includes("organization") ||
      lowerPrompt.includes("layout") ||
      lowerPrompt.includes("architecture")) &&
    (lowerPrompt.includes("show") ||
      lowerPrompt.includes("create") ||
      lowerPrompt.includes("generate") ||
      lowerPrompt.includes("make") ||
      lowerPrompt.includes("build"))
  ) {
    // Generate a file structure based on the project details
    return generateFileStructure(details)
  }

  // Check for specific framework requests
  if (lowerPrompt.includes("react") && lowerPrompt.includes("structure")) {
    return generateReactStructure(details.name)
  }

  if (lowerPrompt.includes("nextjs") || lowerPrompt.includes("next.js")) {
    return generateNextJsStructure(details.name)
  }

  if (lowerPrompt.includes("node") || lowerPrompt.includes("express")) {
    return generateNodeStructure(details.name)
  }

  // No relevant structure request found
  return null
}

// Helper function to generate a React structure
function generateReactStructure(projectName: string): FileNode {
  return {
    name: "root",
    type: "directory",
    children: [
      {
        name: "public",
        type: "directory",
        children: [
          { name: "index.html", type: "file", content: generateSampleContent("index.html", projectName) },
          { name: "favicon.ico", type: "file" },
          { name: "robots.txt", type: "file" },
        ],
      },
      {
        name: "src",
        type: "directory",
        children: [
          { name: "index.js", type: "file", content: generateSampleContent("index.js", projectName) },
          { name: "App.js", type: "file", content: generateSampleContent("App.js", projectName) },
          {
            name: "components",
            type: "directory",
            children: [
              { name: "Header.js", type: "file", content: generateSampleContent("Header.js", projectName) },
              { name: "Footer.js", type: "file", content: generateSampleContent("Footer.js", projectName) },
            ],
          },
          {
            name: "pages",
            type: "directory",
            children: [
              { name: "Home.js", type: "file", content: generateSampleContent("Home.js", projectName) },
              { name: "About.js", type: "file", content: generateSampleContent("About.js", projectName) },
            ],
          },
          {
            name: "styles",
            type: "directory",
            children: [
              { name: "App.css", type: "file", content: generateSampleContent("App.css", projectName) },
              { name: "index.css", type: "file", content: generateSampleContent("index.css", projectName) },
            ],
          },
          {
            name: "utils",
            type: "directory",
            children: [
              { name: "api.js", type: "file", content: generateSampleContent("api.js", projectName) },
              { name: "helpers.js", type: "file", content: generateSampleContent("helpers.js", projectName) },
            ],
          },
        ],
      },
      { name: "package.json", type: "file", content: generateSampleContent("package.json", projectName) },
      { name: "README.md", type: "file", content: generateSampleContent("README.md", projectName) },
    ],
  }
}

// Helper function to generate a Next.js structure
function generateNextJsStructure(projectName: string): FileNode {
  return {
    name: "root",
    type: "directory",
    children: [
      {
        name: "app",
        type: "directory",
        children: [
          { name: "layout.tsx", type: "file", content: generateSampleContent("layout.tsx", projectName) },
          { name: "page.tsx", type: "file", content: generateSampleContent("page.tsx", projectName) },
          { name: "globals.css", type: "file", content: generateSampleContent("globals.css", projectName) },
          {
            name: "about",
            type: "directory",
            children: [{ name: "page.tsx", type: "file", content: generateSampleContent("page.tsx", projectName) }],
          },
          {
            name: "blog",
            type: "directory",
            children: [
              { name: "page.tsx", type: "file", content: generateSampleContent("page.tsx", projectName) },
              {
                name: "[slug]",
                type: "directory",
                children: [{ name: "page.tsx", type: "file", content: generateSampleContent("page.tsx", projectName) }],
              },
            ],
          },
        ],
      },
      {
        name: "components",
        type: "directory",
        children: [
          { name: "Header.tsx", type: "file", content: generateSampleContent("Header.tsx", projectName) },
          { name: "Footer.tsx", type: "file", content: generateSampleContent("Footer.tsx", projectName) },
          { name: "Button.tsx", type: "file", content: generateSampleContent("Button.tsx", projectName) },
        ],
      },
      {
        name: "lib",
        type: "directory",
        children: [
          { name: "utils.ts", type: "file", content: generateSampleContent("utils.ts", projectName) },
          { name: "api.ts", type: "file", content: generateSampleContent("api.ts", projectName) },
        ],
      },
      {
        name: "public",
        type: "directory",
        children: [
          { name: "favicon.ico", type: "file" },
          { name: "logo.svg", type: "file" },
        ],
      },
      { name: "next.config.js", type: "file", content: generateSampleContent("next.config.js", projectName) },
      { name: "package.json", type: "file", content: generateSampleContent("package.json", projectName) },
      { name: "tsconfig.json", type: "file", content: generateSampleContent("tsconfig.json", projectName) },
      { name: "README.md", type: "file", content: generateSampleContent("README.md", projectName) },
    ],
  }
}

// Helper function to generate a Node.js structure
function generateNodeStructure(projectName: string): FileNode {
  return {
    name: "root",
    type: "directory",
    children: [
      {
        name: "src",
        type: "directory",
        children: [
          { name: "index.js", type: "file", content: generateSampleContent("index.js", projectName) },
          {
            name: "routes",
            type: "directory",
            children: [
              { name: "index.js", type: "file", content: generateSampleContent("index.js", projectName) },
              { name: "users.js", type: "file", content: generateSampleContent("users.js", projectName) },
              { name: "auth.js", type: "file", content: generateSampleContent("auth.js", projectName) },
            ],
          },
          {
            name: "controllers",
            type: "directory",
            children: [
              {
                name: "userController.js",
                type: "file",
                content: generateSampleContent("userController.js", projectName),
              },
              {
                name: "authController.js",
                type: "file",
                content: generateSampleContent("authController.js", projectName),
              },
            ],
          },
          {
            name: "models",
            type: "directory",
            children: [{ name: "User.js", type: "file", content: generateSampleContent("User.js", projectName) }],
          },
          {
            name: "middleware",
            type: "directory",
            children: [
              { name: "auth.js", type: "file", content: generateSampleContent("auth.js", projectName) },
              { name: "error.js", type: "file", content: generateSampleContent("error.js", projectName) },
            ],
          },
          {
            name: "utils",
            type: "directory",
            children: [
              { name: "logger.js", type: "file", content: generateSampleContent("logger.js", projectName) },
              { name: "helpers.js", type: "file", content: generateSampleContent("helpers.js", projectName) },
            ],
          },
          {
            name: "config",
            type: "directory",
            children: [
              { name: "db.js", type: "file", content: generateSampleContent("db.js", projectName) },
              { name: "env.js", type: "file", content: generateSampleContent("env.js", projectName) },
            ],
          },
        ],
      },
      {
        name: "tests",
        type: "directory",
        children: [
          { name: "user.test.js", type: "file", content: generateSampleContent("user.test.js", projectName) },
          { name: "auth.test.js", type: "file", content: generateSampleContent("auth.test.js", projectName) },
        ],
      },
      { name: "package.json", type: "file", content: generateSampleContent("package.json", projectName) },
      { name: ".env.example", type: "file" },
      { name: "README.md", type: "file", content: generateSampleContent("README.md", projectName) },
    ],
  }
}

// Update the generateFileStructure function to include sample content for files
export function generateFileStructure(details: ProjectDetails): FileNode {
  // Choose the appropriate structure based on the project details
  if (details.framework.toLowerCase() === "react") {
    return generateReactStructure(details.name)
  } else if (details.framework.toLowerCase() === "nextjs" || details.framework.toLowerCase() === "next.js") {
    return generateNextJsStructure(details.name)
  } else if (details.framework.toLowerCase() === "node" || details.framework.toLowerCase() === "express") {
    return generateNodeStructure(details.name)
  }

  // Default to a basic structure if no specific framework is matched
  return {
    name: "root",
    type: "directory",
    children: [
      {
        name: "src",
        type: "directory",
        children: [
          { name: "index.js", type: "file", content: generateSampleContent("index.js", details.name) },
          {
            name: "components",
            type: "directory",
            children: [{ name: "App.js", type: "file", content: generateSampleContent("App.js", details.name) }],
          },
          {
            name: "styles",
            type: "directory",
            children: [{ name: "main.css", type: "file", content: generateSampleContent("main.css", details.name) }],
          },
        ],
      },
      { name: "package.json", type: "file", content: generateSampleContent("package.json", details.name) },
      { name: "README.md", type: "file", content: generateSampleContent("README.md", details.name) },
    ],
  }
}

// Update the applyTemplate function to include sample content for files
export function applyTemplate(templateId: string, projectName: string): FileNode | null {
  // Basic templates based on templateId
  switch (templateId) {
    case "react-basic":
      return generateReactStructure(projectName)
    case "nextjs-basic":
      return generateNextJsStructure(projectName)
    case "node-express":
      return generateNodeStructure(projectName)
    default:
      return null
  }
}
