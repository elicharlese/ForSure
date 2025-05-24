import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

// Generate file structure from ForSure content
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { forSureContent, projectType } = await request.json()

    if (!forSureContent) {
      return NextResponse.json(
        { success: false, message: 'ForSure content is required' },
        { status: 400 }
      )
    }

    // Parse ForSure content and generate file structure
    const fileStructure = parseForSureContent(forSureContent, projectType)

    return NextResponse.json({
      success: true,
      fileStructure,
      message: 'File structure generated successfully'
    })
  } catch (error) {
    console.error('File structure generation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate file structure' },
      { status: 500 }
    )
  }
}

function parseForSureContent(content: string, projectType?: string): any {
  // This is a simplified parser for ForSure content
  // In a real implementation, you'd want a more robust parser
  
  const lines = content.split('\n').map(line => line.trim()).filter(line => line)
  const structure = { name: 'root', type: 'directory', children: [] }
  const stack: any[] = [structure]
  
  let currentIndent = 0
  
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('<description>') || line.startsWith('</description>')) {
      continue
    }
    
    const indent = (line.match(/^\s*/)?.[0].length || 0) / 2
    const cleanLine = line.replace(/^\s*-?\s*/, '')
    
    if (cleanLine.startsWith('Type:')) {
      const type = cleanLine.replace('Type:', '').trim().toLowerCase()
      const currentNode = stack[stack.length - 1]
      if (currentNode) {
        currentNode.type = type === 'file' ? 'file' : 'directory'
      }
    } else if (cleanLine.startsWith('Name:')) {
      const name = cleanLine.replace('Name:', '').trim()
      const newNode = {
        name,
        type: 'file',
        children: []
      }
      
      // Adjust stack based on indentation
      while (stack.length > indent + 1) {
        stack.pop()
      }
      
      const parent = stack[stack.length - 1]
      if (parent) {
        parent.children.push(newNode)
        stack.push(newNode)
      }
    } else if (cleanLine.includes(':') && !cleanLine.includes('Type:') && !cleanLine.includes('Name:')) {
      // This might be a directory definition
      const name = cleanLine.replace(':', '').trim()
      const newNode = {
        name,
        type: 'directory',
        children: []
      }
      
      // Adjust stack based on indentation
      while (stack.length > indent + 1) {
        stack.pop()
      }
      
      const parent = stack[stack.length - 1]
      if (parent && name !== 'root') {
        parent.children.push(newNode)
        stack.push(newNode)
      }
    }
  }
  
  // If parsing failed, return a default structure based on project type
  if (structure.children.length === 0) {
    return generateDefaultStructure(projectType)
  }
  
  return structure
}

function generateDefaultStructure(projectType?: string): any {
  const baseStructure = {
    name: 'root',
    type: 'directory',
    children: []
  }

  if (projectType === 'Next.js' || projectType === 'nextjs') {
    baseStructure.children = [
      {
        name: 'app',
        type: 'directory',
        children: [
          { name: 'page.tsx', type: 'file', children: [] },
          { name: 'layout.tsx', type: 'file', children: [] },
          {
            name: 'api',
            type: 'directory',
            children: [
              {
                name: 'auth',
                type: 'directory',
                children: [
                  { name: 'route.ts', type: 'file', children: [] }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'components',
        type: 'directory',
        children: [
          {
            name: 'ui',
            type: 'directory',
            children: []
          }
        ]
      },
      {
        name: 'lib',
        type: 'directory',
        children: [
          { name: 'utils.ts', type: 'file', children: [] }
        ]
      },
      { name: 'package.json', type: 'file', children: [] },
      { name: 'next.config.js', type: 'file', children: [] }
    ]
  } else if (projectType === 'React' || projectType === 'react') {
    baseStructure.children = [
      {
        name: 'src',
        type: 'directory',
        children: [
          {
            name: 'components',
            type: 'directory',
            children: []
          },
          {
            name: 'hooks',
            type: 'directory',
            children: []
          },
          {
            name: 'services',
            type: 'directory',
            children: []
          },
          { name: 'App.tsx', type: 'file', children: [] },
          { name: 'index.tsx', type: 'file', children: [] }
        ]
      },
      {
        name: 'public',
        type: 'directory',
        children: [
          { name: 'index.html', type: 'file', children: [] }
        ]
      },
      { name: 'package.json', type: 'file', children: [] }
    ]
  } else {
    // Generic project structure
    baseStructure.children = [
      {
        name: 'src',
        type: 'directory',
        children: []
      },
      {
        name: 'docs',
        type: 'directory',
        children: []
      },
      { name: 'README.md', type: 'file', children: [] },
      { name: 'package.json', type: 'file', children: [] }
    ]
  }

  return baseStructure
}