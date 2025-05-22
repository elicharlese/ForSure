"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, Check, Sparkles, FileUp, LayoutTemplate, FileCode, Info } from "lucide-react"
import { TemplateBrowser } from "./template-browser"
import { getTemplateById, applyTemplate } from "../services/template-service"
import type { FileNode } from "./file-structure-visualization"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export type ProjectDetails = {
  id?: string
  name: string
  description: string
  type: string
  framework: string
  languages: string[]
  teamSize: string
  goals: string
  templateId?: string
  templateName?: string
}

const initialProjectDetails: ProjectDetails = {
  name: "",
  description: "",
  type: "",
  framework: "",
  languages: [],
  teamSize: "",
  goals: "",
}

type FormStep = {
  title: string
  description: string
}

const formSteps: FormStep[] = [
  {
    title: "Project Basics",
    description: "Let's start with the basic information about your project",
  },
  {
    title: "Technical Details",
    description: "Tell us about the technical aspects of your project",
  },
  {
    title: "Template & Files",
    description: "Choose a template or upload existing files",
  },
  {
    title: "Team & Goals",
    description: "Share information about your team and project goals",
  },
  {
    title: "Review & Confirm",
    description: "Review your project details before starting the chat",
  },
]

interface ProjectDetailsFormProps {
  onComplete: (details: ProjectDetails, initialStructure?: FileNode) => void
  initialDetails?: ProjectDetails
}

export function ProjectDetailsForm({ onComplete, initialDetails }: ProjectDetailsFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>(initialDetails || initialProjectDetails)
  const [templateBrowserOpen, setTemplateBrowserOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string } | null>(null)
  const [initialStructure, setInitialStructure] = useState<FileNode | undefined>(undefined)
  const [uploadTab, setUploadTab] = useState<string>("template")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const updateProjectDetails = (field: keyof ProjectDetails, value: any) => {
    setProjectDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setProjectDetails((prev) => {
      const languages = [...prev.languages]
      if (languages.includes(language)) {
        return {
          ...prev,
          languages: languages.filter((l) => l !== language),
        }
      } else {
        return {
          ...prev,
          languages: [...languages, language],
        }
      }
    })
  }

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete(projectDetails, initialStructure)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return projectDetails.name.trim() !== "" && projectDetails.description.trim() !== ""
      case 1:
        return projectDetails.type !== "" && projectDetails.framework !== "" && projectDetails.languages.length > 0
      case 2:
        // Template selection is optional
        return true
      case 3:
        return projectDetails.teamSize !== "" && projectDetails.goals.trim() !== ""
      case 4:
        return true
      default:
        return false
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      setSelectedTemplate({ id: templateId, name: template.name })
      updateProjectDetails("templateId", templateId)
      updateProjectDetails("templateName", template.name)

      // If framework and type are not set, use the template's values
      if (!projectDetails.framework) {
        updateProjectDetails("framework", template.framework)
      }
      if (!projectDetails.type) {
        updateProjectDetails("type", template.type)
      }

      // Generate the initial structure based on the template
      const structure = applyTemplate(templateId, projectDetails.name || "New Project")
      if (structure) {
        setInitialStructure(structure)
      }
    }
    setTemplateBrowserOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string
        const fileExtension = file.name.split(".").pop()?.toLowerCase()

        if (fileExtension === "json") {
          const parsedData = JSON.parse(result)

          // Check if it's a valid file structure
          if (isValidFileStructure(parsedData)) {
            setInitialStructure(parsedData)
            toast({
              title: "File structure loaded",
              description: `Successfully loaded file structure from ${file.name}`,
            })
          } else {
            toast({
              title: "Invalid file structure",
              description: "The uploaded file doesn't contain a valid file structure",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Unsupported file format",
            description: "Please upload a JSON file containing a valid file structure",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error parsing file",
          description: "There was an error reading the uploaded file",
          variant: "destructive",
        })
        console.error("Error parsing file:", error)
      }
    }

    reader.readAsText(file)
  }

  // Simple validation for file structure
  const isValidFileStructure = (data: any): boolean => {
    return (
      data &&
      typeof data === "object" &&
      "name" in data &&
      "type" in data &&
      (data.type === "directory" || data.type === "file")
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{formSteps[currentStep].title}</CardTitle>
        <CardDescription>{formSteps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step 1: Project Basics */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium mb-1">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="Enter your project name"
                value={projectDetails.name}
                onChange={(e) => updateProjectDetails("name", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="project-description" className="block text-sm font-medium mb-1">
                Project Description
              </label>
              <Textarea
                id="project-description"
                placeholder="Briefly describe what your project is about"
                value={projectDetails.description}
                onChange={(e) => updateProjectDetails("description", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 2: Technical Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="project-type" className="block text-sm font-medium mb-1">
                Project Type
              </label>
              <Select value={projectDetails.type} onValueChange={(value) => updateProjectDetails("type", value)}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Application</SelectItem>
                  <SelectItem value="mobile">Mobile Application</SelectItem>
                  <SelectItem value="desktop">Desktop Application</SelectItem>
                  <SelectItem value="library">Library/Package</SelectItem>
                  <SelectItem value="api">API/Backend Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="framework" className="block text-sm font-medium mb-1">
                Primary Framework
              </label>
              <Select
                value={projectDetails.framework}
                onValueChange={(value) => updateProjectDetails("framework", value)}
              >
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select primary framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="django">Django</SelectItem>
                  <SelectItem value="flask">Flask</SelectItem>
                  <SelectItem value="rails">Ruby on Rails</SelectItem>
                  <SelectItem value="laravel">Laravel</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="flutter">Flutter</SelectItem>
                  <SelectItem value="reactnative">React Native</SelectItem>
                  <SelectItem value="none">None/Vanilla</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Programming Languages</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {[
                  "JavaScript",
                  "TypeScript",
                  "Python",
                  "Java",
                  "C#",
                  "PHP",
                  "Ruby",
                  "Go",
                  "Rust",
                  "Swift",
                  "Kotlin",
                  "C++",
                ].map((language) => (
                  <Button
                    key={language}
                    type="button"
                    variant={projectDetails.languages.includes(language) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleLanguageToggle(language)}
                  >
                    {projectDetails.languages.includes(language) && <Check className="mr-2 h-4 w-4" />}
                    {language}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Template & Files */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Tabs value={uploadTab} onValueChange={setUploadTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="template" className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  <span>Use Template</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  <span>Upload Files</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="pt-4">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Start with a template</AlertTitle>
                    <AlertDescription>
                      Choose from our pre-built templates to quickly set up your project structure.
                    </AlertDescription>
                  </Alert>

                  {selectedTemplate ? (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Selected Template</h3>
                          <p className="text-sm text-muted-foreground">{selectedTemplate.name}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border rounded-lg p-8 gap-4">
                      <LayoutTemplate className="h-12 w-12 text-muted-foreground" />
                      <div className="text-center">
                        <h3 className="font-medium">No template selected</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose a template to quickly set up your project structure
                        </p>
                      </div>
                      <Button onClick={() => setTemplateBrowserOpen(true)}>Browse Templates</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="pt-4">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Upload existing files</AlertTitle>
                    <AlertDescription>
                      Upload a JSON file containing your project structure to continue working on an existing project.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col items-center justify-center border rounded-lg p-8 gap-4 border-dashed">
                    <FileCode className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <h3 className="font-medium">Drag and drop your file here</h3>
                      <p className="text-sm text-muted-foreground mt-1">Or click to browse your files</p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".json"
                      onChange={handleFileUpload}
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>Select File</Button>
                    {initialStructure && (
                      <Badge variant="outline" className="mt-2 px-3 py-1">
                        <Check className="mr-1 h-3 w-3" />
                        File structure loaded
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Step 4: Team & Goals */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="team-size" className="block text-sm font-medium mb-1">
                Team Size
              </label>
              <Select
                value={projectDetails.teamSize}
                onValueChange={(value) => updateProjectDetails("teamSize", value)}
              >
                <SelectTrigger id="team-size">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Developer</SelectItem>
                  <SelectItem value="small">Small Team (2-5)</SelectItem>
                  <SelectItem value="medium">Medium Team (6-15)</SelectItem>
                  <SelectItem value="large">Large Team (16+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="project-goals" className="block text-sm font-medium mb-1">
                Project Goals
              </label>
              <Textarea
                id="project-goals"
                placeholder="What are you trying to achieve with this project?"
                value={projectDetails.goals}
                onChange={(e) => updateProjectDetails("goals", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Project Basics</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {projectDetails.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {projectDetails.description}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Technical Details</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium">Project Type:</span> {projectDetails.type}
                </div>
                <div>
                  <span className="font-medium">Framework:</span> {projectDetails.framework}
                </div>
                <div>
                  <span className="font-medium">Languages:</span> {projectDetails.languages.join(", ")}
                </div>
                {projectDetails.templateName && (
                  <div>
                    <span className="font-medium">Template:</span> {projectDetails.templateName}
                  </div>
                )}
                {initialStructure && (
                  <div>
                    <span className="font-medium">Initial Structure:</span> {initialStructure ? "Loaded" : "None"}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Team & Goals</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium">Team Size:</span> {projectDetails.teamSize}
                </div>
                <div>
                  <span className="font-medium">Goals:</span> {projectDetails.goals}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!isStepValid()}>
          {currentStep === formSteps.length - 1 ? (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Start Chat
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>

      {/* Template Browser Dialog */}
      <TemplateBrowser
        isOpen={templateBrowserOpen}
        onClose={() => setTemplateBrowserOpen(false)}
        onSelectTemplate={handleTemplateSelect}
        currentFramework={projectDetails.framework}
        currentType={projectDetails.type}
      />
    </Card>
  )
}
