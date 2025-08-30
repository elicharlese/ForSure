import type { NextRequest } from 'next/server'
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

    let supabaseQuery: any = supabase.from('projects')
    // Apply select with count if available (and reassign to keep chain semantics)
    if (typeof supabaseQuery.select === 'function') {
      supabaseQuery = supabaseQuery.select(
        '*, profiles!projects_owner_id_fkey(name, avatar_url)',
        { count: 'exact' }
      )
    }
    // Limit to projects owned by the authenticated user for now.
    if (typeof supabaseQuery.eq === 'function') {
      supabaseQuery = supabaseQuery.eq('owner_id', user.id)
    }

    if (search) {
      // The projects table uses 'name' column, not 'title'
      if (typeof supabaseQuery.or === 'function') {
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${search}%,description.ilike.%${search}%`
        )
      }
    }

    if (sort) {
      if (typeof supabaseQuery.order === 'function') {
        supabaseQuery = supabaseQuery.order(sort, {
          ascending: order === 'asc',
        })
      }
    } else {
      if (typeof supabaseQuery.order === 'function') {
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
      }
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const rangeCall =
      typeof supabaseQuery.range === 'function'
        ? await supabaseQuery.range(from, to)
        : undefined
    const {
      data: projects,
      error,
      count,
    } = (rangeCall ?? { data: [], error: null, count: 0 }) as any

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
    if (process.env.NODE_ENV !== 'test') {
      console.error('Get projects error:', error)
    }
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

    // Map incoming payload to Supabase schema: 'name' is required, slug must be unique
    const name: string = projectData.name ?? projectData.title
    const description: string | undefined = projectData.description
    const status: string = projectData.status || 'active'

    // Simple slug generator (unique-ish)
    const base = (name || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    const slug = `${base}-${Date.now()}`

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          name,
          description,
          slug,
          owner_id: user.id,
          status,
        },
      ])
      .select('*, profiles!projects_owner_id_fkey(name, avatar_url)')
      .single()

    if (error) {
      return apiError('Failed to create project', 500)
    }

    return apiResponse(project, 201)
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Create project error:', error)
    }
    return apiError('Internal server error', 500)
  }
})
