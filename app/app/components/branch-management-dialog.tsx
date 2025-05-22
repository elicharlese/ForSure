"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, Check, Trash2, Edit, Clock, ArrowRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { Branch, ProjectVersion } from "../hooks/use-saved-projects"

interface BranchManagementDialogProps {
  projectId: string
  branches: Branch[]
  versions: ProjectVersion[]
  currentBranchId: string
  currentVersionId: string
  onCreateBranch: (sourceVersionId: string, name: string, description?: string, switchToBranch?: boolean) => void
  onSwitchBranch: (branchId: string) => void
  onDeleteBranch: (branchId: string) => void
  onRenameBranch: (branchId: string, newName: string) => void
  trigger?: React.ReactNode
}

export function BranchManagementDialog({
  projectId,
  branches,
  versions,
  currentBranchId,
  currentVersionId,
  onCreateBranch,
  onSwitchBranch,
  onDeleteBranch,
  onRenameBranch,
  trigger,
}: BranchManagementDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [newBranchName, setNewBranchName] = useState("")
  const [newBranchDescription, setNewBranchDescription] = useState("")
  const [sourceVersionId, setSourceVersionId] = useState(currentVersionId)
  const [switchToNewBranch, setSwitchToNewBranch] = useState(true)
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null)
  const [editedBranchName, setEditedBranchName] = useState("")
  const [isCreatingBranch, setIsCreatingBranch] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewBranchName("")
      setNewBranchDescription("")
      setSourceVersionId(currentVersionId)
      setSwitchToNewBranch(true)
      setEditingBranchId(null)
    }
  }, [open, currentVersionId])

  const handleCreateBranch = () => {
    if (!newBranchName.trim()) return

    onCreateBranch(sourceVersionId, newBranchName.trim(), newBranchDescription.trim() || undefined, switchToNewBranch)
    setIsCreatingBranch(false)
    setNewBranchName("")
    setNewBranchDescription("")
  }

  const handleRenameBranch = (branchId: string) => {
    if (!editedBranchName.trim()) return
    onRenameBranch(branchId, editedBranchName.trim())
    setEditingBranchId(null)
  }

  const startEditingBranch = (branch: Branch) => {
    setEditingBranchId(branch.id)
    setEditedBranchName(branch.name)
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

  const getBranchVersionCount = (branchId: string) => {
    return versions.filter((v) => v.branchId === branchId).length
  }

  const getVersionName = (versionId: string) => {
    const version = versions.find((v) => v.versionId === versionId)
    if (!version) return "Unknown version"
    return version.notes?.includes("Merge of") ? "Merge result" : `Version ${versionId.substring(0, 7)}`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <GitBranch className="h-4 w-4 mr-2" />
            Branches
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Branch Management</DialogTitle>
          <DialogDescription>Create, switch, and manage branches for your project.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                <span>Branches</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-1" onClick={() => setIsCreatingBranch(true)}>
                <GitBranch className="h-4 w-4" />
                <span>Create Branch</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="flex-1 overflow-hidden">
            {branches.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                <GitBranch className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No branches available</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setActiveTab("create")
                    setIsCreatingBranch(true)
                  }}
                >
                  Create Branch
                </Button>
              </div>
            ) : (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-3 pr-4">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className={`p-3 border rounded-md transition-colors ${
                        branch.id === currentBranchId ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      style={{
                        borderLeftColor: branch.color,
                        borderLeftWidth: "4px",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {editingBranchId === branch.id ? (
                            <div className="flex items-center gap-2 mb-2">
                              <Input
                                value={editedBranchName}
                                onChange={(e) => setEditedBranchName(e.target.value)}
                                className="h-8"
                                placeholder="Branch name"
                                autoFocus
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRenameBranch(branch.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingBranchId(null)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{branch.name}</h4>
                              {branch.isDefault && (
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  Default
                                </Badge>
                              )}
                              {branch.id === currentBranchId && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                >
                                  Current
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Created: {formatDate(branch.createdAt)}</span>
                          </div>

                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Last updated: {formatDate(branch.lastUpdated)}</span>
                          </div>

                          {branch.description && (
                            <div className="mt-2 text-sm">
                              <p className="text-xs">{branch.description}</p>
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{getBranchVersionCount(branch.id)} versions</span>
                            <span>•</span>
                            <span className="flex items-center">Head: {getVersionName(branch.headVersionId)}</span>
                          </div>

                          {branch.sourceVersionId !== branch.headVersionId && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                Created from: {getVersionName(branch.sourceVersionId)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 ml-4">
                          {!branch.isDefault && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteBranch(branch.id)}
                                    disabled={branch.id === currentBranchId}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete branch</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditingBranch(branch)}
                                  disabled={editingBranchId === branch.id}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rename branch</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {branch.id !== currentBranchId && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => {
                                      onSwitchBranch(branch.id)
                                      setOpen(false)
                                    }}
                                  >
                                    <ArrowRight className="h-3 w-3" />
                                    <span>Switch</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Switch to this branch</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="create" className="flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input
                  id="branch-name"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="feature/new-feature"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch-description">Description (Optional)</Label>
                <Textarea
                  id="branch-description"
                  value={newBranchDescription}
                  onChange={(e) => setNewBranchDescription(e.target.value)}
                  placeholder="What is this branch for?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-version">Create From</Label>
                <Select value={sourceVersionId} onValueChange={setSourceVersionId}>
                  <SelectTrigger id="source-version">
                    <SelectValue placeholder="Select a version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version) => (
                      <SelectItem key={version.versionId} value={version.versionId}>
                        {version.versionId === currentVersionId
                          ? "Current Version"
                          : version.notes?.includes("Merge of")
                            ? `Merge Result (${version.versionId.substring(0, 7)})`
                            : `Version ${version.versionId.substring(0, 7)}`}
                        {version.notes &&
                          !version.notes.includes("Merge of") &&
                          ` - ${version.notes.substring(0, 30)}${version.notes.length > 30 ? "..." : ""}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="switch-to-branch" checked={switchToNewBranch} onCheckedChange={setSwitchToNewBranch} />
                <Label htmlFor="switch-to-branch">Switch to new branch after creation</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between">
          <div>
            {activeTab === "list" && (
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("create")
                  setIsCreatingBranch(true)
                }}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Create Branch
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {activeTab === "create" && (
              <Button variant="default" onClick={handleCreateBranch} disabled={!newBranchName.trim()}>
                Create Branch
              </Button>
            )}
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
