"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clipboard, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocsCodeBlockProps {
  code: string
  language?: string
  className?: string
  showLineNumbers?: boolean
  fileName?: string
}

export default function DocsCodeBlock({
  code,
  language = "forsure",
  className,
  showLineNumbers = false,
  fileName,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden code-window my-4", className)}>
      {fileName && (
        <div className="px-4 py-1 bg-secondary-dark/90 text-xs font-mono text-primary/80 border-b border-primary/20 truncate">
          {fileName}
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary-dark/80 border-b border-primary/30">
        <span className="text-xs font-mono text-primary">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 text-primary hover:text-white hover:bg-secondary"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className={cn("p-4 overflow-x-auto text-sm text-white font-mono", showLineNumbers && "line-numbers")}>
        <code>{code}</code>
      </div>
    </div>
  )
}
