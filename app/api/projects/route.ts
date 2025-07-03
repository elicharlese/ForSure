import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { createProjectSchema, paginationSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'

export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    
    const validation = validateRequestBody(query, paginationSchema)
    if (!validation.success) {
      return apiError('Invalid query parameters', 422, validation.errors)
    }

    const { page, limit, search, sort, order } = validation.data as any

    let supabaseQuery = supabase
      .from('projects')
      .select('*, profiles!projects_owner_id_fkey(name, avatar_url)', { count: 'exact' })
      .or(`owner_id.eq.${user.id},collaborators.cs.{${user.id}}`)

    if (search) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (sort) {
      supabaseQuery = supabaseQuery.order(sort, { ascending: order === 'asc' })
    } else {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: projects, error, count } = await supabaseQuery
      .range(from, to)

    if (error) {
      return apiError('Failed to fetch projects', 500)
    }

    return apiResponse({
      projects,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return apiError('Internal server error', 500)
  }
})

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()
    
    const validation = validateRequestBody(body, createProjectSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const projectData = validation.data as any

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          ...projectData,
          owner_id: user.id,
          status: projectData.status || 'active',
        },
      ])
      .select('*, profiles!projects_owner_id_fkey(name, avatar_url)')
      .single()

    if (error) {
      return apiError('Failed to create project', 500)
    }

    return apiResponse(project, 201)
  } catch (error) {
    console.error('Create project error:', error)
    return apiError('Internal server error', 500)
  }
})
