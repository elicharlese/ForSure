"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Clock, Trash2, RotateCcw } from "lucide-react"
import type { ProjectVersion } from "../hooks/use-saved-projects"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VersionHistoryDialogProps {
  projectId: string
  versions: ProjectVersion[]
  currentVersionId: string
  onRestore: (versionId: string) => void
  onDelete: (versionId: string) => void
  trigger?: React.ReactNode
}

export function VersionHistoryDialog({
  projectId,
  versions,
  currentVersionId,
  onRestore,
  onDelete,
  trigger,
}: VersionHistoryDialogProps) {
  const [open, setOpen] = useState(false)

  const handleRestore = (versionId: string) => {
    onRestore(versionId)
    setOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getVersionChanges = (version: ProjectVersion, index: number) => {
    if (index === versions.length - 1) return "Initial version"

    const previousVersion = versions[index + 1]
    const changes: string[] = []

    // Compare basic properties
    if (version.details.name !== previousVersion.details.name) {
      changes.push("Project name changed")
    }

    if (version.details.description !== previousVersion.details.description) {
      changes.push("Description updated")
    }

    if (version.details.type !== previousVersion.details.type) {
      changes.push("Project type changed")
    }

    if (version.details.framework !== previousVersion.details.framework) {
      changes.push("Framework changed")
    }

    // Compare languages
    const addedLanguages = version.details.languages.filter((lang) => !previousVersion.details.languages.includes(lang))

    const removedLanguages = previousVersion.details.languages.filter(
      (lang) => !version.details.languages.includes(lang),
    )

    if (addedLanguages.length > 0) {
      changes.push(`Added languages: ${addedLanguages.join(", ")}`)
    }

    if (removedLanguages.length > 0) {
      changes.push(`Removed languages: ${removedLanguages.join(", ")}`)
    }

    if (version.details.teamSize !== previousVersion.details.teamSize) {
      changes.push("Team size updated")
    }

    if (version.details.goals !== previousVersion.details.goals) {
      changes.push("Project goals updated")
    }

    return changes.length > 0 ? changes.join(", ") : "No detected changes"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            Version History
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>View and restore previous versions of your project.</DialogDescription>
        </DialogHeader>

        {versions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>No version history available</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-4">
              {versions
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((version, index, sortedVersions) => (
                  <div
                    key={version.versionId}
                    className={`p-3 border rounded-md transition-colors ${
                      version.versionId === currentVersionId ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {version.versionId === currentVersionId
                              ? "Current Version"
                              : `Version ${versions.length - index}`}
                          </h4>
                          {version.versionId === currentVersionId && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(version.timestamp)}</span>
                        </div>

                        <div className="mt-2 text-sm">
                          <div className="font-medium text-xs text-muted-foreground mb-1">Changes:</div>
                          <p className="text-xs">{getVersionChanges(version, index)}</p>
                        </div>

                        {version.notes && (
                          <div className="mt-2 text-sm">
                            <div className="font-medium text-xs text-muted-foreground mb-1">Notes:</div>
                            <p className="text-xs">{version.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        {version.versionId !== currentVersionId && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => onDelete(version.versionId)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete version</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRestore(version.versionId)}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Restore this version</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
