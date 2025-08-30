'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  type FormatterOptions,
  defaultFormatterOptions,
} from '../services/code-formatter'
import { FormatterSettings } from './formatter-settings'
import type { FileNode } from './file-structure-visualization'

interface FormatAllDialogProps {
  isOpen: boolean
  onClose: () => void
  onFormat: (options: FormatterOptions, fileTypes: string[]) => void
  fileStructure: FileNode
  isFormatting: boolean
  progress: number
  formattedCount: number
  totalFiles: number
}

export function FormatAllDialog({
  isOpen,
  onClose,
  onFormat,
  fileStructure,
  isFormatting,
  progress,
  formattedCount,
  totalFiles,
}: FormatAllDialogProps) {
  const [formatterOptions, setFormatterOptions] = useState<FormatterOptions>({
    ...defaultFormatterOptions,
  })
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([
    'js',
    'jsx',
    'ts',
    'tsx',
    'html',
    'css',
    'json',
    'md',
  ])

  // Get all unique file extensions in the project
  const fileExtensions = getUniqueFileExtensions(fileStructure)

  const handleFormatAll = () => {
    onFormat(formatterOptions, selectedFileTypes)
  }

  const toggleFileType = (extension: string) => {
    setSelectedFileTypes(prev =>
      prev.includes(extension)
        ? prev.filter(ext => ext !== extension)
        : [...prev, extension]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Format All Files</DialogTitle>
          <DialogDescription>
            Format all files in your project according to the selected options.
            This operation can be undone.
          </DialogDescription>
        </DialogHeader>

        {isFormatting ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Formatting files... ({formattedCount} of {totalFiles})
            </p>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Formatter Settings</h3>
                <FormatterSettings
                  options={formatterOptions}
                  onChange={setFormatterOptions}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">File Types to Format</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {fileExtensions.map(extension => (
                    <div
                      key={extension}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`format-${extension}`}
                        checked={selectedFileTypes.includes(extension)}
                        onCheckedChange={() => toggleFileType(extension)}
                      />
                      <Label
                        htmlFor={`format-${extension}`}
                        className="text-sm"
                      >
                        .{extension}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleFormatAll}>Format All Files</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get all unique file extensions in the project
function getUniqueFileExtensions(
  node: FileNode,
  extensions: Set<string> = new Set()
): string[] {
  if (node.type === 'file') {
    const extension = node.name.split('.').pop()?.toLowerCase()
    if (extension) {
      extensions.add(extension)
    }
  }

  if (node.children) {
    node.children.forEach(child => {
      getUniqueFileExtensions(child, extensions)
    })
  }

  return Array.from(extensions).sort()
}
