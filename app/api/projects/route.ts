import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user projects
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []

    const skip = (page - 1) * limit

    // Build query
    const query: any = {
      $or: [
        { owner: decoded.userId },
        { collaborators: decoded.userId }
      ]
    }

    if (search) {
      query.$text = { $search: search }
    }

    if (tags.length > 0) {
      query.tags = { $in: tags }
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('collaborators', 'name email avatar')
      .sort({ lastAccessedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Project.countDocuments(query)

    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new project
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const projectData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'type', 'framework', 'languages', 'description', 'industry', 'stage', 'teamSize', 'timeline', 'goals']
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const project = new Project({
      ...projectData,
      owner: decoded.userId,
      collaborators: [],
      fileStructure: { name: 'root', type: 'directory', children: [] },
      forSureFiles: [],
      tags: projectData.tags || [],
      isPublic: projectData.isPublic || false,
      version: 1,
      versions: [{
        version: 1,
        fileStructure: { name: 'root', type: 'directory', children: [] },
        forSureFiles: [],
        createdBy: decoded.userId,
        description: 'Initial version'
      }]
    })

    await project.save()
    await project.populate('owner', 'name email avatar')

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}