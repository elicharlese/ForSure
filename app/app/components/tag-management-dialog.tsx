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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TagIcon,
  Plus,
  Trash2,
  Edit,
  Calendar,
  GitlabIcon as GitTag,
  Milestone,
  Zap,
  Star,
  Package,
  Search,
  Filter,
} from "lucide-react"
import type { Tag, ProjectVersion } from "../hooks/use-saved-projects"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TagManagementDialogProps {
  projectId: string
  tags: Tag[]
  versions: ProjectVersion[]
  currentVersionId: string
  onCreateTag: (
    versionId: string,
    name: string,
    type: Tag["type"],
    description?: string,
    metadata?: Tag["metadata"],
  ) => void
  onDeleteTag: (tagId: string) => void
  onUpdateTag: (tagId: string, updates: Partial<Pick<Tag, "name" | "description" | "metadata">>) => void
  onMoveTag: (tagId: string, newVersionId: string) => void
  trigger?: React.ReactNode
}

const TAG_TYPES = [
  { value: "release", label: "Release", icon: Package, color: "bg-green-500" },
  { value: "milestone", label: "Milestone", icon: Milestone, color: "bg-blue-500" },
  { value: "hotfix", label: "Hotfix", icon: Zap, color: "bg-red-500" },
  { value: "feature", label: "Feature", icon: Star, color: "bg-purple-500" },
  { value: "custom", label: "Custom", icon: TagIcon, color: "bg-gray-500" },
] as const

export function TagManagementDialog({
  projectId,
  tags,
  versions,
  currentVersionId,
  onCreateTag,
  onDeleteTag,
  onUpdateTag,
  onMoveTag,
  trigger,
}: TagManagementDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<Tag["type"] | "all">("all")
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  // Create tag form state
  const [createTagForm, setCreateTagForm] = useState({
    name: "",
    type: "custom" as Tag["type"],
    description: "",
    versionId: currentVersionId,
    version: "",
    changelog: "",
    releaseNotes: "",
  })

  // Edit tag form state
  const [editTagForm, setEditTagForm] = useState({
    name: "",
    description: "",
    version: "",
    changelog: "",
    releaseNotes: "",
  })

  const handleCreateTag = () => {
    if (!createTagForm.name.trim()) return

    const metadata: Tag["metadata"] = {}
    if (createTagForm.version) metadata.version = createTagForm.version
    if (createTagForm.changelog) metadata.changelog = createTagForm.changelog
    if (createTagForm.releaseNotes) metadata.releaseNotes = createTagForm.releaseNotes

    onCreateTag(
      createTagForm.versionId,
      createTagForm.name,
      createTagForm.type,
      createTagForm.description || undefined,
      Object.keys(metadata).length > 0 ? metadata : undefined,
    )

    // Reset form
    setCreateTagForm({
      name: "",
      type: "custom",
      description: "",
      versionId: currentVersionId,
      version: "",
      changelog: "",
      releaseNotes: "",
    })

    setActiveTab("list")
  }

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag)
    setEditTagForm({
      name: tag.name,
      description: tag.description || "",
      version: tag.metadata?.version || "",
      changelog: tag.metadata?.changelog || "",
      releaseNotes: tag.metadata?.releaseNotes || "",
    })
    setActiveTab("edit")
  }

  const handleUpdateTag = () => {
    if (!editingTag) return

    const metadata: Tag["metadata"] = { ...editingTag.metadata }
    if (editTagForm.version) metadata.version = editTagForm.version
    if (editTagForm.changelog) metadata.changelog = editTagForm.changelog
    if (editTagForm.releaseNotes) metadata.releaseNotes = editTagForm.releaseNotes

    onUpdateTag(editingTag.id, {
      name: editTagForm.name,
      description: editTagForm.description || undefined,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    })

    setEditingTag(null)
    setActiveTab("list")
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

  const getShortId = (id: string) => {
    return id.substring(0, 7)
  }

  const getTagTypeInfo = (type: Tag["type"]) => {
    return TAG_TYPES.find((t) => t.value === type) || TAG_TYPES[4]
  }

  const getVersionInfo = (versionId: string) => {
    const version = versions.find((v) => v.versionId === versionId)
    if (!version) return { shortId: "Unknown", timestamp: "" }

    return {
      shortId: getShortId(versionId),
      timestamp: version.timestamp,
    }
  }

  // Filter tags based on search and type
  const filteredTags = tags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.metadata?.version?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || tag.type === filterType

    return matchesSearch && matchesType
  })

  // Sort tags by creation date (newest first)
  const sortedTags = [...filteredTags].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <GitTag className="h-4 w-4 mr-2" />
            Manage Tags
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tag Management</DialogTitle>
          <DialogDescription>
            Create and manage version tags for releases, milestones, and important checkpoints.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Tags ({tags.length})</TabsTrigger>
            <TabsTrigger value="create">Create Tag</TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingTag}>
              {editingTag ? "Edit Tag" : "Edit"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="flex-1 overflow-hidden">
            <div className="space-y-4">
              {/* Search and filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as Tag["type"] | "all")}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {TAG_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags list */}
              <ScrollArea className="max-h-[50vh]">
                {sortedTags.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <GitTag className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No tags found</p>
                    {searchQuery && <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>}
                  </div>
                ) : (
                  <div className="space-y-3 pr-4">
                    {sortedTags.map((tag) => {
                      const typeInfo = getTagTypeInfo(tag.type)
                      const versionInfo = getVersionInfo(tag.versionId)
                      const TypeIcon = typeInfo.icon

                      return (
                        <div key={tag.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1 rounded ${typeInfo.color} text-white`}>
                                  <TypeIcon className="h-3 w-3" />
                                </div>
                                <h4 className="font-medium">{tag.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {typeInfo.label}
                                </Badge>
                                {tag.metadata?.version && (
                                  <Badge variant="secondary" className="text-xs">
                                    v{tag.metadata.version}
                                  </Badge>
                                )}
                                {tag.isProtected && (
                                  <Badge variant="destructive" className="text-xs">
                                    Protected
                                  </Badge>
                                )}
                              </div>

                              {tag.description && (
                                <p className="text-sm text-muted-foreground mb-2">{tag.description}</p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(tag.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <GitTag className="h-3 w-3" />
                                  <span>Version {versionInfo.shortId}</span>
                                </div>
                              </div>

                              {tag.metadata?.changelog && (
                                <div className="mt-2 p-2 bg-muted rounded text-xs">
                                  <div className="font-medium mb-1">Changelog:</div>
                                  <p>{tag.metadata.changelog}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 ml-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditTag(tag)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit tag</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {!tag.isProtected && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={() => onDeleteTag(tag.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Delete tag</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="create" className="flex-1 overflow-hidden">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">Tag Name *</Label>
                    <Input
                      id="tag-name"
                      placeholder="e.g., v1.0.0, milestone-1"
                      value={createTagForm.name}
                      onChange={(e) => setCreateTagForm({ ...createTagForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tag-type">Tag Type</Label>
                    <Select
                      value={createTagForm.type}
                      onValueChange={(value) => setCreateTagForm({ ...createTagForm, type: value as Tag["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TAG_TYPES.map((type) => {
                          const TypeIcon = type.icon
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded ${type.color} text-white`}>
                                  <TypeIcon className="h-3 w-3" />
                                </div>
                                {type.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag-version">Target Version</Label>
                  <Select
                    value={createTagForm.versionId}
                    onValueChange={(value) => setCreateTagForm({ ...createTagForm, versionId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {versions
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((version, index) => (
                          <SelectItem key={version.versionId} value={version.versionId}>
                            <div className="flex items-center gap-2">
                              <span>Version {versions.length - index}</span>
                              <span className="text-muted-foreground">({getShortId(version.versionId)})</span>
                              {version.versionId === currentVersionId && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag-description">Description</Label>
                  <Textarea
                    id="tag-description"
                    placeholder="Describe this tag..."
                    value={createTagForm.description}
                    onChange={(e) => setCreateTagForm({ ...createTagForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Additional Metadata</h4>

                  <div className="space-y-2">
                    <Label htmlFor="semantic-version">Semantic Version</Label>
                    <Input
                      id="semantic-version"
                      placeholder="e.g., 1.0.0"
                      value={createTagForm.version}
                      onChange={(e) => setCreateTagForm({ ...createTagForm, version: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="changelog">Changelog</Label>
                    <Textarea
                      id="changelog"
                      placeholder="What changed in this version..."
                      value={createTagForm.changelog}
                      onChange={(e) => setCreateTagForm({ ...createTagForm, changelog: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="release-notes">Release Notes</Label>
                    <Textarea
                      id="release-notes"
                      placeholder="Detailed release notes..."
                      value={createTagForm.releaseNotes}
                      onChange={(e) => setCreateTagForm({ ...createTagForm, releaseNotes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setActiveTab("list")}>
                Cancel
              </Button>
              <Button onClick={handleCreateTag} disabled={!createTagForm.name.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tag
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="flex-1 overflow-hidden">
            {editingTag && (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 pr-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-tag-name">Tag Name *</Label>
                    <Input
                      id="edit-tag-name"
                      value={editTagForm.name}
                      onChange={(e) => setEditTagForm({ ...editTagForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-tag-description">Description</Label>
                    <Textarea
                      id="edit-tag-description"
                      value={editTagForm.description}
                      onChange={(e) => setEditTagForm({ ...editTagForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Metadata</h4>

                    <div className="space-y-2">
                      <Label htmlFor="edit-semantic-version">Semantic Version</Label>
                      <Input
                        id="edit-semantic-version"
                        value={editTagForm.version}
                        onChange={(e) => setEditTagForm({ ...editTagForm, version: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-changelog">Changelog</Label>
                      <Textarea
                        id="edit-changelog"
                        value={editTagForm.changelog}
                        onChange={(e) => setEditTagForm({ ...editTagForm, changelog: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-release-notes">Release Notes</Label>
                      <Textarea
                        id="edit-release-notes"
                        value={editTagForm.releaseNotes}
                        onChange={(e) => setEditTagForm({ ...editTagForm, releaseNotes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTag(null)
                  setActiveTab("list")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateTag} disabled={!editTagForm.name.trim()}>
                <Edit className="h-4 w-4 mr-2" />
                Update Tag
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
