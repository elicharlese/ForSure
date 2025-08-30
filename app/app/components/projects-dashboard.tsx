'use client'

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
import {
  Clock,
  Code,
  FileCode,
  FolderGit2,
  GitBranch,
  GitPullRequest,
  Plus,
  Search,
  Tag,
  Trash2,
} from 'lucide-react'
import DashboardChat from './dashboard-chat'

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
}

interface ProjectsDashboardProps {
  projects: Project[]
  onNewProject: () => void
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onQuickCreateProject: (projectData: any) => void
  onStartChat: (initialMessages: any[]) => void
  isLoaded: boolean
}

export default function ProjectsDashboard({
  projects,
  onNewProject,
  onSelectProject,
  onDeleteProject,
  onQuickCreateProject,
  onStartChat,
  isLoaded,
}: ProjectsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredProjects = projects.filter(project => {
    const searchLower = searchQuery.toLowerCase()
    return (
      project.name?.toLowerCase().includes(searchLower) ||
      project.details?.description?.toLowerCase().includes(searchLower) ||
      project.details?.framework?.toLowerCase().includes(searchLower) ||
      project.details?.type?.toLowerCase().includes(searchLower) ||
      project.details?.languages?.some(lang =>
        lang.toLowerCase().includes(searchLower)
      )
    )
  })

  // Sort projects by last updated date (most recent first)
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dateA = a.lastUpdated
      ? new Date(a.lastUpdated).getTime()
      : new Date(a.createdAt).getTime()
    const dateB = b.lastUpdated
      ? new Date(b.lastUpdated).getTime()
      : new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  // Get recent projects (last 7 days)
  const recentProjects = sortedProjects.filter(project => {
    const projectDate = project.lastUpdated
      ? new Date(project.lastUpdated)
      : new Date(project.createdAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return projectDate >= sevenDaysAgo
  })

  const displayProjects =
    activeTab === 'recent' ? recentProjects : sortedProjects

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

  return (
    <div className="space-y-8">
      {/* Quick Start Chat Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Quick Start</h2>
          <p className="text-sm text-muted-foreground">
            Chat with ForSure AI to quickly create a new project, or browse your
            existing projects below.
          </p>
        </div>
        <DashboardChat
          onProjectCreate={onQuickCreateProject}
          onStartChat={onStartChat}
        />
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Project Manager
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your existing ForSure projects and file structures.
            </p>
          </div>
          <Button onClick={onNewProject} variant="outline" className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="h-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Custom Tab Implementation */}
        <div className="space-y-4">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'recent'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Recent ({recentProjects.length})
            </button>
          </div>

          <div className="mt-6">
            {isLoaded && displayProjects.length === 0 ? (
              activeTab === 'recent' ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FileCode className="h-10 w-10 text-muted-foreground mb-4" />
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
                <EmptyProjectsState onNewProject={onNewProject} />
              )
            ) : (
              <ProjectGrid
                projects={displayProjects}
                onSelectProject={onSelectProject}
                onDeleteProject={onDeleteProject}
                formatRelativeTime={formatRelativeTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectGrid({
  projects,
  onSelectProject,
  onDeleteProject,
  formatRelativeTime,
}: {
  projects: Project[]
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  formatRelativeTime: (dateString: string) => string
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
}: {
  project: Project
  onSelect: () => void
  onDelete: () => void
  formatRelativeTime: (dateString: string) => string
}) {
  const lastUpdatedDate = project.lastUpdated || project.createdAt
  const lastUpdatedFormatted = formatRelativeTime(lastUpdatedDate)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.details.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {project.details.description || 'No description provided'}
            </CardDescription>
          </div>
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
          {project.details.languages.map(lang => (
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
        <Button size="sm" onClick={onSelect}>
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
