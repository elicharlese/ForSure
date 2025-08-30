'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload, Check, AlertCircle, FileJson } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import type { SavedProject } from '../hooks/use-saved-projects'
import type { ProjectDetails } from './project-details-form'

interface ProjectImportExportProps {
  currentProject: ProjectDetails | null
  savedProjects: SavedProject[]
  onImport: (projects: SavedProject[]) => void
  onExport?: (project: ProjectDetails) => void
  trigger?: React.ReactNode
}

interface ImportResult {
  success: boolean
  projects: SavedProject[]
  errors: string[]
}

export function ProjectImportExport({
  currentProject,
  savedProjects,
  onImport,
  onExport,
  trigger,
}: ProjectImportExportProps) {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [importSuccess, setImportSuccess] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [importedProjects, setImportedProjects] = useState<SavedProject[]>([])
  const [processingFiles, setProcessingFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportAll = () => {
    if (savedProjects.length === 0) return

    const dataStr = JSON.stringify(savedProjects, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `forsure-projects-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  const handleExportCurrent = () => {
    if (!currentProject) return

    // Find the full saved project data for the current project
    const projectToExport = savedProjects.find(p => p.id === currentProject.id)

    if (projectToExport) {
      const dataStr = JSON.stringify(projectToExport, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `forsure-project-${projectToExport.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } else if (currentProject) {
      // If the current project isn't saved yet, export just the details
      const dataStr = JSON.stringify(
        {
          name: currentProject.name,
          details: currentProject,
          lastUpdated: new Date().toISOString(),
          versions: [
            {
              versionId: crypto.randomUUID(),
              details: currentProject,
              timestamp: new Date().toISOString(),
            },
          ],
          currentVersionId: crypto.randomUUID(),
        },
        null,
        2
      )

      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `forsure-project-${currentProject.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }

    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  const processImportFile = async (file: File): Promise<ImportResult> => {
    try {
      const content = await file.text()
      const parsed = JSON.parse(content)

      // Check if it's an array of projects or a single project
      if (Array.isArray(parsed)) {
        // Validate each project has the required fields
        const validProjects = parsed.filter(
          p =>
            p.name &&
            p.details &&
            p.lastUpdated &&
            p.versions &&
            p.currentVersionId
        )

        if (validProjects.length === 0) {
          return {
            success: false,
            projects: [],
            errors: [`No valid projects found in file "${file.name}"`],
          }
        }

        return {
          success: true,
          projects: validProjects,
          errors: [],
        }
      } else if (parsed.name && parsed.details) {
        // Single project
        return {
          success: true,
          projects: [parsed],
          errors: [],
        }
      } else {
        return {
          success: false,
          projects: [],
          errors: [`Invalid project format in file "${file.name}"`],
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      return {
        success: false,
        projects: [],
        errors: [
          `Failed to parse file "${file.name}". Please ensure it's a valid JSON file.`,
        ],
      }
    }
  }

  const processMultipleFiles = async (files: FileList | File[]) => {
    setImportErrors([])
    setImportedProjects([])
    setProcessingFiles(true)
    setImportSuccess(false)

    const allErrors: string[] = []
    const allProjects: SavedProject[] = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Skip non-JSON files
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        allErrors.push(`Skipped "${file.name}" - Not a JSON file`)
        continue
      }

      const result = await processImportFile(file)

      if (result.success) {
        allProjects.push(...result.projects)
      }

      if (result.errors.length > 0) {
        allErrors.push(...result.errors)
      }
    }

    setProcessingFiles(false)
    setImportErrors(allErrors)
    setImportedProjects(allProjects)

    if (allProjects.length > 0) {
      onImport(allProjects)
      setImportSuccess(true)

      // Only auto-close if there were no errors
      if (allErrors.length === 0) {
        setTimeout(() => {
          setImportSuccess(false)
          setIsImportOpen(false)
        }, 2000)
      }
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    processMultipleFiles(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add('bg-primary/5', 'border-primary/30')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('bg-primary/5', 'border-primary/30')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('bg-primary/5', 'border-primary/30')

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processMultipleFiles(files)
    }
  }

  return (
    <>
      {trigger || (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Projects</DialogTitle>
            <DialogDescription>
              Export your projects to a JSON file that you can import later or
              share with others.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {exportSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your project has been exported successfully.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleExportCurrent}
                disabled={!currentProject}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Current Project
              </Button>

              <Button
                onClick={handleExportAll}
                disabled={savedProjects.length === 0}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Projects ({savedProjects.length})
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsExportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Projects</DialogTitle>
            <DialogDescription>
              Import projects from JSON files that were previously exported.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {importErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {importErrors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {importSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  {importedProjects.length === 1
                    ? '1 project imported successfully!'
                    : `${importedProjects.length} projects imported successfully!`}
                </AlertDescription>
              </Alert>
            )}

            {importedProjects.length > 0 && (
              <div className="bg-muted/50 p-3 rounded-md border">
                <h4 className="text-sm font-medium mb-2">Imported Projects:</h4>
                <div className="flex flex-wrap gap-2">
                  {importedProjects.map(project => (
                    <Badge
                      key={project.id}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <FileJson className="h-3 w-3" />
                      {project.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <label
                htmlFor="import-file"
                className="block text-sm font-medium mb-2"
              >
                Select JSON files to import
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                multiple
                ref={fileInputRef}
                onChange={handleImport}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-primary/5 hover:border-primary/30"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop JSON files here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports multiple ForSure project files (.json)
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsImportOpen(false)}>
              {importSuccess ? 'Close' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
