import { NextRequest } from 'next/server'
import { authMiddleware } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { updateProjectSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request)
  if (authResult.error) {
    return apiError(authResult.error, authResult.status!)
  }
  const user = authResult.user

  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, profiles!projects_owner_id_fkey(name, avatar_url)')
      .eq('id', params.id)
      .or(`owner_id.eq.${user.id},collaborators.cs.{${user.id}}`)
      .single()

    if (error) {
      return apiError('Project not found', 404)
    }

    return apiResponse(project)
  } catch (error) {
    console.error('Get project error:', error)
    return apiError('Internal server error', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request)
  if (authResult.error) {
    return apiError(authResult.error, authResult.status!)
  }
  const user = authResult.user

  try {
    const body = await request.json()

    const validation = validateRequestBody(body, updateProjectSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const updateData = validation.data as any

    // Check if user owns the project
    const { data: existingProject } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (!existingProject || existingProject.owner_id !== user.id) {
      return apiError('Project not found or access denied', 404)
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select('*, profiles!projects_owner_id_fkey(name, avatar_url)')
      .single()

    if (error) {
      return apiError('Failed to update project', 500)
    }

    return apiResponse(project)
  } catch (error) {
    console.error('Update project error:', error)
    return apiError('Internal server error', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request)
  if (authResult.error) {
    return apiError(authResult.error, authResult.status!)
  }
  const user = authResult.user

  try {
    // Check if user owns the project
    const { data: existingProject } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (!existingProject || existingProject.owner_id !== user.id) {
      return apiError('Project not found or access denied', 404)
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) {
      return apiError('Failed to delete project', 500)
    }

    return apiResponse({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    return apiError('Internal server error', 500)
  }
}
