import { NextRequest } from 'next/server'
import { withAuth, withAdminAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { createTemplateSchema, paginationSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    const validation = validateRequestBody(query, paginationSchema)
    if (!validation.success) {
      return apiError('Invalid query parameters', 422, validation.errors)
    }

    const { page, limit, search, sort, order } = validation.data as any
    const { category } = query as any

    const where: any = { is_public: true }
    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    const sortMap: Record<string, string> = {
      downloads: 'download_count',
      download_count: 'download_count',
      created_at: 'created_at',
      name: 'name',
      category: 'category',
    }
    const sortKey = (sort && sortMap[String(sort)]) || 'download_count'
    const sortOrder = order === 'asc' ? 'asc' : 'desc'
    const orderBy: any = { [sortKey]: sortOrder }

    const skip = (page - 1) * limit
    const take = limit

    const db = prisma as any
    const [total, templatesRaw] = await Promise.all([
      db.template.count({ where }),
      db.template.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          creator: { select: { name: true, avatar_url: true } },
        },
      }),
    ])

    type TemplateRow = {
      id: string
      name: string
      description: string | null
      category: string
      content: unknown
      preview_image_url: string | null
      is_public: boolean
      download_count: number
      creator_id: string
      tags: string[]
      version: string
      created_at: Date
      updated_at: Date
      creator?: { name: string | null; avatar_url: string | null } | null
    }

    const templates = (templatesRaw as TemplateRow[]).map((t: TemplateRow) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      content: t.content,
      preview_image_url: t.preview_image_url,
      is_public: t.is_public,
      downloads: t.download_count,
      author_id: t.creator_id,
      tags: t.tags,
      version: t.version,
      created_at: t.created_at,
      updated_at: t.updated_at,
      profiles: t.creator
        ? { name: t.creator.name, avatar_url: t.creator.avatar_url }
        : null,
    }))

    return apiResponse({
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get templates error:', error)
    return apiError('Failed to get templates', 500)
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
