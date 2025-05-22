"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { ProjectDetailsForm, type ProjectDetails } from "./components/project-details-form"
import { FormProgress } from "./components/form-progress"
import { useSavedProjects } from "./hooks/use-saved-projects"
import { ChatInterface } from "./components/chat-interface"
import { VisualizationPanel } from "./components/visualization-panel"
import { TemplateBrowser } from "./components/template-browser"
import { FormatAllDialog } from "./components/format-all-dialog"
import { generateFileStructure, getFileStructureForPrompt } from "./services/file-structure-service"
import { applyFileStructureCommand } from "./services/file-structure-manipulation"
import { applyTemplate } from "./services/template-service"
import { formatAllFiles, type FormatterOptions } from "./services/code-formatter"
import { useFileStructureHistory } from "./hooks/use-file-structure-history"
import { useAuth } from "@/contexts/auth-context"
import type { Message } from "./types/chat"
import type { FileNode } from "./components/file-structure-visualization"

export default function ChatApp() {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(true)
  const [templateBrowserOpen, setTemplateBrowserOpen] = useState(false)
  const [formatAllDialogOpen, setFormatAllDialogOpen] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [formatProgress, setFormatProgress] = useState(0)
  const [formattedCount, setFormattedCount] = useState(0)
  const [totalFilesToFormat, setTotalFilesToFormat] = useState(0)
  const { isDemoMode } = useAuth()
  const {
    savedProjects,
    saveProject,
    deleteProject,
    getProject,
    getProjectVersions,
    restoreVersion,
    deleteVersion,
    shareProject,
    unshareProject,
    isLoaded,
  } = useSavedProjects()

  // Initialize file structure history with a default empty structure
  const {
    fileStructure: activeFileStructure,
    updateStructure,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  } = useFileStructureHistory({
    name: "root",
    type: "directory",
    children: [],
  })

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleFormComplete = (details: ProjectDetails) => {
    setProjectDetails(details)
    setEditingProject(false)

    // Add initial assistant message based on project details
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: isDemoMode
        ? `Welcome to the ForSure AI Demo! I see you're working on "${details.name}", a ${details.type} project using ${details.framework} with ${details.languages.join(", ")}. This is a demo mode with full access to all features. Feel free to explore and experiment with the file structure tools!`
        : `Welcome to ForSure AI! I see you're working on "${details.name}", a ${details.type} project using ${details.framework} with ${details.languages.join(", ")}. How can I help you with your project structure today?`,
    }

    setMessages([welcomeMessage])

    // Generate initial file structure and reset history
    const initialStructure = generateFileStructure(details)
    updateStructure(initialStructure, false) // Don't record in history
    clearHistory(initialStructure) // Reset history with new structure
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Check if this is a file structure command
    if (activeFileStructure) {
      const result = applyFileStructureCommand(activeFileStructure, input)
      if (result.success) {
        // Update the structure and record in history
        updateStructure(result.newStructure)

        // Add AI response about the file structure change
        setTimeout(() => {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: result.message,
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)

          // On mobile, switch to chat view when a new message arrives
          if (isMobile) {
            setShowMobileChat(true)
          }
        }, 500)
        return
      }
    }

    // Check if we should show a file structure based on the prompt
    const fileStructure = projectDetails ? getFileStructureForPrompt(input, projectDetails) : null
    if (fileStructure) {
      // Update the structure and record in history
      updateStructure(fileStructure)
    }

    // Check if this is a template-related request
    const lowerPrompt = input.toLowerCase()
    if (
      (lowerPrompt.includes("template") || lowerPrompt.includes("boilerplate") || lowerPrompt.includes("starter")) &&
      (lowerPrompt.includes("show") ||
        lowerPrompt.includes("list") ||
        lowerPrompt.includes("browse") ||
        lowerPrompt.includes("use"))
    ) {
      // Add AI response about templates
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I can help you browse project templates! I've opened the template browser for you. You can filter templates by framework, project type, and complexity to find the perfect starting point for your project.",
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
        setTemplateBrowserOpen(true)
      }, 1000)
      return
    }

    // Check if this is a format all request
    if (
      (lowerPrompt.includes("format") || lowerPrompt.includes("beautify") || lowerPrompt.includes("prettify")) &&
      (lowerPrompt.includes("all") || lowerPrompt.includes("every") || lowerPrompt.includes("project"))
    ) {
      // Add AI response about format all
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I can help you format all files in your project! I've opened the format all dialog for you. You can select which file types to format and configure the formatting options.",
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
        setFormatAllDialogOpen(true)
      }, 1000)
      return
    }

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input, projectDetails),
        fileStructure,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // On mobile, switch to chat view when a new message arrives
      if (isMobile) {
        setShowMobileChat(true)
      }
    }, 1000)
  }

  const generateResponse = (prompt: string, details: ProjectDetails | null): string => {
    // Add handling for format all request
    let lowerPrompt = prompt.toLowerCase()
    if (
      (lowerPrompt.includes("format") || lowerPrompt.includes("beautify") || lowerPrompt.includes("prettify")) &&
      (lowerPrompt.includes("all") || lowerPrompt.includes("every") || lowerPrompt.includes("project"))
    ) {
      return "I can help you format all files in your project. This will ensure consistent code style across your entire project. Would you like me to open the format all dialog for you?"
    }

    // Add handling for file content editing commands
    lowerPrompt = prompt.toLowerCase()
    if (
      (lowerPrompt.includes("edit") || lowerPrompt.includes("update") || lowerPrompt.includes("change")) &&
      (lowerPrompt.includes("file") || lowerPrompt.includes("content"))
    ) {
      return "I've updated the file content as requested. You can see the changes in the File Structure panel. If you need to undo this change, you can use the undo button or press Ctrl+Z."
    }

    // Check if this is a template-related request
    lowerPrompt = prompt.toLowerCase()
    if (
      (lowerPrompt.includes("template") || lowerPrompt.includes("boilerplate") || lowerPrompt.includes("starter")) &&
      (lowerPrompt.includes("create") || lowerPrompt.includes("save") || lowerPrompt.includes("make"))
    ) {
      return "You can save your current file structure as a template by clicking the 'Save as Template' button in the File Structure panel. This will allow you to reuse this structure for future projects."
    }

    // Check if this is a file structure modification request
    if (
      (lowerPrompt.includes("add") || lowerPrompt.includes("create")) &&
      (lowerPrompt.includes("file") || lowerPrompt.includes("folder") || lowerPrompt.includes("directory"))
    ) {
      return "I've updated the file structure based on your request. You can see the changes in the File Structure panel. If you need to undo this change, you can use the undo button or press Ctrl+Z."
    }

    if (
      (lowerPrompt.includes("remove") || lowerPrompt.includes("delete")) &&
      (lowerPrompt.includes("file") || lowerPrompt.includes("folder") || lowerPrompt.includes("directory"))
    ) {
      return "I've removed the requested item from the file structure. You can see the updated structure in the File Structure panel. If you need to restore this item, you can use the undo button or press Ctrl+Z."
    }

    if (
      lowerPrompt.includes("rename") &&
      (lowerPrompt.includes("file") || lowerPrompt.includes("folder") || lowerPrompt.includes("directory"))
    ) {
      return "I've renamed the item as requested. You can see the updated file structure in the File Structure panel. If you need to revert this change, you can use the undo button or press Ctrl+Z."
    }

    if (
      lowerPrompt.includes("move") &&
      (lowerPrompt.includes("file") || lowerPrompt.includes("folder") || lowerPrompt.includes("directory"))
    ) {
      return "I've moved the item to the new location. You can see the updated file structure in the File Structure panel. If you need to undo this move, you can use the undo button or press Ctrl+Z."
    }

    if (lowerPrompt.includes("undo") && canUndo) {
      undo()
      return "I've undone the last change to the file structure. You can see the updated structure in the File Structure panel."
    }

    if (lowerPrompt.includes("redo") && canRedo) {
      redo()
      return "I've redone the previously undone change to the file structure. You can see the updated structure in the File Structure panel."
    }

    // Simple response generation logic with project context
    if (prompt.toLowerCase().includes("hello") || prompt.toLowerCase().includes("hi")) {
      return `Hello! I'm ForSure AI, your assistant for file structure definition and project organization. I'm here to help with your ${details?.name || "project"}. How can I assist you today?`
    }

    if (prompt.toLowerCase().includes("help")) {
      return `I can help you with:

- Creating file structure definitions for your ${details?.type || "project"}
- Organizing your ${details?.framework || "project"} files
- Generating ForSure templates
- Explaining best practices for ${details?.languages.join(", ") || "project"} organization

Just let me know what you need!`
    }

    if (prompt.toLowerCase().includes("forsure") || prompt.toLowerCase().includes("file structure")) {
      return `ForSure is a powerful language and CLI tool for defining, documenting, and generating project structures. It helps you maintain consistency across projects and teams. Would you like me to show you an example of a ForSure file for your ${details?.framework || ""} project?`
    }

    if ((details && prompt.toLowerCase().includes("structure")) || prompt.toLowerCase().includes("organize")) {
      if (details?.framework === "nextjs") {
        return "For a Next.js project, I recommend the following structure:"
      } else if (details?.framework === "react") {
        return "For a React project, I recommend the following structure:"
      }
    }

    return (
      "I understand you're asking about \"" +
      prompt +
      `". As a ForSure AI assistant, I can help with file structure definitions and project organization for your ${details?.name || "project"}. Could you provide more details about what you're trying to accomplish with your project structure?`
    )
  }

  const clearChat = () => {
    if (projectDetails) {
      // Keep the welcome message if we have project details
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Welcome back to ForSure AI! I'm here to help with "${projectDetails.name}". How can I assist you with your project structure today?`,
      }
      setMessages([welcomeMessage])
    } else {
      setMessages([])
    }
  }

  const resetProject = () => {
    setProjectDetails(null)
    setMessages([])
    clearHistory() // Reset history with default structure
  }

  const editProject = () => {
    setEditingProject(true)
  }

  const handleSaveProject = (details: ProjectDetails, versionNotes?: string) => {
    if (!projectDetails) return

    const updatedDetails = {
      ...projectDetails,
      name: details.name,
    }

    const projectId = saveProject(updatedDetails, versionNotes)

    // Update current project with saved ID
    setProjectDetails({
      ...updatedDetails,
      id: projectId,
    })
  }

  const handleLoadProject = (projectId: string) => {
    const project = getProject(projectId)
    if (project) {
      setProjectDetails(project.details)

      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Welcome back to your "${project.details.name}" project! How can I help you with your project structure today?`,
      }

      setMessages([welcomeMessage])

      // Generate file structure for the loaded project and reset history
      const initialStructure = generateFileStructure(project.details)
      updateStructure(initialStructure, false) // Don't record in history
      clearHistory(initialStructure) // Reset history with new structure
    }
  }

  const handleRestoreVersion = (versionId: string) => {
    if (!projectDetails?.id) return

    restoreVersion(projectDetails.id, versionId)

    // Refresh project details from the restored version
    const project = getProject(projectDetails.id)
    if (project) {
      setProjectDetails(project.details)

      // Add version restored message
      const restoredMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've restored a previous version of your "${project.details.name}" project. How can I help you with your project structure today?`,
      }

      setMessages([restoredMessage])

      // Update file structure for the restored version and reset history
      const initialStructure = generateFileStructure(project.details)
      updateStructure(initialStructure, false) // Don't record in history
      clearHistory(initialStructure) // Reset history with new structure
    }
  }

  const handleShareProject = (settings: any) => {
    if (!projectDetails?.id) return ""
    return shareProject(projectDetails.id, settings)
  }

  const handleUnshareProject = () => {
    if (!projectDetails?.id) return
    unshareProject(projectDetails.id)
  }

  const handleShowFileStructure = () => {
    if (!projectDetails) return

    const fileStructure = generateFileStructure(projectDetails)
    updateStructure(fileStructure)

    // On mobile, switch to visualization view
    if (isMobile) {
      setShowMobileChat(false)
    }
  }

  const handleFileStructureChange = (newStructure: FileNode) => {
    updateStructure(newStructure)
  }

  const handleApplyTemplate = (templateId: string) => {
    if (!projectDetails) return

    const newStructure = applyTemplate(templateId, projectDetails.name)
    if (newStructure) {
      updateStructure(newStructure)

      // Add template applied message
      const templateMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've applied the template to your project structure. You can see the updated structure in the File Structure panel.`,
      }
      setMessages((prev) => [...prev, templateMessage])
    }
  }

  const handleFormatAll = (options: FormatterOptions, fileTypes: string[]) => {
    if (!activeFileStructure) return

    setIsFormatting(true)
    setFormatProgress(0)
    setFormattedCount(0)
    setTotalFilesToFormat(0)

    // Use setTimeout to allow the UI to update before starting the formatting
    setTimeout(() => {
      // Format all files
      const { newStructure, formattedCount, totalFiles } = formatAllFiles(
        activeFileStructure,
        options,
        fileTypes,
        (count, total) => {
          setFormattedCount(count)
          setTotalFilesToFormat(total)
          setFormatProgress((count / total) * 100)
        },
      )

      // Update the structure
      updateStructure(newStructure)

      // Add formatting complete message
      const formatMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've formatted ${formattedCount} files in your project. The formatting has been applied according to your selected options.`,
      }
      setMessages((prev) => [...prev, formatMessage])

      // Reset formatting state
      setIsFormatting(false)
      setFormatAllDialogOpen(false)
    }, 100)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Get current project versions if available
  const currentProjectVersions = projectDetails?.id ? getProjectVersions(projectDetails.id) : []
  const currentProject = projectDetails?.id ? getProject(projectDetails.id) : null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {!projectDetails || editingProject ? (
          <div className="container py-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {editingProject ? "Edit Project Details" : "Welcome to ForSure AI"}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {editingProject
                    ? "Update your project information below."
                    : "Let's start by gathering some information about your project to help you better."}
                </p>
              </div>

              <FormProgress steps={["Basics", "Technical", "Team & Goals", "Review"]} currentStep={0} />

              <ProjectDetailsForm
                onComplete={handleFormComplete}
                initialDetails={editingProject ? projectDetails : undefined}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Project info banner - only show on mobile */}
            {isMobile && (
              <div className="bg-muted/50 border-b border-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{projectDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {projectDetails.type} • {projectDetails.framework} • {projectDetails.languages.join(", ")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={editProject}>
                    Edit
                  </Button>
                </div>
              </div>
            )}
            {isMobile && projectDetails && !editingProject && (
              <div className="bg-muted/50 border-b border-primary/10 p-2 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant={showMobileChat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMobileChat(true)}
                    className="px-3"
                  >
                    Chat
                  </Button>
                  <Button
                    variant={!showMobileChat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMobileChat(false)}
                    className="px-3"
                  >
                    View
                  </Button>
                </div>
              </div>
            )}

            {/* Split view layout */}
            {(!isMobile || (isMobile && showMobileChat)) && (
              <div className={`${isMobile ? "w-full" : "w-1/2 border-r"} flex flex-col h-[calc(100vh-56px)]`}>
                {/* Project info banner - only show on desktop */}
                {!isMobile && (
                  <div className="bg-muted/50 border-b border-primary/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{projectDetails.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {projectDetails.type} • {projectDetails.framework} • {projectDetails.languages.join(", ")}
                        </p>

                        {projectDetails.id && currentProject && currentProjectVersions.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Version {currentProjectVersions.length} • Last updated:{" "}
                            {new Date(currentProject.lastUpdated).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={editProject}>
                        Edit Project
                      </Button>
                    </div>
                  </div>
                )}

                {/* Chat interface */}
                <ChatInterface
                  messages={messages}
                  input={input}
                  isLoading={isLoading}
                  projectDetails={projectDetails}
                  onInputChange={setInput}
                  onSubmit={handleSubmit}
                  onCopy={copyToClipboard}
                  copiedId={copied}
                />
              </div>
            )}

            {/* Visualization panel */}
            {(!isMobile || (isMobile && !showMobileChat)) && (
              <div className={`${isMobile ? "w-full" : "w-1/2"} h-[calc(100vh-56px)]`}>
                <VisualizationPanel
                  projectDetails={projectDetails}
                  activeFileStructure={activeFileStructure}
                  onFileStructureChange={handleFileStructureChange}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                  onFormatAll={() => setFormatAllDialogOpen(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>

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

      {/* Format all dialog */}
      {formatAllDialogOpen && (
        <FormatAllDialog
          isOpen={formatAllDialogOpen}
          onClose={() => setFormatAllDialogOpen(false)}
          onFormat={handleFormatAll}
          fileStructure={activeFileStructure}
          isFormatting={isFormatting}
          progress={formatProgress}
          formattedCount={formattedCount}
          totalFiles={totalFilesToFormat}
        />
      )}
    </div>
  )
}
