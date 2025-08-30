'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileText,
  Download,
} from 'lucide-react'
import type {
  BatchValidationResult,
  BatchValidationProgress,
} from '../services/forsure-validator'
import { ForSureValidator } from '../services/forsure-validator'

interface BatchValidationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  files: FileList | null
  existingFiles: { name: string }[]
  onValidationComplete: (results: BatchValidationResult[]) => void
}

export function BatchValidationDialog({
  open,
  onOpenChange,
  files,
  existingFiles,
  onValidationComplete,
}: BatchValidationDialogProps) {
  const [progress, setProgress] = useState<BatchValidationProgress | null>(null)
  const [results, setResults] = useState<BatchValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())

  const startValidation = async () => {
    if (!files || files.length === 0) return

    setIsValidating(true)
    setResults([])
    setProgress(null)

    try {
      const validationResults = await ForSureValidator.validateFilesBatch(
        files,
        existingFiles,
        progressUpdate => {
          setProgress(progressUpdate)
        }
      )

      setResults(validationResults)
      onValidationComplete(validationResults)
    } catch (error) {
      console.error('Batch validation failed:', error)
    } finally {
      setIsValidating(false)
    }
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

  const downloadReport = () => {
    const summary = ForSureValidator.getBatchValidationSummary(results)
    const report = generateValidationReport(results, summary)

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forsure-validation-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateValidationReport = (
    results: BatchValidationResult[],
    summary: any
  ): string => {
    let report = 'ForSure Files Validation Report\n'
    report += '='.repeat(40) + '\n\n'
    report += `Generated: ${new Date().toLocaleString()}\n\n`

    report += 'Summary:\n'
    report += `---------\n`
    report += `Total Files: ${summary.total}\n`
    report += `Valid Files: ${summary.valid}\n`
    report += `Invalid Files: ${summary.invalid}\n`
    report += `Files with Warnings: ${summary.warnings}\n\n`

    report += 'Detailed Results:\n'
    report += '-'.repeat(20) + '\n\n'

    results.forEach((result, index) => {
      report += `${index + 1}. ${result.fileName}\n`
      report += `   Status: ${result.overallValid ? '✓ Valid' : '✗ Invalid'}\n`

      if (result.fileValidation.errors.length > 0) {
        report += `   File Errors:\n`
        result.fileValidation.errors.forEach(error => {
          report += `     - ${error}\n`
        })
      }

      if (result.contentValidation.errors.length > 0) {
        report += `   Content Errors:\n`
        result.contentValidation.errors.forEach(error => {
          report += `     - ${error}\n`
        })
      }

      const allWarnings = [
        ...result.fileValidation.warnings,
        ...result.contentValidation.warnings,
      ]
      if (allWarnings.length > 0) {
        report += `   Warnings:\n`
        allWarnings.forEach(warning => {
          report += `     - ${warning}\n`
        })
      }

      report += '\n'
    })

    return report
  }

  const summary =
    results.length > 0
      ? ForSureValidator.getBatchValidationSummary(results)
      : null
  const progressPercentage = progress
    ? (progress.completed / progress.total) * 100
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Batch File Validation
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {!isValidating && results.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Ready to Validate Files
                </h3>
                <p className="text-muted-foreground mb-4">
                  {files
                    ? `${files.length} file(s) selected for validation`
                    : 'No files selected'}
                </p>
                <Button
                  onClick={startValidation}
                  disabled={!files || files.length === 0}
                >
                  Start Validation
                </Button>
              </div>
            </div>
          )}

          {isValidating && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-md space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">
                    Validating Files...
                  </h3>
                  {progress && (
                    <p className="text-sm text-muted-foreground">
                      {progress.current
                        ? `Processing: ${progress.current}`
                        : 'Completing...'}
                    </p>
                  )}
                </div>

                <Progress value={progressPercentage} className="w-full" />

                {progress && (
                  <div className="text-center text-sm text-muted-foreground">
                    {progress.completed} of {progress.total} files processed
                  </div>
                )}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Summary */}
              {summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Validation Summary</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadReport}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {summary.total}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Files
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {summary.valid}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Valid
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {summary.invalid}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Invalid
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {summary.warnings}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Warnings
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Results</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-2">
                      {results.map((result, index) => (
                        <Collapsible
                          key={result.fileName}
                          open={expandedFiles.has(result.fileName)}
                          onOpenChange={() =>
                            toggleFileExpanded(result.fileName)
                          }
                        >
                          <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                {result.overallValid ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                <span className="font-medium">
                                  {result.fileName}
                                </span>
                                <div className="flex gap-1">
                                  {result.overallValid && (
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-600"
                                    >
                                      Valid
                                    </Badge>
                                  )}
                                  {!result.overallValid && (
                                    <Badge
                                      variant="outline"
                                      className="text-red-600 border-red-600"
                                    >
                                      Invalid
                                    </Badge>
                                  )}
                                  {(result.fileValidation.warnings.length > 0 ||
                                    result.contentValidation.warnings.length >
                                      0) && (
                                    <Badge
                                      variant="outline"
                                      className="text-amber-600 border-amber-600"
                                    >
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Warnings
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {expandedFiles.has(result.fileName) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="ml-8 mt-2 space-y-2">
                              {/* File validation errors */}
                              {result.fileValidation.errors.length > 0 && (
                                <div className="text-sm">
                                  <div className="font-medium text-red-600 mb-1">
                                    File Errors:
                                  </div>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {result.fileValidation.errors.map(
                                      (error, idx) => (
                                        <li key={idx} className="text-red-600">
                                          {error}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Content validation errors */}
                              {result.contentValidation.errors.length > 0 && (
                                <div className="text-sm">
                                  <div className="font-medium text-red-600 mb-1">
                                    Content Errors:
                                  </div>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {result.contentValidation.errors.map(
                                      (error, idx) => (
                                        <li key={idx} className="text-red-600">
                                          {error}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Warnings */}
                              {(result.fileValidation.warnings.length > 0 ||
                                result.contentValidation.warnings.length >
                                  0) && (
                                <div className="text-sm">
                                  <div className="font-medium text-amber-600 mb-1">
                                    Warnings:
                                  </div>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {[
                                      ...result.fileValidation.warnings,
                                      ...result.contentValidation.warnings,
                                    ].map((warning, idx) => (
                                      <li key={idx} className="text-amber-600">
                                        {warning}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Success message */}
                              {result.overallValid &&
                                result.fileValidation.warnings.length === 0 &&
                                result.contentValidation.warnings.length ===
                                  0 && (
                                  <div className="text-sm text-green-600">
                                    ✓ File passed all validation checks
                                  </div>
                                )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {results.length > 0 && (
            <Button onClick={() => onOpenChange(false)}>
              Continue with Results
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
