// Define formatter types and options
export type FormatterOptions = {
  tabSize: number
  insertSpaces: boolean
  singleQuotes: boolean
  trailingComma: boolean
  semicolons: boolean
  bracketSpacing: boolean
  jsxBracketSameLine: boolean
  arrowParens: 'avoid' | 'always'
}

// Default formatter options
export const defaultFormatterOptions: FormatterOptions = {
  tabSize: 2,
  insertSpaces: true,
  singleQuotes: true,
  trailingComma: true,
  semicolons: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
}

// Format JavaScript/TypeScript code
export function formatJavaScript(
  code: string,
  options: Partial<FormatterOptions> = {}
): string {
  const mergedOptions = { ...defaultFormatterOptions, ...options }

  try {
    // This is a simplified formatter for demonstration
    // In a real implementation, you would use a library like prettier

    // Remove extra whitespace
    let formatted = code.trim()

    // Basic indentation for blocks
    formatted = formatBlocks(formatted, mergedOptions)

    // Format object literals
    formatted = formatObjects(formatted, mergedOptions)

    // Ensure consistent quotes
    formatted = formatQuotes(formatted, mergedOptions.singleQuotes)

    // Ensure semicolons
    if (mergedOptions.semicolons) {
      formatted = ensureSemicolons(formatted)
    } else {
      formatted = removeSemicolons(formatted)
    }

    return formatted
  } catch (error) {
    console.error('Error formatting JavaScript:', error)
    return code // Return original code if formatting fails
  }
}

// Format HTML code
export function formatHTML(
  code: string,
  options: Partial<FormatterOptions> = {}
): string {
  const mergedOptions = { ...defaultFormatterOptions, ...options }

  try {
    // This is a simplified formatter for demonstration
    // In a real implementation, you would use a library like prettier or js-beautify

    // Remove extra whitespace
    let formatted = code.trim()

    // Format tags
    formatted = formatTags(formatted, mergedOptions)

    return formatted
  } catch (error) {
    console.error('Error formatting HTML:', error)
    return code // Return original code if formatting fails
  }
}

// Format CSS code
export function formatCSS(
  code: string,
  options: Partial<FormatterOptions> = {}
): string {
  const mergedOptions = { ...defaultFormatterOptions, ...options }

  try {
    // This is a simplified formatter for demonstration
    // In a real implementation, you would use a library like prettier or js-beautify

    // Remove extra whitespace
    let formatted = code.trim()

    // Format CSS blocks
    formatted = formatCSSBlocks(formatted, mergedOptions)

    return formatted
  } catch (error) {
    console.error('Error formatting CSS:', error)
    return code // Return original code if formatting fails
  }
}

// Format JSON code
export function formatJSON(
  code: string,
  options: Partial<FormatterOptions> = {}
): string {
  const mergedOptions = { ...defaultFormatterOptions, ...options }

  try {
    // Parse and stringify JSON with proper indentation
    const parsed = JSON.parse(code)
    return JSON.stringify(parsed, null, mergedOptions.tabSize)
  } catch (error) {
    console.error('Error formatting JSON:', error)
    return code // Return original code if formatting fails
  }
}

// Format Markdown code
export function formatMarkdown(
  code: string,
  options: Partial<FormatterOptions> = {}
): string {
  // This is a simplified formatter for demonstration
  // In a real implementation, you would use a library like prettier

  try {
    // Normalize line endings
    let formatted = code.replace(/\r\n/g, '\n')

    // Ensure consistent headings (space after #)
    formatted = formatted.replace(/^(#{1,6})([^#\s])/gm, '$1 $2')

    // Ensure lists have proper spacing
    formatted = formatted.replace(/^(\s*[-*+])[^\s]/gm, '$1 ')

    // Normalize multiple blank lines to a maximum of two
    formatted = formatted.replace(/\n{3,}/g, '\n\n')

    return formatted
  } catch (error) {
    console.error('Error formatting Markdown:', error)
    return code // Return original code if formatting fails
  }
}

// Format code based on file extension
export function formatCode(
  code: string,
  fileName: string,
  options: Partial<FormatterOptions> = {}
): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return formatJavaScript(code, options)
    case 'html':
      return formatHTML(code, options)
    case 'css':
      return formatCSS(code, options)
    case 'json':
      return formatJSON(code, options)
    case 'md':
      return formatMarkdown(code, options)
    default:
      return code // Return original code for unsupported file types
  }
}

// Format all files in a file structure
export function formatAllFiles(
  fileStructure: any,
  options: FormatterOptions,
  fileTypes: string[],
  onProgress?: (formattedCount: number, totalFiles: number) => void
): { newStructure: any; formattedCount: number; totalFiles: number } {
  // Count total files to format
  const totalFiles = countFilesToFormat(fileStructure, fileTypes)
  let formattedCount = 0

  // Clone the structure to avoid modifying the original
  const newStructure = JSON.parse(JSON.stringify(fileStructure))

  // Format all files recursively
  formatFilesRecursive(newStructure, options, fileTypes, count => {
    formattedCount = count
    if (onProgress) {
      onProgress(formattedCount, totalFiles)
    }
  })

  return { newStructure, formattedCount, totalFiles }
}

// Count files to format
function countFilesToFormat(node: any, fileTypes: string[]): number {
  let count = 0

  if (node.type === 'file') {
    const extension = node.name.split('.').pop()?.toLowerCase()
    if (extension && fileTypes.includes(extension)) {
      count++
    }
  }

  if (node.children) {
    node.children.forEach((child: any) => {
      count += countFilesToFormat(child, fileTypes)
    })
  }

  return count
}

// Format files recursively
function formatFilesRecursive(
  node: any,
  options: FormatterOptions,
  fileTypes: string[],
  onProgress: (count: number) => void,
  count = 0
): number {
  if (node.type === 'file') {
    const extension = node.name.split('.').pop()?.toLowerCase()
    if (extension && fileTypes.includes(extension) && node.content) {
      node.content = formatCode(node.content, node.name, options)
      count++
      onProgress(count)
    }
  }

  if (node.children) {
    node.children.forEach((child: any) => {
      count = formatFilesRecursive(child, options, fileTypes, onProgress, count)
    })
  }

  return count
}

// Helper functions for formatting

// Format code blocks with proper indentation
function formatBlocks(code: string, options: FormatterOptions): string {
  const { tabSize, insertSpaces } = options
  const indent = insertSpaces ? ' '.repeat(tabSize) : '\t'

  let formatted = ''
  let indentLevel = 0
  let inString = false
  let stringChar = ''

  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    const nextChar = code[i + 1] || ''

    // Handle strings
    if (
      (char === "'" || char === '"' || char === '`') &&
      (i === 0 || code[i - 1] !== '\\')
    ) {
      if (inString && char === stringChar) {
        inString = false
        stringChar = ''
      } else if (!inString) {
        inString = true
        stringChar = char
      }
    }

    // Only process braces if not in a string
    if (!inString) {
      if (char === '{' || char === '[' || char === '(') {
        formatted += char
        if (nextChar !== '}' && nextChar !== ']' && nextChar !== ')') {
          indentLevel++
          formatted += '\n' + indent.repeat(indentLevel)
        }
        continue
      }

      if (char === '}' || char === ']' || char === ')') {
        if (code[i - 1] !== '{' && code[i - 1] !== '[' && code[i - 1] !== '(') {
          indentLevel = Math.max(0, indentLevel - 1)
          formatted += '\n' + indent.repeat(indentLevel)
        }
        formatted += char
        continue
      }

      if (char === ';') {
        formatted += char
        if (nextChar !== '}' && nextChar !== ']' && nextChar !== ')') {
          formatted += '\n' + indent.repeat(indentLevel)
        }
        continue
      }
    }

    formatted += char
  }

  return formatted
}

// Format object literals
function formatObjects(code: string, options: FormatterOptions): string {
  // This is a simplified implementation
  return code
}

// Format quotes consistently
function formatQuotes(code: string, useSingleQuotes: boolean): string {
  if (useSingleQuotes) {
    // Replace double quotes with single quotes, but not in strings that contain single quotes
    // This is a simplified implementation
    return code
  } else {
    // Replace single quotes with double quotes, but not in strings that contain double quotes
    // This is a simplified implementation
    return code
  }
}

// Ensure semicolons at the end of statements
function ensureSemicolons(code: string): string {
  // This is a simplified implementation
  return code
}

// Remove unnecessary semicolons
function removeSemicolons(code: string): string {
  // This is a simplified implementation
  return code
}

// Format HTML tags
function formatTags(code: string, options: FormatterOptions): string {
  // This is a simplified implementation
  return code
}

// Format CSS blocks
function formatCSSBlocks(code: string, options: FormatterOptions): string {
  // This is a simplified implementation
  return code
}
