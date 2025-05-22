"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, GitMerge, GitCommit, GitBranch, RefreshCw } from "lucide-react"
import type { ProjectVersion, Branch, Tag } from "../hooks/use-saved-projects"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface VersionNode {
  id: string
  version: ProjectVersion
  parents: string[]
  children: string[]
  isMergeResult: boolean
  x: number
  y: number
  lane: number
  mergeSourceIds?: string[]
  branchId?: string
}

interface VersionHistoryGraphProps {
  versions: ProjectVersion[]
  branches: Branch[]
  tags: Tag[]
  currentVersionId: string
  currentBranchId: string
  onVersionSelect: (versionId: string) => void
}

export function VersionHistoryGraph({
  versions,
  branches,
  tags,
  currentVersionId,
  currentBranchId,
  onVersionSelect,
}: VersionHistoryGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<VersionNode[]>([])
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<VersionNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<VersionNode | null>(null)

  // Constants for graph layout
  const NODE_RADIUS = 12
  const LANE_WIDTH = 60
  const VERTICAL_SPACING = 80
  const HORIZONTAL_MARGIN = 40

  // Build the version tree from flat version history
  useEffect(() => {
    if (!versions.length) return

    // Sort versions by timestamp (oldest first)
    const sortedVersions = [...versions].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    // Create initial nodes with parent-child relationships
    const initialNodes: Record<string, VersionNode> = {}

    // First pass: create nodes
    sortedVersions.forEach((version, index) => {
      // Check if this version is a merge result by looking at its notes
      const isMergeResult = version.notes?.includes("Merge of") || false

      // Extract merge source IDs from notes if available
      let mergeSourceIds: string[] | undefined
      if (isMergeResult && version.notes) {
        const matches = version.notes.match(/Merge of versions ([a-f0-9-]+) and ([a-f0-9-]+)/)
        if (matches && matches.length >= 3) {
          mergeSourceIds = [matches[1], matches[2]]
        }
      }

      initialNodes[version.versionId] = {
        id: version.versionId,
        version,
        parents: [],
        children: [],
        isMergeResult,
        mergeSourceIds,
        x: 0,
        y: index * VERTICAL_SPACING,
        lane: 0,
        branchId: version.branchId,
      }
    })

    // Second pass: establish parent-child relationships
    sortedVersions.forEach((version, index) => {
      if (index > 0) {
        const currentNode = initialNodes[version.versionId]

        // For merge results, connect to both parents
        if (currentNode.isMergeResult && currentNode.mergeSourceIds) {
          currentNode.mergeSourceIds.forEach((parentId) => {
            if (initialNodes[parentId]) {
              currentNode.parents.push(parentId)
              initialNodes[parentId].children.push(version.versionId)
            }
          })
        }
        // For regular versions, connect to the previous version in the same branch
        else if (index > 0) {
          // Find the previous version in the same branch
          const previousVersionsInSameBranch = sortedVersions
            .slice(0, index)
            .filter((v) => v.branchId === version.branchId)
            .reverse()

          if (previousVersionsInSameBranch.length > 0) {
            const previousVersion = previousVersionsInSameBranch[0]
            currentNode.parents.push(previousVersion.versionId)
            initialNodes[previousVersion.versionId].children.push(version.versionId)
          } else {
            // This is the first version in a branch, find the source version
            const branch = branches.find((b) => b.id === version.branchId)
            if (branch && branch.sourceVersionId && initialNodes[branch.sourceVersionId]) {
              currentNode.parents.push(branch.sourceVersionId)
              initialNodes[branch.sourceVersionId].children.push(version.versionId)
            }
          }
        }
      }
    })

    // Assign lanes to nodes for horizontal positioning
    const assignLanes = (nodes: Record<string, VersionNode>) => {
      // Map branches to lanes
      const branchLanes: Record<string, number> = {}
      let currentLane = 0

      // Assign a lane to each branch
      branches.forEach((branch) => {
        branchLanes[branch.id] = currentLane++
      })

      // Assign lanes to nodes based on their branch
      Object.values(nodes).forEach((node) => {
        if (node.branchId && branchLanes[node.branchId] !== undefined) {
          node.lane = branchLanes[node.branchId]
        }
      })

      // Special handling for merge nodes - they stay in their branch's lane
      Object.values(nodes)
        .filter((node) => node.isMergeResult)
        .forEach((node) => {
          if (node.branchId && branchLanes[node.branchId] !== undefined) {
            node.lane = branchLanes[node.branchId]
          }
        })
    }

    assignLanes(initialNodes)

    // Calculate final x, y coordinates
    Object.values(initialNodes).forEach((node) => {
      node.x = HORIZONTAL_MARGIN + node.lane * LANE_WIDTH
    })

    setNodes(Object.values(initialNodes))
  }, [versions, branches])

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  // Handle reset view
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Get a short version ID for display
  const getShortId = (id: string) => {
    return id.substring(0, 7)
  }

  // Get node color based on its state and branch
  const getNodeColor = (node: VersionNode) => {
    if (node.id === currentVersionId) return "fill-primary stroke-primary-foreground"
    if (node.isMergeResult) return "fill-purple-500 stroke-white"

    // Use branch color if available
    if (node.branchId) {
      const branch = branches.find((b) => b.id === node.branchId)
      if (branch?.color) {
        // Return a dynamic class based on the color
        if (branch.color === "#3b82f6") return "fill-blue-500 stroke-white"
        if (branch.color === "#ef4444") return "fill-red-500 stroke-white"
        if (branch.color === "#10b981") return "fill-emerald-500 stroke-white"
        if (branch.color === "#f59e0b") return "fill-amber-500 stroke-white"
        if (branch.color === "#8b5cf6") return "fill-violet-500 stroke-white"
        if (branch.color === "#ec4899") return "fill-pink-500 stroke-white"
        if (branch.color === "#06b6d4") return "fill-cyan-500 stroke-white"
        if (branch.color === "#f97316") return "fill-orange-500 stroke-white"
        if (branch.color === "#14b8a6") return "fill-teal-500 stroke-white"
        if (branch.color === "#a855f7") return "fill-purple-500 stroke-white"
      }
    }

    return "fill-gray-500 stroke-white"
  }

  // Get edge color based on branch
  const getEdgeColor = (sourceNode: VersionNode, targetNode: VersionNode) => {
    // For merge connections, use a dashed purple line
    if (targetNode.isMergeResult && targetNode.mergeSourceIds?.includes(sourceNode.id)) {
      return {
        stroke: "#8b5cf6", // violet-500
        strokeDasharray: "5,5",
      }
    }

    // For connections within the same branch, use the branch color
    if (sourceNode.branchId && sourceNode.branchId === targetNode.branchId) {
      const branch = branches.find((b) => b.id === sourceNode.branchId)
      if (branch?.color) return { stroke: branch.color, strokeDasharray: "" }
    }

    // For branch creation connections, use a dashed line with the target branch color
    if (sourceNode.branchId !== targetNode.branchId) {
      const branch = branches.find((b) => b.id === targetNode.branchId)
      if (branch?.color) return { stroke: branch.color, strokeDasharray: "5,5" }
    }

    // Default color
    return { stroke: "#9ca3af", strokeDasharray: "" } // gray-400
  }

  // Get node icon based on its type
  const getNodeIcon = (node: VersionNode) => {
    if (node.isMergeResult) {
      return <GitMerge className="h-4 w-4 text-white" />
    }
    if (node.children.length > 1) {
      return <GitBranch className="h-4 w-4 text-white" />
    }
    return <GitCommit className="h-4 w-4 text-white" />
  }

  // Get branch name for a node
  const getBranchName = (node: VersionNode) => {
    if (!node.branchId) return "No branch"
    const branch = branches.find((b) => b.id === node.branchId)
    return branch ? branch.name : "Unknown branch"
  }

  // Handle node click
  const handleNodeClick = (node: VersionNode) => {
    setSelectedNode(node)
    onVersionSelect(node.id)
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Version History Graph</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetView}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[400px] overflow-hidden bg-muted/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Branch labels */}
        <div
          className="absolute top-2 left-2 z-10 flex flex-col gap-2"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "0 0",
          }}
        >
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm shadow-sm"
              style={{ borderLeft: `3px solid ${branch.color}` }}
            >
              <GitBranch className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">{branch.name}</span>
              {branch.id === currentBranchId && (
                <Badge variant="outline" className="h-4 text-[10px] bg-primary/10 text-primary">
                  current
                </Badge>
              )}
            </div>
          ))}
        </div>

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="cursor-grab"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "0 0",
          }}
        >
          <g>
            {/* Draw edges first so they appear behind nodes */}
            {nodes.map((node) => (
              <g key={`edges-${node.id}`}>
                {node.parents.map((parentId) => {
                  const parent = nodes.find((n) => n.id === parentId)
                  if (!parent) return null

                  const edgeStyle = getEdgeColor(parent, node)

                  // For merge nodes, draw diagonal lines
                  if (node.isMergeResult) {
                    return (
                      <path
                        key={`edge-${node.id}-${parentId}`}
                        d={`M ${node.x} ${node.y} L ${parent.x} ${parent.y}`}
                        stroke={edgeStyle.stroke}
                        strokeWidth="2"
                        strokeDasharray={edgeStyle.strokeDasharray}
                      />
                    )
                  }

                  // For branch creation, draw diagonal lines
                  if (node.branchId !== parent.branchId) {
                    return (
                      <path
                        key={`edge-${node.id}-${parentId}`}
                        d={`M ${node.x} ${node.y} L ${parent.x} ${parent.y}`}
                        stroke={edgeStyle.stroke}
                        strokeWidth="2"
                        strokeDasharray={edgeStyle.strokeDasharray}
                      />
                    )
                  }

                  // For regular nodes in the same branch, draw straight lines
                  return (
                    <line
                      key={`edge-${node.id}-${parentId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={parent.x}
                      y2={parent.y}
                      stroke={edgeStyle.stroke}
                      strokeWidth="2"
                      strokeDasharray={edgeStyle.strokeDasharray}
                    />
                  )
                })}
              </g>
            ))}

            {/* Draw nodes on top of edges */}
            {nodes.map((node) => (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <circle
                  r={NODE_RADIUS}
                  className={`${getNodeColor(node)} transition-all ${
                    node.id === selectedNode?.id ? "r-14 stroke-2" : ""
                  }`}
                />

                {/* Current version indicator */}
                {node.id === currentVersionId && (
                  <circle r={NODE_RADIUS + 4} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" />
                )}

                {/* Node icon */}
                <foreignObject x={-8} y={-8} width="16" height="16" className="pointer-events-none">
                  <div className="flex items-center justify-center w-full h-full">{getNodeIcon(node)}</div>
                </foreignObject>

                {/* Version label */}
                <text
                  x="0"
                  y={NODE_RADIUS + 16}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground font-mono"
                >
                  {getShortId(node.id)}
                </text>
              </g>
            ))}

            {/* Draw tags on top of nodes */}
            {tags.map((tag) => {
              const node = nodes.find((n) => n.id === tag.versionId)
              if (!node) return null

              const getTagColor = (type: Tag["type"]) => {
                switch (type) {
                  case "release":
                    return "#10b981" // emerald-500
                  case "milestone":
                    return "#3b82f6" // blue-500
                  case "hotfix":
                    return "#ef4444" // red-500
                  case "feature":
                    return "#8b5cf6" // violet-500
                  default:
                    return "#6b7280" // gray-500
                }
              }

              return (
                <g key={`tag-${tag.id}`} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Tag indicator */}
                  <rect
                    x={NODE_RADIUS + 4}
                    y={-6}
                    width="12"
                    height="12"
                    rx="2"
                    fill={getTagColor(tag.type)}
                    className="cursor-pointer"
                    onClick={() => onVersionSelect(node.id)}
                  />
                  <text
                    x={NODE_RADIUS + 10}
                    y={1}
                    textAnchor="middle"
                    className="text-[8px] fill-white font-bold pointer-events-none"
                  >
                    T
                  </text>

                  {/* Tag name */}
                  <text
                    x={NODE_RADIUS + 20}
                    y={-NODE_RADIUS - 4}
                    textAnchor="start"
                    className="text-xs fill-foreground font-medium"
                  >
                    {tag.name}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoveredNode && (
          <div
            className="absolute bg-popover text-popover-foreground p-3 rounded-md shadow-md text-sm z-10 max-w-xs"
            style={{
              left: hoveredNode.x * zoom + pan.x + 20,
              top: hoveredNode.y * zoom + pan.y + 20,
            }}
          >
            <div className="font-medium mb-1">
              {hoveredNode.isMergeResult ? "Merge Result" : "Version"} {getShortId(hoveredNode.id)}
            </div>
            <div className="text-xs text-muted-foreground mb-1">{formatDate(hoveredNode.version.timestamp)}</div>
            <div className="text-xs text-muted-foreground mb-2">Branch: {getBranchName(hoveredNode)}</div>

            {/* Show tags for this version */}
            {(() => {
              const versionTags = tags.filter((tag) => tag.versionId === hoveredNode.id)
              if (versionTags.length > 0) {
                return (
                  <div className="text-xs mb-2 border-t pt-1">
                    <div className="font-medium mb-1">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {versionTags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-[10px]">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            })()}

            {hoveredNode.version.notes && <div className="text-xs mt-1 border-t pt-1">{hoveredNode.version.notes}</div>}
          </div>
        )}
      </div>

      {/* Selected version details */}
      {selectedNode && (
        <div className="p-4 border-t bg-muted/10">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">
                {selectedNode.isMergeResult ? "Merge Result" : "Version"}: {getShortId(selectedNode.id)}
              </h4>
              <p className="text-sm text-muted-foreground">{formatDate(selectedNode.version.timestamp)}</p>
              <p className="text-sm text-muted-foreground">Branch: {getBranchName(selectedNode)}</p>
              {selectedNode.version.notes && (
                <p className="text-sm mt-2 p-2 bg-muted rounded-md">{selectedNode.version.notes}</p>
              )}
            </div>
            <div>
              {selectedNode.id !== currentVersionId && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => onVersionSelect(selectedNode.id)}>
                        View Details
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View full version details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
