'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Folder, Trash2, Clock, ArrowRight } from 'lucide-react'
import type { SavedProject } from '../hooks/use-saved-projects'

interface SavedProjectsDialogProps {
  projects: SavedProject[]
  onSelect: (projectId: string) => void
  onDelete: (projectId: string) => void
  trigger?: React.ReactNode
}

export function SavedProjectsDialog({
  projects,
  onSelect,
  onDelete,
  trigger,
}: SavedProjectsDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (projectId: string) => {
    onSelect(projectId)
    setOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Load Project</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Projects</DialogTitle>
          <DialogDescription>
            Select a project to load or manage your saved projects.
          </DialogDescription>
        </DialogHeader>

        {projects.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <Folder className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>No saved projects yet</p>
            <p className="text-sm mt-1">Your saved projects will appear here</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2 pr-4">
              {projects
                .sort(
                  (a, b) =>
                    new Date(b.lastUpdated).getTime() -
                    new Date(a.lastUpdated).getTime()
                )
                .map(project => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{project.name}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Last updated: {formatDate(project.lastUpdated)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {project.details.type} • {project.details.framework} •{' '}
                        {project.details.languages.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation()
                          onDelete(project.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSelect(project.id)}
                      >
                        <span className="sr-only sm:not-sr-only sm:mr-2">
                          Load
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
