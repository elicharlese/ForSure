import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await Project.findById(params.id)
      .populate('owner', 'name email avatar')
      .populate('collaborators', 'name email avatar')

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this project
    const hasAccess = project.owner._id.toString() === decoded.userId ||
                     project.collaborators.some((c: any) => c._id.toString() === decoded.userId) ||
                     project.isPublic

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      )
    }

    // Update last accessed time if user is owner or collaborator
    if (project.owner._id.toString() === decoded.userId ||
        project.collaborators.some((c: any) => c._id.toString() === decoded.userId)) {
      project.lastAccessedAt = new Date()
      await project.save()
    }

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await Project.findById(params.id)

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has edit access
    const hasEditAccess = project.owner.toString() === decoded.userId ||
                         project.collaborators.some((c: any) => c.toString() === decoded.userId)

    if (!hasEditAccess) {
      return NextResponse.json(
        { success: false, message: 'Edit access denied' },
        { status: 403 }
      )
    }

    const updateData = await request.json()
    
    // Create new version if file structure or forSure files changed
    if (updateData.fileStructure || updateData.forSureFiles) {
      const newVersion = {
        version: project.version + 1,
        fileStructure: updateData.fileStructure || project.fileStructure,
        forSureFiles: updateData.forSureFiles || project.forSureFiles,
        createdBy: decoded.userId,
        description: updateData.versionDescription || 'Updated project'
      }
      
      project.versions.push(newVersion)
      project.version = newVersion.version
    }

    // Update project fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'versionDescription' && updateData[key] !== undefined) {
        (project as any)[key] = updateData[key]
      }
    })

    project.updatedAt = new Date()
    await project.save()
    await project.populate('owner', 'name email avatar')
    await project.populate('collaborators', 'name email avatar')

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await Project.findById(params.id)

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Only owner can delete project
    if (project.owner.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Only project owner can delete the project' },
        { status: 403 }
      )
    }

    await Project.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}