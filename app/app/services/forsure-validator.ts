export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface BatchValidationResult {
  fileName: string
  fileValidation: ValidationResult
  contentValidation: ValidationResult
  overallValid: boolean
}

export interface BatchValidationProgress {
  total: number
  completed: number
  current: string
  results: BatchValidationResult[]
}

export class ForSureValidator {
  // Maximum file size (5MB)
  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024

  // Valid file extensions
  static readonly VALID_EXTENSIONS = [".fs", ".forsure", ".txt"]

  // ForSure syntax patterns to validate
  static readonly REQUIRED_PATTERNS = [
    // Basic ForSure syntax patterns
    /^(component|page|layout|route|api|util|hook|context|service|model|type|interface|const|function):/im,
  ]

  // ForSure syntax that should trigger warnings but not errors
  static readonly WARNING_PATTERNS = [
    // Missing description
    /^(component|page|layout):[^{]*\{\s*\}/im,
  ]

  /**
   * Validates a file based on its name, size, and content
   */
  static validateFile(file: File, existingFiles: { name: string }[]): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    }

    // Check file extension
    const extension = this.getFileExtension(file.name).toLowerCase()
    if (!this.VALID_EXTENSIONS.includes(extension)) {
      result.errors.push(
        `Invalid file extension: ${extension}. Allowed extensions: ${this.VALID_EXTENSIONS.join(", ")}`,
      )
      result.isValid = false
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      result.errors.push(`File size exceeds the maximum allowed size of ${this.formatFileSize(this.MAX_FILE_SIZE)}`)
      result.isValid = false
    }

    // Check for duplicate file names
    if (existingFiles.some((existingFile) => existingFile.name === file.name)) {
      result.errors.push(`A file with the name "${file.name}" already exists`)
      result.isValid = false
    }

    return result
  }

  /**
   * Validates multiple files in batch with progress tracking
   */
  static async validateFilesBatch(
    files: FileList,
    existingFiles: { name: string }[],
    onProgress?: (progress: BatchValidationProgress) => void,
  ): Promise<BatchValidationResult[]> {
    const results: BatchValidationResult[] = []
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Update progress
      if (onProgress) {
        onProgress({
          total,
          completed: i,
          current: file.name,
          results: [...results],
        })
      }

      // Validate file properties
      const fileValidation = this.validateFile(file, existingFiles)

      let contentValidation: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
      }

      // Only validate content if file properties are valid
      if (fileValidation.isValid) {
        try {
          const content = await this.readFileAsText(file)
          contentValidation = this.validateContent(content)
        } catch (error) {
          contentValidation = {
            isValid: false,
            errors: [`Failed to read file: ${(error as Error).message}`],
            warnings: [],
          }
        }
      }

      const batchResult: BatchValidationResult = {
        fileName: file.name,
        fileValidation,
        contentValidation,
        overallValid: fileValidation.isValid && contentValidation.isValid,
      }

      results.push(batchResult)

      // Add a small delay to allow UI updates
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    // Final progress update
    if (onProgress) {
      onProgress({
        total,
        completed: total,
        current: "",
        results,
      })
    }

    return results
  }

  /**
   * Reads a file as text (promisified)
   */
  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(reader.error || new Error("Unknown error"))
      reader.readAsText(file)
    })
  }

  /**
   * Validates the content of a ForSure file
   */
  static validateContent(content: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    }

    // Check if content is empty
    if (!content.trim()) {
      result.errors.push("File content is empty")
      result.isValid = false
      return result
    }

    // Check for required patterns
    let hasRequiredPattern = false
    for (const pattern of this.REQUIRED_PATTERNS) {
      if (pattern.test(content)) {
        hasRequiredPattern = true
        break
      }
    }

    if (!hasRequiredPattern) {
      result.errors.push("File does not contain valid ForSure syntax")
      result.isValid = false
    }

    // Check for warning patterns
    for (const pattern of this.WARNING_PATTERNS) {
      if (pattern.test(content)) {
        result.warnings.push("Some components are missing descriptions")
      }
    }

    // Check for balanced braces
    const braceResult = this.checkBalancedBraces(content)
    if (!braceResult.isBalanced) {
      result.errors.push(`Unbalanced braces: ${braceResult.message}`)
      result.isValid = false
    }

    return result
  }

  /**
   * Checks if braces are balanced in the content
   */
  private static checkBalancedBraces(content: string): { isBalanced: boolean; message: string } {
    const stack: { char: string; line: number }[] = []
    const lines = content.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      for (let j = 0; j < line.length; j++) {
        const char = line[j]

        if (char === "{" || char === "[" || char === "(") {
          stack.push({ char, line: i + 1 })
        } else if (char === "}" || char === "]" || char === ")") {
          if (stack.length === 0) {
            return {
              isBalanced: false,
              message: `Unexpected closing '${char}' at line ${i + 1}`,
            }
          }

          const last = stack.pop()!
          const expected = last.char === "{" ? "}" : last.char === "[" ? "]" : ")"

          if (char !== expected) {
            return {
              isBalanced: false,
              message: `Expected '${expected}' but found '${char}' at line ${i + 1}`,
            }
          }
        }
      }
    }

    if (stack.length > 0) {
      const last = stack[stack.length - 1]
      return {
        isBalanced: false,
        message: `Unclosed '${last.char}' from line ${last.line}`,
      }
    }

    return { isBalanced: true, message: "" }
  }

  /**
   * Gets the file extension from a filename
   */
  private static getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".")
    return lastDotIndex !== -1 ? filename.slice(lastDotIndex) : ""
  }

  /**
   * Formats file size in bytes to a human-readable format
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  /**
   * Generates a summary of batch validation results
   */
  static getBatchValidationSummary(results: BatchValidationResult[]): {
    total: number
    valid: number
    invalid: number
    warnings: number
  } {
    return {
      total: results.length,
      valid: results.filter((r) => r.overallValid).length,
      invalid: results.filter((r) => !r.overallValid).length,
      warnings: results.filter((r) => r.fileValidation.warnings.length > 0 || r.contentValidation.warnings.length > 0)
        .length,
    }
  }
}
