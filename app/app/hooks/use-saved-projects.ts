"use client"

import { useState, useEffect } from "react"
import type { ProjectDetails } from "../components/project-details-form"

export type ProjectVersion = {
  versionId: string
  details: ProjectDetails
  timestamp: string
  notes?: string
}

export type ShareSettings = {
  isShared: boolean
  shareId: string
  sharePassword?: string
  allowCopy: boolean
  expiresAt?: string
  viewCount: number
  maxViews?: number
  allowComments: boolean
}

export type Comment = {
  id: string
  shareId: string
  author: string
  content: string
  timestamp: string
  replies?: Comment[]
  isEdited?: boolean
}

export type SavedProject = {
  id: string
  name: string
  details: ProjectDetails
  lastUpdated: string
  versions: ProjectVersion[]
  currentVersionId: string
  shareSettings?: ShareSettings
  comments?: Comment[]
}

export function useSavedProjects() {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved projects from localStorage on initial render
  useEffect(() => {
    const loadSavedProjects = () => {
      try {
        const saved = localStorage.getItem("forsure-saved-projects")
        if (saved) {
          // Handle migration from old format to new format with versions
          const parsedProjects = JSON.parse(saved) as SavedProject[]
          const migratedProjects = parsedProjects.map((project) => {
            if (!project.versions) {
              // Create initial version if missing
              const initialVersion: ProjectVersion = {
                versionId: crypto.randomUUID(),
                details: project.details,
                timestamp: project.lastUpdated,
              }
              return {
                ...project,
                versions: [initialVersion],
                currentVersionId: initialVersion.versionId,
              }
            }
            return project
          })
          setSavedProjects(migratedProjects)
        }
      } catch (error) {
        console.error("Failed to load saved projects:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSavedProjects()
  }, [])

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("forsure-saved-projects", JSON.stringify(savedProjects))
    }
  }, [savedProjects, isLoaded])

  const saveProject = (details: ProjectDetails, versionNotes?: string) => {
    const now = new Date().toISOString()
    const newVersionId = crypto.randomUUID()

    const newVersion: ProjectVersion = {
      versionId: newVersionId,
      details: { ...details },
      timestamp: now,
      notes: versionNotes,
    }

    const existingIndex = savedProjects.findIndex(
      (project) => project.id === details.id || project.name === details.name,
    )

    if (existingIndex >= 0) {
      // Update existing project with new version
      setSavedProjects((prev) => {
        const updated = [...prev]
        const existingProject = updated[existingIndex]

        updated[existingIndex] = {
          ...existingProject,
          name: details.name,
          lastUpdated: now,
          versions: [...existingProject.versions, newVersion],
          currentVersionId: newVersionId,
          details: { ...details },
        }
        return updated
      })
      return details.id
    } else {
      // Add new project
      const newProjectId = details.id || crypto.randomUUID()
      const newProject: SavedProject = {
        id: newProjectId,
        name: details.name,
        details: {
          ...details,
          id: newProjectId,
        },
        lastUpdated: now,
        versions: [newVersion],
        currentVersionId: newVersionId,
      }

      setSavedProjects((prev) => [...prev, newProject])
      return newProjectId
    }
  }

  const deleteProject = (id: string) => {
    setSavedProjects((prev) => prev.filter((project) => project.id !== id))
  }

  const getProject = (id: string) => {
    return savedProjects.find((project) => project.id === id)
  }

  const getProjectVersions = (projectId: string) => {
    const project = getProject(projectId)
    return project?.versions || []
  }

  const restoreVersion = (projectId: string, versionId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id === projectId) {
          const version = project.versions.find((v) => v.versionId === versionId)
          if (!version) return project

          return {
            ...project,
            details: { ...version.details },
            currentVersionId: versionId,
            lastUpdated: new Date().toISOString(),
          }
        }
        return project
      })
    })
  }

  const deleteVersion = (projectId: string, versionId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id === projectId) {
          // Don't allow deleting if there's only one version
          if (project.versions.length <= 1) return project

          // Don't allow deleting the current version
          if (project.currentVersionId === versionId) return project

          return {
            ...project,
            versions: project.versions.filter((v) => v.versionId !== versionId),
          }
        }
        return project
      })
    })
  }

  // Sharing functions
  const shareProject = (projectId: string, settings: Partial<ShareSettings> = {}) => {
    const shareId = crypto.randomUUID()

    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            shareSettings: {
              isShared: true,
              shareId,
              allowCopy: settings.allowCopy ?? true,
              allowComments: settings.allowComments ?? true,
              viewCount: 0,
              maxViews: settings.maxViews,
              expiresAt: settings.expiresAt,
              sharePassword: settings.sharePassword,
            },
            comments: project.comments || [],
          }
        }
        return project
      })
    })

    return shareId
  }

  const unshareProject = (projectId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id === projectId) {
          const { shareSettings, ...rest } = project
          return {
            ...rest,
            shareSettings: {
              ...shareSettings,
              isShared: false,
            },
          }
        }
        return project
      })
    })
  }

  const getProjectByShareId = (shareId: string) => {
    return savedProjects.find((project) => project.shareSettings?.shareId === shareId && project.shareSettings.isShared)
  }

  const incrementViewCount = (shareId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.shareSettings?.shareId === shareId && project.shareSettings.isShared) {
          const newViewCount = (project.shareSettings.viewCount || 0) + 1
          return {
            ...project,
            shareSettings: {
              ...project.shareSettings,
              viewCount: newViewCount,
              // If max views reached, unshare the project
              isShared: project.shareSettings.maxViews ? newViewCount <= project.shareSettings.maxViews : true,
            },
          }
        }
        return project
      })
    })
  }

  // Comment functions
  const addComment = (shareId: string, comment: { author: string; content: string }) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      shareId,
      author: comment.author,
      content: comment.content,
      timestamp: new Date().toISOString(),
      replies: [],
    }

    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.shareSettings?.shareId === shareId && project.shareSettings.isShared) {
          return {
            ...project,
            comments: [...(project.comments || []), newComment],
          }
        }
        return project
      })
    })

    return newComment
  }

  const editComment = (shareId: string, commentId: string, content: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.shareSettings?.shareId === shareId && project.comments) {
          return {
            ...project,
            comments: project.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  content,
                  isEdited: true,
                }
              }
              return comment
            }),
          }
        }
        return project
      })
    })
  }

  const deleteComment = (shareId: string, commentId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.shareSettings?.shareId === shareId && project.comments) {
          return {
            ...project,
            comments: project.comments.filter((comment) => comment.id !== commentId),
          }
        }
        return project
      })
    })
  }

  const addReply = (shareId: string, commentId: string, reply: { author: string; content: string }) => {
    const newReply: Comment = {
      id: crypto.randomUUID(),
      shareId,
      author: reply.author,
      content: reply.content,
      timestamp: new Date().toISOString(),
    }

    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.shareSettings?.shareId === shareId && project.comments) {
          return {
            ...project,
            comments: project.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply],
                }
              }
              return comment
            }),
          }
        }
        return project
      })
    })

    return newReply
  }

  const getComments = (shareId: string) => {
    const project = getProjectByShareId(shareId)
    return project?.comments || []
  }

  return {
    savedProjects,
    saveProject,
    deleteProject,
    getProject,
    getProjectVersions,
    restoreVersion,
    deleteVersion,
    isLoaded,
    // Share functions
    shareProject,
    unshareProject,
    getProjectByShareId,
    incrementViewCount,
    // Comment functions
    addComment,
    editComment,
    deleteComment,
    addReply,
    getComments,
  }
}
