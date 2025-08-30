'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Download,
  ChevronDown,
  ChevronRight,
  Wand2,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react'
import {
  autoFormatMultipleFiles,
  generateAutoFormatReport,
  type AutoFormatOptions,
  type AutoFormatResult,
  defaultAutoFormatOptions,
} from '../services/forsure-auto-formatter'

interface AutoFormatDialogProps {
  isOpen: boolean
  onClose: () => void
  files: Array<{ name: string; content: string }>
  onFilesFormatted: (
    formattedFiles: Array<{ name: string; content: string }>
  ) => void
}

export function AutoFormatDialog({
  isOpen,
  onClose,
  files,
  onFilesFormatted,
}: AutoFormatDialogProps) {
  const [options, setOptions] = useState<AutoFormatOptions>(
    defaultAutoFormatOptions
  )
  const [isFormatting, setIsFormatting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [results, setResults] = useState<
    Array<{ name: string; result: AutoFormatResult }>
  >([])
  const [showResults, setShowResults] = useState(false)
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())

  const handleOptionChange = (key: keyof AutoFormatOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const handleFormat = async () => {
    setIsFormatting(true)
    setProgress(0)
    setShowResults(false)

    try {
      const formatResults = await autoFormatMultipleFiles(
        files,
        options,
        (current, total, fileName) => {
          setProgress((current / total) * 100)
          setCurrentFile(fileName)
        }
      )

      setResults(formatResults)
      setShowResults(true)

      // Apply formatting to files
      const formattedFiles = formatResults.map(({ name, result }) => ({
        name,
        content: result.formatted,
      }))

      onFilesFormatted(formattedFiles)
    } catch (error) {
      console.error('Auto-format error:', error)
    } finally {
      setIsFormatting(false)
      setProgress(0)
      setCurrentFile('')
    }
  }

  const downloadReport = () => {
    const report = generateAutoFormatReport(results)
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forsure-autoformat-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleFileExpanded = (fileName: string) => {
    const newExpanded = new Set(expandedFiles)
    if (newExpanded.has(fileName)) {
      newExpanded.delete(fileName)
    } else {
      newExpanded.add(fileName)
    }
    setExpandedFiles(newExpanded)
  }

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'fix':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'improvement':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const totalChanges = results.reduce(
    (sum, r) => sum + r.result.changes.length,
    0
  )
  const filesWithChanges = results.filter(r => r.result.hasChanges).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Auto-Format ForSure Files
          </DialogTitle>
          <DialogDescription>
            Automatically format and fix common issues in your ForSure files.
            {files.length > 0 &&
              ` Processing ${files.length} file${files.length === 1 ? '' : 's'}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!showResults ? (
            <div className="space-y-6">
              {/* Formatting Options */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Formatting Options
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(options).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={checked =>
                          handleOptionChange(
                            key as keyof AutoFormatOptions,
                            !!checked
                          )
                        }
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {isFormatting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Formatting files...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  {currentFile && (
                    <p className="text-sm text-muted-foreground">
                      Processing: {currentFile}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Formatting Results
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Files Processed:</span>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.length}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Files Modified:</span>
                    <div className="text-2xl font-bold text-green-600">
                      {filesWithChanges}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Total Changes:</span>
                    <div className="text-2xl font-bold text-purple-600">
                      {totalChanges}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {results.map(({ name, result }) => (
                    <div key={name} className="border rounded-lg">
                      <Collapsible>
                        <CollapsibleTrigger
                          className="w-full p-3 flex items-center justify-between hover:bg-muted/50"
                          onClick={() => toggleFileExpanded(name)}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFiles.has(name) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-medium">{name}</span>
                            {result.hasChanges ? (
                              <Badge variant="secondary">
                                {result.changes.length} change
                                {result.changes.length === 1 ? '' : 's'}
                              </Badge>
                            ) : (
                              <Badge variant="outline">No changes</Badge>
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-3 pb-3 space-y-2">
                            {result.changes.length > 0 ? (
                              result.changes.map((change, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-2 bg-muted/30 rounded text-sm"
                                >
                                  {getChangeTypeIcon(change.type)}
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {change.description}
                                    </div>
                                    <div className="text-muted-foreground">
                                      Line {change.line}
                                    </div>
                                    {change.before.length < 100 && (
                                      <div className="mt-1 space-y-1">
                                        <div className="text-red-600">
                                          - {change.before}
                                        </div>
                                        <div className="text-green-600">
                                          + {change.after}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground text-sm p-2">
                                File is already well-formatted. No changes
                                needed.
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {showResults && (
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {showResults ? 'Close' : 'Cancel'}
            </Button>
            {!showResults && (
              <Button
                onClick={handleFormat}
                disabled={isFormatting || files.length === 0}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isFormatting ? 'Formatting...' : 'Format Files'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
