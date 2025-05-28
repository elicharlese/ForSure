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
  Lightbulb,
  Target,
  Activity,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { ProjectDetails } from "./project-details-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PortViewer } from "./port-viewer"

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
  const [activeView, setActiveView] = useState<"structure" | "code" | "preview" | "port">("structure")
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>("")
  const [inspectMode, setInspectMode] = useState(false)
  const [inspectedElement, setInspectedElement] = useState<any>(null)
  const [inspectPrompts, setInspectPrompts] = useState<string[]>([])
  const [showInspectPanel, setShowInspectPanel] = useState(false)

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

  const handleInspectElement = (element: any, elementType: string, elementPath: string) => {
    setInspectedElement({
      type: elementType,
      path: elementPath,
      name: element.name || elementPath,
      content: element.content || "",
      properties: getElementProperties(element, elementType),
    })

    // Generate contextual prompts based on the inspected element
    const prompts = generateInspectPrompts(element, elementType, elementPath)
    setInspectPrompts(prompts)
    setShowInspectPanel(true)
  }

  const getElementProperties = (element: any, elementType: string) => {
    const properties: Record<string, any> = {}

    if (elementType === "file") {
      properties.extension = getFileExtension(element.name)
      properties.size = element.content?.length || 0
      properties.lines = element.content?.split("\n").length || 0
    } else if (elementType === "directory") {
      properties.itemCount = element.children?.length || 0
      properties.fileCount = getFileCount(element)
      properties.folderCount = getFolderCount(element) - 1 // Subtract self
    }

    return properties
  }

  const generateInspectPrompts = (element: any, elementType: string, elementPath: string): string[] => {
    const prompts: string[] = []

    if (elementType === "file") {
      const ext = getFileExtension(element.name).toLowerCase()

      if (["js", "jsx", "ts", "tsx"].includes(ext)) {
        prompts.push(`Add TypeScript types to ${element.name}`)
        prompts.push(`Optimize the code structure in ${element.name}`)
        prompts.push(`Add error handling to ${element.name}`)
        prompts.push(`Create unit tests for ${element.name}`)
      } else if (ext === "json") {
        prompts.push(`Validate the JSON structure in ${element.name}`)
        prompts.push(`Add schema validation for ${element.name}`)
      } else if (ext === "md") {
        prompts.push(`Improve the documentation in ${element.name}`)
        prompts.push(`Add code examples to ${element.name}`)
      } else if (["css", "scss", "less"].includes(ext)) {
        prompts.push(`Optimize CSS performance in ${element.name}`)
        prompts.push(`Add responsive design to ${element.name}`)
      }

      prompts.push(`Refactor ${element.name} for better maintainability`)
      prompts.push(`Add comments and documentation to ${element.name}`)
    } else if (elementType === "directory") {
      prompts.push(`Organize files better in the ${element.name} directory`)
      prompts.push(`Add an index file to ${element.name}`)
      prompts.push(`Create a README for the ${element.name} directory`)
      prompts.push(`Add configuration files to ${element.name}`)
    }

    return prompts
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
          onClick={(e) => {
            e.stopPropagation()
            if (inspectMode) {
              handleInspectElement(node, isFolder ? "directory" : "file", path)
            } else {
              if (isFolder) {
                toggleFolder(path)
              } else {
                selectNode(path)
              }
            }
          }}
          className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
            isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
          } ${inspectMode ? "hover:bg-blue-100 hover:ring-2 hover:ring-blue-300" : ""}`}
          style={{ paddingLeft: `${level * 12 + 4}px` }}
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
    if (!selectedNode) {
      // Project overview when no file is selected
      return (
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-teal-500/10 to-indigo-500/10 w-16 h-16 mx-auto flex items-center justify-center">
              <Zap className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{projectDetails.name}</h3>
            <p className="text-muted-foreground mb-4">{projectDetails.description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full">{projectDetails.framework}</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">{projectDetails.language}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Folder className="h-4 w-4 mr-2 text-amber-500" />
                  Project Structure
                </h4>
                <div className="text-sm text-muted-foreground">
                  {getFileCount(activeFileStructure)} files in {getFolderCount(activeFileStructure)} folders
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Team
                </h4>
                <div className="text-sm text-muted-foreground">
                  {currentTeam ? `Working in ${currentTeam.name}` : "Personal project"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Recent Files</h4>
              <div className="space-y-2">
                {getRecentFiles(activeFileStructure).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => {
                      selectNode(file.path)
                      setActiveView("structure")
                    }}
                  >
                    {getFileIcon(file.name)}
                    <span className="ml-2 text-sm">{file.path}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    const node = getNodeByPath(activeFileStructure, selectedNode.split("/").filter(Boolean))
    if (!node) {
      return <div className="flex items-center justify-center h-full text-muted-foreground">File not found</div>
    }

    if (node.type === "directory") {
      // Directory preview
      return (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Folder className="h-5 w-5 mr-2 text-amber-500" />
              {node.name}
            </h3>
            <p className="text-muted-foreground">Directory contents</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {node.children?.map((child, index) => (
              <Card
                key={index}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  inspectMode ? "hover:ring-2 hover:ring-blue-300" : ""
                }`}
                onClick={() => {
                  const childPath = selectedNode ? `${selectedNode}/${child.name}` : child.name
                  if (inspectMode) {
                    handleInspectElement(child, child.type, childPath)
                  } else {
                    selectNode(childPath)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    {child.type === "directory" ? (
                      <Folder className="h-8 w-8 text-amber-500 mr-3" />
                    ) : (
                      <div className="mr-3">{getFileIcon(child.name)}</div>
                    )}
                    <div>
                      <div className="font-medium truncate">{child.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {child.type === "directory"
                          ? `${child.children?.length || 0} items`
                          : getFileExtension(child.name)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!node.children || node.children.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>This directory is empty</p>
            </div>
          )}
        </div>
      )
    }

    // File preview
    const fileExtension = getFileExtension(node.name).toLowerCase()
    const content = node.content || ""

    if (fileExtension === "md") {
      // Markdown preview
      return (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <h3 className="font-semibold flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              {node.name} - Markdown Preview
            </h3>
          </div>
          <div className="flex-1 p-6 overflow-auto prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
          </div>
        </div>
      )
    }

    if (fileExtension === "json") {
      // JSON preview
      return (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-green-500/10 to-teal-500/10">
            <h3 className="font-semibold flex items-center">
              <FileCode className="h-4 w-4 mr-2 text-green-500" />
              {node.name} - JSON Preview
            </h3>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-auto">
              {formatJSON(content)}
            </pre>
          </div>
        </div>
      )
    }

    if (fileExtension === "html") {
      // HTML preview
      return (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <h3 className="font-semibold flex items-center">
              <Code className="h-4 w-4 mr-2 text-orange-500" />
              {node.name} - HTML Preview
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <iframe
              srcDoc={content}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
              title="HTML Preview"
            />
          </div>
        </div>
      )
    }

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExtension)) {
      // Image preview
      return (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <h3 className="font-semibold flex items-center">
              <FileText className="h-4 w-4 mr-2 text-pink-500" />
              {node.name} - Image Preview
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 bg-checkered">
            <img
              src={content || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(node.name)}`}
              alt={node.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )
    }

    // Default code preview
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
          <h3 className="font-semibold flex items-center">
            <FileCode className="h-4 w-4 mr-2 text-purple-500" />
            {node.name} - Code Preview
          </h3>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-auto">
            <code>{content || "// Empty file"}</code>
          </pre>
        </div>
      </div>
    )
  }

  // Helper functions
  const getFileCount = (node: FileStructureNode): number => {
    if (node.type === "file") return 1
    return (node.children || []).reduce((count, child) => count + getFileCount(child), 0)
  }

  const getFolderCount = (node: FileStructureNode): number => {
    if (node.type === "file") return 0
    return 1 + (node.children || []).reduce((count, child) => count + getFolderCount(child), 0)
  }

  const getRecentFiles = (node: FileStructureNode, path = ""): Array<{ name: string; path: string }> => {
    const files: Array<{ name: string; path: string }> = []

    if (node.type === "file") {
      files.push({ name: node.name, path })
    } else if (node.children) {
      for (const child of node.children) {
        const childPath = path ? `${path}/${child.name}` : child.name
        files.push(...getRecentFiles(child, childPath))
      }
    }

    return files.slice(0, 5) // Return first 5 files
  }

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop() || ""
  }

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase()
    if (ext === "js" || ext === "jsx" || ext === "ts" || ext === "tsx")
      return <FileCode className="h-4 w-4 text-yellow-500" />
    if (ext === "json") return <FileCode className="h-4 w-4 text-green-500" />
    if (ext === "md" || ext === "txt") return <FileText className="h-4 w-4 text-blue-500" />
    if (ext === "html" || ext === "css") return <Code className="h-4 w-4 text-purple-500" />
    return <File className="h-4 w-4 text-gray-500" />
  }

  const renderMarkdown = (content: string): string => {
    // Simple markdown to HTML conversion
    return content
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>")
  }

  const formatJSON = (content: string): string => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2)
    } catch {
      return content
    }
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
            variant={activeView === "port" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("port")}
          >
            <Activity className="h-4 w-4 mr-2" />
            Port
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
      <div className="flex-1 overflow-auto relative">
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
        {activeView === "port" && (
          <div className="h-full">
            <PortViewer projectDetails={projectDetails} />
          </div>
        )}

        {/* Inspect Panel */}
        {showInspectPanel && inspectedElement && (
          <div className="absolute top-4 right-4 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  <h3 className="font-semibold">Inspect: {inspectedElement.name}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowInspectPanel(false)} className="h-6 w-6">
                  ×
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {inspectedElement.type === "file" ? "File" : "Directory"} • {inspectedElement.path}
              </p>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {/* Element Properties */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Properties</h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(inspectedElement.properties).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Prompts */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
                  AI Suggestions
                </h4>
                <div className="space-y-2">
                  {inspectPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 text-xs bg-muted/50 hover:bg-muted rounded border border-transparent hover:border-primary/20 transition-colors"
                      onClick={() => {
                        // Here you would typically send this prompt to the chat
                        console.log("Selected prompt:", prompt)
                        setShowInspectPanel(false)
                        setInspectMode(false)
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
