"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  GitMerge,
  FileText,
  Code,
  Settings,
} from "lucide-react"

interface ConflictResolutionHelperProps {
  conflicts: Array<{
    path: string
    type: "content" | "type" | "structure"
    severity: "low" | "medium" | "high"
    suggestion: string
    confidence: number
  }>
  onApplySuggestion: (path: string, suggestion: string) => void
}

export function ConflictResolutionHelper({ conflicts, onApplySuggestion }: ConflictResolutionHelperProps) {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null)

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
    }
  }

  const getSeverityIcon = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: "content" | "type" | "structure") => {
    switch (type) {
      case "content":
        return <FileText className="h-4 w-4" />
      case "type":
        return <Code className="h-4 w-4" />
      case "structure":
        return <Settings className="h-4 w-4" />
    }
  }

  const highPriorityConflicts = conflicts.filter((c) => c.severity === "high")
  const mediumPriorityConflicts = conflicts.filter((c) => c.severity === "medium")
  const lowPriorityConflicts = conflicts.filter((c) => c.severity === "low")

  const smartSuggestions = [
    {
      title: "Auto-merge Compatible Changes",
      description: "Automatically merge changes that don't conflict with each other",
      action: "Apply to 5 conflicts",
      confidence: 95,
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: "Prefer Newer Timestamps",
      description: "Use changes from the more recent version when in doubt",
      action: "Apply to 3 conflicts",
      confidence: 80,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "Merge Text Content",
      description: "Intelligently combine text changes from both versions",
      action: "Apply to 2 conflicts",
      confidence: 75,
      icon: <GitMerge className="h-4 w-4" />,
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Conflict Resolution Assistant
        </CardTitle>
        <CardDescription>AI-powered suggestions to help resolve merge conflicts efficiently</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
            <TabsTrigger value="conflicts">Conflict Analysis</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="grid gap-3">
              {smartSuggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-primary">{suggestion.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{suggestion.description}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.confidence}% confidence
                          </Badge>
                          <span className="text-xs text-muted-foreground">{suggestion.action}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-4">
            <div className="grid gap-4">
              {/* High Priority */}
              {highPriorityConflicts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-sm">High Priority ({highPriorityConflicts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {highPriorityConflicts.map((conflict, index) => (
                      <ConflictItem
                        key={index}
                        conflict={conflict}
                        isSelected={selectedConflict === conflict.path}
                        onSelect={() => setSelectedConflict(conflict.path)}
                        onApplySuggestion={onApplySuggestion}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Priority */}
              {mediumPriorityConflicts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">Medium Priority ({mediumPriorityConflicts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {mediumPriorityConflicts.map((conflict, index) => (
                      <ConflictItem
                        key={index}
                        conflict={conflict}
                        isSelected={selectedConflict === conflict.path}
                        onSelect={() => setSelectedConflict(conflict.path)}
                        onApplySuggestion={onApplySuggestion}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Low Priority */}
              {lowPriorityConflicts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Low Priority ({lowPriorityConflicts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {lowPriorityConflicts.map((conflict, index) => (
                      <ConflictItem
                        key={index}
                        conflict={conflict}
                        isSelected={selectedConflict === conflict.path}
                        onSelect={() => setSelectedConflict(conflict.path)}
                        onApplySuggestion={onApplySuggestion}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <div className="font-medium text-sm mb-2">Detected Patterns</div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>• Most conflicts are in configuration files</div>
                  <div>• Target version has more recent dependency updates</div>
                  <div>• Current version has additional feature implementations</div>
                  <div>• No structural conflicts detected</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="font-medium text-sm mb-2">Recommendations</div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>• Consider using target version for dependency updates</div>
                  <div>• Manually review feature implementations</div>
                  <div>• Auto-merge non-conflicting configuration changes</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface ConflictItemProps {
  conflict: {
    path: string
    type: "content" | "type" | "structure"
    severity: "low" | "medium" | "high"
    suggestion: string
    confidence: number
  }
  isSelected: boolean
  onSelect: () => void
  onApplySuggestion: (path: string, suggestion: string) => void
}

function ConflictItem({ conflict, isSelected, onSelect, onApplySuggestion }: ConflictItemProps) {
  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
    }
  }

  const getTypeIcon = (type: "content" | "type" | "structure") => {
    switch (type) {
      case "content":
        return <FileText className="h-3 w-3" />
      case "type":
        return <Code className="h-3 w-3" />
      case "structure":
        return <Settings className="h-3 w-3" />
    }
  }

  return (
    <div
      className={`border rounded-md p-3 cursor-pointer transition-colors ${
        isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/30"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className={getSeverityColor(conflict.severity)}>{getTypeIcon(conflict.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs truncate">{conflict.path}</div>
            <div className="text-xs text-muted-foreground mt-1">{conflict.suggestion}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {conflict.type}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getSeverityColor(conflict.severity)}`}>
                {conflict.severity}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {conflict.confidence}% confidence
              </Badge>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onApplySuggestion(conflict.path, conflict.suggestion)
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}
