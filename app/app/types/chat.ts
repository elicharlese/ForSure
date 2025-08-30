import type { FileNode } from '../components/file-structure-visualization'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  fileStructure?: FileNode
}

export type TeamChatMessage = {
  id: string
  teamId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  attachments?: {
    type: 'file' | 'image' | 'link' | 'project'
    name: string
    url?: string
    id?: string
    size?: number
    mimeType?: string
    data?: string // base64 encoded data for small files
    thumbnail?: string // base64 encoded thumbnail for images
  }[]
  reactions?: {
    emoji: string
    count: number
    users: string[] // user IDs
  }[]
  isRead?: { [userId: string]: boolean }
}
