import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { paginationSchema, createComponentSchema } from '@/lib/validations'
import { withAuth } from '@/lib/auth-middleware'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    const validation = validateRequestBody(query, paginationSchema)
    if (!validation.success) {
      return apiError('Invalid query parameters', 422, validation.errors)
    }

    const { page, limit, search, sort, order } = validation.data as {
      page: number
      limit: number
      search?: string
      sort?: string
      order?: 'asc' | 'desc'
    }

    const { category, tags } = query as { category?: string; tags?: string }

    const tagsArray = tags
      ? String(tags)
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      : []

    const where: any = {
      is_public: true,
      ...(category ? { category } : {}),
      ...(tagsArray.length ? { tags: { hasSome: tagsArray } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: String(search), mode: 'insensitive' } },
              {
                description: { contains: String(search), mode: 'insensitive' },
              },
              { category: { contains: String(search), mode: 'insensitive' } },
              { tags: { has: String(search) } },
            ],
          }
        : {}),
    }

    const sortMap: Record<string, string> = {
      downloads: 'download_count',
      stars: 'stars',
      created_at: 'created_at',
      newest: 'created_at',
      name: 'name',
      category: 'category',
    }
    const sortKey = (sort && sortMap[String(sort)]) || 'download_count'
    const sortOrder = order === 'asc' ? 'asc' : 'desc'

    const skip = (page - 1) * limit
    const take = limit

    const db = prisma as any
    const [total, rows] = await Promise.all([
      db.component.count({ where }),
      db.component.findMany({
        where,
        orderBy: { [sortKey]: sortOrder },
        skip,
        take,
        include: { creator: { select: { name: true, avatar_url: true } } },
      }),
    ])

    const components = rows.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category,
      tags: c.tags,
      prompt: c.prompt,
      downloads: c.download_count,
      stars: c.stars,
      preview_image_url: c.preview_image_url,
      creator: c.creator,
      created_at: c.created_at,
      updated_at: c.updated_at,
      slug: c.slug,
    }))

    return apiResponse({
      components,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get components error:', error)
    return apiError('Failed to get components', 500)
  }
}

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()

    const validation = validateRequestBody(body, createComponentSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const data = validation.data as any

    // Create a unique slug
    const baseSlug = slugify(data.name)
    let uniqueSlug = baseSlug
    let counter = 1
    const db = prisma as any
    while (await db.component.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`
    }

    const created = await db.component.create({
      data: {
        name: data.name,
        slug: uniqueSlug,
        description: data.description ?? null,
        category: data.category,
        tags: data.tags ?? [],
        prompt: data.prompt,
        preview_image_url: data.preview_image_url ?? null,
        is_public: data.is_public ?? true,
        creator_id: user.id,
      },
      include: { creator: { select: { name: true, avatar_url: true } } },
    })

    return apiResponse(created, 201)
  } catch (error) {
    console.error('Create component error:', error)
    return apiError('Internal server error', 500)
  }
})
