'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clipboard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeExampleProps {
  code: string
  language?: string
  className?: string
}

export default function CodeExample({
  code,
  language = 'forsure',
  className,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden code-window',
        className
      )}
    >
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
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          fontSize: '0.875rem',
          backgroundColor: 'transparent',
        }}
        wrapLongLines={true}
        showLineNumbers={language !== 'bash' && language !== 'text'}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
