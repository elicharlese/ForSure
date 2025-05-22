"use client"

export interface FileAttachment {
  type: "file" | "image" | "link" | "project"
  name: string
  url?: string
  id?: string
  size?: number
  mimeType?: string
  data?: string // base64 encoded data for small files
  thumbnail?: string // base64 encoded thumbnail for images
}

export class FileService {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly MAX_THUMBNAIL_SIZE = 200 * 1024 // 200KB for thumbnails

  static async processFile(file: File): Promise<FileAttachment> {
    const attachment: FileAttachment = {
      type: this.getFileType(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      id: crypto.randomUUID(),
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`)
    }

    // For small files, store as base64
    if (file.size <= this.MAX_THUMBNAIL_SIZE) {
      attachment.data = await this.fileToBase64(file)
    } else {
      // For larger files, create a placeholder URL
      attachment.url = URL.createObjectURL(file)
    }

    // Generate thumbnail for images
    if (attachment.type === "image") {
      try {
        attachment.thumbnail = await this.generateImageThumbnail(file)
      } catch (error) {
        console.warn("Failed to generate thumbnail:", error)
      }
    }

    return attachment
  }

  static getFileType(file: File): "file" | "image" {
    if (file.type.startsWith("image/")) {
      return "image"
    }
    return "file"
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  static async generateImageThumbnail(file: File, maxWidth = 200, maxHeight = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      img.onload = () => {
        // Calculate thumbnail dimensions
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)

        try {
          const thumbnail = canvas.toDataURL("image/jpeg", 0.7)
          resolve(thumbnail)
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  static getFileIcon(mimeType?: string): string {
    if (!mimeType) return "📄"

    if (mimeType.startsWith("image/")) return "🖼️"
    if (mimeType.startsWith("video/")) return "🎥"
    if (mimeType.startsWith("audio/")) return "🎵"
    if (mimeType.includes("pdf")) return "📕"
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝"
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return "📊"
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📊"
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive")) return "🗜️"
    if (mimeType.includes("text")) return "📄"

    return "📎"
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  static isImageFile(mimeType?: string): boolean {
    return mimeType?.startsWith("image/") || false
  }

  static canPreview(mimeType?: string): boolean {
    if (!mimeType) return false

    return mimeType.startsWith("image/") || mimeType.startsWith("text/") || mimeType.includes("pdf")
  }
}
