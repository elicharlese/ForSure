'use client'

import type React from 'react'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Clock,
  Code,
  FolderGit2,
  GitBranch,
  GitPullRequest,
  Plus,
  Search,
  Tag,
  Trash2,
  MessageCircle,
  Sparkles,
  Send,
  Filter,
  ArrowUpDown,
  Star,
  StarOff,
  Bookmark,
  Layers,
  Zap,
  Lightbulb,
  Rocket,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  details: {
    name: string
    type: string
    framework: string
    languages: string[]
    description?: string
  }
  createdAt: string
  lastUpdated?: string
  branches?: number
  tags?: number
  favorite?: boolean
  status?: 'active' | 'completed' | 'archived' | 'draft'
  category?: string
}

interface EnhancedDashboardProps {
  projects: Project[]
  onNewProject: () => void
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onQuickCreateProject: (projectData: any) => void
  onStartChat: (initialMessages: any[]) => void
  isLoaded: boolean
}

export default function EnhancedDashboard({
  projects,
  onNewProject,
  onSelectProject,
  onDeleteProject,
  onQuickCreateProject,
  onStartChat,
  isLoaded,
}: EnhancedDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [sortBy, setSortBy] = useState('lastUpdated')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [expandedIdeas, setExpandedIdeas] = useState<string[]>([])
  const [activeProjectTab, setActiveProjectTab] = useState('all')

  // Project ideas to help users get started
  const projectIdeas = [
    {
      id: 'idea-1',
      title: 'E-commerce Platform',
      description:
        'Build a modern e-commerce platform with product catalog, cart, and checkout functionality.',
      frameworks: ['Next.js', 'React'],
      complexity: 'Medium',
    },
    {
      id: 'idea-2',
      title: 'Personal Blog',
      description:
        'Create a personal blog with markdown support, categories, and comments.',
      frameworks: ['Next.js', 'Gatsby'],
      complexity: 'Low',
    },
    {
      id: 'idea-3',
      title: 'Task Management App',
      description:
        'Develop a task management application with drag-and-drop interface and team collaboration.',
      frameworks: ['React', 'Vue.js'],
      complexity: 'Medium',
    },
    {
      id: 'idea-4',
      title: 'API Backend Service',
      description:
        'Build a RESTful API service with authentication, rate limiting, and database integration.',
      frameworks: ['Node.js', 'Express'],
      complexity: 'Medium',
    },
  ]

  // Chat suggestions
  const chatSuggestions = [
    'I want to build a React e-commerce app',
    'Create a Next.js blog with TypeScript',
    'Build a Node.js API for mobile app',
    'Make a Vue.js dashboard project',
  ]

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`

    return date.toLocaleDateString()
  }

  // Toggle favorite status
  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId)
      } else {
        return [...prev, projectId]
      }
    })
  }

  // Toggle expanded idea
  const toggleExpandIdea = (ideaId: string) => {
    setExpandedIdeas(prev => {
      if (prev.includes(ideaId)) {
        return prev.filter(id => id !== ideaId)
      } else {
        return [...prev, ideaId]
      }
    })
  }

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        project.name?.toLowerCase().includes(searchLower) ||
        project.details?.description?.toLowerCase().includes(searchLower) ||
        project.details?.framework?.toLowerCase().includes(searchLower) ||
        project.details?.type?.toLowerCase().includes(searchLower) ||
        project.details?.languages?.some(lang =>
          lang.toLowerCase().includes(searchLower)
        )

      // Category filter
      const matchesCategory =
        filterCategory === 'all' || project.category === filterCategory

      // Status filter
      const matchesStatus =
        filterStatus === 'all' || project.status === filterStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'lastUpdated') {
        const dateA = a.lastUpdated
          ? new Date(a.lastUpdated).getTime()
          : new Date(a.createdAt).getTime()
        const dateB = b.lastUpdated
          ? new Date(b.lastUpdated).getTime()
          : new Date(b.createdAt).getTime()
        return dateB - dateA
      } else if (sortBy === 'favorite') {
        const aFav = favorites.includes(a.id) ? 1 : 0
        const bFav = favorites.includes(b.id) ? 1 : 0
        return bFav - aFav
      }
      return 0
    })

  // Get recent projects (last 7 days)
  const recentProjects = filteredProjects.filter(project => {
    const projectDate = project.lastUpdated
      ? new Date(project.lastUpdated)
      : new Date(project.createdAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return projectDate >= sevenDaysAgo
  })

  // Get favorite projects
  const favoriteProjects = filteredProjects.filter(project =>
    favorites.includes(project.id)
  )

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    // Create initial messages for the chat
    const initialMessages = [
      {
        id: Date.now().toString(),
        role: 'user',
        content: chatInput,
      },
    ]

    // Transition to split screen with these messages
    onStartChat(initialMessages)
    setChatInput('')
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion)
  }

  // Handle idea selection
  const handleIdeaSelect = (idea: any) => {
    // Create a project from the idea
    const projectData = {
      name: idea.title,
      type: 'Web App',
      framework: idea.frameworks[0],
      languages: ['JavaScript', 'TypeScript'],
      description: idea.description,
    }

    onQuickCreateProject(projectData)
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 mb-2">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to ForSure AI</h1>
          <p className="text-muted-foreground mb-6">
            Start building your project structure with AI assistance or browse
            your existing projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onNewProject} size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {
                // Create initial messages for the chat
                const initialMessages = [
                  {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content:
                      'Welcome to ForSure AI! How can I help you build your project today?',
                  },
                ]
                // Start the chat with initial messages and transition to split screen
                onStartChat(initialMessages)
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Chat with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Ideas</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>AI Chat</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.slice(0, 3).map(project => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                      >
                        <div>
                          <h4 className="font-medium">
                            {project.details.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatRelativeTime(
                              project.lastUpdated || project.createdAt
                            )}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSelectProject(project.id)}
                        >
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    document.getElementById('projects-tab')?.click()
                  }
                >
                  View All Projects
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Start Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Button onClick={onNewProject} className="justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        document.getElementById('ideas-tab')?.click()
                      }
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Browse Project Ideas
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        document.getElementById('chat-tab')?.click()
                      }
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                    <FolderGit2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {filteredProjects.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Projects
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {recentProjects.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recent Projects
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {favoriteProjects.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Favorite Projects
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                    <GitBranch className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {filteredProjects.reduce(
                      (total, project) => total + (project.branches || 0),
                      0
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Branches
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Project Ideas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Featured Project Ideas
              </h2>
              <Button
                variant="link"
                onClick={() => document.getElementById('ideas-tab')?.click()}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectIdeas.slice(0, 2).map(idea => (
                <Card key={idea.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {idea.frameworks.map(framework => (
                        <Badge
                          key={framework}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Code className="h-3 w-3" />
                          {framework}
                        </Badge>
                      ))}
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Layers className="h-3 w-3" />
                        {idea.complexity}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button size="sm" onClick={() => handleIdeaSelect(idea)}>
                      <Zap className="h-3 w-3 mr-1" />
                      Use This Idea
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6" id="projects-tab">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-green-500" />
                Your Projects
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your existing ForSure projects and file structures.
              </p>
            </div>
            <Button onClick={onNewProject} className="shrink-0 gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="h-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-9">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Sort by</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastUpdated">Last Updated</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="favorite">Favorites</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px] h-9">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Full Stack</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Simple Tab Navigation */}
          <div className="border-b">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveProjectTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeProjectTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>All</span>
                  <Badge variant="secondary" className="ml-1">
                    {filteredProjects.length}
                  </Badge>
                </div>
              </button>
              <button
                onClick={() => setActiveProjectTab('recent')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeProjectTab === 'recent'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Recent</span>
                  <Badge variant="secondary" className="ml-1">
                    {recentProjects.length}
                  </Badge>
                </div>
              </button>
              <button
                onClick={() => setActiveProjectTab('favorites')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeProjectTab === 'favorites'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Favorites</span>
                  <Badge variant="secondary" className="ml-1">
                    {favoriteProjects.length}
                  </Badge>
                </div>
              </button>
              <button
                onClick={() => setActiveProjectTab('archived')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeProjectTab === 'archived'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Archived</span>
                  <Badge variant="secondary" className="ml-1">
                    {
                      filteredProjects.filter(p => p.status === 'archived')
                        .length
                    }
                  </Badge>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeProjectTab === 'all' && (
              <>
                {isLoaded && filteredProjects.length === 0 ? (
                  <EmptyProjectsState onNewProject={onNewProject} />
                ) : (
                  <ProjectGrid
                    projects={filteredProjects}
                    onSelectProject={onSelectProject}
                    onDeleteProject={onDeleteProject}
                    formatRelativeTime={formatRelativeTime}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </>
            )}

            {activeProjectTab === 'recent' && (
              <>
                {isLoaded && recentProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No recent projects</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      You haven't worked on any projects in the last 7 days.
                    </p>
                    <Button onClick={onNewProject} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      New Project
                    </Button>
                  </div>
                ) : (
                  <ProjectGrid
                    projects={recentProjects}
                    onSelectProject={onSelectProject}
                    onDeleteProject={onDeleteProject}
                    formatRelativeTime={formatRelativeTime}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </>
            )}

            {activeProjectTab === 'favorites' && (
              <>
                {isLoaded && favoriteProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Star className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      No favorite projects
                    </h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Mark projects as favorites to see them here.
                    </p>
                  </div>
                ) : (
                  <ProjectGrid
                    projects={favoriteProjects}
                    onSelectProject={onSelectProject}
                    onDeleteProject={onDeleteProject}
                    formatRelativeTime={formatRelativeTime}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </>
            )}

            {activeProjectTab === 'archived' && (
              <>
                {isLoaded &&
                filteredProjects.filter(p => p.status === 'archived').length ===
                  0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bookmark className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      No archived projects
                    </h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Archived projects will appear here.
                    </p>
                  </div>
                ) : (
                  <ProjectGrid
                    projects={filteredProjects.filter(
                      p => p.status === 'archived'
                    )}
                    onSelectProject={onSelectProject}
                    onDeleteProject={onDeleteProject}
                    formatRelativeTime={formatRelativeTime}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="space-y-6" id="ideas-tab">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Project Ideas
              </h2>
              <p className="text-sm text-muted-foreground">
                Get inspired with these project ideas or use them as starting
                points.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectIdeas.map(idea => (
              <Card key={idea.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <CardDescription
                    className={
                      expandedIdeas.includes(idea.id) ? '' : 'line-clamp-2'
                    }
                  >
                    {idea.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {idea.frameworks.map(framework => (
                      <Badge
                        key={framework}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Code className="h-3 w-3" />
                        {framework}
                      </Badge>
                    ))}
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Layers className="h-3 w-3" />
                      {idea.complexity}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpandIdea(idea.id)}
                    className="text-xs text-muted-foreground"
                  >
                    {expandedIdeas.includes(idea.id)
                      ? 'Show less'
                      : 'Show more'}
                  </Button>
                  <Button size="sm" onClick={() => handleIdeaSelect(idea)}>
                    <Zap className="h-3 w-3 mr-1" />
                    Use This Idea
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6" id="chat-tab">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Quick Start with AI
              </h2>
              <p className="text-sm text-muted-foreground">
                Describe your project idea and let AI help you structure it.
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleChatSubmit} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    id="chat-input"
                    placeholder="Describe your project idea or ask a question..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Try these suggestions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chatSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">How AI Can Help You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                      <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium mb-2">Project Structure</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe your project and AI will help you create the
                      optimal file structure.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
                      <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium mb-2">Technology Advice</h3>
                    <p className="text-sm text-muted-foreground">
                      Get recommendations on frameworks, libraries, and best
                      practices for your project.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                      <GitBranch className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium mb-2">Project Organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn how to organize your code for maintainability and
                      scalability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectGrid({
  projects,
  onSelectProject,
  onDeleteProject,
  formatRelativeTime,
  favorites,
  onToggleFavorite,
}: {
  projects: any[]
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  formatRelativeTime: (dateString: string) => string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={() => onSelectProject(project.id)}
          onDelete={() => onDeleteProject(project.id)}
          formatRelativeTime={formatRelativeTime}
          isFavorite={favorites.includes(project.id)}
          onToggleFavorite={() => onToggleFavorite(project.id)}
        />
      ))}
    </div>
  )
}

function ProjectCard({
  project,
  onSelect,
  onDelete,
  formatRelativeTime,
  isFavorite,
  onToggleFavorite,
}: {
  project: any
  onSelect: () => void
  onDelete: () => void
  formatRelativeTime: (dateString: string) => string
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  const lastUpdatedDate = project.lastUpdated || project.createdAt
  const lastUpdatedFormatted = formatRelativeTime(lastUpdatedDate)

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{project.details.name}</CardTitle>
              {project.status && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
              )}
            </div>
            <CardDescription className="line-clamp-1">
              {project.details.description || 'No description provided'}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={e => {
                e.stopPropagation()
                onToggleFavorite()
              }}
            >
              {isFavorite ? (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              ) : (
                <StarOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            {project.details.framework}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FolderGit2 className="h-3 w-3" />
            {project.details.type}
          </Badge>
          {project.branches && (
            <Badge variant="outline" className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {project.branches}
            </Badge>
          )}
          {project.tags && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {project.tags}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {project.details.languages.map((lang: string) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {lastUpdatedFormatted}
        </div>
        <Button size="sm" onClick={onSelect} className="gap-1">
          <Rocket className="h-3.5 w-3.5" />
          Open Project
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyProjectsState({ onNewProject }: { onNewProject: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <GitPullRequest className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No projects found</h3>
      <p className="text-muted-foreground mt-2 mb-4">
        Get started by creating a new project to define your file structure.
      </p>
      <Button onClick={onNewProject}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </div>
  )
}
