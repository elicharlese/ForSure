'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface SimpleDashboardProps {
  projects: any[]
  onNewProject: () => void
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onQuickCreateProject: (projectData: any) => void
  onStartChat: (initialMessages: any[]) => void
  isLoaded: boolean
}

export default function SimpleDashboard({
  projects,
  onNewProject,
  onSelectProject,
  onDeleteProject,
  onQuickCreateProject,
  onStartChat,
  isLoaded,
}: SimpleDashboardProps) {
  const handleQuickStart = () => {
    const initialMessages = [
      {
        role: 'assistant',
        content:
          "Hi! I'm ForSure AI. What kind of project would you like to create today?",
      },
    ]
    onStartChat(initialMessages)
  }

  return (
    <div className="space-y-6">
      {/* Quick Start Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Start chatting with ForSure AI to create your project quickly.
          </p>
          <Button onClick={handleQuickStart} className="w-full">
            Start Chat with AI
          </Button>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Projects</CardTitle>
          <Button onClick={onNewProject} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </CardHeader>
        <CardContent>
          {isLoaded ? (
            projects.length > 0 ? (
              <div className="grid gap-4">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">
                        {project.details?.name || project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {project.details?.framework || 'Unknown'} •{' '}
                        {project.details?.type || 'Project'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onSelectProject(project.id)}
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Button onClick={onNewProject}>
                  Create Your First Project
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
