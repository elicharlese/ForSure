import type { FileNode } from "../components/file-structure-visualization"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  fileStructure?: FileNode
}
