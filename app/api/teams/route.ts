import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Team from '@/models/Team'

// Get user teams
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const teams = await Team.find({
      $or: [
        { owner: user.id },
        { 'members.user': user.id }
      ]
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('projects', 'name type framework')
    .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      teams
    })
  } catch (error) {
    console.error('Get teams error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new team
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { name, description, isPublic } = await request.json()

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Team name is required' },
        { status: 400 }
      )
    }

    const team = new Team({
      name,
      description,
      owner: user.id,
      members: [{
        user: user.id,
        role: 'admin',
        joinedAt: new Date()
      }],
      projects: [],
      isPublic: isPublic || false
    })

    await team.save()
    await team.populate('owner', 'name email avatar')
    await team.populate('members.user', 'name email avatar')

    return NextResponse.json({
      success: true,
      team,
      message: 'Team created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create team error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}