'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileStructureVisualization } from '@/app/app/components/file-structure-visualization'
import { CommentSection } from '@/app/app/components/comment-section'
import { generateFileStructure } from '@/app/app/services/file-structure-service'
import { useSavedProjects } from '@/app/app/hooks/use-saved-projects'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Copy,
  ArrowLeft,
  Lock,
  Eye,
  Calendar,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function SharedProjectPage() {
  const params = useParams()
  const router = useRouter()
  const {
    getProjectByShareId,
    incrementViewCount,
    addComment,
    editComment,
    deleteComment,
    addReply,
    getComments,
  } = useSavedProjects()
  const [project, setProject] = useState<any>(null)
  const [fileStructure, setFileStructure] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [viewIncremented, setViewIncremented] = useState(false)
  const [activeTab, setActiveTab] = useState('structure')

  const shareId = params.shareId as string

  useEffect(() => {
    if (!shareId) return

    const sharedProject = getProjectByShareId(shareId)

    if (!sharedProject) {
      setError('Project not found or no longer shared')
      setLoading(false)
      return
    }

    // Check if project has expired
    if (sharedProject.shareSettings?.expiresAt) {
      const expiryDate = new Date(sharedProject.shareSettings.expiresAt)
      if (expiryDate < new Date()) {
        setError('This shared project has expired')
        setLoading(false)
        return
      }
    }

    // Check if max views reached
    if (
      sharedProject.shareSettings?.maxViews &&
      sharedProject.shareSettings.viewCount >=
        sharedProject.shareSettings.maxViews
    ) {
      setError('This shared project has reached its maximum view count')
      setLoading(false)
      return
    }

    // If password protected, don't load project yet
    if (sharedProject.shareSettings?.sharePassword) {
      setProject({ isPasswordProtected: true, name: sharedProject.name })
      setLoading(false)
      return
    }

    // Load project and increment view count
    setProject(sharedProject)
    setFileStructure(generateFileStructure(sharedProject.details))

    if (!viewIncremented) {
      incrementViewCount(shareId)
      setViewIncremented(true)
    }

    setLoading(false)
  }, [shareId, getProjectByShareId, incrementViewCount, viewIncremented])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const sharedProject = getProjectByShareId(shareId)

    if (sharedProject?.shareSettings?.sharePassword === password) {
      setProject(sharedProject)
      setFileStructure(generateFileStructure(sharedProject.details))
      setPasswordError(false)

      if (!viewIncremented) {
        incrementViewCount(shareId)
        setViewIncremented(true)
      }
    } else {
      setPasswordError(true)
    }
  }

  const handleCopyProject = () => {
    if (project && fileStructure) {
      // Logic to copy project would go here
      // For now, just navigate to app
      router.push('/app')
    }
  }

  const handleAddComment = (comment: { author: string; content: string }) => {
    if (shareId) {
      addComment(shareId, comment)
    }
  }

  const handleEditComment = (commentId: string, content: string) => {
    if (shareId) {
      editComment(shareId, commentId, content)
    }
  }

  const handleDeleteComment = (commentId: string) => {
    if (shareId) {
      deleteComment(shareId, commentId)
    }
  }

  const handleAddReply = (
    commentId: string,
    reply: { author: string; content: string }
  ) => {
    if (shareId) {
      addReply(shareId, commentId, reply)
    }
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Loading shared project...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle>Shared Project Unavailable</CardTitle>
              </div>
              <CardDescription>This project cannot be accessed</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (project?.isPasswordProtected && !fileStructure) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Password Protected Project</CardTitle>
              </div>
              <CardDescription>
                This shared project requires a password to view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{project.name}</h3>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={passwordError ? 'border-red-500' : ''}
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">
                        Incorrect password
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Unlock Project
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (project && fileStructure) {
    const shareSettings = project.shareSettings
    const expiryDate = shareSettings?.expiresAt
      ? new Date(shareSettings.expiresAt)
      : null
    const viewsLeft = shareSettings?.maxViews
      ? shareSettings.maxViews - (shareSettings.viewCount || 0)
      : null
    const comments = project.comments || []
    const allowComments = shareSettings?.allowComments !== false

    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
              <h1 className="text-2xl font-bold">{project.name}</h1>
            </div>

            {shareSettings?.allowCopy && (
              <Button onClick={handleCopyProject}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Project
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {expiryDate && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires {formatDistanceToNow(expiryDate, { addSuffix: true })}
              </Badge>
            )}

            {viewsLeft !== null && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {viewsLeft} {viewsLeft === 1 ? 'view' : 'views'} remaining
              </Badge>
            )}

            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${allowComments ? '' : 'text-muted-foreground'}`}
            >
              <MessageSquare className="h-3 w-3" />
              {allowComments ? 'Comments enabled' : 'Comments disabled'}
            </Badge>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="structure">File Structure</TabsTrigger>
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="comments" className="relative">
                Comments
                {comments.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                    {comments.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Structure</CardTitle>
                  <CardDescription>
                    File structure for {project.name}, a {project.details.type}{' '}
                    project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileStructureVisualization
                    structure={fileStructure}
                    readOnly={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Information about this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="font-medium">Project Basics</h3>
                        <div className="rounded-lg border p-4">
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Name:</span>{' '}
                              {project.details.name}
                            </div>
                            <div>
                              <span className="font-medium">Description:</span>{' '}
                              {project.details.description}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Technical Details</h3>
                        <div className="rounded-lg border p-4">
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Project Type:</span>{' '}
                              {project.details.type}
                            </div>
                            <div>
                              <span className="font-medium">Framework:</span>{' '}
                              {project.details.framework}
                            </div>
                            <div>
                              <span className="font-medium">Languages:</span>{' '}
                              {project.details.languages.join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Team & Goals</h3>
                      <div className="rounded-lg border p-4">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Team Size:</span>{' '}
                            {project.details.teamSize}
                          </div>
                          <div>
                            <span className="font-medium">Goals:</span>{' '}
                            {project.details.goals}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <CommentSection
                shareId={shareId}
                comments={comments}
                allowComments={allowComments}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onAddReply={handleAddReply}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return null
}
