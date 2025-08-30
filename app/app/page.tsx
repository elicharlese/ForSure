'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ProjectDetailsForm,
  type ProjectDetails,
} from './components/project-details-form'
import { FormProgress } from './components/form-progress'
import { useSavedProjects } from './hooks/use-saved-projects'
import { ChatInterface } from './components/chat-interface'
import { VisualizationPanel } from './components/visualization-panel'
import { useFileStructureHistory } from './hooks/use-file-structure-history'
import { useAuth } from '@/contexts/auth-context'
import EnhancedDashboard from './components/enhanced-dashboard'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

export default function ChatApp() {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  )
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(true)
  const [showDashboard, setShowDashboard] = useState(true)
  const [leftPanelWidth, setLeftPanelWidth] = useState(40)
  const { toast } = useToast()
  const { isDemoMode, user } = useAuth()
  const [isDraftProject, setIsDraftProject] = useState(false)
  const [forSureFiles, setForSureFiles] = useState<any[]>([])
  const [rightChatMessages, setRightChatMessages] = useState<any[]>([])
  const [rightChatInput, setRightChatInput] = useState('')
  const [rightChatLoading, setRightChatLoading] = useState(false)
  const [showRightChat, setShowRightChat] = useState(true)
  const [rightPanelWidth, setRightPanelWidth] = useState(30)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [collapsedPanelWidth] = useState(3) // Width when collapsed

  const {
    savedProjects,
    saveProject,
    deleteProject,
    getProject,
    getProjectVersions,
    restoreVersion,
    isLoaded,
  } = useSavedProjects()

  const {
    fileStructure: activeFileStructure,
    updateStructure,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  } = useFileStructureHistory({
    name: 'root',
    type: 'directory',
    children: [],
  })

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const handleQuickCreateProject = (projectData: any) => {
    const projectDetails: ProjectDetails = {
      name: projectData.name || 'Untitled Project',
      type: projectData.type || 'Web App',
      framework: projectData.framework || 'React',
      languages: projectData.languages || ['JavaScript'],
      description: `A ${projectData.type || 'web app'} built with ${projectData.framework || 'React'}`,
      industry: 'Technology',
      stage: 'Planning',
      teamSize: '1-5',
      timeline: '3-6 months',
      goals: ['Build a functional application', 'Learn new technologies'],
    }

    handleFormComplete(projectDetails)

    toast({
      title: 'Project Created',
      description: `Your project "${projectDetails.name}" has been created from chat!`,
    })
  }

  const handleStartChatFromDashboard = (initialMessages: any[]) => {
    const draftProject: ProjectDetails = {
      name: 'New Project',
      type: 'Web App',
      framework: 'React',
      languages: ['JavaScript'],
      description: 'Project in progress...',
      industry: 'Technology',
      stage: 'Planning',
      teamSize: '1-5',
      timeline: '3-6 months',
      goals: ['Define project structure'],
    }

    setProjectDetails(draftProject)
    setMessages(initialMessages)
    setShowDashboard(false)
    setIsDraftProject(true)

    const initialStructure = { name: 'root', type: 'directory', children: [] }
    updateStructure(initialStructure, false)
    clearHistory(initialStructure)

    toast({
      title: 'Chat Started',
      description: 'Continue chatting to define your project details.',
    })
  }

  const handleFormComplete = (details: ProjectDetails) => {
    setProjectDetails(details)
    setEditingProject(false)
    setShowDashboard(false)
    setIsDraftProject(false)

    const welcomeMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: isDemoMode
        ? `Welcome to the ForSure AI Demo! I see you're working on "${details.name}", a ${details.type} project using ${details.framework} with ${details.languages.join(', ')}. This is a demo mode with full access to all features. Feel free to explore and experiment with the file structure tools!`
        : `Welcome to ForSure AI! I see you're working on "${details.name}", a ${details.type} project using ${details.framework} with ${details.languages.join(', ')}. How can I help you with your project structure today?`,
    }

    setMessages([welcomeMessage])

    const initialStructure = { name: 'root', type: 'directory', children: [] }
    updateStructure(initialStructure, false)
    clearHistory(initialStructure)

    toast({
      title: 'Project Created',
      description: `Your project "${details.name}" has been created successfully.`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Get active ForSure files for context
    const activeFiles = forSureFiles.filter(f => f.isActive)
    const fileContext =
      activeFiles.length > 0
        ? `\n\nActive ForSure Files Context:\n${activeFiles.map(f => `${f.name}:\n${f.content}`).join('\n\n')}`
        : ''

    setTimeout(() => {
      let assistantResponse = `I understand you're asking about "${input}".`

      // Enhanced AI response based on ForSure files
      if (activeFiles.length > 0) {
        assistantResponse += ` I can see you have ${activeFiles.length} active ForSure file(s) that I'm referencing: ${activeFiles.map(f => f.name).join(', ')}.`
      }

      assistantResponse += ' How can I help you further with your project?'

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
      }

      if (isDraftProject && projectDetails) {
        const updatedProject = extractProjectDetailsFromChat(
          input,
          projectDetails
        )
        if (updatedProject !== projectDetails) {
          setProjectDetails(updatedProject)
          assistantMessage.content = `Great! I've updated your project details. Your "${updatedProject.name}" ${updatedProject.type.toLowerCase()} using ${updatedProject.framework} is taking shape. What would you like to work on next?`

          if (updatedProject.name !== 'New Project') {
            setIsDraftProject(false)
            assistantMessage.content +=
              ' Your project is now ready - you can start building your file structure!'
          }
        }
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)

      if (isMobile) {
        setShowMobileChat(true)
      }
    }, 1000)
  }

  const handleRightChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rightChatInput.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: rightChatInput,
    }
    setRightChatMessages(prev => [...prev, userMessage])
    setRightChatInput('')
    setRightChatLoading(true)

    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Secondary AI: I understand you're asking about "${rightChatInput}". This is the secondary chat panel for additional assistance or different perspectives on your project.`,
      }

      setRightChatMessages(prev => [...prev, assistantMessage])
      setRightChatLoading(false)
    }, 1000)
  }

  const extractProjectDetailsFromChat = (
    input: string,
    currentProject: ProjectDetails
  ): ProjectDetails => {
    const lowerInput = input.toLowerCase()
    const updatedProject = { ...currentProject }

    const namePatterns = [
      /(?:called|named|building|creating)\s+([a-zA-Z0-9\s]+)/i,
      /project\s+([a-zA-Z0-9\s]+)/i,
      /app\s+([a-zA-Z0-9\s]+)/i,
    ]

    for (const pattern of namePatterns) {
      const match = input.match(pattern)
      if (match && match[1]) {
        updatedProject.name = match[1].trim()
        break
      }
    }

    if (lowerInput.includes('next') || lowerInput.includes('nextjs')) {
      updatedProject.framework = 'Next.js'
      updatedProject.type = 'Full-stack Web App'
    } else if (lowerInput.includes('react native')) {
      updatedProject.framework = 'React Native'
      updatedProject.type = 'Mobile App'
    } else if (lowerInput.includes('react')) {
      updatedProject.framework = 'React'
      updatedProject.type = 'Web App'
    } else if (lowerInput.includes('node') || lowerInput.includes('api')) {
      updatedProject.framework = 'Node.js'
      updatedProject.type = 'API/Backend'
    } else if (lowerInput.includes('vue')) {
      updatedProject.framework = 'Vue.js'
      updatedProject.type = 'Web App'
    }

    if (
      updatedProject.framework.includes('React') ||
      updatedProject.framework.includes('Next')
    ) {
      updatedProject.languages = ['JavaScript', 'TypeScript']
    } else if (updatedProject.framework === 'Node.js') {
      updatedProject.languages = ['JavaScript', 'TypeScript']
    }

    return updatedProject
  }

  const resetProject = () => {
    setProjectDetails(null)
    setMessages([])
    setIsDraftProject(false)
    clearHistory()
    setShowDashboard(true)
  }

  const editProject = () => {
    setEditingProject(true)
  }

  const handleLoadProject = (projectId: string) => {
    const project = getProject(projectId)
    if (project) {
      setProjectDetails(project.details)
      setShowDashboard(false)
      setIsDraftProject(false)

      const welcomeMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Welcome back to your "${project.details.name}" project! How can I help you with your project structure today?`,
      }

      setMessages([welcomeMessage])

      const initialStructure = { name: 'root', type: 'directory', children: [] }
      updateStructure(initialStructure, false)
      clearHistory(initialStructure)

      toast({
        title: 'Project Loaded',
        description: `Project "${project.details.name}" has been loaded successfully.`,
      })
    }
  }

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId)

    toast({
      title: 'Project Deleted',
      description: 'The project has been deleted successfully.',
    })
  }

  const handleStartNewProject = () => {
    setShowDashboard(false)
    setProjectDetails(null)
    setEditingProject(false)
    setMessages([])
    setIsDraftProject(false)
  }

  const handleResize = (e: React.MouseEvent) => {
    if (leftPanelCollapsed) return

    const startX = e.clientX
    const startWidth = leftPanelWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth =
        document.querySelector('.flex-1.flex.flex-col.md\\:flex-row')
          ?.clientWidth || 1
      const newWidth =
        startWidth + ((moveEvent.clientX - startX) / containerWidth) * 100
      const constrainedWidth = Math.min(Math.max(newWidth, 20), 80)
      setLeftPanelWidth(constrainedWidth)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  const handleRightResize = (e: React.MouseEvent) => {
    if (rightPanelCollapsed) return

    const startX = e.clientX
    const startWidth = rightPanelWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth =
        document.querySelector('.flex-1.flex.flex-col.md\\:flex-row')
          ?.clientWidth || 1
      const newWidth =
        startWidth - ((moveEvent.clientX - startX) / containerWidth) * 100
      const constrainedWidth = Math.min(Math.max(newWidth, 20), 60)
      setRightPanelWidth(constrainedWidth)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        {showDashboard ? (
          <div className="container py-6">
            <EnhancedDashboard
              projects={savedProjects}
              onNewProject={handleStartNewProject}
              onSelectProject={handleLoadProject}
              onDeleteProject={handleDeleteProject}
              onQuickCreateProject={handleQuickCreateProject}
              onStartChat={handleStartChatFromDashboard}
              isLoaded={isLoaded}
            />
          </div>
        ) : !projectDetails || editingProject ? (
          <div className="container py-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {editingProject
                    ? 'Edit Project Details'
                    : 'Create a New Project'}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {editingProject
                    ? 'Update your project information below.'
                    : "Let's start by gathering some information about your project to help you better."}
                </p>
              </div>

              <FormProgress
                steps={['Basics', 'Technical', 'Team & Goals', 'Review']}
                currentStep={0}
              />

              <ProjectDetailsForm
                onComplete={handleFormComplete}
                initialDetails={editingProject ? projectDetails : undefined}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row h-full">
            {/* Mobile project info banner */}
            {isMobile && (
              <div className="bg-muted/50 border-b border-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{projectDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {projectDetails.type} • {projectDetails.framework} •{' '}
                      {projectDetails.languages.join(', ')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={editProject}>
                    Edit
                  </Button>
                </div>
              </div>
            )}

            {/* Mobile view toggle */}
            {isMobile && projectDetails && !editingProject && (
              <div className="bg-muted/50 border-b border-primary/10 p-2 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant={
                      showMobileChat && showRightChat === false
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => {
                      setShowMobileChat(true)
                      setShowRightChat(false)
                    }}
                    className="px-3"
                  >
                    Chat 1
                  </Button>
                  <Button
                    variant={!showMobileChat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMobileChat(false)}
                    className="px-3"
                  >
                    View
                  </Button>
                  <Button
                    variant={
                      showMobileChat && showRightChat === true
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => {
                      setShowMobileChat(true)
                      setShowRightChat(true)
                    }}
                    className="px-3"
                  >
                    Chat 2
                  </Button>
                </div>
              </div>
            )}

            {/* Chat panel */}
            {(!isMobile || (isMobile && showMobileChat && !showRightChat)) && (
              <div
                className={`${
                  isMobile ? 'w-full' : ''
                } flex flex-col h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-r border-primary/10 shadow-inner relative overflow-hidden transition-all duration-300 ease-in-out`}
                style={{
                  width: isMobile
                    ? '100%'
                    : leftPanelCollapsed
                      ? `${collapsedPanelWidth}%`
                      : `${leftPanelWidth}%`,
                }}
              >
                {/* AI-inspired background pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

                {/* Subtle glow effect */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div
                  className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"
                  style={{ animationDelay: '2s' }}
                ></div>

                {/* Collapsed state */}
                {!isMobile && leftPanelCollapsed && (
                  <div className="h-full flex flex-col items-center justify-center p-2 relative z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLeftPanelCollapsed(false)}
                      className="mb-4 rotate-90"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="text-xs text-muted-foreground writing-mode-vertical text-center">
                      Frontend Development
                    </div>
                  </div>
                )}

                {/* Expanded state */}
                {(!leftPanelCollapsed || isMobile) && (
                  <>
                    {/* Desktop project info banner */}
                    {!isMobile && (
                      <div className="bg-muted/50 border-b border-primary/10 p-4 backdrop-blur-sm relative z-10 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {projectDetails.name}
                              </h3>
                              {isDraftProject && (
                                <Badge variant="outline" className="text-xs">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {projectDetails.type} • {projectDetails.framework}{' '}
                              • {projectDetails.languages.join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={editProject}
                            >
                              Edit Project
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLeftPanelCollapsed(true)}
                              className="h-8 w-8"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chat interface with proper chat layout */}
                    <div className="relative z-10 flex-1 flex flex-col min-h-0">
                      <ChatInterface
                        messages={messages}
                        input={input}
                        isLoading={isLoading}
                        projectDetails={projectDetails}
                        forSureFiles={forSureFiles}
                        onForSureFilesChange={setForSureFiles}
                        onInputChange={setInput}
                        onSubmit={handleSubmit}
                        onCopy={(text, id) => {
                          navigator.clipboard.writeText(text)
                          setCopied(id)
                          setTimeout(() => setCopied(null), 2000)
                        }}
                        copiedId={copied}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* First resize handle */}
            {!isMobile && projectDetails && !editingProject && (
              <div
                className="w-1 hover:w-2 bg-border hover:bg-primary/30 cursor-ew-resize transition-all h-full flex items-center justify-center"
                onMouseDown={handleResize}
              >
                <div className="h-8 w-1 bg-primary/50 rounded-full"></div>
              </div>
            )}

            {/* Visualization panel */}
            {(!isMobile || (isMobile && !showMobileChat)) && (
              <div
                className={`${isMobile ? 'w-full' : ''} h-full transition-all duration-300 ease-in-out`}
                style={{
                  width: isMobile
                    ? '100%'
                    : `${100 - (leftPanelCollapsed ? collapsedPanelWidth : leftPanelWidth) - (showRightChat ? (rightPanelCollapsed ? collapsedPanelWidth : rightPanelWidth) : 0) - 0.5}%`,
                }}
              >
                <VisualizationPanel
                  projectDetails={projectDetails}
                  activeFileStructure={activeFileStructure}
                  onFileStructureChange={updateStructure}
                  canUndo={canUndo}
                  canRedo={redo}
                  onUndo={undo}
                  onRedo={redo}
                  onFormatAll={() => {}}
                  currentTeam={null}
                  onMergeVersions={() => {}}
                  onCreateBranch={() => {}}
                  onSwitchBranch={() => {}}
                  onDeleteBranch={() => {}}
                  onRenameBranch={() => {}}
                  onCreateTag={() => {}}
                  onDeleteTag={() => {}}
                  onUpdateTag={() => {}}
                  onMoveTag={() => {}}
                >
                  {!isMobile && !showRightChat && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRightChat(true)}
                      className="ml-2"
                    >
                      Show Secondary Chat
                    </Button>
                  )}
                </VisualizationPanel>
              </div>
            )}

            {/* Second resize handle */}
            {!isMobile &&
              projectDetails &&
              !editingProject &&
              showRightChat && (
                <div
                  className="w-1 hover:w-2 bg-border hover:bg-primary/30 cursor-ew-resize transition-all h-full flex items-center justify-center"
                  onMouseDown={handleRightResize}
                >
                  <div className="h-8 w-1 bg-primary/50 rounded-full"></div>
                </div>
              )}

            {/* Right chat panel */}
            {(!isMobile || (isMobile && showMobileChat && showRightChat)) &&
              showRightChat && (
                <div
                  className={`${
                    isMobile ? 'w-full' : ''
                  } flex flex-col h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-l border-primary/10 shadow-inner relative overflow-hidden transition-all duration-300 ease-in-out`}
                  style={{
                    width: isMobile
                      ? '100%'
                      : rightPanelCollapsed
                        ? `${collapsedPanelWidth}%`
                        : `${rightPanelWidth}%`,
                  }}
                >
                  {/* AI-inspired background pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

                  {/* Subtle glow effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                  {/* Collapsed state */}
                  {!isMobile && rightPanelCollapsed && (
                    <div className="h-full flex flex-col items-center justify-center p-2 relative z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRightPanelCollapsed(false)}
                        className="mb-4 rotate-90"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-xs text-muted-foreground writing-mode-vertical text-center">
                        Backend Development
                      </div>
                    </div>
                  )}

                  {/* Expanded state */}
                  {(!rightPanelCollapsed || isMobile) && (
                    <>
                      {/* Right chat header */}
                      {!isMobile && (
                        <div className="bg-muted/50 border-b border-primary/10 p-4 backdrop-blur-sm relative z-10 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">
                                Backend AI Assistant
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Backend development and API assistance
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setRightPanelCollapsed(true)}
                                className="h-8 w-8"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right chat interface */}
                      <div className="relative z-10 flex-1 flex flex-col min-h-0">
                        <ChatInterface
                          messages={rightChatMessages}
                          input={rightChatInput}
                          isLoading={rightChatLoading}
                          projectDetails={projectDetails}
                          forSureFiles={forSureFiles}
                          onForSureFilesChange={setForSureFiles}
                          onInputChange={setRightChatInput}
                          onSubmit={handleRightChatSubmit}
                          onCopy={(text, id) => {
                            navigator.clipboard.writeText(text)
                            setCopied(id)
                            setTimeout(() => setCopied(null), 2000)
                          }}
                          copiedId={copied}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
