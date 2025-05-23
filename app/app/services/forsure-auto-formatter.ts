export interface AutoFormatOptions {
  fixIndentation: boolean
  fixBraces: boolean
  fixQuotes: boolean
  fixSpacing: boolean
  fixLineEndings: boolean
  addMissingSemicolons: boolean
  removeTrailingSpaces: boolean
  normalizeKeywords: boolean
  sortImports: boolean
  formatComments: boolean
}

export const defaultAutoFormatOptions: AutoFormatOptions = {
  fixIndentation: true,
  fixBraces: true,
  fixQuotes: true,
  fixSpacing: true,
  fixLineEndings: true,
  addMissingSemicolons: true,
  removeTrailingSpaces: true,
  normalizeKeywords: true,
  sortImports: true,
  formatComments: true,
}

export interface AutoFormatResult {
  formatted: string
  changes: AutoFormatChange[]
  hasChanges: boolean
}

export interface AutoFormatChange {
  type: "fix" | "improvement" | "warning"
  line: number
  column?: number
  description: string
  before: string
  after: string
}

// Auto-format ForSure files
export function autoFormatForSure(content: string, options: Partial<AutoFormatOptions> = {}): AutoFormatResult {
  const mergedOptions = { ...defaultAutoFormatOptions, ...options }
  const changes: AutoFormatChange[] = []
  let formatted = content
  const lineNumber = 1

  // Track original lines for change reporting
  const originalLines = content.split("\n")

  // 1. Fix line endings
  if (mergedOptions.fixLineEndings) {
    const beforeLineEndings = formatted
    formatted = formatted.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    if (beforeLineEndings !== formatted) {
      changes.push({
        type: "fix",
        line: 1,
        description: "Normalized line endings to LF",
        before: "Mixed line endings",
        after: "LF line endings",
      })
    }
  }

  // 2. Remove trailing spaces
  if (mergedOptions.removeTrailingSpaces) {
    const lines = formatted.split("\n")
    const newLines = lines.map((line, index) => {
      const trimmed = line.replace(/\s+$/, "")
      if (trimmed !== line) {
        changes.push({
          type: "improvement",
          line: index + 1,
          description: "Removed trailing whitespace",
          before: line,
          after: trimmed,
        })
      }
      return trimmed
    })
    formatted = newLines.join("\n")
  }

  // 3. Fix indentation
  if (mergedOptions.fixIndentation) {
    formatted = fixIndentation(formatted, changes)
  }

  // 4. Fix braces and brackets
  if (mergedOptions.fixBraces) {
    formatted = fixBraces(formatted, changes)
  }

  // 5. Fix quotes
  if (mergedOptions.fixQuotes) {
    formatted = fixQuotes(formatted, changes)
  }

  // 6. Fix spacing
  if (mergedOptions.fixSpacing) {
    formatted = fixSpacing(formatted, changes)
  }

  // 7. Add missing semicolons
  if (mergedOptions.addMissingSemicolons) {
    formatted = addMissingSemicolons(formatted, changes)
  }

  // 8. Normalize keywords
  if (mergedOptions.normalizeKeywords) {
    formatted = normalizeKeywords(formatted, changes)
  }

  // 9. Sort imports
  if (mergedOptions.sortImports) {
    formatted = sortImports(formatted, changes)
  }

  // 10. Format comments
  if (mergedOptions.formatComments) {
    formatted = formatComments(formatted, changes)
  }

  return {
    formatted,
    changes,
    hasChanges: changes.length > 0,
  }
}

// Fix indentation issues
function fixIndentation(content: string, changes: AutoFormatChange[]): string {
  const lines = content.split("\n")
  const indentSize = 2
  let indentLevel = 0
  let inString = false
  let stringChar = ""

  const formattedLines = lines.map((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    // Track string state
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i]
      if ((char === '"' || char === "'" || char === "`") && (i === 0 || trimmed[i - 1] !== "\\")) {
        if (inString && char === stringChar) {
          inString = false
          stringChar = ""
        } else if (!inString) {
          inString = true
          stringChar = char
        }
      }
    }

    // Don't process indentation inside strings
    if (inString) return line

    // Calculate expected indent level
    let expectedIndent = indentLevel

    // Decrease indent for closing braces/brackets
    if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) {
      expectedIndent = Math.max(0, indentLevel - 1)
    }

    const expectedIndentString = " ".repeat(expectedIndent * indentSize)
    const formattedLine = expectedIndentString + trimmed

    // Update indent level for next line
    if (trimmed.endsWith("{") || trimmed.endsWith("[") || trimmed.endsWith("(")) {
      indentLevel++
    } else if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    // Record change if indentation was fixed
    if (formattedLine !== line && line.trim() === trimmed) {
      changes.push({
        type: "improvement",
        line: index + 1,
        description: "Fixed indentation",
        before: line,
        after: formattedLine,
      })
    }

    return formattedLine
  })

  return formattedLines.join("\n")
}

// Fix brace and bracket formatting
function fixBraces(content: string, changes: AutoFormatChange[]): string {
  let formatted = content

  // Fix spacing around braces
  const bracePatterns = [
    { pattern: /(\w)\s*{\s*/g, replacement: "$1 {\n", description: "Fixed opening brace spacing" },
    { pattern: /\s*}\s*/g, replacement: "\n}", description: "Fixed closing brace spacing" },
    { pattern: /(\w)\s*\[\s*/g, replacement: "$1[", description: "Fixed opening bracket spacing" },
    { pattern: /\s*\]\s*/g, replacement: "]", description: "Fixed closing bracket spacing" },
  ]

  bracePatterns.forEach(({ pattern, replacement, description }) => {
    const before = formatted
    formatted = formatted.replace(pattern, replacement)
    if (before !== formatted) {
      changes.push({
        type: "improvement",
        line: 1,
        description,
        before: "Inconsistent brace spacing",
        after: "Consistent brace spacing",
      })
    }
  })

  return formatted
}

// Fix quote consistency
function fixQuotes(content: string, changes: AutoFormatChange[]): string {
  const formatted = content
  const lines = formatted.split("\n")

  const fixedLines = lines.map((line, index) => {
    // Convert double quotes to single quotes (except in specific cases)
    const before = line
    const fixed = line.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'")

    if (fixed !== before) {
      changes.push({
        type: "improvement",
        line: index + 1,
        description: "Normalized quotes to single quotes",
        before,
        after: fixed,
      })
    }

    return fixed
  })

  return fixedLines.join("\n")
}

// Fix spacing issues
function fixSpacing(content: string, changes: AutoFormatChange[]): string {
  let formatted = content

  const spacingPatterns = [
    { pattern: /\s*,\s*/g, replacement: ", ", description: "Fixed comma spacing" },
    { pattern: /\s*:\s*/g, replacement: ": ", description: "Fixed colon spacing" },
    { pattern: /\s*;\s*/g, replacement: "; ", description: "Fixed semicolon spacing" },
    { pattern: /\s*=\s*/g, replacement: " = ", description: "Fixed assignment spacing" },
    { pattern: /\s*\+\s*/g, replacement: " + ", description: "Fixed operator spacing" },
    { pattern: /\s*-\s*/g, replacement: " - ", description: "Fixed operator spacing" },
    { pattern: /\s*\*\s*/g, replacement: " * ", description: "Fixed operator spacing" },
    { pattern: /\s*\/\s*/g, replacement: " / ", description: "Fixed operator spacing" },
  ]

  spacingPatterns.forEach(({ pattern, replacement, description }) => {
    const before = formatted
    formatted = formatted.replace(pattern, replacement)
    if (before !== formatted) {
      changes.push({
        type: "improvement",
        line: 1,
        description,
        before: "Inconsistent spacing",
        after: "Consistent spacing",
      })
    }
  })

  return formatted
}

// Add missing semicolons
function addMissingSemicolons(content: string, changes: AutoFormatChange[]): string {
  const lines = content.split("\n")

  const fixedLines = lines.map((line, index) => {
    const trimmed = line.trim()

    // Skip empty lines, comments, and lines that already end with semicolon
    if (
      !trimmed ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.endsWith(";") ||
      trimmed.endsWith("{") ||
      trimmed.endsWith("}") ||
      trimmed.endsWith("[") ||
      trimmed.endsWith("]") ||
      trimmed.endsWith(",")
    ) {
      return line
    }

    // Add semicolon to statements that need them
    if (
      trimmed.includes("=") ||
      trimmed.startsWith("let ") ||
      trimmed.startsWith("const ") ||
      trimmed.startsWith("var ") ||
      trimmed.includes("return ") ||
      trimmed.includes("import ")
    ) {
      const fixed = line + ";"
      changes.push({
        type: "fix",
        line: index + 1,
        description: "Added missing semicolon",
        before: line,
        after: fixed,
      })
      return fixed
    }

    return line
  })

  return fixedLines.join("\n")
}

// Normalize ForSure keywords
function normalizeKeywords(content: string, changes: AutoFormatChange[]): string {
  let formatted = content

  const keywordPatterns = [
    { pattern: /\bcomponent\b/gi, replacement: "component", description: "Normalized component keyword" },
    { pattern: /\bpage\b/gi, replacement: "page", description: "Normalized page keyword" },
    { pattern: /\blayout\b/gi, replacement: "layout", description: "Normalized layout keyword" },
    { pattern: /\bstyle\b/gi, replacement: "style", description: "Normalized style keyword" },
    { pattern: /\bscript\b/gi, replacement: "script", description: "Normalized script keyword" },
    { pattern: /\bimport\b/gi, replacement: "import", description: "Normalized import keyword" },
    { pattern: /\bexport\b/gi, replacement: "export", description: "Normalized export keyword" },
  ]

  keywordPatterns.forEach(({ pattern, replacement, description }) => {
    const before = formatted
    formatted = formatted.replace(pattern, replacement)
    if (before !== formatted) {
      changes.push({
        type: "improvement",
        line: 1,
        description,
        before: "Inconsistent keyword casing",
        after: "Consistent keyword casing",
      })
    }
  })

  return formatted
}

// Sort import statements
function sortImports(content: string, changes: AutoFormatChange[]): string {
  const lines = content.split("\n")
  const imports: string[] = []
  const nonImports: string[] = []
  let inImportSection = true

  lines.forEach((line, index) => {
    if (line.trim().startsWith("import ")) {
      imports.push(line)
    } else if (line.trim() === "" && inImportSection) {
      // Keep empty lines in import section
      imports.push(line)
    } else {
      if (inImportSection && line.trim() !== "") {
        inImportSection = false
      }
      nonImports.push(line)
    }
  })

  if (imports.length > 1) {
    const sortedImports = imports
      .filter((line) => line.trim().startsWith("import "))
      .sort((a, b) => {
        // Sort by import path
        const pathA = a.match(/from ['"]([^'"]+)['"]/)?.[1] || ""
        const pathB = b.match(/from ['"]([^'"]+)['"]/)?.[1] || ""
        return pathA.localeCompare(pathB)
      })

    const hasChanges = imports.some((line, index) => line.trim().startsWith("import ") && sortedImports[index] !== line)

    if (hasChanges) {
      changes.push({
        type: "improvement",
        line: 1,
        description: "Sorted import statements",
        before: "Unsorted imports",
        after: "Alphabetically sorted imports",
      })

      return [...sortedImports, "", ...nonImports].join("\n")
    }
  }

  return content
}

// Format comments
function formatComments(content: string, changes: AutoFormatChange[]): string {
  const lines = content.split("\n")

  const fixedLines = lines.map((line, index) => {
    const trimmed = line.trim()

    // Fix single-line comments
    if (trimmed.startsWith("//")) {
      const commentText = trimmed.substring(2).trim()
      const fixed = line.replace(trimmed, `// ${commentText}`)

      if (fixed !== line) {
        changes.push({
          type: "improvement",
          line: index + 1,
          description: "Fixed comment spacing",
          before: line,
          after: fixed,
        })
      }

      return fixed
    }

    return line
  })

  return fixedLines.join("\n")
}

// Auto-format multiple files
export async function autoFormatMultipleFiles(
  files: Array<{ name: string; content: string }>,
  options: Partial<AutoFormatOptions> = {},
  onProgress?: (current: number, total: number, fileName: string) => void,
): Promise<Array<{ name: string; result: AutoFormatResult }>> {
  const results: Array<{ name: string; result: AutoFormatResult }> = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (onProgress) {
      onProgress(i + 1, files.length, file.name)
    }

    // Add small delay to prevent UI blocking
    await new Promise((resolve) => setTimeout(resolve, 10))

    const result = autoFormatForSure(file.content, options)
    results.push({ name: file.name, result })
  }

  return results
}

// Generate auto-format report
export function generateAutoFormatReport(results: Array<{ name: string; result: AutoFormatResult }>): string {
  const timestamp = new Date().toISOString()
  let report = `ForSure Auto-Format Report\n`
  report += `Generated: ${timestamp}\n`
  report += `${"=".repeat(50)}\n\n`

  const totalFiles = results.length
  const filesWithChanges = results.filter((r) => r.result.hasChanges).length
  const totalChanges = results.reduce((sum, r) => sum + r.result.changes.length, 0)

  report += `Summary:\n`
  report += `- Total files processed: ${totalFiles}\n`
  report += `- Files with changes: ${filesWithChanges}\n`
  report += `- Total changes made: ${totalChanges}\n\n`

  results.forEach(({ name, result }) => {
    report += `File: ${name}\n`
    report += `${"─".repeat(30)}\n`

    if (result.hasChanges) {
      report += `Changes made: ${result.changes.length}\n\n`

      result.changes.forEach((change, index) => {
        report += `${index + 1}. ${change.description}\n`
        report += `   Line: ${change.line}\n`
        report += `   Type: ${change.type}\n`
        if (change.before.length < 100) {
          report += `   Before: ${change.before}\n`
          report += `   After: ${change.after}\n`
        }
        report += "\n"
      })
    } else {
      report += `No changes needed - file is already well-formatted\n\n`
    }
  })

  return report
}
