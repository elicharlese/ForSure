"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Undo2, Redo2, Save, Share, Code, FileJson, GitBranch } from "lucide-react"
import { FileStructureVisualization } from "./file-structure-visualization"
import { SaveProjectDialog } from "./save-project-dialog"
import { SaveTemplateDialog } from "./save-template-dialog"
import { ShareProjectDialog } from "./share-project-dialog"
import { SavedProjectsDialog } from "./saved-projects-dialog"
import { VersionHistoryDialog } from "./version-history-dialog"
import { BranchManagementDialog } from "./branch-management-dialog"
import { useSavedProjects } from "../hooks/use-saved-projects"
import type { FileNode } from "./file-structure-visualization"
import type { ProjectDetails } from "./project-details-form"
import type { MergeOptions } from "./version-merge-dialog"
import type { Team } from "../types/team"
import type { Tag } from "../hooks/use-saved-projects"

interface VisualizationPanelProps {
  projectDetails: ProjectDetails | null
  activeFileStructure: FileNode
  onFileStructureChange: (newStructure: FileNode) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onFormatAll: () => void
  currentTeam: Team | null
  onMergeVersions: (sourceVersionId: string, targetVersionId: string, options: MergeOptions) => void
  onCreateBranch: (sourceVersionId: string, name: string, description?: string, switchToBranch?: boolean) => void
  onSwitchBranch: (branchId: string) => void
  onDeleteBranch: (branchId: string) => void
  onRenameBranch: (branchId: string, newName: string) => void
}

export function VisualizationPanel({
  projectDetails,
  activeFileStructure,
  onFileStructureChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onFormatAll,
  currentTeam,
  onMergeVersions,
  onCreateBranch,
  onSwitchBranch,
  onDeleteBranch,
  onRenameBranch,
}: VisualizationPanelProps) {
  const [activeTab, setActiveTab] = useState("structure")
  const [saveProjectDialogOpen, setSaveProjectDialogOpen] = useState(false)
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false)
  const [shareProjectDialogOpen, setShareProjectDialogOpen] = useState(false)
  const [savedProjectsDialogOpen, setSavedProjectsDialogOpen] = useState(false)
  const {
    getProjectVersions,
    getProjectBranches,
    getProjectTags,
    getCurrentBranch,
    createBranch,
    switchBranch,
    deleteBranch,
    renameBranch,
    createTag,
    deleteTag,
    updateTag,
    moveTag,
    restoreVersion,
    deleteVersion,
  } = useSavedProjects()

  // Get versions, branches, and tags if project is saved
  const versions = projectDetails?.id ? getProjectVersions(projectDetails.id) : []
  const branches = projectDetails?.id ? getProjectBranches(projectDetails.id) : []
  const tags = projectDetails?.id ? getProjectTags(projectDetails.id) : []
  const currentBranch = projectDetails?.id ? getCurrentBranch(projectDetails.id) : null
  const currentVersionId = projectDetails?.id
    ? versions.find((v) => v.details.id === projectDetails.id)?.versionId || ""
    : ""

  const handleCreateBranch = (sourceVersionId: string, name: string, description?: string, switchToBranch = true) => {
    if (!projectDetails?.id) return
    createBranch(projectDetails.id, sourceVersionId, name, description, switchToBranch)
  }

  const handleSwitchBranch = (branchId: string) => {
    if (!projectDetails?.id) return
    switchBranch(projectDetails.id, branchId)
  }

  const handleDeleteBranch = (branchId: string) => {
    if (!projectDetails?.id) return
    deleteBranch(projectDetails.id, branchId)
  }

  const handleRenameBranch = (branchId: string, newName: string) => {
    if (!projectDetails?.id) return
    renameBranch(projectDetails.id, branchId, newName)
  }

  const handleRestoreVersion = (versionId: string) => {
    if (!projectDetails?.id) return
    restoreVersion(projectDetails.id, versionId)
  }

  const handleDeleteVersion = (versionId: string) => {
    if (!projectDetails?.id) return
    deleteVersion(projectDetails.id, versionId)
  }

  const handleCreateTag = (
    versionId: string,
    name: string,
    type: Tag["type"],
    description?: string,
    metadata?: Tag["metadata"],
  ) => {
    if (!projectDetails?.id) return
    createTag(projectDetails.id, versionId, name, type, description, metadata)
  }

  const handleDeleteTag = (tagId: string) => {
    if (!projectDetails?.id) return
    deleteTag(projectDetails.id, tagId)
  }

  const handleUpdateTag = (tagId: string, updates: Partial<Pick<Tag, "name" | "description" | "metadata">>) => {
    if (!projectDetails?.id) return
    updateTag(projectDetails.id, tagId, updates)
  }

  const handleMoveTag = (tagId: string, newVersionId: string) => {
    if (!projectDetails?.id) return
    moveTag(projectDetails.id, tagId, newVersionId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="structure">File Structure</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
                <Undo2 className="h-4 w-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
                <Redo2 className="h-4 w-4 mr-2" />
                Redo
              </Button>
              <Button variant="outline" size="sm" onClick={onFormatAll}>
                <Code className="h-4 w-4 mr-2" />
                Format All
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto">
        <TabsContent value="structure" className="h-full m-0">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSaveProjectDialogOpen(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSaveTemplateDialogOpen(true)}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShareProjectDialogOpen(true)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSavedProjectsDialogOpen(true)}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Saved Projects
                </Button>

                {projectDetails?.id && versions.length > 0 && (
                  <VersionHistoryDialog
                    projectId={projectDetails.id}
                    versions={versions}
                    branches={branches}
                    tags={tags}
                    currentVersionId={currentVersionId}
                    currentBranchId={currentBranch?.id || ""}
                    onRestore={handleRestoreVersion}
                    onDelete={handleDeleteVersion}
                    onMerge={onMergeVersions}
                    onCreateBranch={handleCreateBranch}
                    onSwitchBranch={handleSwitchBranch}
                    onDeleteBranch={handleDeleteBranch}
                    onRenameBranch={handleRenameBranch}
                    onCreateTag={handleCreateTag}
                    onDeleteTag={handleDeleteTag}
                    onUpdateTag={handleUpdateTag}
                    onMoveTag={handleMoveTag}
                  />
                )}

                {projectDetails?.id && branches.length > 0 && (
                  <BranchManagementDialog
                    projectId={projectDetails.id}
                    branches={branches}
                    versions={versions}
                    currentBranchId={currentBranch?.id || ""}
                    currentVersionId={currentVersionId}
                    onCreateBranch={handleCreateBranch}
                    onSwitchBranch={handleSwitchBranch}
                    onDeleteBranch={handleDeleteBranch}
                    onRenameBranch={handleRenameBranch}
                  />
                )}
              </div>
            </div>

            {currentBranch && (
              <div className="px-4 py-2 bg-muted/30 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Current branch: <span className="font-medium">{currentBranch.name}</span>
                  </span>
                </div>
                {branches.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={() => {
                      const branchDialog = document.querySelector(
                        '[data-dialog-content="branch-management"]',
                      ) as HTMLElement
                      if (branchDialog) branchDialog.click()
                    }}
                  >
                    Switch Branch
                  </Button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-auto p-4">
              <FileStructureVisualization
                fileStructure={activeFileStructure}
                onFileStructureChange={onFileStructureChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-full m-0">
          <div className="h-full flex items-center justify-center bg-muted/30">
            <Card className="w-[600px]">
              <CardHeader>
                <CardTitle>Preview Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  The preview feature will allow you to see a visual representation of your project structure. This
                  feature is currently under development.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="h-full m-0">
          <div className="h-full flex items-center justify-center bg-muted/30">
            <Card className="w-[600px]">
              <CardHeader>
                <CardTitle>Code View Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  The code view will allow you to see and edit the ForSure code representation of your project
                  structure. This feature is currently under development.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>

      {/* Dialogs */}
      <SaveProjectDialog
        isOpen={saveProjectDialogOpen}
        onClose={() => setSaveProjectDialogOpen(false)}
        projectDetails={projectDetails}
      />

      <SaveTemplateDialog
        isOpen={saveTemplateDialogOpen}
        onClose={() => setSaveTemplateDialogOpen(false)}
        fileStructure={activeFileStructure}
        projectDetails={projectDetails}
      />

      <ShareProjectDialog
        isOpen={shareProjectDialogOpen}
        onClose={() => setShareProjectDialogOpen(false)}
        projectDetails={projectDetails}
      />

      <SavedProjectsDialog
        isOpen={savedProjectsDialogOpen}
        onClose={() => setSavedProjectsDialogOpen(false)}
        currentTeam={currentTeam}
      />
    </div>
  )
}
