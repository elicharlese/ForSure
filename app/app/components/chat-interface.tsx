"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send, Paperclip, Sparkles, Mic, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AutoFormatDialog } from "./auto-format-dialog"

interface File {
  name: string
  content: string
}

export function ChatInterface() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [forSureFiles, setForSureFiles] = useState<File[]>([])
  const [maybeFiles, setMaybeFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [isAutoFormatDialogOpen, setIsAutoFormatDialogOpen] = useState(false)

  const handleAutoFormatFiles = (formattedFiles: Array<{ name: string; content: string }>) => {
    const updatedFiles = forSureFiles.map((file) => {
      const formatted = formattedFiles.find((f) => f.name === file.name)
      return formatted ? { ...file, content: formatted.content } : file
    })
    setForSureFiles(updatedFiles)
    setIsAutoFormatDialogOpen(false)
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    Array.from(e.target.files).forEach(async (file) => {
      try {
        const content = await file.text()
        const newFile = { name: file.name, content }
        setForSureFiles((prevFiles) => [...prevFiles, newFile])
      } catch (error) {
        console.error("Error reading file:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to read file ${file.name}.`,
        })
      }
    })

    // Clear the input to allow re-uploading the same file
    e.target.value = ""
  }

  const handleRemoveFile = (index: number) => {
    setForSureFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (forSureFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one file.",
      })
      return
    }

    setIsLoading(true)
    setResponse("")

    try {
      // const response = await fetch("/api/chat", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ prompt, files: forSureFiles }),
      // })

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }

      // const data = await response.json()
      // setResponse(data.response)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResponse("This is a mock response. The API is not yet implemented.")
    } catch (error: any) {
      console.error("Failed to fetch:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get response from the server.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-[0.7] overflow-y-auto px-6 pt-6">
        <h1 className="text-2xl font-bold mb-4">Chat Interface</h1>

        {response && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Response</h3>
            <div className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{response}</div>
          </div>
        )}
      </div>

      <div className="border-t mt-auto px-6 py-4 bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-lg border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary">
            <Textarea
              id="prompt"
              placeholder="Ask ForSure AI anything..."
              value={prompt}
              onChange={handlePromptChange}
              rows={3}
              className="min-h-[80px] resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between p-2 border-t">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />

                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Add image</span>
                </Button>

                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>

                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">AI suggestions</span>
                </Button>
              </div>

              <Button type="submit" size="sm" className="rounded-full px-3" disabled={isLoading}>
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>

          {forSureFiles.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">{forSureFiles.length} file(s) attached</div>
          )}
        </form>
      </div>

      <AutoFormatDialog
        isOpen={isAutoFormatDialogOpen}
        onClose={() => setIsAutoFormatDialogOpen(false)}
        files={forSureFiles.map((f) => ({ name: f.name, content: f.content }))}
        onFilesFormatted={handleAutoFormatFiles}
      />
    </div>
  )
}
