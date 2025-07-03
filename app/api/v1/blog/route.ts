import { NextRequest } from 'next/server'
import { withAuth, withAdminAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { createBlogPostSchema, paginationSchema } from '@/lib/validations'
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

    let supabaseQuery = supabase
      .from('blog_posts')
      .select('*, profiles!blog_posts_author_id_fkey(name, avatar_url)', { count: 'exact' })
      .eq('published', true)

    if (search) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (sort) {
      supabaseQuery = supabaseQuery.order(sort, { ascending: order === 'asc' })
    } else {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: posts, error, count } = await supabaseQuery.range(from, to)

    if (error) {
      return apiError('Failed to fetch blog posts', 500)
    }

    return apiResponse({
      posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Get blog posts error:', error)
    return apiError('Internal server error', 500)
  }
}

export const POST = withAdminAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()
    
    const validation = validateRequestBody(body, createBlogPostSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const postData = validation.data as any

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          ...postData,
          author_id: user.id,
          published: postData.published || false,
        },
      ])
      .select('*, profiles!blog_posts_author_id_fkey(name, avatar_url)')
      .single()

    if (error) {
      return apiError('Failed to create blog post', 500)
    }

    return apiResponse(post, 201)
  } catch (error) {
    console.error('Create blog post error:', error)
    return apiError('Internal server error', 500)
  }
})
