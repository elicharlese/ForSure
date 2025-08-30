// app/app/components/file-structure-message.tsx

import type React from 'react'

interface FileNode {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  content?: string
}

interface FileStructureMessageProps {
  fileStructure: FileNode
}

const FileStructureMessage: React.FC<FileStructureMessageProps> = ({
  fileStructure,
}) => {
  const renderNode = (node: FileNode, indent = 0): React.ReactNode => {
    const indentStyle = { paddingLeft: `${indent * 16}px` }

    if (node.type === 'directory') {
      return (
        <div key={node.name}>
          <div style={indentStyle} className="flex items-center space-x-2">
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
              className="h-4 w-4"
            >
              <path d="M2 7v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              <path d="M22 7H2" />
              <path d="M10 12h4" />
            </svg>
            <span className="text-sm">{node.name}</span>
          </div>
          {node.children &&
            node.children.map(child => renderNode(child, indent + 1))}
        </div>
      )
    } else {
      return (
        <div
          key={node.name}
          style={indentStyle}
          className="flex items-center space-x-2"
        >
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
            className="h-4 w-4"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm">{node.name}</span>
          {renderFileContentPreview(node)}
        </div>
      )
    }
  }

  // Add a function to render file content preview
  const renderFileContentPreview = (node: FileNode) => {
    if (node.type !== 'file' || !node.content) return null

    const extension = node.name.split('.').pop()?.toLowerCase() || ''

    // Determine language for syntax highlighting
    let language = 'plaintext'
    switch (extension) {
      case 'js':
        language = 'javascript'
        break
      case 'jsx':
        language = 'javascript'
        break
      case 'ts':
        language = 'typescript'
        break
      case 'tsx':
        language = 'typescript'
        break
      case 'html':
        language = 'html'
        break
      case 'css':
        language = 'css'
        break
      case 'json':
        language = 'json'
        break
      case 'md':
        language = 'markdown'
        break
    }

    // Limit preview to first 10 lines
    const contentLines = node.content.split('\n')
    const previewContent = contentLines.slice(0, 10).join('\n')
    const hasMoreLines = contentLines.length > 10

    return (
      <div className="mt-2 text-sm">
        <div className="bg-muted rounded-md p-2 overflow-x-auto">
          <pre className="text-xs">
            <code>{previewContent}</code>
          </pre>
        </div>
        {hasMoreLines && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {contentLines.length - 10} more lines...
          </div>
        )}
      </div>
    )
  }

  return <div>{renderNode(fileStructure)}</div>
}

export { FileStructureMessage }
