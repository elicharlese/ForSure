import { NextRequest } from 'next/server'
import { withAuth, withAdminAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { createTemplateSchema, paginationSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    
    const validation = validateRequestBody(query, paginationSchema)
    if (!validation.success) {
      return apiError('Invalid query parameters', 422, validation.errors)
    }

    const { page, limit, search, sort, order } = validation.data as any
    const { category } = query

    let supabaseQuery = supabase
      .from('templates')
      .select('*, profiles!templates_author_id_fkey(name, avatar_url)', { count: 'exact' })

    if (search) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category)
    }

    if (sort) {
      supabaseQuery = supabaseQuery.order(sort, { ascending: order === 'asc' })
    } else {
      supabaseQuery = supabaseQuery.order('downloads', { ascending: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: templates, error, count } = await supabaseQuery.range(from, to)

    if (error) {
      return apiError('Failed to fetch templates', 500)
    }

    return apiResponse({
      templates,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Get templates error:', error)
    return apiError('Internal server error', 500)
  }
}

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()
    
    const validation = validateRequestBody(body, createTemplateSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const templateData = validation.data as any

    const { data: template, error } = await supabase
      .from('templates')
      .insert([
        {
          ...templateData,
          author_id: user.id,
          downloads: 0,
          featured: templateData.featured || false,
        },
      ])
      .select('*, profiles!templates_author_id_fkey(name, avatar_url)')
      .single()

    if (error) {
      return apiError('Failed to create template', 500)
    }

    return apiResponse(template, 201)
  } catch (error) {
    console.error('Create template error:', error)
    return apiError('Internal server error', 500)
  }
})
