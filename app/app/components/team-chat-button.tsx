"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { TeamChatDialog } from "./team-chat-dialog"
import { useTeamChat } from "../hooks/use-team-chat"
import type { Team } from "../types/team"

interface TeamChatButtonProps {
  team: Team | null
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function TeamChatButton({ team, variant = "outline", size = "sm" }: TeamChatButtonProps) {
  const { unreadCount } = useTeamChat(team?.id || null)

  return (
    <TeamChatDialog
      team={team}
      trigger={
        <Button variant={variant} size={size} className="relative">
          <MessageSquare className="h-4 w-4 mr-2" />
          Team Chat
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      }
    />
  )
}
