'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Trash2,
  Copy,
  FileText,
  ImageIcon,
  Link,
  Folder,
} from 'lucide-react'
import { useTeamChat } from '../hooks/use-team-chat'
import { useAuth } from '@/contexts/auth-context'
import type { Team, TeamChatMessage } from '../types/team'
import { format, isToday, isYesterday } from 'date-fns'
import { FileService } from '../services/file-service'

interface TeamChatDialogProps {
  team: Team | null
  trigger?: React.ReactNode
}

// Common emoji reactions
const commonEmojis = ['👍', '👎', '❤️', '😂', '😮', '🎉', '🚀', '👀']

export function TeamChatDialog({ team, trigger }: TeamChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    messages,
    isLoading,
    error,
    unreadCount,
    sendMessage,
    uploadFiles,
    markAsRead,
    addReaction,
    deleteMessage,
    refreshMessages,
  } = useTeamChat(team?.id || null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Mark messages as read when dialog opens
  useEffect(() => {
    if (isOpen && team) {
      markAsRead()
    }
  }, [isOpen, team, markAsRead])

  // Refresh messages periodically (simulating real-time updates)
  useEffect(() => {
    if (isOpen && team) {
      const interval = setInterval(() => {
        refreshMessages()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isOpen, team, refreshMessages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSendWithFiles = async () => {
    if (selectedFiles.length > 0) {
      setIsSending(true)
      try {
        const success = await sendMessage(message, undefined, selectedFiles)
        if (success) {
          setMessage('')
          setSelectedFiles([])
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        } else {
          toast({
            title: 'Failed to send message',
            description: 'Please try again',
            variant: 'destructive',
          })
        }
      } catch (err) {
        console.error('Error sending message with files:', err)
        toast({
          title: 'Error',
          description: 'Failed to send message with files',
          variant: 'destructive',
        })
      } finally {
        setIsSending(false)
      }
    } else {
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return

    if (selectedFiles.length > 0) {
      handleSendWithFiles()
      return
    }

    setIsSending(true)
    try {
      const success = await sendMessage(message)
      if (success) {
        setMessage('')
      } else {
        toast({
          title: 'Failed to send message',
          description: 'Please try again',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error('Error sending message:', err)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji)
    setEmojiPickerOpen(false)
    setActiveMessageId(null)
  }

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId)
    }
  }

  const copyMessageContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copied to clipboard',
      description: 'Message content copied to clipboard',
    })
  }

  // Group messages by date
  const groupedMessages: { [date: string]: TeamChatMessage[] } = {}
  messages.forEach(msg => {
    const date = new Date(msg.timestamp)
    const dateKey = format(date, 'yyyy-MM-dd')

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }

    groupedMessages[dateKey].push(msg)
  })

  // Format date for display
  const formatDateHeading = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) {
      return 'Today'
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'MMMM d, yyyy')
    }
  }

  // Format time for message
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="relative">
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
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle className="flex items-center">
            {team ? (
              <>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {team.name} Chat
              </>
            ) : (
              'Team Chat'
            )}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {team
              ? `${team.members.length} members`
              : 'Select a team to start chatting'}
          </DialogDescription>
        </DialogHeader>

        {!team ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No Team Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a team to start chatting with team members
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse">Loading messages...</div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              {Object.keys(groupedMessages).length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No Messages Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start the conversation by sending a message
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {Object.entries(groupedMessages).map(
                    ([date, dateMessages]) => (
                      <div key={date} className="mb-6">
                        <div className="relative flex items-center py-2">
                          <div className="flex-grow border-t border-muted"></div>
                          <span className="flex-shrink mx-4 text-xs text-muted-foreground">
                            {formatDateHeading(date)}
                          </span>
                          <div className="flex-grow border-t border-muted"></div>
                        </div>

                        {dateMessages.map(msg => {
                          const isCurrentUser = msg.userId === user?.id
                          return (
                            <div
                              key={msg.id}
                              className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}
                              >
                                <Avatar
                                  className={`h-8 w-8 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}
                                >
                                  <AvatarImage
                                    src={msg.userAvatar || '/placeholder.svg'}
                                    alt={msg.userName}
                                  />
                                  <AvatarFallback>
                                    {msg.userName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <div
                                    className={`flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}
                                  >
                                    <span className="text-xs font-medium">
                                      {msg.userName}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {formatMessageTime(msg.timestamp)}
                                    </span>
                                  </div>

                                  <div className="group relative">
                                    <div
                                      className={`rounded-lg px-3 py-2 text-sm ${
                                        isCurrentUser
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted'
                                      }`}
                                    >
                                      {msg.content}

                                      {msg.attachments &&
                                        msg.attachments.length > 0 && (
                                          <div className="mt-2 space-y-1">
                                            {msg.attachments.map(
                                              (attachment, i) => (
                                                <div
                                                  key={i}
                                                  className={`flex items-center rounded p-2 text-xs ${
                                                    isCurrentUser
                                                      ? 'bg-primary/80'
                                                      : 'bg-background'
                                                  }`}
                                                >
                                                  {attachment.type ===
                                                    'file' && (
                                                    <FileText className="h-3 w-3 mr-1" />
                                                  )}
                                                  {attachment.type ===
                                                    'image' && (
                                                    <ImageIcon className="h-3 w-3 mr-1" />
                                                  )}
                                                  {attachment.type ===
                                                    'link' && (
                                                    <Link className="h-3 w-3 mr-1" />
                                                  )}
                                                  {attachment.type ===
                                                    'project' && (
                                                    <Folder className="h-3 w-3 mr-1" />
                                                  )}
                                                  {attachment.name}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>

                                    {/* Message actions */}
                                    <div
                                      className={`absolute ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 hidden group-hover:flex items-center space-x-1`}
                                    >
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6"
                                              onClick={() => {
                                                setActiveMessageId(msg.id)
                                                setEmojiPickerOpen(true)
                                              }}
                                            >
                                              <Smile className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Add reaction
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <Popover
                                        open={activeMessageId === msg.id}
                                        onOpenChange={open =>
                                          !open && setActiveMessageId(null)
                                        }
                                      >
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() =>
                                              setActiveMessageId(msg.id)
                                            }
                                          >
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs"
                                            onClick={() =>
                                              copyMessageContent(msg.content)
                                            }
                                          >
                                            <Copy className="h-3 w-3 mr-2" />
                                            Copy text
                                          </Button>

                                          {(isCurrentUser ||
                                            team.members.some(
                                              m =>
                                                m.userId === user?.id &&
                                                (m.role === 'admin' ||
                                                  m.role === 'owner')
                                            )) && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start text-xs text-destructive hover:text-destructive"
                                              onClick={() =>
                                                handleDeleteMessage(msg.id)
                                              }
                                            >
                                              <Trash2 className="h-3 w-3 mr-2" />
                                              Delete
                                            </Button>
                                          )}
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>

                                  {/* Reactions */}
                                  {msg.reactions &&
                                    msg.reactions.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {msg.reactions.map(reaction => (
                                          <Badge
                                            key={reaction.emoji}
                                            variant="outline"
                                            className={`text-xs py-0 h-5 ${
                                              reaction.users.includes(
                                                user?.id || ''
                                              )
                                                ? 'bg-accent'
                                                : 'bg-background'
                                            } cursor-pointer hover:bg-accent`}
                                            onClick={() =>
                                              handleReaction(
                                                msg.id,
                                                reaction.emoji
                                              )
                                            }
                                          >
                                            {reaction.emoji} {reaction.count}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>

            {/* Emoji picker popover */}
            <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
              <PopoverContent className="w-fit p-2" align="end">
                <div className="flex flex-wrap gap-2 max-w-[200px]">
                  {commonEmojis.map(emoji => (
                    <button
                      key={emoji}
                      className="text-lg hover:bg-accent p-1 rounded cursor-pointer"
                      onClick={() =>
                        activeMessageId &&
                        handleReaction(activeMessageId, emoji)
                      }
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="p-4 border-t">
              {selectedFiles.length > 0 && (
                <div className="mb-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {selectedFiles.length} file
                      {selectedFiles.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFiles([])}
                      className="h-6 text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-muted-foreground">
                          {FileService.formatFileSize(file.size)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`flex items-center gap-2 ${isDragOver ? 'bg-accent/50 rounded-lg p-2' : ''}`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Input
                  placeholder={
                    isDragOver ? 'Drop files here...' : 'Type a message...'
                  }
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                  className="flex-1"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isSending}
                        className="shrink-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach files</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  onClick={handleSendWithFiles}
                  disabled={
                    (!message.trim() && selectedFiles.length === 0) || isSending
                  }
                  className="shrink-0"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
