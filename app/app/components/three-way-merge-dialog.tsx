'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  GitMerge,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronRight,
  Copy,
  GitBranch,
  History,
  Target,
  Users,
} from 'lucide-react'
import type { ProjectVersion } from '../hooks/use-saved-projects'
import { Badge } from '@/components/ui/badge'
import {
  ThreeWayMergeService,
  type ThreeWayMergeResult,
  type ThreeWayConflict,
  type ThreeWayChange,
} from '../services/three-way-merge'

interface ThreeWayMergeDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  currentVersion: ProjectVersion
  targetVersion: ProjectVersion
  allVersions: ProjectVersion[]
  onMerge: (mergeOptions: ThreeWayMergeOptions) => void
}

export interface ThreeWayMergeOptions {
  mergeStrategy: 'three-way' | 'manual' | 'theirs' | 'ours'
  resolutions: Record<string, 'current' | 'target' | 'ancestor' | 'custom'>
  customResolutions: Record<string, any>
  mergeNotes: string
  createNewVersion: boolean
  mergeResult: ThreeWayMergeResult
}

export function ThreeWayMergeDialog({
  isOpen,
  onClose,
  projectId,
  currentVersion,
  targetVersion,
  allVersions,
  onMerge,
}: ThreeWayMergeDialogProps) {
  const [mergeStrategy, setMergeStrategy] = useState<
    'three-way' | 'manual' | 'theirs' | 'ours'
  >('three-way')
  const [mergeNotes, setMergeNotes] = useState<string>('')
  const [createNewVersion, setCreateNewVersion] = useState<boolean>(true)
  const [mergeResult, setMergeResult] = useState<ThreeWayMergeResult | null>(
    null
  )
  const [resolutions, setResolutions] = useState<
    Record<string, 'current' | 'target' | 'ancestor' | 'custom'>
  >({})
  const [customResolutions, setCustomResolutions] = useState<
    Record<string, any>
  >({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [expandedConflicts, setExpandedConflicts] = useState<Set<string>>(
    new Set()
  )

  // Calculate merge statistics
  const mergeStats = useMemo(() => {
    if (!mergeResult)
      return {
        total: 0,
        conflicts: 0,
        autoResolved: 0,
        resolved: 0,
        progress: 0,
        remaining: 0,
      }

    const total = mergeResult.conflicts.length + mergeResult.autoResolved.length
    const conflicts = mergeResult.conflicts.length
    const autoResolved = mergeResult.autoResolved.length
    const resolved = Object.keys(resolutions).length + autoResolved
    const progress = total > 0 ? (resolved / total) * 100 : 0

    return {
      total,
      conflicts,
      autoResolved,
      resolved,
      progress,
      remaining: conflicts - Object.keys(resolutions).length,
    }
  }, [mergeResult, resolutions])

  // Perform three-way merge when dialog opens
  useEffect(() => {
    if (isOpen) {
      performThreeWayMerge()
    }
  }, [isOpen, currentVersion, targetVersion, allVersions])

  // Auto-apply three-way merge strategy
  useEffect(() => {
    if (mergeStrategy === 'three-way' && mergeResult) {
      applyThreeWayStrategy()
    }
  }, [mergeStrategy, mergeResult])

  const performThreeWayMerge = () => {
    setIsLoading(true)

    // Simulate processing time for better UX
    setTimeout(() => {
      const result = ThreeWayMergeService.performThreeWayMerge(
        ThreeWayMergeService.findCommonAncestor(
          currentVersion,
          targetVersion,
          allVersions
        ),
        currentVersion,
        targetVersion
      )

      setMergeResult(result)
      setIsLoading(false)
    }, 1000)
  }

  const applyThreeWayStrategy = () => {
    if (!mergeResult) return

    const newResolutions: Record<
      string,
      'current' | 'target' | 'ancestor' | 'custom'
    > = {}

    // Auto-resolve conflicts with high confidence
    mergeResult.conflicts.forEach(conflict => {
      if (conflict.autoResolvable && conflict.suggestedResolution) {
        newResolutions[conflict.path] = conflict.suggestedResolution as
          | 'current'
          | 'target'
          | 'ancestor'
      }
    })

    setResolutions(newResolutions)
  }

  const toggleConflictExpansion = (path: string) => {
    setExpandedConflicts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const resolveConflict = (
    path: string,
    resolution: 'current' | 'target' | 'ancestor' | 'custom',
    customValue?: any
  ) => {
    setResolutions(prev => ({
      ...prev,
      [path]: resolution,
    }))

    if (resolution === 'custom' && customValue !== undefined) {
      setCustomResolutions(prev => ({
        ...prev,
        [path]: customValue,
      }))
    } else {
      setCustomResolutions(prev => {
        const newResolutions = { ...prev }
        delete newResolutions[path]
        return newResolutions
      })
    }
  }

  const autoResolveAll = () => {
    if (!mergeResult) return

    const newResolutions: Record<
      string,
      'current' | 'target' | 'ancestor' | 'custom'
    > = {}

    mergeResult.conflicts.forEach(conflict => {
      if (conflict.autoResolvable && conflict.suggestedResolution) {
        newResolutions[conflict.path] = conflict.suggestedResolution as
          | 'current'
          | 'target'
          | 'ancestor'
      }
    })

    setResolutions(prev => ({ ...prev, ...newResolutions }))
  }

  const resetResolutions = () => {
    setResolutions({})
    setCustomResolutions({})
  }

  const handleMerge = () => {
    if (!mergeResult) return

    const options: ThreeWayMergeOptions = {
      mergeStrategy,
      resolutions,
      customResolutions,
      mergeNotes:
        mergeNotes ||
        `Three-way merge from version ${new Date(targetVersion.timestamp).toLocaleDateString()} using common ancestor ${
          mergeResult.commonAncestor
            ? new Date(
                mergeResult.commonAncestor.timestamp
              ).toLocaleDateString()
            : 'none'
        }`,
      createNewVersion,
      mergeResult,
    }

    onMerge(options)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Three-Way Merge Resolution
          </DialogTitle>
          <DialogDescription>
            Intelligent merge using common ancestor analysis for better conflict
            resolution
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Merge Progress */}
          <div className="mb-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">
                Three-Way Merge Progress
              </div>
              <div className="text-sm text-muted-foreground">
                {mergeStats.resolved} of {mergeStats.total} changes resolved
              </div>
            </div>
            <Progress value={mergeStats.progress} className="mb-2" />
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 dark:bg-blue-900/20"
              >
                {mergeStats.total} total changes
              </Badge>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 dark:bg-red-900/20"
              >
                {mergeStats.conflicts} conflicts
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 dark:bg-green-900/20"
              >
                {mergeStats.autoResolved} auto-resolved
              </Badge>
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20"
              >
                {mergeStats.remaining} remaining
              </Badge>
            </div>
          </div>

          {/* Three-way version info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="border rounded-md p-3 bg-background">
              <div className="text-sm font-medium mb-1 flex items-center gap-1">
                <History className="h-3 w-3" />
                Common Ancestor
              </div>
              <div className="text-xs text-muted-foreground">
                {mergeResult?.commonAncestor
                  ? formatDate(mergeResult.commonAncestor.timestamp)
                  : 'Not found'}
              </div>
              {mergeResult?.commonAncestor?.notes && (
                <div className="text-xs border-t pt-1 mt-1 truncate">
                  {mergeResult.commonAncestor.notes}
                </div>
              )}
            </div>
            <div className="border rounded-md p-3 bg-background">
              <div className="text-sm font-medium mb-1 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Current Version
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(currentVersion.timestamp)}
              </div>
              {currentVersion.notes && (
                <div className="text-xs border-t pt-1 mt-1 truncate">
                  {currentVersion.notes}
                </div>
              )}
            </div>
            <div className="border rounded-md p-3 bg-background">
              <div className="text-sm font-medium mb-1 flex items-center gap-1">
                <Target className="h-3 w-3" />
                Target Version
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(targetVersion.timestamp)}
              </div>
              {targetVersion.notes && (
                <div className="text-xs border-t pt-1 mt-1 truncate">
                  {targetVersion.notes}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={autoResolveAll}
                className="h-8 gap-1"
                disabled={isLoading}
              >
                <Zap className="h-3 w-3" />
                Auto-resolve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetResolutions}
                className="h-8 gap-1"
                disabled={isLoading}
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
          </div>

          {/* Merge strategy */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Merge Strategy</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                {
                  key: 'three-way',
                  label: 'Three-Way',
                  desc: 'Intelligent ancestor-based merge',
                },
                {
                  key: 'manual',
                  label: 'Manual',
                  desc: 'Select each resolution manually',
                },
                {
                  key: 'theirs',
                  label: 'Use Theirs',
                  desc: 'Prefer target version changes',
                },
                {
                  key: 'ours',
                  label: 'Use Ours',
                  desc: 'Prefer current version changes',
                },
              ].map(strategy => (
                <Button
                  key={strategy.key}
                  variant={
                    mergeStrategy === strategy.key ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setMergeStrategy(strategy.key as any)}
                  className="h-auto p-2 flex flex-col items-start"
                >
                  <div className="font-medium text-xs">{strategy.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {strategy.desc}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Changes list with three-way conflict resolution */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="conflicts" className="flex-1 flex flex-col">
              <TabsList className="mb-2">
                <TabsTrigger value="conflicts">
                  Conflicts ({mergeResult?.conflicts.length || 0})
                </TabsTrigger>
                <TabsTrigger value="auto-resolved">
                  Auto-Resolved ({mergeResult?.autoResolved.length || 0})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Changes (
                  {(mergeResult?.conflicts.length || 0) +
                    (mergeResult?.autoResolved.length || 0)}
                  )
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 rounded-md border">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                      <div className="text-sm text-muted-foreground">
                        Performing three-way merge analysis...
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Finding common ancestor and analyzing changes
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <TabsContent value="conflicts" className="mt-0">
                      <div className="divide-y">
                        {mergeResult?.conflicts.map((conflict, index) => (
                          <ThreeWayConflictItem
                            key={index}
                            conflict={conflict}
                            resolution={resolutions[conflict.path]}
                            customResolution={customResolutions[conflict.path]}
                            isExpanded={expandedConflicts.has(conflict.path)}
                            onToggleExpansion={() =>
                              toggleConflictExpansion(conflict.path)
                            }
                            onResolve={resolveConflict}
                          />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="auto-resolved" className="mt-0">
                      <div className="divide-y">
                        {mergeResult?.autoResolved.map((change, index) => (
                          <ThreeWayChangeItem key={index} change={change} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="all" className="mt-0">
                      <div className="divide-y">
                        {mergeResult?.conflicts.map((conflict, index) => (
                          <ThreeWayConflictItem
                            key={`conflict-${index}`}
                            conflict={conflict}
                            resolution={resolutions[conflict.path]}
                            customResolution={customResolutions[conflict.path]}
                            isExpanded={expandedConflicts.has(conflict.path)}
                            onToggleExpansion={() =>
                              toggleConflictExpansion(conflict.path)
                            }
                            onResolve={resolveConflict}
                          />
                        ))}
                        {mergeResult?.autoResolved.map((change, index) => (
                          <ThreeWayChangeItem
                            key={`resolved-${index}`}
                            change={change}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  </>
                )}
              </ScrollArea>
            </Tabs>
          </div>

          {/* Merge notes */}
          <div className="mt-4">
            <Label htmlFor="merge-notes">Merge Notes</Label>
            <textarea
              id="merge-notes"
              className="w-full mt-1 p-2 border rounded-md h-20 resize-none"
              placeholder="Describe the three-way merge resolution strategy..."
              value={mergeNotes}
              onChange={e => setMergeNotes(e.target.value)}
            />
          </div>

          {/* Create new version checkbox */}
          <div className="mt-2 flex items-center space-x-2">
            <Checkbox
              id="create-new-version"
              checked={createNewVersion}
              onCheckedChange={checked =>
                setCreateNewVersion(checked as boolean)
              }
            />
            <Label htmlFor="create-new-version">
              Create new version (recommended)
            </Label>
          </div>

          {!createNewVersion && (
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Not creating a new version will overwrite your current version.
                This cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleMerge}
            disabled={
              isLoading ||
              (mergeResult?.conflicts.length || 0) >
                Object.keys(resolutions).length +
                  Object.keys(customResolutions).length
            }
          >
            <GitMerge className="h-4 w-4 mr-2" />
            Complete Three-Way Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ThreeWayConflictItemProps {
  conflict: ThreeWayConflict
  resolution: 'current' | 'target' | 'ancestor' | 'custom' | undefined
  customResolution: any
  isExpanded: boolean
  onToggleExpansion: () => void
  onResolve: (
    path: string,
    resolution: 'current' | 'target' | 'ancestor' | 'custom',
    customValue?: any
  ) => void
}

function ThreeWayConflictItem({
  conflict,
  resolution,
  customResolution,
  isExpanded,
  onToggleExpansion,
  onResolve,
}: ThreeWayConflictItemProps) {
  const [customValue, setCustomValue] = useState<string>(customResolution || '')

  const getTypeColor = () => {
    switch (conflict.type) {
      case 'both-modified':
        return 'text-orange-600 dark:text-orange-400'
      case 'both-added':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'both-deleted':
        return 'text-red-600 dark:text-red-400'
      case 'content':
        return 'text-blue-600 dark:text-blue-400'
      case 'type':
        return 'text-purple-600 dark:text-purple-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getConfidenceColor = () => {
    if (conflict.confidence > 0.7) return 'text-green-600'
    if (conflict.confidence > 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleCustomResolution = () => {
    onResolve(conflict.path, 'custom', customValue)
  }

  const copyToCustom = (source: 'ancestor' | 'current' | 'target') => {
    let value: any
    switch (source) {
      case 'ancestor':
        value = conflict.ancestorValue
        break
      case 'current':
        value = conflict.currentValue
        break
      case 'target':
        value = conflict.targetValue
        break
    }
    setCustomValue(
      typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    )
  }

  return (
    <div className="p-4 hover:bg-muted/30">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`font-mono text-sm ${getTypeColor()}`}>!</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-medium text-sm truncate">
                {conflict.path}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onToggleExpansion}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Badge variant="outline" className={getTypeColor()}>
                {conflict.type}
              </Badge>
              <Badge variant="outline" className={getConfidenceColor()}>
                {Math.round(conflict.confidence * 100)}% confidence
              </Badge>
              {conflict.autoResolvable && (
                <Badge variant="outline" className="text-blue-600">
                  Auto-resolvable
                </Badge>
              )}
              {conflict.suggestedResolution && (
                <Badge variant="outline" className="text-purple-600">
                  Suggested: {conflict.suggestedResolution}
                </Badge>
              )}
            </div>

            <div className="text-xs text-muted-foreground mb-2">
              {conflict.conflictReason}
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-3">
                {/* Three-way comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {conflict.ancestorValue !== undefined && (
                    <div className="border rounded-md">
                      <div className="bg-muted px-3 py-2 text-xs font-medium flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <History className="h-3 w-3" />
                          Ancestor
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => copyToCustom('ancestor')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-3 text-xs font-mono bg-background max-h-32 overflow-auto">
                        <pre className="whitespace-pre-wrap">
                          {typeof conflict.ancestorValue === 'string'
                            ? conflict.ancestorValue
                            : JSON.stringify(conflict.ancestorValue, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-md">
                    <div className="bg-muted px-3 py-2 text-xs font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Current
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToCustom('current')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-3 text-xs font-mono bg-background max-h-32 overflow-auto">
                      <pre className="whitespace-pre-wrap">
                        {typeof conflict.currentValue === 'string'
                          ? conflict.currentValue
                          : JSON.stringify(conflict.currentValue, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <div className="bg-muted px-3 py-2 text-xs font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Target
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToCustom('target')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-3 text-xs font-mono bg-background max-h-32 overflow-auto">
                      <pre className="whitespace-pre-wrap">
                        {typeof conflict.targetValue === 'string'
                          ? conflict.targetValue
                          : JSON.stringify(conflict.targetValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Custom resolution editor */}
                {resolution === 'custom' && (
                  <div className="border rounded-md">
                    <div className="bg-muted px-3 py-2 text-xs font-medium">
                      Custom Resolution
                    </div>
                    <div className="p-3">
                      <textarea
                        className="w-full h-24 text-xs font-mono border rounded p-2 resize-none"
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        placeholder="Enter your custom resolution..."
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={handleCustomResolution}
                          className="h-7"
                        >
                          Apply Custom
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onResolve(conflict.path, 'current')}
                          className="h-7"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resolution buttons */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {conflict.ancestorValue !== undefined && (
            <Button
              variant={resolution === 'ancestor' ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3"
              onClick={() => onResolve(conflict.path, 'ancestor')}
            >
              {resolution === 'ancestor' && <Check className="h-3 w-3 mr-1" />}
              <History className="h-3 w-3 mr-1" />
              Ancestor
            </Button>
          )}

          <Button
            variant={resolution === 'current' ? 'default' : 'outline'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onResolve(conflict.path, 'current')}
          >
            {resolution === 'current' && <Check className="h-3 w-3 mr-1" />}
            <ArrowLeft className="h-3 w-3 mr-1" />
            Current
          </Button>

          <Button
            variant={resolution === 'custom' ? 'default' : 'outline'}
            size="sm"
            className="h-8 px-3"
            onClick={() => {
              if (resolution === 'custom') {
                onResolve(conflict.path, 'current')
              } else {
                setCustomValue(
                  typeof conflict.currentValue === 'string'
                    ? conflict.currentValue
                    : JSON.stringify(conflict.currentValue, null, 2)
                )
                onResolve(conflict.path, 'custom', customValue)
              }
            }}
          >
            {resolution === 'custom' && <Check className="h-3 w-3 mr-1" />}
            Custom
          </Button>

          <Button
            variant={resolution === 'target' ? 'default' : 'outline'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onResolve(conflict.path, 'target')}
          >
            {resolution === 'target' && <Check className="h-3 w-3 mr-1" />}
            Target
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ThreeWayChangeItemProps {
  change: ThreeWayChange
}

function ThreeWayChangeItem({ change }: ThreeWayChangeItemProps) {
  const getTypeColor = () => {
    switch (change.changeType) {
      case 'added':
        return 'text-green-600 dark:text-green-400'
      case 'removed':
        return 'text-red-600 dark:text-red-400'
      case 'modified':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTypeIcon = () => {
    switch (change.changeType) {
      case 'added':
        return '+'
      case 'removed':
        return '-'
      case 'modified':
        return '~'
      default:
        return '✓'
    }
  }

  const getSourceIcon = () => {
    switch (change.source) {
      case 'current':
        return <Users className="h-3 w-3" />
      case 'target':
        return <Target className="h-3 w-3" />
      case 'both':
        return <GitBranch className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="p-3 hover:bg-muted/30 flex items-center">
      <div className={`font-mono mr-3 ${getTypeColor()}`}>{getTypeIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{change.path}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Badge variant="outline" className={getTypeColor()}>
            {change.changeType}
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            <span className="flex items-center gap-1">
              {getSourceIcon()}
              {change.source}
            </span>
          </Badge>
        </div>
      </div>
      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
        Auto-resolved
      </div>
    </div>
  )
}
