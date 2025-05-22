import type { FileNode } from "../components/file-structure-visualization"

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  framework: string
  type: string
  complexity: "simple" | "standard" | "advanced"
  tags: string[]
  structure: FileNode
  thumbnail?: string
}

// Collection of predefined project templates
const predefinedTemplates: ProjectTemplate[] = [
  // Next.js Templates
  {
    id: "nextjs-basic",
    name: "Next.js Basic",
    description: "A simple Next.js project with App Router and basic components",
    framework: "nextjs",
    type: "web",
    complexity: "simple",
    tags: ["nextjs", "react", "typescript", "app-router"],
    structure: {
      name: "nextjs-project",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "next.config.js", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: "tailwind.config.js", type: "file" },
        { name: "postcss.config.js", type: "file" },
        {
          name: "app",
          type: "directory",
          children: [
            { name: "layout.tsx", type: "file" },
            { name: "page.tsx", type: "file" },
            { name: "globals.css", type: "file" },
            {
              name: "about",
              type: "directory",
              children: [{ name: "page.tsx", type: "file" }],
            },
            {
              name: "contact",
              type: "directory",
              children: [{ name: "page.tsx", type: "file" }],
            },
          ],
        },
        {
          name: "components",
          type: "directory",
          children: [
            { name: "header.tsx", type: "file" },
            { name: "footer.tsx", type: "file" },
            {
              name: "ui",
              type: "directory",
              children: [
                { name: "button.tsx", type: "file" },
                { name: "card.tsx", type: "file" },
              ],
            },
          ],
        },
        {
          name: "lib",
          type: "directory",
          children: [{ name: "utils.ts", type: "file" }],
        },
        {
          name: "public",
          type: "directory",
          children: [
            { name: "favicon.ico", type: "file" },
            {
              name: "images",
              type: "directory",
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    id: "nextjs-fullstack",
    name: "Next.js Full-Stack",
    description: "A comprehensive Next.js project with API routes, authentication, and database integration",
    framework: "nextjs",
    type: "web",
    complexity: "advanced",
    tags: ["nextjs", "react", "typescript", "full-stack", "api", "auth", "database"],
    structure: {
      name: "nextjs-fullstack",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "next.config.js", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: "tailwind.config.js", type: "file" },
        { name: "postcss.config.js", type: "file" },
        { name: ".env.local", type: "file" },
        { name: ".env.example", type: "file" },
        {
          name: "app",
          type: "directory",
          children: [
            { name: "layout.tsx", type: "file" },
            { name: "page.tsx", type: "file" },
            { name: "globals.css", type: "file" },
            {
              name: "api",
              type: "directory",
              children: [
                {
                  name: "auth",
                  type: "directory",
                  children: [
                    {
                      name: "login",
                      type: "directory",
                      children: [{ name: "route.ts", type: "file" }],
                    },
                    {
                      name: "register",
                      type: "directory",
                      children: [{ name: "route.ts", type: "file" }],
                    },
                    {
                      name: "logout",
                      type: "directory",
                      children: [{ name: "route.ts", type: "file" }],
                    },
                  ],
                },
                {
                  name: "users",
                  type: "directory",
                  children: [{ name: "route.ts", type: "file" }],
                },
                {
                  name: "products",
                  type: "directory",
                  children: [{ name: "route.ts", type: "file" }],
                },
              ],
            },
            {
              name: "dashboard",
              type: "directory",
              children: [
                { name: "layout.tsx", type: "file" },
                { name: "page.tsx", type: "file" },
                {
                  name: "settings",
                  type: "directory",
                  children: [{ name: "page.tsx", type: "file" }],
                },
                {
                  name: "profile",
                  type: "directory",
                  children: [{ name: "page.tsx", type: "file" }],
                },
              ],
            },
            {
              name: "auth",
              type: "directory",
              children: [
                {
                  name: "login",
                  type: "directory",
                  children: [{ name: "page.tsx", type: "file" }],
                },
                {
                  name: "register",
                  type: "directory",
                  children: [{ name: "page.tsx", type: "file" }],
                },
              ],
            },
          ],
        },
        {
          name: "components",
          type: "directory",
          children: [
            { name: "header.tsx", type: "file" },
            { name: "footer.tsx", type: "file" },
            { name: "auth-form.tsx", type: "file" },
            { name: "user-avatar.tsx", type: "file" },
            {
              name: "ui",
              type: "directory",
              children: [
                { name: "button.tsx", type: "file" },
                { name: "card.tsx", type: "file" },
                { name: "input.tsx", type: "file" },
                { name: "modal.tsx", type: "file" },
                { name: "dropdown.tsx", type: "file" },
              ],
            },
            {
              name: "dashboard",
              type: "directory",
              children: [
                { name: "sidebar.tsx", type: "file" },
                { name: "stats-card.tsx", type: "file" },
                { name: "recent-activity.tsx", type: "file" },
              ],
            },
          ],
        },
        {
          name: "lib",
          type: "directory",
          children: [
            { name: "utils.ts", type: "file" },
            { name: "auth.ts", type: "file" },
            { name: "db.ts", type: "file" },
            {
              name: "api",
              type: "directory",
              children: [{ name: "client.ts", type: "file" }],
            },
          ],
        },
        {
          name: "models",
          type: "directory",
          children: [
            { name: "user.ts", type: "file" },
            { name: "product.ts", type: "file" },
          ],
        },
        {
          name: "public",
          type: "directory",
          children: [
            { name: "favicon.ico", type: "file" },
            {
              name: "images",
              type: "directory",
              children: [
                { name: "logo.png", type: "file" },
                { name: "hero.jpg", type: "file" },
              ],
            },
          ],
        },
        {
          name: "types",
          type: "directory",
          children: [
            { name: "index.ts", type: "file" },
            { name: "user.ts", type: "file" },
            { name: "product.ts", type: "file" },
          ],
        },
      ],
    },
  },

  // React Templates
  {
    id: "react-vite-basic",
    name: "React Vite Basic",
    description: "A simple React project with Vite and basic components",
    framework: "react",
    type: "web",
    complexity: "simple",
    tags: ["react", "vite", "typescript"],
    structure: {
      name: "react-vite-project",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "vite.config.ts", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: "index.html", type: "file" },
        {
          name: "src",
          type: "directory",
          children: [
            { name: "main.tsx", type: "file" },
            { name: "App.tsx", type: "file" },
            { name: "index.css", type: "file" },
            {
              name: "components",
              type: "directory",
              children: [
                { name: "Header.tsx", type: "file" },
                { name: "Footer.tsx", type: "file" },
              ],
            },
            {
              name: "pages",
              type: "directory",
              children: [
                { name: "Home.tsx", type: "file" },
                { name: "About.tsx", type: "file" },
              ],
            },
            {
              name: "assets",
              type: "directory",
              children: [],
            },
          ],
        },
        {
          name: "public",
          type: "directory",
          children: [
            { name: "favicon.ico", type: "file" },
            { name: "robots.txt", type: "file" },
          ],
        },
      ],
    },
  },
  {
    id: "react-redux-typescript",
    name: "React Redux TypeScript",
    description: "A React project with Redux, TypeScript, and organized feature folders",
    framework: "react",
    type: "web",
    complexity: "advanced",
    tags: ["react", "redux", "typescript", "feature-folders"],
    structure: {
      name: "react-redux-typescript",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "vite.config.ts", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: "index.html", type: "file" },
        {
          name: "src",
          type: "directory",
          children: [
            { name: "main.tsx", type: "file" },
            { name: "App.tsx", type: "file" },
            { name: "index.css", type: "file" },
            { name: "vite-env.d.ts", type: "file" },
            {
              name: "components",
              type: "directory",
              children: [
                { name: "Header.tsx", type: "file" },
                { name: "Footer.tsx", type: "file" },
                { name: "Sidebar.tsx", type: "file" },
                { name: "Layout.tsx", type: "file" },
                {
                  name: "ui",
                  type: "directory",
                  children: [
                    { name: "Button.tsx", type: "file" },
                    { name: "Card.tsx", type: "file" },
                    { name: "Input.tsx", type: "file" },
                    { name: "Modal.tsx", type: "file" },
                  ],
                },
              ],
            },
            {
              name: "features",
              type: "directory",
              children: [
                {
                  name: "auth",
                  type: "directory",
                  children: [
                    { name: "authSlice.ts", type: "file" },
                    { name: "Login.tsx", type: "file" },
                    { name: "Register.tsx", type: "file" },
                    { name: "authApi.ts", type: "file" },
                    { name: "types.ts", type: "file" },
                  ],
                },
                {
                  name: "products",
                  type: "directory",
                  children: [
                    { name: "productsSlice.ts", type: "file" },
                    { name: "ProductList.tsx", type: "file" },
                    { name: "ProductDetail.tsx", type: "file" },
                    { name: "productsApi.ts", type: "file" },
                    { name: "types.ts", type: "file" },
                  ],
                },
                {
                  name: "cart",
                  type: "directory",
                  children: [
                    { name: "cartSlice.ts", type: "file" },
                    { name: "Cart.tsx", type: "file" },
                    { name: "CartItem.tsx", type: "file" },
                    { name: "types.ts", type: "file" },
                  ],
                },
              ],
            },
            {
              name: "pages",
              type: "directory",
              children: [
                { name: "Home.tsx", type: "file" },
                { name: "About.tsx", type: "file" },
                { name: "Profile.tsx", type: "file" },
                { name: "NotFound.tsx", type: "file" },
              ],
            },
            {
              name: "store",
              type: "directory",
              children: [
                { name: "index.ts", type: "file" },
                { name: "rootReducer.ts", type: "file" },
                { name: "middleware.ts", type: "file" },
              ],
            },
            {
              name: "utils",
              type: "directory",
              children: [
                { name: "api.ts", type: "file" },
                { name: "helpers.ts", type: "file" },
                { name: "storage.ts", type: "file" },
              ],
            },
            {
              name: "hooks",
              type: "directory",
              children: [
                { name: "useAuth.ts", type: "file" },
                { name: "useLocalStorage.ts", type: "file" },
                { name: "useWindowSize.ts", type: "file" },
              ],
            },
            {
              name: "assets",
              type: "directory",
              children: [
                {
                  name: "images",
                  type: "directory",
                  children: [],
                },
                {
                  name: "styles",
                  type: "directory",
                  children: [{ name: "variables.css", type: "file" }],
                },
              ],
            },
            {
              name: "types",
              type: "directory",
              children: [{ name: "index.ts", type: "file" }],
            },
          ],
        },
        {
          name: "public",
          type: "directory",
          children: [
            { name: "favicon.ico", type: "file" },
            { name: "robots.txt", type: "file" },
          ],
        },
      ],
    },
  },

  // Express API Templates
  {
    id: "express-api-basic",
    name: "Express API Basic",
    description: "A simple Express.js API with basic routes and controllers",
    framework: "express",
    type: "api",
    complexity: "simple",
    tags: ["express", "node", "api", "javascript"],
    structure: {
      name: "express-api",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: ".env", type: "file" },
        { name: ".env.example", type: "file" },
        {
          name: "src",
          type: "directory",
          children: [
            { name: "index.js", type: "file" },
            { name: "app.js", type: "file" },
            {
              name: "routes",
              type: "directory",
              children: [
                { name: "index.js", type: "file" },
                { name: "users.js", type: "file" },
              ],
            },
            {
              name: "controllers",
              type: "directory",
              children: [{ name: "userController.js", type: "file" }],
            },
            {
              name: "models",
              type: "directory",
              children: [{ name: "User.js", type: "file" }],
            },
            {
              name: "middleware",
              type: "directory",
              children: [{ name: "errorHandler.js", type: "file" }],
            },
            {
              name: "config",
              type: "directory",
              children: [{ name: "db.js", type: "file" }],
            },
          ],
        },
      ],
    },
  },
  {
    id: "express-typescript-mongodb",
    name: "Express TypeScript MongoDB",
    description: "A comprehensive Express.js API with TypeScript, MongoDB, authentication, and testing",
    framework: "express",
    type: "api",
    complexity: "advanced",
    tags: ["express", "typescript", "mongodb", "auth", "testing"],
    structure: {
      name: "express-typescript-mongodb",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: ".env", type: "file" },
        { name: ".env.example", type: "file" },
        { name: ".env.test", type: "file" },
        { name: "jest.config.js", type: "file" },
        {
          name: "src",
          type: "directory",
          children: [
            { name: "index.ts", type: "file" },
            { name: "app.ts", type: "file" },
            {
              name: "routes",
              type: "directory",
              children: [
                { name: "index.ts", type: "file" },
                { name: "auth.routes.ts", type: "file" },
                { name: "user.routes.ts", type: "file" },
                { name: "product.routes.ts", type: "file" },
              ],
            },
            {
              name: "controllers",
              type: "directory",
              children: [
                { name: "auth.controller.ts", type: "file" },
                { name: "user.controller.ts", type: "file" },
                { name: "product.controller.ts", type: "file" },
              ],
            },
            {
              name: "models",
              type: "directory",
              children: [
                { name: "user.model.ts", type: "file" },
                { name: "product.model.ts", type: "file" },
                { name: "token.model.ts", type: "file" },
              ],
            },
            {
              name: "middleware",
              type: "directory",
              children: [
                { name: "auth.middleware.ts", type: "file" },
                { name: "error.middleware.ts", type: "file" },
                { name: "validation.middleware.ts", type: "file" },
              ],
            },
            {
              name: "services",
              type: "directory",
              children: [
                { name: "auth.service.ts", type: "file" },
                { name: "user.service.ts", type: "file" },
                { name: "product.service.ts", type: "file" },
                { name: "email.service.ts", type: "file" },
              ],
            },
            {
              name: "config",
              type: "directory",
              children: [
                { name: "db.ts", type: "file" },
                { name: "env.ts", type: "file" },
                { name: "logger.ts", type: "file" },
              ],
            },
            {
              name: "utils",
              type: "directory",
              children: [
                { name: "jwt.ts", type: "file" },
                { name: "password.ts", type: "file" },
                { name: "validation.ts", type: "file" },
              ],
            },
            {
              name: "types",
              type: "directory",
              children: [
                { name: "index.ts", type: "file" },
                { name: "user.types.ts", type: "file" },
                { name: "product.types.ts", type: "file" },
                { name: "request.types.ts", type: "file" },
              ],
            },
          ],
        },
        {
          name: "tests",
          type: "directory",
          children: [
            {
              name: "unit",
              type: "directory",
              children: [
                { name: "auth.test.ts", type: "file" },
                { name: "user.test.ts", type: "file" },
              ],
            },
            {
              name: "integration",
              type: "directory",
              children: [
                { name: "auth.test.ts", type: "file" },
                { name: "user.test.ts", type: "file" },
              ],
            },
            { name: "setup.ts", type: "file" },
          ],
        },
      ],
    },
  },

  // Vue Templates
  {
    id: "vue-basic",
    name: "Vue Basic",
    description: "A simple Vue.js project with Vue Router and basic components",
    framework: "vue",
    type: "web",
    complexity: "simple",
    tags: ["vue", "javascript", "vue-router"],
    structure: {
      name: "vue-project",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "vite.config.js", type: "file" },
        { name: "index.html", type: "file" },
        {
          name: "src",
          type: "directory",
          children: [
            { name: "main.js", type: "file" },
            { name: "App.vue", type: "file" },
            { name: "router.js", type: "file" },
            {
              name: "components",
              type: "directory",
              children: [
                { name: "Header.vue", type: "file" },
                { name: "Footer.vue", type: "file" },
              ],
            },
            {
              name: "views",
              type: "directory",
              children: [
                { name: "Home.vue", type: "file" },
                { name: "About.vue", type: "file" },
              ],
            },
            {
              name: "assets",
              type: "directory",
              children: [
                {
                  name: "styles",
                  type: "directory",
                  children: [{ name: "main.css", type: "file" }],
                },
                {
                  name: "images",
                  type: "directory",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: "public",
          type: "directory",
          children: [
            { name: "favicon.ico", type: "file" },
            { name: "robots.txt", type: "file" },
          ],
        },
      ],
    },
  },

  // Mobile App Templates
  {
    id: "react-native-basic",
    name: "React Native Basic",
    description: "A simple React Native project with navigation and basic screens",
    framework: "react-native",
    type: "mobile",
    complexity: "standard",
    tags: ["react-native", "mobile", "typescript", "navigation"],
    structure: {
      name: "react-native-app",
      type: "directory",
      children: [
        { name: "README.md", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "package.json", type: "file" },
        { name: "app.json", type: "file" },
        { name: "babel.config.js", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: "App.tsx", type: "file" },
        {
          name: "src",
          type: "directory",
          children: [
            {
              name: "screens",
              type: "directory",
              children: [
                { name: "HomeScreen.tsx", type: "file" },
                { name: "ProfileScreen.tsx", type: "file" },
                { name: "SettingsScreen.tsx", type: "file" },
              ],
            },
            {
              name: "components",
              type: "directory",
              children: [
                { name: "Header.tsx", type: "file" },
                { name: "Button.tsx", type: "file" },
                { name: "Card.tsx", type: "file" },
              ],
            },
            {
              name: "navigation",
              type: "directory",
              children: [{ name: "index.tsx", type: "file" }],
            },
            {
              name: "hooks",
              type: "directory",
              children: [{ name: "useAuth.ts", type: "file" }],
            },
            {
              name: "utils",
              type: "directory",
              children: [{ name: "api.ts", type: "file" }],
            },
            {
              name: "assets",
              type: "directory",
              children: [
                {
                  name: "images",
                  type: "directory",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
]

// Local storage key for custom templates
const CUSTOM_TEMPLATES_KEY = "forsure_custom_templates"

// Load custom templates from local storage
const loadCustomTemplates = (): ProjectTemplate[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load custom templates:", error)
    return []
  }
}

// Save custom templates to local storage
const saveCustomTemplates = (templates: ProjectTemplate[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error("Failed to save custom templates:", error)
  }
}

// Get all templates (predefined + custom)
export const getAllTemplates = (): ProjectTemplate[] => {
  return [...predefinedTemplates, ...loadCustomTemplates()]
}

// Get templates filtered by framework and/or type
export const getFilteredTemplates = (framework?: string, type?: string): ProjectTemplate[] => {
  const allTemplates = getAllTemplates()

  return allTemplates.filter((template) => {
    const frameworkMatch = !framework || template.framework === framework
    const typeMatch = !type || template.type === type
    return frameworkMatch && typeMatch
  })
}

// Get a template by ID
export const getTemplateById = (id: string): ProjectTemplate | undefined => {
  return getAllTemplates().find((template) => template.id === id)
}

// Save a custom template
export const saveCustomTemplate = (template: Omit<ProjectTemplate, "id">): string => {
  const customTemplates = loadCustomTemplates()

  // Generate a unique ID
  const id = `custom-${Date.now()}`

  const newTemplate: ProjectTemplate = {
    ...template,
    id,
  }

  customTemplates.push(newTemplate)
  saveCustomTemplates(customTemplates)

  return id
}

// Delete a custom template
export const deleteCustomTemplate = (id: string): boolean => {
  // Only allow deleting custom templates
  if (!id.startsWith("custom-")) return false

  const customTemplates = loadCustomTemplates()
  const filteredTemplates = customTemplates.filter((template) => template.id !== id)

  if (filteredTemplates.length === customTemplates.length) {
    return false // Template not found
  }

  saveCustomTemplates(filteredTemplates)
  return true
}

// Apply a template to a project name
export const applyTemplate = (templateId: string, projectName: string): FileNode | null => {
  const template = getTemplateById(templateId)
  if (!template) return null

  // Clone the template structure
  const structure: FileNode = JSON.parse(JSON.stringify(template.structure))

  // Update the root name to match the project name
  structure.name = projectName

  return structure
}

// Create a template from the current file structure
export const createTemplateFromStructure = (
  structure: FileNode,
  name: string,
  description: string,
  framework: string,
  type: string,
  complexity: "simple" | "standard" | "advanced" = "standard",
  tags: string[] = [],
): string => {
  // Clone the structure
  const templateStructure: FileNode = JSON.parse(JSON.stringify(structure))

  const template: Omit<ProjectTemplate, "id"> = {
    name,
    description,
    framework,
    type,
    complexity,
    tags,
    structure: templateStructure,
  }

  return saveCustomTemplate(template)
}
