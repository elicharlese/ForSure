"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function AddTestProject() {
  const { toast } = useToast()

  const addTestProject = () => {
    try {
      // Get existing projects or initialize empty array
      const existingProjects = localStorage.getItem("forsure-saved-projects")
      const projects = existingProjects ? JSON.parse(existingProjects) : []

      // Create a test project
      const now = new Date().toISOString()
      const projectId = crypto.randomUUID()
      const versionId = crypto.randomUUID()

      const testProject = {
        id: projectId,
        name: "Test Project",
        details: {
          id: projectId,
          name: "Test Project",
          description: "A test project to demonstrate loading functionality",
          type: "web",
          framework: "nextjs",
          languages: ["typescript", "javascript"],
          team: {
            size: "small",
            experience: "intermediate",
          },
          goals: ["learning", "productivity"],
        },
        lastUpdated: now,
        versions: [
          {
            versionId: versionId,
            details: {
              id: projectId,
              name: "Test Project",
              description: "A test project to demonstrate loading functionality",
              type: "web",
              framework: "nextjs",
              languages: ["typescript", "javascript"],
              team: {
                size: "small",
                experience: "intermediate",
              },
              goals: ["learning", "productivity"],
            },
            timestamp: now,
          },
        ],
        currentVersionId: versionId,
      }

      // Add test project to projects array
      projects.push(testProject)

      // Save back to localStorage
      localStorage.setItem("forsure-saved-projects", JSON.stringify(projects))

      toast({
        title: "Test Project Added",
        description: "A test project has been added to your saved projects.",
      })
    } catch (error) {
      console.error("Failed to add test project:", error)
      toast({
        title: "Error",
        description: "Failed to add test project.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={addTestProject}>
      Add Test Project
    </Button>
  )
}
