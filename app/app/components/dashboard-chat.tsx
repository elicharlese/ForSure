"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SendHorizontal, Sparkles } from "lucide-react"

interface DashboardChatProps {
  onProjectCreate: (projectData: any) => void
  onStartChat: (initialMessages: any[]) => void
}

export default function DashboardChat({ onProjectCreate, onStartChat }: DashboardChatProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Create initial message
    const initialMessages = [
      {
        role: "user",
        content: message,
      },
    ]

    // Start chat in the main interface
    onStartChat(initialMessages)
    setMessage("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    const initialMessages = [
      {
        role: "user",
        content: suggestion,
      },
    ]
    onStartChat(initialMessages)
  }

  return (
    <Card className="border border-muted">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Describe your project or ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestionClick("Create a React app with TypeScript")}
            >
              <Sparkles className="mr-1 h-3 w-3" />
              React + TypeScript
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestionClick("Create a Next.js project with API routes")}
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Next.js + API
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestionClick("Create a Node.js backend with Express")}
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Node.js + Express
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
