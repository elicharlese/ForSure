import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

// AI Chat endpoint
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { message, projectContext, fileStructure, forSureFiles } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate AI response based on context
    let aiResponse = generateAIResponse(message, projectContext, fileStructure, forSureFiles)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      suggestions: generateSuggestions(message, projectContext)
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAIResponse(message: string, projectContext: any, fileStructure: any, forSureFiles: any[]): string {
  const lowerMessage = message.toLowerCase()
  
  // Project structure suggestions
  if (lowerMessage.includes('structure') || lowerMessage.includes('organize')) {
    if (projectContext?.framework === 'Next.js') {
      return `For your Next.js project "${projectContext.name}", I recommend this structure:

\`\`\`
app/
├── (auth)/
│   ├── login/
│   └── register/
├── api/
│   ├── auth/
│   └── projects/
├── components/
│   ├── ui/
│   └── forms/
├── lib/
├── hooks/
└── types/
\`\`\`

This follows Next.js 13+ app router conventions. Would you like me to generate the ForSure file for this structure?`
    } else if (projectContext?.framework === 'React') {
      return `For your React project "${projectContext.name}", here's a recommended structure:

\`\`\`
src/
├── components/
│   ├── common/
│   └── pages/
├── hooks/
├── services/
├── utils/
├── types/
└── styles/
\`\`\`

This is a clean, scalable React structure. Would you like me to create the ForSure definition for this?`
    }
  }

  // ForSure file help
  if (lowerMessage.includes('forsure') || lowerMessage.includes('.forsure')) {
    return `I can help you create ForSure files! ForSure is a prompting language for defining project structures. Here's an example:

\`\`\`forsure
# project.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of your ${projectContext?.type || 'project'}.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Project dependencies and scripts.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Main source code directory.
    </description>
\`\`\`

Would you like me to generate a complete ForSure file for your project?`
  }

  // File structure analysis
  if (fileStructure && (lowerMessage.includes('analyze') || lowerMessage.includes('review'))) {
    const fileCount = countFiles(fileStructure)
    return `I've analyzed your current file structure. You have ${fileCount} files/directories. ${
      fileCount < 5 ? 'Your project is just getting started!' : 
      fileCount < 20 ? 'Good progress on your project structure!' :
      'You have a well-developed project structure!'
    }

Based on your ${projectContext?.framework || 'project'} setup, I notice you could benefit from:
- Better organization of components
- Clearer separation of concerns
- More descriptive file naming

Would you like specific recommendations for improvements?`
  }

  // Default helpful response
  return `I understand you're asking about "${message}". As your ForSure AI assistant, I can help you with:

• **Project Structure**: Design and organize your file hierarchy
• **ForSure Files**: Create prompting language definitions
• **Best Practices**: Framework-specific recommendations
• **Code Generation**: Generate boilerplate files and folders

${projectContext ? `For your ${projectContext.framework} project "${projectContext.name}", ` : ''}what specific aspect would you like help with?`
}

function generateSuggestions(message: string, projectContext: any): string[] {
  const suggestions = [
    "Generate a complete file structure",
    "Create a ForSure definition file",
    "Analyze my current structure",
    "Suggest best practices"
  ]

  if (projectContext?.framework === 'Next.js') {
    suggestions.push("Set up Next.js app router structure")
    suggestions.push("Create API routes structure")
  } else if (projectContext?.framework === 'React') {
    suggestions.push("Organize React components")
    suggestions.push("Set up state management structure")
  }

  return suggestions.slice(0, 4)
}

function countFiles(structure: any): number {
  if (!structure || !structure.children) return 0
  
  let count = structure.children.length
  for (const child of structure.children) {
    if (child.type === 'directory') {
      count += countFiles(child)
    }
  }
  return count
}