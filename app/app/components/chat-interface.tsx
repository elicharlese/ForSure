'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { Send, Paperclip, Sparkles, Mic, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { AutoFormatDialog } from './auto-format-dialog'

interface ForSureFile {
  name: string
  content: string
  isActive?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatInterfaceProps {
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectDetails: any
  forSureFiles: ForSureFile[]
  onForSureFilesChange: (files: ForSureFile[]) => void
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCopy: (text: string, id: string) => void
  copiedId?: string | null
}

export function ChatInterface({
  messages,
  input,
  isLoading,
  projectDetails,
  forSureFiles,
  onForSureFilesChange,
  onInputChange,
  onSubmit,
  onCopy,
  copiedId,
}: ChatInterfaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [isAutoFormatDialogOpen, setIsAutoFormatDialogOpen] = useState(false)

  const handleAutoFormatFiles = (
    formattedFiles: Array<{ name: string; content: string }>
  ) => {
    const updatedFiles = forSureFiles.map(file => {
      const formatted = formattedFiles.find(f => f.name === file.name)
      return formatted ? { ...file, content: formatted.content } : file
    })
    onForSureFilesChange(updatedFiles)
    setIsAutoFormatDialogOpen(false)
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    Array.from(e.target.files).forEach(async file => {
      try {
        const content = await file.text()
        const newFile: ForSureFile = { name: file.name, content }
        onForSureFilesChange([...forSureFiles, newFile])
      } catch (error) {
        console.error('Error reading file:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to read file ${file.name}.`,
        })
      }
    })

    // Clear the input to allow re-uploading the same file
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    onForSureFilesChange(forSureFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-[0.7] overflow-y-auto px-6 pt-6 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Chat Interface</h1>
        {/* Messages */}
        <div className="space-y-3">
          {messages.map(m => (
            <div
              key={m.id}
              className={`p-3 rounded-md border ${m.role === 'assistant' ? 'bg-muted/50' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                {m.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(m.content, m.id)}
                    className="shrink-0"
                  >
                    {copiedId === m.id ? 'Copied' : 'Copy'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t mt-auto px-6 py-4 bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-lg border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary">
            <Textarea
              id="prompt"
              placeholder="Ask ForSure AI anything..."
              value={input}
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
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Add image</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsAutoFormatDialogOpen(true)}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">AI suggestions</span>
                </Button>
              </div>

              <Button
                type="submit"
                size="sm"
                className="rounded-full px-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Sending...'
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
            <div className="mt-2 text-sm text-muted-foreground">
              {forSureFiles.length} file(s) attached
            </div>
          )}
        </form>
      </div>

      <AutoFormatDialog
        isOpen={isAutoFormatDialogOpen}
        onClose={() => setIsAutoFormatDialogOpen(false)}
        files={forSureFiles.map(f => ({ name: f.name, content: f.content }))}
        onFilesFormatted={handleAutoFormatFiles}
      />
    </div>
  )
}
