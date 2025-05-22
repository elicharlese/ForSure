"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTeams } from "./use-teams"
import type { TeamChatMessage } from "../types/team"

export function useTeamChat(teamId: string | null) {
  const [messages, setMessages] = useState<TeamChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const { getTeam, updateTeam } = useTeams()

  // Load messages from localStorage
  const loadMessages = useCallback(() => {
    if (!teamId || !user) {
      setMessages([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const team = getTeam(teamId)

      if (!team) {
        setError("Team not found")
        setIsLoading(false)
        return
      }

      // Initialize chat if it doesn't exist
      if (!team.chat) {
        updateTeam(teamId, { chat: { messages: [] } })
        setMessages([])
        setUnreadCount(0)
      } else {
        setMessages(team.chat.messages || [])

        // Calculate unread messages
        const lastRead = team.chat.lastReadTimestamp?.[user.id] || "0"
        const unread =
          team.chat.messages?.filter((msg) => msg.userId !== user.id && msg.timestamp > lastRead).length || 0

        setUnreadCount(unread)
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err)
      setError("Failed to load chat messages")
    } finally {
      setIsLoading(false)
    }
  }, [teamId, user, getTeam, updateTeam])

  // Load messages on mount and when teamId changes
  useEffect(() => {
    loadMessages()
  }, [loadMessages, teamId])

  // Send a new message
  const sendMessage = useCallback(
    async (content: string, attachments?: TeamChatMessage["attachments"], files?: File[]) => {
      if (!teamId || !user) {
        setError("You must be logged in and have a team selected to send messages")
        return false
      }

      if (!content.trim() && (!attachments || attachments.length === 0) && (!files || files.length === 0)) {
        setError("Message cannot be empty")
        return false
      }

      try {
        const team = getTeam(teamId)
        if (!team) {
          setError("Team not found")
          return false
        }

        const processedAttachments = attachments || []

        // Process uploaded files
        if (files && files.length > 0) {
          const { FileService } = await import("../services/file-service")

          for (const file of files) {
            try {
              const attachment = await FileService.processFile(file)
              processedAttachments.push(attachment)
            } catch (err) {
              console.error("Failed to process file:", file.name, err)
              setError(`Failed to process file: ${file.name}`)
              return false
            }
          }
        }

        // Create new message
        const newMessage: TeamChatMessage = {
          id: crypto.randomUUID(),
          teamId,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          content: content.trim(),
          timestamp: new Date().toISOString(),
          attachments: processedAttachments.length > 0 ? processedAttachments : undefined,
          isRead: { [user.id]: true },
        }

        // Initialize chat if it doesn't exist
        if (!team.chat) {
          team.chat = { messages: [] }
        }

        // Add message to team chat
        const updatedMessages = [...(team.chat.messages || []), newMessage]

        // Update team with new message
        updateTeam(teamId, {
          chat: {
            ...team.chat,
            messages: updatedMessages,
            lastReadTimestamp: {
              ...(team.chat.lastReadTimestamp || {}),
              [user.id]: newMessage.timestamp,
            },
          },
        })

        // Update local state
        setMessages(updatedMessages)
        return true
      } catch (err) {
        console.error("Failed to send message:", err)
        setError("Failed to send message")
        return false
      }
    },
    [teamId, user, getTeam, updateTeam],
  )

  // Upload files
  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!teamId || !user) {
        setError("You must be logged in and have a team selected to upload files")
        return false
      }

      if (files.length === 0) {
        setError("No files selected")
        return false
      }

      try {
        const { FileService } = await import("../services/file-service")
        const attachments: TeamChatMessage["attachments"] = []

        for (const file of files) {
          try {
            const attachment = await FileService.processFile(file)
            attachments.push(attachment)
          } catch (err) {
            console.error("Failed to process file:", file.name, err)
            setError(`Failed to process file: ${file.name}`)
            return false
          }
        }

        // Send message with file attachments
        return await sendMessage("", attachments)
      } catch (err) {
        console.error("Failed to upload files:", err)
        setError("Failed to upload files")
        return false
      }
    },
    [teamId, user, sendMessage],
  )

  // Mark all messages as read
  const markAsRead = useCallback(() => {
    if (!teamId || !user) return

    try {
      const team = getTeam(teamId)
      if (!team || !team.chat) return

      // Update last read timestamp
      updateTeam(teamId, {
        chat: {
          ...team.chat,
          lastReadTimestamp: {
            ...(team.chat.lastReadTimestamp || {}),
            [user.id]: new Date().toISOString(),
          },
        },
      })

      setUnreadCount(0)
    } catch (err) {
      console.error("Failed to mark messages as read:", err)
    }
  }, [teamId, user, getTeam, updateTeam])

  // Add reaction to a message
  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!teamId || !user) return

      try {
        const team = getTeam(teamId)
        if (!team || !team.chat || !team.chat.messages) return

        // Find message
        const messageIndex = team.chat.messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex === -1) return

        const message = team.chat.messages[messageIndex]

        // Initialize reactions if they don't exist
        if (!message.reactions) {
          message.reactions = []
        }

        // Check if user already reacted with this emoji
        const existingReaction = message.reactions.find((r) => r.emoji === emoji)

        if (existingReaction) {
          // If user already reacted, remove their reaction
          if (existingReaction.users.includes(user.id)) {
            existingReaction.users = existingReaction.users.filter((id) => id !== user.id)
            existingReaction.count = existingReaction.users.length

            // Remove reaction if no users left
            if (existingReaction.count === 0) {
              message.reactions = message.reactions.filter((r) => r.emoji !== emoji)
            }
          } else {
            // Add user to existing reaction
            existingReaction.users.push(user.id)
            existingReaction.count = existingReaction.users.length
          }
        } else {
          // Add new reaction
          message.reactions.push({
            emoji,
            count: 1,
            users: [user.id],
          })
        }

        // Update team with modified message
        const updatedMessages = [...team.chat.messages]
        updatedMessages[messageIndex] = message

        updateTeam(teamId, {
          chat: {
            ...team.chat,
            messages: updatedMessages,
          },
        })

        // Update local state
        setMessages(updatedMessages)
      } catch (err) {
        console.error("Failed to add reaction:", err)
      }
    },
    [teamId, user, getTeam, updateTeam],
  )

  // Delete a message
  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!teamId || !user) return

      try {
        const team = getTeam(teamId)
        if (!team || !team.chat || !team.chat.messages) return

        // Find message
        const message = team.chat.messages.find((msg) => msg.id === messageId)
        if (!message) return

        // Check if user is the message author or has admin/owner rights
        const userMember = team.members.find((member) => member.userId === user.id)
        const canDelete = message.userId === user.id || userMember?.role === "admin" || userMember?.role === "owner"

        if (!canDelete) {
          setError("You don't have permission to delete this message")
          return
        }

        // Remove message
        const updatedMessages = team.chat.messages.filter((msg) => msg.id !== messageId)

        updateTeam(teamId, {
          chat: {
            ...team.chat,
            messages: updatedMessages,
          },
        })

        // Update local state
        setMessages(updatedMessages)
      } catch (err) {
        console.error("Failed to delete message:", err)
        setError("Failed to delete message")
      }
    },
    [teamId, user, getTeam, updateTeam],
  )

  return {
    messages,
    isLoading,
    error,
    unreadCount,
    sendMessage,
    uploadFiles,
    markAsRead,
    addReaction,
    deleteMessage,
    refreshMessages: loadMessages,
  }
}
