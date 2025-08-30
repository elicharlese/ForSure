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
import {
  History,
  Clock,
  Trash2,
  RotateCcw,
  GitMerge,
  List,
  GitBranch,
} from 'lucide-react'
import type { ProjectVersion, Branch, Tag } from '../hooks/use-saved-projects'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { VersionMergeDialog, type MergeOptions } from './version-merge-dialog'
import { VersionHistoryGraph } from './version-history-graph'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BranchManagementDialog } from './branch-management-dialog'
import { TagManagementDialog } from './tag-management-dialog'

interface VersionHistoryDialogProps {
  projectId: string
  versions: ProjectVersion[]
  branches: Branch[]
  tags: Tag[]
  currentVersionId: string
  currentBranchId: string
  onRestore: (versionId: string) => void
  onDelete: (versionId: string) => void
  onMerge: (
    sourceVersionId: string,
    targetVersionId: string,
    options: MergeOptions
  ) => void
  onCreateBranch: (
    sourceVersionId: string,
    name: string,
    description?: string,
    switchToBranch?: boolean
  ) => void
  onSwitchBranch: (branchId: string) => void
  onDeleteBranch: (branchId: string) => void
  onRenameBranch: (branchId: string, newName: string) => void
  onCreateTag: (
    versionId: string,
    name: string,
    type: Tag['type'],
    description?: string,
    metadata?: Tag['metadata']
  ) => void
  onDeleteTag: (tagId: string) => void
  onUpdateTag: (
    tagId: string,
    updates: Partial<Pick<Tag, 'name' | 'description' | 'metadata'>>
  ) => void
  onMoveTag: (tagId: string, newVersionId: string) => void
  trigger?: React.ReactNode
}

export function VersionHistoryDialog({
  projectId,
  versions,
  branches,
  tags,
  currentVersionId,
  currentBranchId,
  onRestore,
  onDelete,
  onMerge,
  onCreateBranch,
  onSwitchBranch,
  onDeleteBranch,
  onRenameBranch,
  onCreateTag,
  onDeleteTag,
  onUpdateTag,
  onMoveTag,
  trigger,
}: VersionHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  )
  const [activeTab, setActiveTab] = useState<string>('list')

  const handleRestore = (versionId: string) => {
    onRestore(versionId)
    setOpen(false)
  }

  const handleMerge = (versionId: string) => {
    setSelectedVersionId(versionId)
    setMergeDialogOpen(true)
  }

  const handleMergeComplete = (options: MergeOptions) => {
    if (selectedVersionId) {
      onMerge(currentVersionId, selectedVersionId, options)
    }
    setMergeDialogOpen(false)
    setSelectedVersionId(null)
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

  const getVersionChanges = (version: ProjectVersion, index: number) => {
    if (index === versions.length - 1) return 'Initial version'

    const previousVersion = versions[index + 1]
    const changes: string[] = []

    // Compare basic properties
    if (version.details.name !== previousVersion.details.name) {
      changes.push('Project name changed')
    }

    if (version.details.description !== previousVersion.details.description) {
      changes.push('Description updated')
    }

    if (version.details.type !== previousVersion.details.type) {
      changes.push('Project type changed')
    }

    if (version.details.framework !== previousVersion.details.framework) {
      changes.push('Framework changed')
    }

    // Compare languages
    const addedLanguages = version.details.languages.filter(
      lang => !previousVersion.details.languages.includes(lang)
    )

    const removedLanguages = previousVersion.details.languages.filter(
      lang => !version.details.languages.includes(lang)
    )

    if (addedLanguages.length > 0) {
      changes.push(`Added languages: ${addedLanguages.join(', ')}`)
    }

    if (removedLanguages.length > 0) {
      changes.push(`Removed languages: ${removedLanguages.join(', ')}`)
    }

    if (version.details.teamSize !== previousVersion.details.teamSize) {
      changes.push('Team size updated')
    }

    if (version.details.goals !== previousVersion.details.goals) {
      changes.push('Project goals updated')
    }

    return changes.length > 0 ? changes.join(', ') : 'No detected changes'
  }

  // Get the current version and selected version for merge
  const currentVersion = versions.find(v => v.versionId === currentVersionId)
  const selectedVersion = selectedVersionId
    ? versions.find(v => v.versionId === selectedVersionId)
    : null

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId)
    setActiveTab('list') // Switch to list view to show details
  }

  // Get branch name for a version
  const getBranchName = (version: ProjectVersion) => {
    if (!version.branchId) return 'No branch'
    const branch = branches.find(b => b.id === version.branchId)
    return branch ? branch.name : 'Unknown branch'
  }

  // Get branch color for a version
  const getBranchColor = (version: ProjectVersion) => {
    if (!version.branchId) return undefined
    const branch = branches.find(b => b.id === version.branchId)
    return branch?.color
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and manage the version history of your project.
            </DialogDescription>
          </DialogHeader>

          {versions.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No version history available</p>
            </div>
          ) : (
            <Tabs
              defaultValue="list"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List className="h-4 w-4" />
                    <span>List View</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="graph"
                    className="flex items-center gap-1"
                  >
                    <GitBranch className="h-4 w-4" />
                    <span>Graph View</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <TagManagementDialog
                    projectId={projectId}
                    tags={tags}
                    versions={versions}
                    currentVersionId={currentVersionId}
                    onCreateTag={onCreateTag}
                    onDeleteTag={onDeleteTag}
                    onUpdateTag={onUpdateTag}
                    onMoveTag={onMoveTag}
                  />

                  <BranchManagementDialog
                    projectId={projectId}
                    branches={branches}
                    versions={versions}
                    currentBranchId={currentBranchId}
                    currentVersionId={currentVersionId}
                    onCreateBranch={onCreateBranch}
                    onSwitchBranch={onSwitchBranch}
                    onDeleteBranch={onDeleteBranch}
                    onRenameBranch={onRenameBranch}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <GitBranch className="h-4 w-4" />
                        <span>Manage Branches</span>
                      </Button>
                    }
                  />
                </div>
              </div>

              <TabsContent value="list" className="flex-1 overflow-hidden">
                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-3 pr-4">
                    {versions
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .map((version, index, sortedVersions) => (
                        <div
                          key={version.versionId}
                          className={`p-3 border rounded-md transition-colors ${
                            version.versionId === currentVersionId
                              ? 'border-primary bg-primary/5'
                              : version.versionId === selectedVersionId
                                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                : 'hover:bg-muted/50'
                          }`}
                          style={{
                            borderLeftColor: getBranchColor(version),
                            borderLeftWidth: '4px',
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {version.versionId === currentVersionId
                                    ? 'Current Version'
                                    : `Version ${versions.length - index}`}
                                </h4>
                                {version.versionId === currentVersionId && (
                                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                    Current
                                  </span>
                                )}
                                {version.notes?.includes('Merge of') && (
                                  <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                                    <GitMerge className="h-3 w-3 mr-1" />
                                    Merge
                                  </span>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {getBranchName(version)}
                                </Badge>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(version.timestamp)}</span>
                              </div>

                              <div className="mt-2 text-sm">
                                <div className="font-medium text-xs text-muted-foreground mb-1">
                                  Changes:
                                </div>
                                <p className="text-xs">
                                  {getVersionChanges(version, index)}
                                </p>
                              </div>

                              {version.notes && (
                                <div className="mt-2 text-sm">
                                  <div className="font-medium text-xs text-muted-foreground mb-1">
                                    Notes:
                                  </div>
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
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            onDelete(version.versionId)
                                          }
                                        >
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
                                          onClick={() =>
                                            handleRestore(version.versionId)
                                          }
                                        >
                                          <RotateCcw className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Restore this version</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() =>
                                            handleMerge(version.versionId)
                                          }
                                        >
                                          <GitMerge className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Merge with current version</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Show tags for this version */}
                          {(() => {
                            const versionTags = tags.filter(
                              tag => tag.versionId === version.versionId
                            )
                            if (versionTags.length > 0) {
                              return (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {versionTags.map(tag => (
                                    <Badge
                                      key={tag.id}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          })()}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="graph" className="flex-1 overflow-hidden">
                <VersionHistoryGraph
                  versions={versions}
                  branches={branches}
                  tags={tags}
                  currentVersionId={currentVersionId}
                  currentBranchId={currentBranchId}
                  onVersionSelect={handleVersionSelect}
                />
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      {currentVersion && selectedVersion && (
        <VersionMergeDialog
          isOpen={mergeDialogOpen}
          onClose={() => setMergeDialogOpen(false)}
          projectId={projectId}
          currentVersion={currentVersion}
          targetVersion={selectedVersion}
          onMerge={handleMergeComplete}
        />
      )}
    </>
  )
}
