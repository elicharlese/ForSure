"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Copy, Check, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileStructureMessage } from "./file-structure-message"
import type { Message } from "../types/chat"
import type { ProjectDetails } from "./project-details-form"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  isLoading: boolean
  projectDetails: ProjectDetails | null
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCopy: (text: string, id: string) => void
  copiedId: string | null
}

export function ChatInterface({
  messages,
  input,
  isLoading,
  projectDetails,
  onInputChange,
  onSubmit,
  onCopy,
  copiedId,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.role === "user" ? "items-end" : "items-start")}>
            <div
              className={cn(
                "px-4 py-3 rounded-lg max-w-[85%]",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-primary/10",
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.fileStructure && <FileStructureMessage structure={message.fileStructure} />}
            </div>
            {message.role === "assistant" && (
              <div className="flex items-center mt-1 gap-2">
                <button
                  onClick={() => onCopy(message.content, message.id)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copiedId === message.id ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="px-4 py-3 rounded-lg bg-muted border border-primary/10">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {projectDetails && (
        <div className="border-t border-primary/20 bg-background p-4">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask about file structure, project organization, or ForSure..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="text-xs text-center text-muted-foreground mt-2">
            ForSure AI may make mistakes. Please use with discretion.
          </div>
        </div>
      )}
    </div>
  )
}
