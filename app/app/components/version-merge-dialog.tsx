"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { GitMerge } from "lucide-react"

interface Version {
  versionId: string
  versionName: string
}

export interface MergeOptions {
  mergeStrategy: string
  selectedChanges: string[]
  createNewVersion: boolean
  mergeNotes: string
}

interface VersionMergeDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  currentVersion: any
  targetVersion: any
  onMerge: (options: MergeOptions) => void
}

export function VersionMergeDialog({
  isOpen,
  onClose,
  projectId,
  currentVersion,
  targetVersion,
  onMerge,
}: VersionMergeDialogProps) {
  const [mergeStrategy, setMergeStrategy] = useState("auto")
  const [selectedChanges, setSelectedChanges] = useState<string[]>([])
  const [createNewVersion, setCreateNewVersion] = useState(true)
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const handleMerge = () => {
    const mergeNotes = `Merge of versions ${currentVersion.versionId} and ${targetVersion.versionId}${
      notes ? `: ${notes}` : ""
    }`

    onMerge({
      mergeStrategy,
      selectedChanges,
      createNewVersion,
      mergeNotes,
    })
  }

  const toggleChange = (changeId: string) => {
    setSelectedChanges((prev) => (prev.includes(changeId) ? prev.filter((id) => id !== changeId) : [...prev, changeId]))
  }

  // Mock changes for demonstration
  const mockChanges = [
    { id: "change1", description: "Updated project name" },
    { id: "change2", description: "Modified file structure" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Merge Versions</DialogTitle>
          <DialogDescription>Merge changes from the selected version into your current version.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Merge Strategy</Label>
            <RadioGroup value={mergeStrategy} onValueChange={setMergeStrategy} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto">Auto (Recommended)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual">Manual (Select Changes)</Label>
              </div>
            </RadioGroup>
          </div>

          {mergeStrategy === "manual" && (
            <div className="space-y-2">
              <Label>Select Changes to Include</Label>
              <div className="space-y-2">
                {mockChanges.map((change) => (
                  <div key={change.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={change.id}
                      checked={selectedChanges.includes(change.id)}
                      onCheckedChange={() => toggleChange(change.id)}
                    />
                    <Label htmlFor={change.id}>{change.description}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="create-new-version"
              checked={createNewVersion}
              onCheckedChange={(checked) => setCreateNewVersion(checked as boolean)}
            />
            <Label htmlFor="create-new-version">Create New Version After Merge</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merge-notes">Merge Notes</Label>
            <Textarea
              id="merge-notes"
              placeholder="Add notes about this merge"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleMerge}>
            <GitMerge className="mr-2 h-4 w-4" />
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
