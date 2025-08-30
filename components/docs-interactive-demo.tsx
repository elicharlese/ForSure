'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clipboard, Check, Play, FileCode, FolderTree } from 'lucide-react'

const initialCode = `root:
  # Source code directory
  - src:
      - index.js { entry: true }
      - components:
          - header.js
          - footer.js
  # Assets directory
  - assets:
      - images:
          - logo.png
      - styles:
          - main.css
  # Configuration files
  - package.json
  - README.md`

interface FileNode {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  metadata?: Record<string, any>
}

export default function DocsInteractiveDemo() {
  const [code, setCode] = useState(initialCode)
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState<FileNode[]>([])
  const [activeTab, setActiveTab] = useState('code')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const parseForSure = () => {
    // This is a simplified parser for demo purposes
    // In a real implementation, you'd have a more robust parser
    const lines = code.split('\n')
    const result: FileNode[] = []
    let currentIndent = 0
    let currentNode: FileNode | null = null
    const nodeStack: FileNode[] = []

    lines.forEach(line => {
      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('#')) return

      // Calculate indent level (assuming 2 spaces per level)
      const indent = line.search(/\S|$/) / 2

      // Extract node info
      const match = line.trim().match(/^-\s+([^:{]+)(?::)?(.*)$/)
      if (!match) return

      const name = match[1].trim()
      const isDirectory = !!match[2] || line.trim().endsWith(':')

      // Create new node
      const newNode: FileNode = {
        name,
        type: isDirectory ? 'directory' : 'file',
        children: isDirectory ? [] : undefined,
      }

      // Extract metadata if present
      const metadataMatch = line.match(/{([^}]+)}/)
      if (metadataMatch) {
        try {
          // This is simplified - in reality you'd need a more robust parser
          const metadataStr = `{${metadataMatch[1]}}`
          newNode.metadata = JSON.parse(metadataStr.replace(/(\w+):/g, '"$1":'))
        } catch (e) {
          console.error('Failed to parse metadata', e)
        }
      }

      // Handle indentation to build the tree
      if (indent > currentIndent) {
        // Child of previous node
        if (currentNode && currentNode.children) {
          nodeStack.push(currentNode)
          currentNode.children.push(newNode)
          currentNode = newNode
        }
      } else if (indent === currentIndent) {
        // Sibling of previous node
        if (nodeStack.length > 0) {
          const parent = nodeStack[nodeStack.length - 1]
          if (parent && parent.children) {
            parent.children.push(newNode)
            currentNode = newNode
          }
        } else {
          // Top level
          result.push(newNode)
          currentNode = newNode
        }
      } else {
        // Go back up the tree
        const levelsUp = currentIndent - indent
        for (let i = 0; i < levelsUp; i++) {
          nodeStack.pop()
        }

        if (nodeStack.length > 0) {
          const parent = nodeStack[nodeStack.length - 1]
          if (parent && parent.children) {
            parent.children.push(newNode)
            currentNode = newNode
          }
        } else {
          // Top level
          result.push(newNode)
          currentNode = newNode
        }
      }

      currentIndent = indent
    })

    setOutput(result)
    setActiveTab('output')
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return (
      <ul className={`${level > 0 ? 'ml-4' : ''}`}>
        {nodes.map((node, index) => (
          <li key={index} className="my-1">
            <div className="flex items-center">
              {node.type === 'directory' ? (
                <FolderTree className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <FileCode className="h-4 w-4 mr-2 text-green-500" />
              )}
              <span>{node.name}</span>
              {node.metadata && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {JSON.stringify(node.metadata)}
                </span>
              )}
            </div>
            {node.children && renderFileTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden my-6">
      <div className="bg-muted p-4 border-b">
        <h3 className="font-medium">Interactive ForSure Demo</h3>
        <p className="text-sm text-muted-foreground">
          Edit the ForSure code and see the generated file structure
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="code" className="flex items-center">
              <FileCode className="h-4 w-4 mr-2" />
              ForSure Code
            </TabsTrigger>
            <TabsTrigger value="output" className="flex items-center">
              <FolderTree className="h-4 w-4 mr-2" />
              Output Structure
            </TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={parseForSure}
              className="h-8"
            >
              <Play className="h-4 w-4 mr-1" />
              Generate
            </Button>
          </div>
        </div>

        <TabsContent value="code" className="p-0 m-0">
          <div className="p-4">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-64 font-mono text-sm p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck="false"
            />
          </div>
        </TabsContent>

        <TabsContent value="output" className="p-0 m-0">
          <div className="p-4 min-h-[16rem]">
            {output.length > 0 ? (
              <div className="border rounded-md p-4 bg-muted/30">
                {renderFileTree(output)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FolderTree className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No output yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the "Generate" button to see the file structure
                </p>
                <Button onClick={parseForSure}>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Structure
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
