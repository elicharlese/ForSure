'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Save,
  X,
  Copy,
  Check,
  Code,
  FileText,
  Settings,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatCode,
  type FormatterOptions,
  defaultFormatterOptions,
} from '../services/code-formatter'
import { FormatterSettings } from './formatter-settings'
import {
  autoFormatForSure,
  defaultAutoFormatOptions,
  type AutoFormatOptions,
} from '../services/forsure-auto-formatter'

interface FileEditorProps {
  fileName: string
  content: string
  onSave: (content: string) => void
  onClose: () => void
  className?: string
}

export function FileEditor({
  fileName,
  content: initialContent,
  onSave,
  onClose,
  className,
}: FileEditorProps) {
  const [content, setContent] = useState(initialContent || '')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [language, setLanguage] = useState<string>('plaintext')
  const [formatterOptions, setFormatterOptions] = useState<FormatterOptions>(
    defaultFormatterOptions
  )
  const [isFormatterSettingsOpen, setIsFormatterSettingsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [autoFormatOptions, setAutoFormatOptions] = useState<AutoFormatOptions>(
    defaultAutoFormatOptions
  )
  const [isAutoFormatting, setIsAutoFormatting] = useState(false)

  // Determine language based on file extension
  useEffect(() => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''

    switch (extension) {
      case 'js':
        setLanguage('javascript')
        break
      case 'jsx':
        setLanguage('javascript')
        break
      case 'ts':
        setLanguage('typescript')
        break
      case 'tsx':
        setLanguage('typescript')
        break
      case 'html':
        setLanguage('html')
        break
      case 'css':
        setLanguage('css')
        break
      case 'json':
        setLanguage('json')
        break
      case 'md':
        setLanguage('markdown')
        break
      default:
        setLanguage('plaintext')
    }
  }, [fileName])

  const handleSave = () => {
    onSave(content)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFormat = () => {
    if (
      language === 'javascript' ||
      language === 'typescript' ||
      fileName.endsWith('.fs') ||
      fileName.endsWith('.forsure')
    ) {
      setIsAutoFormatting(true)
      try {
        const result = autoFormatForSure(content, autoFormatOptions)
        setContent(result.formatted)

        // Show a toast or notification about changes made
        if (result.hasChanges) {
          console.log(`Auto-format applied ${result.changes.length} changes`)
        }
      } catch (error) {
        console.error('Auto-format error:', error)
      } finally {
        setIsAutoFormatting(false)
      }
    } else {
      // Use existing formatter for other file types
      const formatted = formatCode(content, fileName, formatterOptions)
      setContent(formatted)
    }
  }

  // Render preview based on file type
  const renderPreview = () => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''

    switch (extension) {
      case 'md':
        return (
          <div className="prose dark:prose-invert max-w-none p-4 overflow-auto">
            {/* Simple markdown rendering - in a real app, use a markdown parser */}
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i}>{line.substring(2)}</h1>
              } else if (line.startsWith('## ')) {
                return <h2 key={i}>{line.substring(3)}</h2>
              } else if (line.startsWith('### ')) {
                return <h3 key={i}>{line.substring(4)}</h3>
              } else if (line.startsWith('- ')) {
                return <li key={i}>{line.substring(2)}</li>
              } else if (line === '') {
                return <br key={i} />
              } else {
                return <p key={i}>{line}</p>
              }
            })}
          </div>
        )
      case 'html':
        return (
          <div className="p-4 overflow-auto">
            <div className="border rounded-md p-4 bg-white">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        )
      case 'json':
        try {
          const formattedJson = JSON.stringify(JSON.parse(content), null, 2)
          return (
            <pre className="p-4 overflow-auto bg-muted rounded-md">
              <code>{formattedJson}</code>
            </pre>
          )
        } catch (e) {
          return (
            <div className="p-4 text-red-500">
              Invalid JSON: {(e as Error).message}
            </div>
          )
        }
      default:
        return (
          <pre className="p-4 overflow-auto bg-muted rounded-md">
            <code>{content}</code>
          </pre>
        )
    }
  }

  return (
    <div className={cn('flex flex-col h-full border rounded-md', className)}>
      <div className="flex items-center justify-between border-b p-2 bg-muted/30">
        <div className="flex items-center gap-2">
          {language === 'javascript' || language === 'typescript' ? (
            <Code className="h-4 w-4 text-yellow-500" />
          ) : (
            <FileText className="h-4 w-4 text-blue-500" />
          )}
          <span className="font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as 'edit' | 'preview')}
        className="flex-1 flex flex-col"
      >
        <div className="border-b">
          <TabsList className="h-10">
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-primary/10"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-primary/10"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {!isCollapsed && (
          <>
            <TabsContent value="edit" className="flex-1 p-0 m-0">
              <div className="relative h-full">
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="h-full min-h-[300px] font-mono text-sm resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={`Enter ${fileName} content here...`}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 p-0 m-0 overflow-auto"
            >
              {renderPreview()}
            </TabsContent>
          </>
        )}
      </Tabs>

      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-4 border-t">
          <p>
            Editor collapsed. Click{' '}
            <ChevronDown className="h-4 w-4 inline mx-1" /> to expand.
          </p>
        </div>
      )}

      {!isCollapsed && (
        <div className="flex justify-between gap-2 p-2 border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFormat}
              disabled={isAutoFormatting}
            >
              {isAutoFormatting ? 'Auto-formatting...' : 'Format'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFormatterSettingsOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      )}

      <FormatterSettings
        isOpen={isFormatterSettingsOpen}
        onClose={() => setIsFormatterSettingsOpen(false)}
        options={formatterOptions}
        onSave={setFormatterOptions}
      />
    </div>
  )
}
