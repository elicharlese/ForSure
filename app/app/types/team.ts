export type TeamRole = "owner" | "admin" | "member"

export interface TeamMember {
  userId: string
  name: string
  email: string
  role: TeamRole
  joinedAt: string
  avatar?: string
  lastActive?: string
  status?: "online" | "offline" | "away" | "busy"
}

export interface TeamChat {
  messages: TeamChatMessage[]
  lastReadTimestamp?: { [userId: string]: string }
}

export interface Team {
  id: string
  name: string
  createdAt: string
  members: TeamMember[]
  projects: string[] // Project IDs
  chat?: TeamChat
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
    type: "file" | "image" | "link" | "project"
    name: string
    url?: string
    id?: string
  }[]
  reactions?: {
    emoji: string
    count: number
    users: string[] // user IDs
  }[]
  isRead?: { [userId: string]: boolean }
}
