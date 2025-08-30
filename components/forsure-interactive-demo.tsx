'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon as Refresh, Copy, Check } from 'lucide-react'

const defaultCode = `root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the project.
  </description>

  - Type: Directory
    - Name: src/
    <description>
    Source code directory.
    </description>

    - Type: File
      - Name: index.js
      <description>
      Entry point for the application.
      </description>

    - Type: Directory
      - Name: components/
      <description>
      Contains reusable UI components.
      </description>

      - Type: File
        - Name: Button.jsx
        <description>
        Reusable button component.
        </description>

  - Type: File
    - Name: README.md
    <description>
    Project documentation.
    </description>`

interface FileNode {
  name: string
  type: 'file' | 'directory'
  description?: string
  children?: FileNode[]
}

export default function ForSureInteractiveDemo() {
  const [code, setCode] = useState(defaultCode)
  const [fileStructure, setFileStructure] = useState<FileNode | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Parse the ForSure code to generate the file structure
    const parsedStructure = parseForSureCode(code)
    setFileStructure(parsedStructure)
  }, [code])

  const parseForSureCode = (code: string): FileNode | null => {
    try {
      // This is a simplified parser for demo purposes
      const lines = code.split('\n')
      const rootNode: FileNode = {
        name: 'root',
        type: 'directory',
        children: [],
      }

      let currentNode = rootNode
      let currentIndentation = 0
      const nodeStack = [rootNode]
      let currentDescription = ''
      let collectingDescription = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (!line.trim()) continue

        // Count leading spaces to determine indentation level
        const indentation = line.search(/\S|$/)
        const trimmedLine = line.trim()

        // Handle description blocks
        if (collectingDescription) {
          if (trimmedLine === '</description>') {
            collectingDescription = false
            if (nodeStack.length > 0) {
              nodeStack[nodeStack.length - 1].description =
                currentDescription.trim()
            }
            currentDescription = ''
          } else {
            currentDescription += trimmedLine + '\n'
          }
          continue
        }

        if (trimmedLine === '<description>') {
          collectingDescription = true
          continue
        }

        // Skip comments and other metadata tags
        if (
          trimmedLine.startsWith('#') ||
          trimmedLine.startsWith('<') ||
          trimmedLine === 'root:'
        ) {
          continue
        }

        // Handle file/directory entries
        if (trimmedLine.startsWith('- Type:')) {
          const type = trimmedLine.includes('Directory') ? 'directory' : 'file'

          // Adjust the stack based on indentation
          if (indentation > currentIndentation) {
            // Going deeper
            currentNode = nodeStack[nodeStack.length - 1]
          } else if (indentation < currentIndentation) {
            // Going back up
            const levelsUp = Math.floor((currentIndentation - indentation) / 2)
            for (let j = 0; j < levelsUp; j++) {
              nodeStack.pop()
            }
            currentNode = nodeStack[nodeStack.length - 1]
          }

          currentIndentation = indentation

          // Create a new node
          const newNode: FileNode = {
            name: 'unnamed',
            type,
            children: type === 'directory' ? [] : undefined,
          }

          // Add to parent's children
          if (!currentNode.children) currentNode.children = []
          currentNode.children.push(newNode)

          // Push to stack if it's a directory
          if (type === 'directory') {
            nodeStack.push(newNode)
          }
        } else if (trimmedLine.startsWith('- Name:')) {
          // Set the name of the current node
          const name = trimmedLine.substring(8).trim()
          if (
            nodeStack.length > 0 &&
            nodeStack[nodeStack.length - 1].children?.length
          ) {
            const lastChild =
              nodeStack[nodeStack.length - 1].children![
                nodeStack[nodeStack.length - 1].children!.length - 1
              ]
            lastChild.name = name
          }
        }
      }

      // Clean up the root node for display
      if (rootNode.children && rootNode.children.length > 0) {
        return {
          name: './',
          type: 'directory',
          children: rootNode.children,
        }
      }

      return rootNode
    } catch (error) {
      console.error('Error parsing ForSure code:', error)
      return null
    }
  }

  const renderFileStructure = (node: FileNode, level = 0) => {
    const indent = level * 20
    const isFile = node.type === 'file'

    return (
      <div key={`${node.name}-${level}`}>
        <div
          className="flex items-center py-1 hover:bg-secondary/10 dark:hover:bg-primary/10 rounded px-2"
          style={{ marginLeft: `${indent}px` }}
        >
          {isFile ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-secondary dark:text-primary-light"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-secondary dark:text-primary-light"
            >
              <path d="M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2.5a1 1 0 0 0 .8-.4l1.9-2.2a1 1 0 0 1 .8-.4H18a2 2 0 0 1 2 2v14z" />
            </svg>
          )}
          <span className="font-mono text-sm">{node.name}</span>
        </div>
        {node.description && (
          <div
            className="text-xs text-secondary/70 dark:text-primary-light/70 italic"
            style={{ marginLeft: `${indent + 24}px` }}
          >
            {node.description}
          </div>
        )}
        {node.children?.map(child => renderFileStructure(child, level + 1))}
      </div>
    )
  }

  const resetDemo = () => {
    setCode(defaultCode)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-primary/20">
      {/* Code Editor */}
      <div className="border-r border-primary/20">
        <div className="p-4 bg-secondary-dark/50 border-b border-primary/20 flex justify-between items-center">
          <span className="font-mono text-sm text-white/80">
            project.forsure
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDemo}
              className="h-8 text-primary hover:text-white hover:bg-secondary"
            >
              <Refresh className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="h-8 text-primary hover:text-white hover:bg-secondary"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="p-0 bg-secondary-dark">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full h-[500px] bg-secondary-dark text-white font-mono text-sm p-4 border-none focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Visualization */}
      <div>
        <div className="p-4 bg-secondary-dark/50 border-b border-primary/20">
          <span className="font-mono text-sm text-white/80">
            File Structure Preview
          </span>
        </div>
        <div className="p-6 bg-white dark:bg-secondary-dark/30 h-[500px] overflow-auto">
          {fileStructure ? (
            renderFileStructure(fileStructure)
          ) : (
            <div className="text-center text-secondary/70 dark:text-primary-light/70 p-4">
              Unable to parse the ForSure code. Please check for syntax errors.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
