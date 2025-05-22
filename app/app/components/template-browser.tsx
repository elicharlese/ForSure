"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, Info, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllTemplates, getFilteredTemplates, type ProjectTemplate } from "../services/template-service"
import { FileStructureVisualization } from "./file-structure-visualization"

interface TemplateBrowserProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
  currentFramework?: string
  currentType?: string
}

export function TemplateBrowser({
  isOpen,
  onClose,
  onSelectTemplate,
  currentFramework,
  currentType,
}: TemplateBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFramework, setSelectedFramework] = useState<string | undefined>(currentFramework)
  const [selectedType, setSelectedType] = useState<string | undefined>(currentType)
  const [selectedComplexity, setSelectedComplexity] = useState<string | undefined>(undefined)
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<ProjectTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Load templates on mount
  useEffect(() => {
    setTemplates(getAllTemplates())
  }, [])

  // Apply filters when templates, search, or filters change
  useEffect(() => {
    let filtered = templates

    // Apply framework and type filters
    filtered = getFilteredTemplates(selectedFramework, selectedType)

    // Apply complexity filter
    if (selectedComplexity) {
      filtered = filtered.filter((template) => template.complexity === selectedComplexity)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, selectedFramework, selectedType, selectedComplexity])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedFramework(undefined)
    setSelectedType(undefined)
    setSelectedComplexity(undefined)
  }

  const openPreview = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setPreviewOpen(true)
  }

  const closePreview = () => {
    setPreviewOpen(false)
  }

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.id)
      closePreview()
      onClose()
    }
  }

  // Get unique frameworks and types for filters
  const frameworks = Array.from(new Set(templates.map((t) => t.framework)))
  const types = Array.from(new Set(templates.map((t) => t.type)))

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl">Project Templates</DialogTitle>
            <DialogDescription className="text-base mt-1.5">
              Choose a template to quickly set up your project structure. Templates are organized by framework, project
              type, and complexity.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search and filters */}
            <div className="px-6 py-4 border-b bg-muted/30">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 rounded-full"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={selectedFramework || ""}
                    onChange={(e) => setSelectedFramework(e.target.value || undefined)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-w-[140px]"
                    aria-label="Filter by framework"
                  >
                    <option value="">All Frameworks</option>
                    {frameworks.map((framework) => (
                      <option key={framework} value={framework}>
                        {framework.charAt(0).toUpperCase() + framework.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedType || ""}
                    onChange={(e) => setSelectedType(e.target.value || undefined)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-w-[140px]"
                    aria-label="Filter by project type"
                  >
                    <option value="">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedComplexity || ""}
                    onChange={(e) => setSelectedComplexity(e.target.value || undefined)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-w-[140px]"
                    aria-label="Filter by complexity"
                  >
                    <option value="">All Complexity</option>
                    <option value="simple">Simple</option>
                    <option value="standard">Standard</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearFilters}
                    title="Clear filters"
                    disabled={!selectedFramework && !selectedType && !selectedComplexity && !searchQuery}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Clear filters</span>
                  </Button>
                </div>
              </div>

              {/* Applied filters */}
              {(selectedFramework || selectedType || selectedComplexity || searchQuery) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedFramework && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                      Framework: {selectedFramework}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setSelectedFramework(undefined)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove framework filter</span>
                      </Button>
                    </Badge>
                  )}
                  {selectedType && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                      Type: {selectedType}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setSelectedType(undefined)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove type filter</span>
                      </Button>
                    </Badge>
                  )}
                  {selectedComplexity && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                      Complexity: {selectedComplexity}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setSelectedComplexity(undefined)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove complexity filter</span>
                      </Button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                      Search: {searchQuery}
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setSearchQuery("")}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Clear search</span>
                      </Button>
                    </Badge>
                  )}

                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 px-2 ml-1">
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Template grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Info className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No templates found</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    Try adjusting your filters or search query to find templates.
                  </p>
                  {(selectedFramework || selectedType || selectedComplexity || searchQuery) && (
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="overflow-hidden flex flex-col h-full border-2 hover:border-primary/50 transition-colors"
                    >
                      <CardHeader className="pb-2 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-base leading-tight">{template.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className={
                              template.complexity === "simple"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : template.complexity === "advanced"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }
                          >
                            {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 min-h-[40px]">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <Badge variant="secondary" className="font-medium">
                            {template.framework}
                          </Badge>
                          <Badge variant="secondary" className="font-medium">
                            {template.type}
                          </Badge>
                          {template.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2 border-t bg-muted/30">
                        <Button variant="outline" size="sm" onClick={() => openPreview(template)}>
                          Preview
                        </Button>
                        <Button size="sm" onClick={() => onSelectTemplate(template.id)}>
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template preview dialog */}
      <Dialog open={previewOpen} onOpenChange={closePreview}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">{selectedTemplate?.name}</DialogTitle>
                <DialogDescription className="mt-1">{selectedTemplate?.description}</DialogDescription>
              </div>
              {selectedTemplate && (
                <Badge
                  variant="outline"
                  className={
                    selectedTemplate.complexity === "simple"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : selectedTemplate.complexity === "advanced"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }
                >
                  {selectedTemplate.complexity.charAt(0).toUpperCase() + selectedTemplate.complexity.slice(1)}{" "}
                  Complexity
                </Badge>
              )}
            </div>
          </DialogHeader>

          <Tabs defaultValue="structure" className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b px-6 py-2 bg-muted/30">
              <TabsList>
                <TabsTrigger value="structure" className="data-[state=active]:bg-primary/10">
                  Structure
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-primary/10">
                  Details
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="structure" className="flex-1 overflow-auto p-6 m-0 border-0">
              {selectedTemplate && (
                <FileStructureVisualization structure={selectedTemplate.structure} readOnly className="h-full" />
              )}
            </TabsContent>
            <TabsContent value="details" className="flex-1 overflow-auto p-6 m-0 border-0">
              {selectedTemplate && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Framework</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 px-3 py-1.5">
                            {selectedTemplate.framework.charAt(0).toUpperCase() + selectedTemplate.framework.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {selectedTemplate.framework === "react"
                              ? "React.js application"
                              : selectedTemplate.framework === "nextjs"
                                ? "Next.js application"
                                : selectedTemplate.framework === "node"
                                  ? "Node.js application"
                                  : "Application"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Project Type</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 px-3 py-1.5">
                            {selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {selectedTemplate.type === "webapp"
                              ? "Web application"
                              : selectedTemplate.type === "api"
                                ? "API service"
                                : selectedTemplate.type === "static"
                                  ? "Static website"
                                  : "Application"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="px-3 py-1.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Structure Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">File Count</h4>
                          <p className="text-sm text-muted-foreground">
                            {countFiles(selectedTemplate.structure)} files in{" "}
                            {countDirectories(selectedTemplate.structure)} directories
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Key Features</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
                            {getTemplateFeatures(selectedTemplate).map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium">This template is ready to use</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href="https://forsure.dev/docs/templates" target="_blank" rel="noopener noreferrer">
                        <span>Learn more</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={closePreview} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSelectTemplate}>Use This Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to count files in a structure
function countFiles(node: any): number {
  if (node.type === "file") return 1

  let count = 0
  if (node.children) {
    for (const child of node.children) {
      count += countFiles(child)
    }
  }
  return count
}

// Helper function to count directories in a structure
function countDirectories(node: any): number {
  if (node.type === "file") return 0

  let count = 1 // Count this directory
  if (node.children) {
    for (const child of node.children) {
      if (child.type === "directory") {
        count += countDirectories(child)
      }
    }
  }
  return count
}

// Helper function to generate template features based on structure and metadata
function getTemplateFeatures(template: any): string[] {
  const features = []

  // Framework-specific features
  if (template.framework === "react") {
    features.push("React component structure")
    features.push("State management setup")
  } else if (template.framework === "nextjs") {
    features.push("Next.js App Router structure")
    features.push("API routes configuration")
  } else if (template.framework === "node") {
    features.push("Express.js server setup")
    features.push("API endpoint organization")
  }

  // Type-specific features
  if (template.type === "webapp") {
    features.push("User interface components")
    features.push("Responsive layout structure")
  } else if (template.type === "api") {
    features.push("RESTful API organization")
    features.push("Controller/service architecture")
  }

  // Complexity-specific features
  if (template.complexity === "advanced") {
    features.push("Advanced project organization")
    features.push("Scalable architecture patterns")
  }

  // Add some generic features if we don't have enough
  if (features.length < 4) {
    if (!features.includes("Configuration files")) features.push("Configuration files")
    if (!features.includes("Testing directory structure")) features.push("Testing directory structure")
    if (!features.includes("Documentation organization")) features.push("Documentation organization")
  }

  return features.slice(0, 5) // Return at most 5 features
}
