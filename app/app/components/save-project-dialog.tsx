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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import type { ProjectDetails } from './project-details-form'

interface SaveProjectDialogProps {
  project: ProjectDetails
  onSave: (project: ProjectDetails, versionNotes?: string) => void
  trigger?: React.ReactNode
}

export function SaveProjectDialog({
  project,
  onSave,
  trigger,
}: SaveProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState(project.name)
  const [versionNotes, setVersionNotes] = useState('')

  const handleSave = () => {
    onSave(
      {
        ...project,
        name: projectName.trim(),
      },
      versionNotes.trim() || undefined
    )
    setOpen(false)
    setVersionNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Save Project</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>
            Save your project details for future reference.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium mb-2"
            >
              Project Name
            </label>
            <Input
              id="project-name"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label
              htmlFor="version-notes"
              className="block text-sm font-medium mb-2"
            >
              Version Notes (Optional)
            </label>
            <Textarea
              id="version-notes"
              value={versionNotes}
              onChange={e => setVersionNotes(e.target.value)}
              placeholder="Describe what changed in this version"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!projectName.trim()}>
            <Save className="mr-2 h-4 w-4" />
            Save Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
