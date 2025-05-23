"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronRight,
  Code,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  GitMerge,
  History,
  MoreHorizontal,
  Plus,
  Redo,
  Save,
  Share,
  Tag,
  Undo,
  Users,
  Zap,
  Wand2,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { ProjectDetails } from "./project-details-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FileStructureNode {
  name: string
  type: "file" | "directory"
  children?: FileStructureNode[]
  content?: string
  language?: string
}

interface VisualizationPanelProps {
  projectDetails: ProjectDetails
  activeFileStructure: FileStructureNode
  onFileStructureChange: (structure: FileStructureNode, addToHistory?: boolean) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onFormatAll: () => void
  currentTeam: any
  onMergeVersions: () => void
  onCreateBranch: () => void
  onSwitchBranch: () => void
  onDeleteBranch: () => void
  onRenameBranch: () => void
  onCreateTag: () => void
  onDeleteTag: () => void
  onUpdateTag: () => void
  onMoveTag: () => void
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
  onCreateTag,
  onDeleteTag,
  onUpdateTag,
  onMoveTag,
}: VisualizationPanelProps) {
  const [activeView, setActiveView] = useState<"structure" | "code" | "preview">("structure")
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>("")

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]))
  }

  const selectNode = (path: string) => {
    setSelectedNode(path)
    const node = getNodeByPath(activeFileStructure, path.split("/").filter(Boolean))
    if (node && node.type === "file" && node.content) {
      setEditingContent(node.content)
    }
  }

  const getNodeByPath = (node: FileStructureNode, pathParts: string[]): FileStructureNode | null => {
    if (pathParts.length === 0) return node
    if (!node.children) return null

    const [current, ...rest] = pathParts
    const childNode = node.children.find((child) => child.name === current)
    if (!childNode) return null

    return rest.length === 0 ? childNode : getNodeByPath(childNode, rest)
  }

  const handleAddFile = (parentPath: string) => {
    const newFileName = prompt("Enter file name:")
    if (!newFileName) return

    const updatedStructure = { ...activeFileStructure }
    const parentNode = parentPath
      ? getNodeByPath(updatedStructure, parentPath.split("/").filter(Boolean))
      : updatedStructure

    if (parentNode) {
      if (!parentNode.children) parentNode.children = []
      parentNode.children.push({
        name: newFileName,
        type: "file",
        content: "",
      })
      onFileStructureChange(updatedStructure, true)
    }
  }

  const handleAddFolder = (parentPath: string) => {
    const newFolderName = prompt("Enter folder name:")
    if (!newFolderName) return

    const updatedStructure = { ...activeFileStructure }
    const parentNode = parentPath
      ? getNodeByPath(updatedStructure, parentPath.split("/").filter(Boolean))
      : updatedStructure

    if (parentNode) {
      if (!parentNode.children) parentNode.children = []
      parentNode.children.push({
        name: newFolderName,
        type: "directory",
        children: [],
      })
      onFileStructureChange(updatedStructure, true)
      toggleFolder(parentPath ? `${parentPath}/${newFolderName}` : newFolderName)
    }
  }

  const handleDeleteNode = (path: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    const pathParts = path.split("/").filter(Boolean)
    const nodeName = pathParts.pop()
    const parentPath = pathParts.join("/")

    const updatedStructure = { ...activeFileStructure }
    const parentNode = parentPath
      ? getNodeByPath(updatedStructure, parentPath.split("/").filter(Boolean))
      : updatedStructure

    if (parentNode && parentNode.children && nodeName) {
      parentNode.children = parentNode.children.filter((child) => child.name !== nodeName)
      onFileStructureChange(updatedStructure, true)
      if (selectedNode === path) setSelectedNode(null)
    }
  }

  const handleRenameNode = (path: string) => {
    const pathParts = path.split("/").filter(Boolean)
    const nodeName = pathParts.pop()
    const parentPath = pathParts.join("/")

    const node = getNodeByPath(activeFileStructure, path.split("/").filter(Boolean))
    if (!node) return

    const newName = prompt("Enter new name:", nodeName)
    if (!newName || newName === nodeName) return

    const updatedStructure = { ...activeFileStructure }
    const parentNode = parentPath
      ? getNodeByPath(updatedStructure, parentPath.split("/").filter(Boolean))
      : updatedStructure

    if (parentNode && parentNode.children && nodeName) {
      const nodeIndex = parentNode.children.findIndex((child) => child.name === nodeName)
      if (nodeIndex !== -1) {
        parentNode.children[nodeIndex].name = newName
        onFileStructureChange(updatedStructure, true)

        // Update expanded folders and selected node paths
        if (node.type === "directory") {
          const oldPath = path
          const newPath = parentPath ? `${parentPath}/${newName}` : newName
          setExpandedFolders((prev) =>
            prev.map((p) =>
              p === oldPath ? newPath : p.startsWith(`${oldPath}/`) ? `${newPath}/${p.slice(oldPath.length + 1)}` : p,
            ),
          )
        }

        if (selectedNode === path) {
          const newPath = parentPath ? `${parentPath}/${newName}` : newName
          setSelectedNode(newPath)
        }
      }
    }
  }

  const handleSaveContent = () => {
    if (!selectedNode) return

    const updatedStructure = { ...activeFileStructure }
    const node = getNodeByPath(updatedStructure, selectedNode.split("/").filter(Boolean))
    if (node && node.type === "file") {
      node.content = editingContent
      onFileStructureChange(updatedStructure, true)
      setEditingNode(null)
    }
  }

  const renderFileStructure = (node: FileStructureNode, path = "", level = 0) => {
    const isExpanded = expandedFolders.includes(path)
    const isSelected = selectedNode === path
    const isFolder = node.type === "directory"
    const hasChildren = isFolder && node.children && node.children.length > 0

    const getFileIcon = (name: string) => {
      const ext = name.split(".").pop()?.toLowerCase()
      if (ext === "js" || ext === "jsx" || ext === "ts" || ext === "tsx")
        return <FileCode className="h-4 w-4 text-yellow-500" />
      if (ext === "json") return <FileCode className="h-4 w-4 text-green-500" />
      if (ext === "md" || ext === "txt") return <FileText className="h-4 w-4 text-blue-500" />
      if (ext === "html" || ext === "css") return <Code className="h-4 w-4 text-purple-500" />
      return <File className="h-4 w-4 text-gray-500" />
    }

    return (
      <div key={path || "root"}>
        <div
          className={`flex items-center py-1 px-2 rounded-md ${
            isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
          }`}
          style={{ paddingLeft: `${level * 12 + 4}px` }}
          onClick={(e) => {
            e.stopPropagation()
            if (isFolder) {
              toggleFolder(path)
            } else {
              selectNode(path)
              setActiveView("code")
            }
          }}
        >
          <div className="flex-1 flex items-center overflow-hidden">
            {isFolder ? (
              <>
                <button
                  className="mr-1 p-0.5 rounded-sm hover:bg-muted-foreground/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFolder(path)
                  }}
                >
                  {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-amber-500 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 text-amber-500 mr-2" />
                )}
              </>
            ) : (
              <span className="ml-4 mr-2">{getFileIcon(node.name)}</span>
            )}
            <span className="truncate">{node.name}</span>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isFolder && (
                  <>
                    <DropdownMenuItem onClick={() => handleAddFile(path)}>
                      <File className="h-4 w-4 mr-2" />
                      Add File
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddFolder(path)}>
                      <Folder className="h-4 w-4 mr-2" />
                      Add Folder
                    </DropdownMenuItem>
                    <Separator className="my-1" />
                  </>
                )}
                <DropdownMenuItem onClick={() => handleRenameNode(path)}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteNode(path)} className="text-red-500">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child) =>
              renderFileStructure(child, path ? `${path}/${child.name}` : child.name, level + 1),
            )}
          </div>
        )}
      </div>
    )
  }

  const renderCodeEditor = () => {
    if (!selectedNode) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="mb-6 p-4 rounded-full bg-primary/10">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No File Selected</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Select a file to edit its content or use the auto-formatter to improve your code structure and style.
          </p>
          <Button
            onClick={onFormatAll}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Auto-Format All Files
          </Button>
        </div>
      )
    }

    const node = getNodeByPath(activeFileStructure, selectedNode.split("/").filter(Boolean))
    if (!node || node.type !== "file") {
      return <div className="flex items-center justify-center h-full text-muted-foreground">Invalid selection</div>
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b bg-gradient-to-r from-teal-500/10 to-indigo-500/10">
          <div className="flex items-center">
            <div className="h-5 w-5 mr-2 rounded-sm bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center">
              <Code className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium">{selectedNode}</span>
          </div>
          <Button
            size="sm"
            onClick={handleSaveContent}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white border-none"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        <div className="flex-1 p-2 overflow-auto bg-slate-900">
          <textarea
            className="w-full h-full min-h-[300px] font-mono text-sm p-4 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none border-none placeholder-slate-500 selection:bg-indigo-500/30"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            spellCheck={false}
            style={{
              lineHeight: "1.5",
              caretColor: "#14b8a6", // teal-500
              boxShadow: "inset 0 0 0 1px rgba(71, 85, 105, 0.2)",
            }}
          />
        </div>
        <div className="p-2 border-t bg-slate-900 text-slate-400 text-xs flex items-center justify-between">
          <div>ForSure Syntax</div>
          <div className="flex items-center">
            <span className="mr-2">Line: 1, Col: 1</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    )
  }

  const renderPreview = () => {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Preview functionality coming soon
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full border-l">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center space-x-2">
          <Button
            variant={activeView === "structure" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("structure")}
          >
            <Folder className="h-4 w-4 mr-2" />
            Structure
          </Button>
          <Button
            variant={activeView === "code" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("code")}
            className={
              activeView === "code" ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white border-none" : ""
            }
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
          <Button
            variant={activeView === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("preview")}
          >
            <Zap className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onUndo} disabled={!canUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onRedo} disabled={!canRedo}>
            <Redo className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <GitBranch className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onFormatAll}>
                <Zap className="h-4 w-4 mr-2" />
                Format All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onMergeVersions}>
                <GitMerge className="h-4 w-4 mr-2" />
                Merge Versions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateBranch}>
                <GitBranch className="h-4 w-4 mr-2" />
                Create Branch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateTag}>
                <Tag className="h-4 w-4 mr-2" />
                Create Tag
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Share className="h-4 w-4 mr-2" />
                Share Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <History className="h-4 w-4 mr-2" />
                Version History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Users className="h-4 w-4 mr-2" />
                Team Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {activeView === "structure" && (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Project Files</h3>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleAddFile("")}>
                  <File className="h-4 w-4 mr-1" />
                  Add File
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAddFolder("")}>
                  <Folder className="h-4 w-4 mr-1" />
                  Add Folder
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-2">
                {renderFileStructure(activeFileStructure)}
                {(!activeFileStructure.children || activeFileStructure.children.length === 0) && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No files yet. Start by adding a file or folder.</p>
                    <div className="flex justify-center mt-4 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddFile("")}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add File
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddFolder("")}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Folder
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        {activeView === "code" && renderCodeEditor()}
        {activeView === "preview" && renderPreview()}
      </div>
    </div>
  )
}
