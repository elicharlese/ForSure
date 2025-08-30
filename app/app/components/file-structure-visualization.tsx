'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Copy,
  Check,
  Download,
  Plus,
  Trash,
  Edit,
  Save,
  Undo,
  Redo,
  Search,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
// Add a new import for the FileEditor component
import { FileEditor } from './file-editor'

export type FileNode = {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  description?: string
  content?: string
}

interface FileStructureVisualizationProps {
  structure: FileNode
  className?: string
  onStructureChange?: (newStructure: FileNode) => void
  readOnly?: boolean
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
}

export function FileStructureVisualization({
  structure,
  className,
  onStructureChange,
  readOnly = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: FileStructureVisualizationProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set([structure.name])
  )
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [editingPath, setEditingPath] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>('')
  const [newItemPath, setNewItemPath] = useState<string | null>(null)
  const [newItemType, setNewItemType] = useState<'file' | 'directory' | null>(
    null
  )
  const [newItemName, setNewItemName] = useState<string>('')
  // Add a new state for the currently open file
  const [openFile, setOpenFile] = useState<{
    path: string
    name: string
    content: string
  } | null>(null)

  // Search state
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Effect to focus search input when search becomes visible
  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchVisible])

  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the target is an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        editingPath !== null ||
        newItemPath !== null
      ) {
        // Allow the search shortcut even in input fields
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          e.preventDefault()
          setSearchVisible(true)
          return
        }

        // Don't handle other shortcuts in input fields
        return
      }

      // Search: Ctrl+F or Command+F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setSearchVisible(true)
        return
      }

      // Undo: Ctrl+Z or Command+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === 'z' &&
        !e.shiftKey &&
        canUndo &&
        onUndo
      ) {
        e.preventDefault()
        onUndo()
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z or Command+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        if (canRedo && onRedo) {
          e.preventDefault()
          onRedo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canUndo, canRedo, onUndo, onRedo, editingPath, newItemPath])

  // Effect to perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setCurrentResultIndex(-1)
      return
    }

    const results = searchFileStructure(structure, searchQuery, caseSensitive)
    setSearchResults(results)
    setCurrentResultIndex(results.length > 0 ? 0 : -1)

    // Auto-expand paths to search results
    if (results.length > 0) {
      const newExpandedNodes = new Set(expandedNodes)

      results.forEach(resultPath => {
        // Expand all parent directories of the result
        const parts = resultPath.split('/')
        let currentPath = parts[0]
        newExpandedNodes.add(currentPath)

        for (let i = 1; i < parts.length - 1; i++) {
          currentPath += '/' + parts[i]
          newExpandedNodes.add(currentPath)
        }
      })

      setExpandedNodes(newExpandedNodes)
    }
  }, [searchQuery, caseSensitive, structure])

  // Search the file structure for matching files and directories
  const searchFileStructure = (
    node: FileNode,
    query: string,
    caseSensitive: boolean,
    parentPath = ''
  ): string[] => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
    const results: string[] = []

    // Check if the current node matches
    const nodeName = caseSensitive ? node.name : node.name.toLowerCase()
    const searchFor = caseSensitive ? query : query.toLowerCase()

    if (nodeName.includes(searchFor)) {
      results.push(currentPath)
    }

    // Recursively search children
    if (node.children) {
      node.children.forEach(child => {
        results.push(
          ...searchFileStructure(child, query, caseSensitive, currentPath)
        )
      })
    }

    return results
  }

  // Navigate to the next search result
  const goToNextResult = () => {
    if (searchResults.length === 0) return

    const nextIndex = (currentResultIndex + 1) % searchResults.length
    setCurrentResultIndex(nextIndex)

    // Ensure the result is visible by expanding its parent directories
    const resultPath = searchResults[nextIndex]
    ensurePathIsVisible(resultPath)
  }

  // Navigate to the previous search result
  const goToPrevResult = () => {
    if (searchResults.length === 0) return

    const prevIndex =
      (currentResultIndex - 1 + searchResults.length) % searchResults.length
    setCurrentResultIndex(prevIndex)

    // Ensure the result is visible by expanding its parent directories
    const resultPath = searchResults[prevIndex]
    ensurePathIsVisible(resultPath)
  }

  // Ensure a path is visible by expanding all its parent directories
  const ensurePathIsVisible = (path: string) => {
    const parts = path.split('/')
    let currentPath = parts[0]
    const newExpandedNodes = new Set(expandedNodes)

    newExpandedNodes.add(currentPath)

    for (let i = 1; i < parts.length; i++) {
      currentPath += '/' + parts[i]
      newExpandedNodes.add(currentPath)
    }

    setExpandedNodes(newExpandedNodes)

    // Scroll to the element
    setTimeout(() => {
      const element = document.getElementById(`file-node-${path}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Clear the search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setCurrentResultIndex(-1)
  }

  // Toggle search visibility
  const toggleSearch = () => {
    setSearchVisible(!searchVisible)
    if (!searchVisible) {
      clearSearch()
    }
  }

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const expandAll = () => {
    const allPaths = getAllPaths(structure)
    setExpandedNodes(new Set(allPaths))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set([structure.name]))
  }

  const getAllPaths = (node: FileNode, parentPath = ''): string[] => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
    const paths = [currentPath]

    if (node.children) {
      node.children.forEach(child => {
        paths.push(...getAllPaths(child, currentPath))
      })
    }

    return paths
  }

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const downloadAsForSureFile = () => {
    const forSureContent = generateForSureFile(structure)
    const blob = new Blob([forSureContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'project-structure.fs'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateForSureFile = (node: FileNode, indent = 0): string => {
    const indentation = '  '.repeat(indent)
    let result = ''

    if (node.type === 'directory') {
      result += `${indentation}${node.name}/\n`
      if (node.children) {
        node.children.forEach(child => {
          result += generateForSureFile(child, indent + 1)
        })
      }
    } else {
      result += `${indentation}${node.name}\n`
    }

    return result
  }

  const startEditing = (path: string, name: string) => {
    setEditingPath(path)
    setEditingName(name)
  }

  const cancelEditing = () => {
    setEditingPath(null)
    setEditingName('')
  }

  const saveEditing = (path: string) => {
    if (!editingName.trim() || !onStructureChange) {
      cancelEditing()
      return
    }

    // Clone the structure
    const newStructure = JSON.parse(JSON.stringify(structure))

    // Find and update the node
    const pathParts = path.split('/')
    let current = newStructure

    // Navigate to the parent
    for (let i = 1; i < pathParts.length - 1; i++) {
      const part = pathParts[i]
      const child = current.children?.find(c => c.name === part)
      if (!child) return
      current = child
    }

    // Update the node name
    const nodeName = pathParts[pathParts.length - 1]
    const nodeIndex = current.children?.findIndex(c => c.name === nodeName)
    if (nodeIndex === undefined || nodeIndex === -1) return

    current.children[nodeIndex].name = editingName

    // Update the structure
    onStructureChange(newStructure)
    cancelEditing()
  }

  const startAddingItem = (path: string, type: 'file' | 'directory') => {
    setNewItemPath(path)
    setNewItemType(type)
    setNewItemName('')
  }

  const cancelAddingItem = () => {
    setNewItemPath(null)
    setNewItemType(null)
    setNewItemName('')
  }

  const saveNewItem = () => {
    if (
      !newItemName.trim() ||
      !newItemPath ||
      !newItemType ||
      !onStructureChange
    ) {
      cancelAddingItem()
      return
    }

    // Clone the structure
    const newStructure = JSON.parse(JSON.stringify(structure))

    // Find the parent node
    const pathParts = newItemPath.split('/')
    let current = newStructure

    // Navigate to the parent
    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i]
      const child = current.children?.find(c => c.name === part)
      if (!child) return
      current = child
    }

    // Add the new item
    if (!current.children) current.children = []

    // Check if name already exists
    if (current.children.some(c => c.name === newItemName)) {
      alert(
        `A ${newItemType} with the name "${newItemName}" already exists in this directory.`
      )
      return
    }

    current.children.push({
      name: newItemName,
      type: newItemType,
      ...(newItemType === 'directory' ? { children: [] } : {}),
    })

    // Update the structure
    onStructureChange(newStructure)

    // Expand the parent node
    setExpandedNodes(prev => new Set([...prev, newItemPath]))

    cancelAddingItem()
  }

  const deleteNode = (path: string) => {
    if (!onStructureChange) return

    if (!confirm(`Are you sure you want to delete "${path}"?`)) return

    // Clone the structure
    const newStructure = JSON.parse(JSON.stringify(structure))

    // Find and delete the node
    const pathParts = path.split('/')
    let current = newStructure

    // Navigate to the parent
    for (let i = 1; i < pathParts.length - 1; i++) {
      const part = pathParts[i]
      const child = current.children?.find(c => c.name === part)
      if (!child) return
      current = child
    }

    // Delete the node
    const nodeName = pathParts[pathParts.length - 1]
    if (!current.children) return

    current.children = current.children.filter(c => c.name !== nodeName)

    // Update the structure
    onStructureChange(newStructure)
  }

  // Add a function to open a file for editing
  const openFileForEditing = (path: string, node: FileNode) => {
    if (node.type === 'file') {
      setOpenFile({
        path,
        name: node.name,
        content: node.content || '',
      })
    }
  }

  // Add a function to save file content
  const saveFileContent = (content: string) => {
    if (!openFile || !onStructureChange) return

    // Clone the structure
    const newStructure = JSON.parse(JSON.stringify(structure))

    // Find and update the node
    const pathParts = openFile.path.split('/')
    let current = newStructure

    // Navigate to the parent
    for (let i = 1; i < pathParts.length - 1; i++) {
      const part = pathParts[i]
      const child = current.children?.find(c => c.name === part)
      if (!child) return
      current = child
    }

    // Update the file content
    const fileName = pathParts[pathParts.length - 1]
    const fileIndex = current.children?.findIndex(c => c.name === fileName)
    if (fileIndex === undefined || fileIndex === -1) return

    current.children[fileIndex].content = content

    // Update the structure
    onStructureChange(newStructure)
    setOpenFile(null)
  }

  // Add a function to close the file editor
  const closeFileEditor = () => {
    setOpenFile(null)
  }

  const renderFileTree = (node: FileNode, path = '', level = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedNodes.has(currentPath)
    const hasChildren = node.children && node.children.length > 0
    const isEditing = editingPath === currentPath
    const isAddingItem = newItemPath === currentPath

    // Check if this node is a search result
    const isSearchResult = searchResults.includes(currentPath)
    const isCurrentSearchResult =
      isSearchResult && searchResults[currentResultIndex] === currentPath

    return (
      <div key={currentPath} className={level === 0 ? 'mt-2' : ''}>
        <div
          id={`file-node-${currentPath}`}
          className={cn(
            'flex items-center py-1 px-1 rounded-md group transition-colors',
            level === 0 && 'bg-muted/30',
            isSearchResult && 'bg-yellow-100/30 dark:bg-yellow-900/20',
            isCurrentSearchResult &&
              'bg-yellow-200/50 dark:bg-yellow-800/30 ring-1 ring-yellow-400 dark:ring-yellow-600',
            !isSearchResult && !isCurrentSearchResult && 'hover:bg-muted/50'
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(currentPath)}
              className="w-5 h-5 flex items-center justify-center text-muted-foreground"
              aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-5 h-5" />
          )}

          <span className="mr-1.5 text-muted-foreground">
            {node.type === 'directory' ? (
              <Folder className="h-4 w-4 text-primary" />
            ) : (
              <File className="h-4 w-4 text-muted-foreground" />
            )}
          </span>

          {isEditing ? (
            <div className="flex-1 flex items-center">
              <Input
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                className="h-7 py-1"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEditing(currentPath)
                  if (e.key === 'Escape') cancelEditing()
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => saveEditing(currentPath)}
              >
                <Save className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={cancelEditing}
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <span
              className={cn(
                'flex-1',
                node.type === 'directory' && 'font-medium',
                node.type === 'file' && 'cursor-pointer hover:underline'
              )}
              onClick={
                node.type === 'file'
                  ? () => openFileForEditing(currentPath, node)
                  : undefined
              }
              title={node.type === 'file' ? 'Click to edit file' : undefined}
            >
              {node.name}
              {isCurrentSearchResult && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  Current Match
                </Badge>
              )}
            </span>
          )}

          {!isEditing && !readOnly && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              {node.type === 'directory' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => startAddingItem(currentPath, 'file')}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Add File
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => startAddingItem(currentPath, 'directory')}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      Add Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => startEditing(currentPath, node.name)}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => deleteNode(currentPath)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}

          <button
            onClick={() => copyPath(currentPath)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Copy path ${currentPath}`}
          >
            {copiedPath === currentPath ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 pl-2 border-l border-dashed border-muted-foreground/20">
            {node.children!.map(child =>
              renderFileTree(child, currentPath, level + 1)
            )}
          </div>
        )}

        {isAddingItem && (
          <div className="ml-4 pl-2 border-l border-dashed border-muted-foreground/20 mt-1">
            <div className="flex items-center py-1 px-1 rounded-md bg-muted/30">
              <span className="w-5 h-5" />
              <span className="mr-1.5 text-muted-foreground">
                {newItemType === 'directory' ? (
                  <Folder className="h-4 w-4 text-primary" />
                ) : (
                  <File className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
              <div className="flex-1 flex items-center">
                <Input
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder={`New ${newItemType}`}
                  className="h-7 py-1"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveNewItem()
                    if (e.key === 'Escape') cancelAddingItem()
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={saveNewItem}
                >
                  <Save className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={cancelAddingItem}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {node.description && isExpanded && level === 0 && (
          <div className="ml-4 pl-2 mt-1 text-sm text-muted-foreground">
            {node.description}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('rounded-md border p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Project Structure</h3>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSearch}
                  className={cn('h-8', searchVisible && 'bg-primary/10')}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search (Ctrl+F)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!readOnly && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onUndo}
                      disabled={!canUndo}
                      className="h-8"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo (Ctrl+Z)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRedo}
                      disabled={!canRedo}
                      className="h-8"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Redo (Ctrl+Y)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-8"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="h-8"
          >
            Collapse All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAsForSureFile}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {searchVisible && (
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="pl-8 pr-8"
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  if (searchQuery) {
                    clearSearch()
                  } else {
                    setSearchVisible(false)
                  }
                }
                if (e.key === 'Enter') {
                  if (e.shiftKey) {
                    goToPrevResult()
                  } else {
                    goToNextResult()
                  }
                }
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={cn('h-8 w-8 p-0', caseSensitive && 'bg-primary/10')}
            title={
              caseSensitive ? 'Case sensitive (on)' : 'Case sensitive (off)'
            }
          >
            <span className="sr-only">Toggle case sensitivity</span>
            <span className="font-mono text-xs">Aa</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevResult}
            disabled={searchResults.length === 0}
            className="h-8 w-8 p-0"
            title="Previous match (Shift+Enter)"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextResult}
            disabled={searchResults.length === 0}
            className="h-8 w-8 p-0"
            title="Next match (Enter)"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>

          {searchResults.length > 0 && (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentResultIndex + 1} of {searchResults.length}
            </span>
          )}
        </div>
      )}

      <div className="bg-muted/30 rounded-md p-2">
        {renderFileTree(structure)}
      </div>
      {openFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <FileEditor
              fileName={openFile.name}
              content={openFile.content}
              onSave={saveFileContent}
              onClose={closeFileEditor}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}
