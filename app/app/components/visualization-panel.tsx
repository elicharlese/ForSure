"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileStructureVisualization, type FileNode } from "./file-structure-visualization"
import { PortViewer } from "./port-viewer"
import { TemplateBrowser } from "./template-browser"
import { SaveTemplateDialog } from "./save-template-dialog"
import { generateFileStructure } from "../services/file-structure-service"
import { applyTemplate } from "../services/template-service"
import type { ProjectDetails } from "./project-details-form"
import { LayoutTemplate, Save } from "lucide-react"

interface VisualizationPanelProps {
  projectDetails: ProjectDetails | null
  activeFileStructure: FileNode | null
  onFileStructureChange: (newStructure: FileNode) => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
}

export function VisualizationPanel({
  projectDetails,
  activeFileStructure,
  onFileStructureChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: VisualizationPanelProps) {
  const [activeTab, setActiveTab] = useState("structure")
  const [templateBrowserOpen, setTemplateBrowserOpen] = useState(false)
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false)

  // Generate a default file structure if none is provided
  const fileStructure = activeFileStructure || (projectDetails ? generateFileStructure(projectDetails) : null)

  const handleApplyTemplate = (templateId: string) => {
    if (!projectDetails) return

    const newStructure = applyTemplate(templateId, projectDetails.name)
    if (newStructure) {
      onFileStructureChange(newStructure)
    }
  }

  const handleSaveTemplate = (templateId: string) => {
    // Template saved successfully
    console.log("Template saved with ID:", templateId)
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4 flex justify-between items-center">
          <TabsList className="h-12">
            <TabsTrigger value="structure" className="data-[state=active]:bg-primary/10">
              File Structure
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-primary/10">
              Port Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "structure" && fileStructure && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setTemplateBrowserOpen(true)} className="h-8 gap-1">
                <LayoutTemplate className="h-4 w-4" />
                <span>Templates</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaveTemplateOpen(true)}
                className="h-8 gap-1"
                disabled={!projectDetails}
              >
                <Save className="h-4 w-4" />
                <span>Save as Template</span>
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="structure" className="flex-1 p-4 overflow-auto">
          {fileStructure ? (
            <FileStructureVisualization
              structure={fileStructure}
              className="h-full"
              onStructureChange={onFileStructureChange}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={onUndo}
              onRedo={onRedo}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No project structure available. Create a project to see file structure recommendations.
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
          <PortViewer projectDetails={projectDetails} />
        </TabsContent>
      </Tabs>

      {/* Template browser dialog */}
      {templateBrowserOpen && (
        <TemplateBrowser
          isOpen={templateBrowserOpen}
          onClose={() => setTemplateBrowserOpen(false)}
          onSelectTemplate={handleApplyTemplate}
          currentFramework={projectDetails?.framework}
          currentType={projectDetails?.type}
        />
      )}

      {/* Save template dialog */}
      {saveTemplateOpen && fileStructure && projectDetails && (
        <SaveTemplateDialog
          isOpen={saveTemplateOpen}
          onClose={() => setSaveTemplateOpen(false)}
          onSave={handleSaveTemplate}
          structure={fileStructure}
          projectDetails={projectDetails}
        />
      )}
    </div>
  )
}
