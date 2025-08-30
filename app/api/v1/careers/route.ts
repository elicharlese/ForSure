import { NextRequest } from 'next/server'
import { withAdminAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { createCareerSchema, paginationSchema } from '@/lib/validations'
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
    const { type, department, location } = query

    let supabaseQuery = supabase
      .from('careers')
      .select('*', { count: 'exact' })
      .eq('active', true)

    if (search) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    if (type) {
      supabaseQuery = supabaseQuery.eq('type', type)
    }

    if (department) {
      supabaseQuery = supabaseQuery.eq('department', department)
    }

    if (location) {
      supabaseQuery = supabaseQuery.ilike('location', `%${location}%`)
    }

    if (sort) {
      supabaseQuery = supabaseQuery.order(sort, { ascending: order === 'asc' })
    } else {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: careers, error, count } = await supabaseQuery.range(from, to)

    if (error) {
      return apiError('Failed to fetch careers', 500)
    }

    return apiResponse({
      careers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Get careers error:', error)
    return apiError('Internal server error', 500)
  }
}

export const POST = withAdminAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()

    const validation = validateRequestBody(body, createCareerSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const careerData = validation.data as any

    const { data: career, error } = await supabase
      .from('careers')
      .insert([
        {
          ...careerData,
          active: careerData.active !== false,
        },
      ])
      .select()
      .single()

    if (error) {
      return apiError('Failed to create career listing', 500)
    }

    return apiResponse(career, 201)
  } catch (error) {
    console.error('Create career error:', error)
    return apiError('Internal server error', 500)
  }
})
