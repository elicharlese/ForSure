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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createTemplateFromStructure } from '../services/template-service'
import type { FileNode } from './file-structure-visualization'
import type { ProjectDetails } from './project-details-form'

interface SaveTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateId: string) => void
  structure: FileNode
  projectDetails: ProjectDetails
}

export function SaveTemplateDialog({
  isOpen,
  onClose,
  onSave,
  structure,
  projectDetails,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [complexity, setComplexity] = useState<
    'simple' | 'standard' | 'advanced'
  >('standard')

  const handleSave = () => {
    if (!name.trim()) return

    const templateId = createTemplateFromStructure(
      structure,
      name,
      description,
      projectDetails.framework,
      projectDetails.type,
      complexity,
      tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
    )

    onSave(templateId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Save your current file structure as a reusable template for future
            projects.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Custom Template"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A brief description of what this template is for..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="complexity">Complexity</Label>
            <select
              id="complexity"
              value={complexity}
              onChange={e =>
                setComplexity(
                  e.target.value as 'simple' | 'standard' | 'advanced'
                )
              }
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="simple">Simple</option>
              <option value="standard">Standard</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="react, typescript, api, etc."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
