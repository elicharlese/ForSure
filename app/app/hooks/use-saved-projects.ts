"use client"

import { useState, useEffect } from "react"
import type { ProjectDetails } from "../components/project-details-form"
import type { MergeOptions } from "../components/version-merge-dialog"

export type ProjectVersion = {
  versionId: string
  details: ProjectDetails
  timestamp: string
  notes?: string
  branchId?: string // Reference to the branch this version belongs to
}

export type Branch = {
  id: string
  name: string
  description?: string
  createdAt: string
  lastUpdated: string
  sourceVersionId: string // The version this branch was created from
  headVersionId: string // The latest version in this branch
  isDefault?: boolean // Whether this is the default/main branch
  color?: string // Optional color for visual distinction
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

export type Tag = {
  id: string
  name: string
  description?: string
  versionId: string // The version this tag points to
  type: "release" | "milestone" | "hotfix" | "feature" | "custom"
  createdAt: string
  createdBy?: string
  isProtected?: boolean // Whether this tag can be deleted
  metadata?: {
    version?: string // Semantic version like "1.0.0"
    changelog?: string
    releaseNotes?: string
    [key: string]: any
  }
}

export type SavedProject = {
  id: string
  name: string
  details: ProjectDetails
  lastUpdated: string
  versions: ProjectVersion[]
  currentVersionId: string
  branches: Branch[] // List of branches
  currentBranchId: string // Currently active branch
  tags: Tag[] // List of tags
  shareSettings?: ShareSettings
  comments?: Comment[]
}

export type ThreeWayMergeOptions = {
  mergeResult: {
    conflicts: {
      path: string
      currentValue: any
      targetValue: any
      ancestorValue: any
    }[]
    autoResolved: {
      path: string
      finalValue: any
    }[]
  }
  resolutions: { [path: string]: "current" | "target" | "ancestor" | "custom" }
  customResolutions: { [path: string]: any }
  createNewVersion: boolean
  mergeNotes?: string
}

// Branch colors for visual distinction
export const BRANCH_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#a855f7", // purple-500
]

export function useSavedProjects() {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved projects from localStorage on initial render
  useEffect(() => {
    const loadSavedProjects = () => {
      try {
        const saved = localStorage.getItem("forsure-saved-projects")
        if (saved) {
          // Handle migration from old format to new format with versions and branches
          const parsedProjects = JSON.parse(saved) as SavedProject[]
          const migratedProjects = parsedProjects.map((project) => {
            // Create initial version if missing
            if (!project.versions) {
              const initialVersion: ProjectVersion = {
                versionId: crypto.randomUUID(),
                details: project.details,
                timestamp: project.lastUpdated,
              }
              project = {
                ...project,
                versions: [initialVersion],
                currentVersionId: initialVersion.versionId,
              }
            }

            // Create initial branch if missing
            if (!project.branches) {
              const mainBranchId = crypto.randomUUID()
              const mainBranch: Branch = {
                id: mainBranchId,
                name: "main",
                createdAt: project.versions[0].timestamp,
                lastUpdated: project.lastUpdated,
                sourceVersionId: project.versions[0].versionId,
                headVersionId: project.currentVersionId,
                isDefault: true,
                color: BRANCH_COLORS[0],
              }

              // Assign all existing versions to the main branch
              const updatedVersions = project.versions.map((version) => ({
                ...version,
                branchId: mainBranchId,
              }))

              project = {
                ...project,
                versions: updatedVersions,
                branches: [mainBranch],
                currentBranchId: mainBranchId,
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

    const existingIndex = savedProjects.findIndex(
      (project) => project.id === details.id || project.name === details.name,
    )

    if (existingIndex >= 0) {
      // Update existing project with new version
      setSavedProjects((prev) => {
        const updated = [...prev]
        const existingProject = updated[existingIndex]
        const currentBranch = existingProject.branches.find((b) => b.id === existingProject.currentBranchId)

        if (!currentBranch) {
          console.error("Current branch not found")
          return prev
        }

        const newVersion: ProjectVersion = {
          versionId: newVersionId,
          details: { ...details },
          timestamp: now,
          notes: versionNotes,
          branchId: currentBranch.id,
        }

        // Update the branch's head version
        const updatedBranches = existingProject.branches.map((branch) =>
          branch.id === currentBranch.id
            ? {
                ...branch,
                headVersionId: newVersionId,
                lastUpdated: now,
              }
            : branch,
        )

        updated[existingIndex] = {
          ...existingProject,
          name: details.name,
          lastUpdated: now,
          versions: [...existingProject.versions, newVersion],
          currentVersionId: newVersionId,
          details: { ...details },
          branches: updatedBranches,
        }
        return updated
      })
      return details.id
    } else {
      // Add new project
      const newProjectId = details.id || crypto.randomUUID()
      const mainBranchId = crypto.randomUUID()

      const newVersion: ProjectVersion = {
        versionId: newVersionId,
        details: {
          ...details,
          id: newProjectId,
        },
        timestamp: now,
        notes: versionNotes,
        branchId: mainBranchId,
      }

      const mainBranch: Branch = {
        id: mainBranchId,
        name: "main",
        createdAt: now,
        lastUpdated: now,
        sourceVersionId: newVersionId,
        headVersionId: newVersionId,
        isDefault: true,
        color: BRANCH_COLORS[0],
      }

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
        branches: [mainBranch],
        currentBranchId: mainBranchId,
        tags: [],
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

  const getProjectBranches = (projectId: string) => {
    const project = getProject(projectId)
    return project?.branches || []
  }

  const getCurrentBranch = (projectId: string) => {
    const project = getProject(projectId)
    if (!project) return null
    return project.branches.find((branch) => branch.id === project.currentBranchId) || null
  }

  const getBranchVersions = (projectId: string, branchId: string) => {
    const project = getProject(projectId)
    if (!project) return []
    return project.versions.filter((version) => version.branchId === branchId)
  }

  const createBranch = (
    projectId: string,
    sourceVersionId: string,
    branchName: string,
    branchDescription?: string,
    switchToBranch = true,
  ) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const sourceVersion = project.versions.find((v) => v.versionId === sourceVersionId)
        if (!sourceVersion) return project

        const now = new Date().toISOString()
        const newBranchId = crypto.randomUUID()

        // Assign a color to the new branch
        const usedColors = project.branches.map((b) => b.color)
        const availableColors = BRANCH_COLORS.filter((color) => !usedColors.includes(color))
        const branchColor =
          availableColors.length > 0
            ? availableColors[0]
            : BRANCH_COLORS[project.branches.length % BRANCH_COLORS.length]

        // Create the new branch
        const newBranch: Branch = {
          id: newBranchId,
          name: branchName,
          description: branchDescription,
          createdAt: now,
          lastUpdated: now,
          sourceVersionId: sourceVersionId,
          headVersionId: sourceVersionId, // Initially, the head is the source version
          color: branchColor,
        }

        return {
          ...project,
          branches: [...project.branches, newBranch],
          currentBranchId: switchToBranch ? newBranchId : project.currentBranchId,
        }
      })
    })
  }

  const switchBranch = (projectId: string, branchId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const branch = project.branches.find((b) => b.id === branchId)
        if (!branch) return project

        return {
          ...project,
          currentBranchId: branchId,
          currentVersionId: branch.headVersionId,
          details: {
            ...project.versions.find((v) => v.versionId === branch.headVersionId)?.details,
          },
        }
      })
    })
  }

  const deleteBranch = (projectId: string, branchId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        // Don't allow deleting the default branch
        const branchToDelete = project.branches.find((b) => b.id === branchId)
        if (!branchToDelete || branchToDelete.isDefault) return project

        // Don't allow deleting the current branch
        if (project.currentBranchId === branchId) return project

        // Remove the branch
        const updatedBranches = project.branches.filter((b) => b.id !== branchId)

        // Optionally, you could also remove versions that belong only to this branch
        // This is a design decision - in Git, deleting a branch doesn't delete the commits
        // For simplicity, we'll keep the versions

        return {
          ...project,
          branches: updatedBranches,
        }
      })
    })
  }

  const renameBranch = (projectId: string, branchId: string, newName: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const updatedBranches = project.branches.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                name: newName,
                lastUpdated: new Date().toISOString(),
              }
            : branch,
        )

        return {
          ...project,
          branches: updatedBranches,
        }
      })
    })
  }

  const restoreVersion = (projectId: string, versionId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const version = project.versions.find((v) => v.versionId === versionId)
        if (!version) return project

        // When restoring a version, we need to update the current branch's head
        const currentBranchId = project.currentBranchId
        const updatedBranches = project.branches.map((branch) =>
          branch.id === currentBranchId
            ? {
                ...branch,
                headVersionId: versionId,
                lastUpdated: new Date().toISOString(),
              }
            : branch,
        )

        return {
          ...project,
          details: { ...version.details },
          currentVersionId: versionId,
          lastUpdated: new Date().toISOString(),
          branches: updatedBranches,
        }
      })
    })
  }

  const deleteVersion = (projectId: string, versionId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        // Don't allow deleting if there's only one version
        if (project.versions.length <= 1) return project

        // Don't allow deleting the current version
        if (project.currentVersionId === versionId) return project

        // Don't allow deleting a version that is a branch head
        const isBranchHead = project.branches.some((branch) => branch.headVersionId === versionId)
        if (isBranchHead) return project

        return {
          ...project,
          versions: project.versions.filter((v) => v.versionId !== versionId),
        }
      })
    })
  }

  const findCommonAncestor = (projectId: string, version1Id: string, version2Id: string) => {
    const project = getProject(projectId)
    if (!project) return null

    // Get the versions in chronological order (oldest first)
    const sortedVersions = [...project.versions].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    // Find the latest version that comes before both version1 and version2
    const version1Index = sortedVersions.findIndex((v) => v.versionId === version1Id)
    const version2Index = sortedVersions.findIndex((v) => v.versionId === version2Id)

    if (version1Index === -1 || version2Index === -1) return null

    // If one version is an ancestor of the other, return the earlier one
    if (version1Index < version2Index) return sortedVersions[version1Index]
    if (version2Index < version1Index) return sortedVersions[version2Index]

    // Otherwise, find the latest common ancestor by looking at version notes
    // This is a simplified approach - in a real VCS, you'd have a proper commit graph
    for (let i = Math.min(version1Index, version2Index) - 1; i >= 0; i--) {
      // For this example, we'll just return the most recent version before both
      return sortedVersions[i]
    }

    // If no common ancestor found, return the first version
    return sortedVersions[0]
  }

  // New function to merge versions
  const mergeVersions = (
    projectId: string,
    sourceVersionId: string,
    targetVersionId: string,
    options: MergeOptions,
  ) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        // Find the source and target versions
        const sourceVersion = project.versions.find((v) => v.versionId === sourceVersionId)
        const targetVersion = project.versions.find((v) => v.versionId === targetVersionId)

        if (!sourceVersion || !targetVersion) return project

        // Create a new merged version based on the source version
        const mergedDetails = { ...sourceVersion.details }

        // Apply selected changes based on merge strategy
        if (options.mergeStrategy === "theirs") {
          // Use all changes from target version
          mergedDetails.name = targetVersion.details.name
          mergedDetails.description = targetVersion.details.description
          mergedDetails.type = targetVersion.details.type
          mergedDetails.framework = targetVersion.details.framework
          mergedDetails.languages = [...targetVersion.details.languages]
          mergedDetails.teamSize = targetVersion.details.teamSize
          mergedDetails.goals = targetVersion.details.goals

          // Merge file structure if available
          if (targetVersion.details.fileStructure) {
            mergedDetails.fileStructure = JSON.parse(JSON.stringify(targetVersion.details.fileStructure))
          }
        } else if (options.mergeStrategy === "ours") {
          // Keep current version (already copied)
        } else if (options.mergeStrategy === "manual") {
          // Apply selected changes manually
          Object.entries(options.selectedChanges).forEach(([path, version]) => {
            const pathParts = path.split("/")

            if (version === "target") {
              // Apply target version's value
              if (path === "name") mergedDetails.name = targetVersion.details.name
              else if (path === "description") mergedDetails.description = targetVersion.details.description
              else if (path === "type") mergedDetails.type = targetVersion.details.type
              else if (path === "framework") mergedDetails.framework = targetVersion.details.framework
              else if (path === "teamSize") mergedDetails.teamSize = targetVersion.details.teamSize
              else if (path === "goals") mergedDetails.goals = targetVersion.details.goals
              else if (path.startsWith("languages/")) {
                const lang = pathParts[1]
                if (!mergedDetails.languages.includes(lang)) {
                  mergedDetails.languages.push(lang)
                }
              } else if (path.startsWith("fileStructure/")) {
                // Handle file structure changes
                if (!mergedDetails.fileStructure) {
                  mergedDetails.fileStructure = {
                    name: "root",
                    type: "directory",
                    children: [],
                  }
                }

                // This is a simplified approach - in a real app, you'd need more sophisticated
                // file structure merging logic
                if (targetVersion.details.fileStructure) {
                  mergedDetails.fileStructure = JSON.parse(JSON.stringify(targetVersion.details.fileStructure))
                }
              }
            } else if (version === "current") {
              // Keep current version's value (already set)
              // For languages, we might need to remove a language that was removed
              if (path.startsWith("languages/")) {
                const lang = pathParts[1]
                mergedDetails.languages = mergedDetails.languages.filter((l) => l !== lang)
              }
            }
          })
        }

        // Create merge notes
        const mergeNotes = options.mergeNotes || `Merge of versions ${sourceVersionId} and ${targetVersionId}`

        // Create a new version or update the current one
        if (options.createNewVersion) {
          const newVersionId = crypto.randomUUID()
          const now = new Date().toISOString()

          // The merged version belongs to the current branch
          const currentBranchId = project.currentBranchId

          const newVersion: ProjectVersion = {
            versionId: newVersionId,
            details: mergedDetails,
            timestamp: now,
            notes: mergeNotes,
            branchId: currentBranchId,
          }

          // Update the branch's head version
          const updatedBranches = project.branches.map((branch) =>
            branch.id === currentBranchId
              ? {
                  ...branch,
                  headVersionId: newVersionId,
                  lastUpdated: now,
                }
              : branch,
          )

          return {
            ...project,
            name: mergedDetails.name,
            details: mergedDetails,
            lastUpdated: now,
            versions: [...project.versions, newVersion],
            currentVersionId: newVersionId,
            branches: updatedBranches,
          }
        } else {
          // Update the current version
          return {
            ...project,
            name: mergedDetails.name,
            details: mergedDetails,
            lastUpdated: new Date().toISOString(),
            versions: project.versions.map((v) =>
              v.versionId === sourceVersionId ? { ...v, details: mergedDetails, notes: mergeNotes } : v,
            ),
          }
        }
      })
    })
  }

  // New function to merge versions using three-way merge
  const mergeVersionsThreeWay = (
    projectId: string,
    sourceVersionId: string,
    targetVersionId: string,
    options: ThreeWayMergeOptions,
  ) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        // Find the source and target versions
        const sourceVersion = project.versions.find((v) => v.versionId === sourceVersionId)
        const targetVersion = project.versions.find((v) => v.versionId === targetVersionId)

        if (!sourceVersion || !targetVersion) return project

        // Start with the source version as base
        const mergedDetails = { ...sourceVersion.details }

        // Apply resolutions from three-way merge
        Object.entries(options.resolutions).forEach(([path, resolution]) => {
          const conflict = options.mergeResult.conflicts.find((c) => c.path === path)
          if (!conflict) return

          if (resolution === "target") {
            applyValueToPath(mergedDetails, path, conflict.targetValue)
          } else if (resolution === "ancestor" && conflict.ancestorValue !== undefined) {
            applyValueToPath(mergedDetails, path, conflict.ancestorValue)
          } else if (resolution === "custom") {
            const customValue = options.customResolutions[path]
            if (customValue !== undefined) {
              applyValueToPath(mergedDetails, path, customValue)
            }
          }
          // 'current' resolution means keep the current value (already set)
        })

        // Apply auto-resolved changes
        options.mergeResult.autoResolved.forEach((change) => {
          applyValueToPath(mergedDetails, change.path, change.finalValue)
        })

        // Create merge notes
        const mergeNotes = options.mergeNotes || `Three-way merge of versions ${sourceVersionId} and ${targetVersionId}`

        // Create a new version or update the current one
        if (options.createNewVersion) {
          const newVersionId = crypto.randomUUID()
          const now = new Date().toISOString()

          // The merged version belongs to the current branch
          const currentBranchId = project.currentBranchId

          const newVersion: ProjectVersion = {
            versionId: newVersionId,
            details: mergedDetails,
            timestamp: now,
            notes: mergeNotes,
            branchId: currentBranchId,
          }

          // Update the branch's head version
          const updatedBranches = project.branches.map((branch) =>
            branch.id === currentBranchId
              ? {
                  ...branch,
                  headVersionId: newVersionId,
                  lastUpdated: now,
                }
              : branch,
          )

          return {
            ...project,
            name: mergedDetails.name,
            details: mergedDetails,
            lastUpdated: now,
            versions: [...project.versions, newVersion],
            currentVersionId: newVersionId,
            branches: updatedBranches,
          }
        } else {
          // Update the current version
          return {
            ...project,
            name: mergedDetails.name,
            details: mergedDetails,
            lastUpdated: new Date().toISOString(),
            versions: project.versions.map((v) =>
              v.versionId === sourceVersionId ? { ...v, details: mergedDetails, notes: mergeNotes } : v,
            ),
          }
        }
      })
    })
  }

  // Helper function to apply a value to a nested path
  const applyValueToPath = (obj: any, path: string, value: any) => {
    const pathParts = path.split("/")

    if (pathParts.length === 1) {
      // Simple property
      obj[path] = value
    } else if (path.startsWith("languages/")) {
      // Language handling
      const lang = pathParts[1]
      if (value === undefined) {
        // Remove language
        obj.languages = obj.languages.filter((l: string) => l !== lang)
      } else {
        // Add language
        if (!obj.languages.includes(lang)) {
          obj.languages.push(lang)
        }
      }
    } else if (path.startsWith("fileStructure/")) {
      // File structure handling - simplified for this example
      if (value !== undefined) {
        obj.fileStructure = value
      } else {
        delete obj.fileStructure
      }
    }
  }

  const shareProject = async (projectId: string, settings: ShareSettings) => {
    // Placeholder for shareProject implementation
    console.log("shareProject called", projectId, settings)
  }

  const unshareProject = async (projectId: string) => {
    // Placeholder for unshareProject implementation
    console.log("unshareProject called", projectId)
  }

  const getProjectByShareId = async (shareId: string) => {
    // Placeholder for getProjectByShareId implementation
    console.log("getProjectByShareId called", shareId)
    return null
  }

  const incrementViewCount = async (shareId: string) => {
    // Placeholder for incrementViewCount implementation
    console.log("incrementViewCount called", shareId)
  }

  const addComment = async (shareId: string, author: string, content: string) => {
    // Placeholder for addComment implementation
    console.log("addComment called", shareId, author, content)
  }

  const editComment = async (commentId: string, content: string) => {
    // Placeholder for editComment implementation
    console.log("editComment called", commentId, content)
  }

  const deleteComment = async (commentId: string) => {
    // Placeholder for deleteComment implementation
    console.log("deleteComment called", commentId)
  }

  const addReply = async (commentId: string, author: string, content: string) => {
    // Placeholder for addReply implementation
    console.log("addReply called", commentId, author, content)
  }

  const getComments = async (shareId: string) => {
    // Placeholder for getComments implementation
    console.log("getComments called", shareId)
    return []
  }

  const createTag = (
    projectId: string,
    versionId: string,
    tagName: string,
    tagType: Tag["type"] = "custom",
    description?: string,
    metadata?: Tag["metadata"],
  ) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const version = project.versions.find((v) => v.versionId === versionId)
        if (!version) return project

        // Check if tag name already exists
        const existingTag = project.tags?.find((tag) => tag.name === tagName)
        if (existingTag) {
          console.error("Tag name already exists")
          return project
        }

        const now = new Date().toISOString()
        const newTagId = crypto.randomUUID()

        const newTag: Tag = {
          id: newTagId,
          name: tagName,
          description,
          versionId,
          type: tagType,
          createdAt: now,
          metadata,
        }

        return {
          ...project,
          tags: [...(project.tags || []), newTag],
        }
      })
    })
  }

  const deleteTag = (projectId: string, tagId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        // Don't allow deleting protected tags
        const tagToDelete = project.tags?.find((tag) => tag.id === tagId)
        if (tagToDelete?.isProtected) return project

        return {
          ...project,
          tags: project.tags?.filter((tag) => tag.id !== tagId) || [],
        }
      })
    })
  }

  const updateTag = (
    projectId: string,
    tagId: string,
    updates: Partial<Pick<Tag, "name" | "description" | "metadata">>,
  ) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const updatedTags =
          project.tags?.map((tag) =>
            tag.id === tagId
              ? {
                  ...tag,
                  ...updates,
                }
              : tag,
          ) || []

        return {
          ...project,
          tags: updatedTags,
        }
      })
    })
  }

  const getProjectTags = (projectId: string) => {
    const project = getProject(projectId)
    return project?.tags || []
  }

  const getTagsForVersion = (projectId: string, versionId: string) => {
    const project = getProject(projectId)
    if (!project) return []
    return project.tags?.filter((tag) => tag.versionId === versionId) || []
  }

  const moveTag = (projectId: string, tagId: string, newVersionId: string) => {
    setSavedProjects((prev) => {
      return prev.map((project) => {
        if (project.id !== projectId) return project

        const version = project.versions.find((v) => v.versionId === newVersionId)
        if (!version) return project

        const updatedTags =
          project.tags?.map((tag) =>
            tag.id === tagId
              ? {
                  ...tag,
                  versionId: newVersionId,
                }
              : tag,
          ) || []

        return {
          ...project,
          tags: updatedTags,
        }
      })
    })
  }

  // Add to the return statement
  return {
    savedProjects,
    saveProject,
    deleteProject,
    getProject,
    getProjectVersions,
    getProjectBranches,
    getCurrentBranch,
    getBranchVersions,
    createBranch,
    switchBranch,
    deleteBranch,
    renameBranch,
    restoreVersion,
    deleteVersion,
    mergeVersions,
    mergeVersionsThreeWay,
    // Tag functions
    createTag,
    deleteTag,
    updateTag,
    getProjectTags,
    getTagsForVersion,
    moveTag,
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
