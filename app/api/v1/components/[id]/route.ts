import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { updateComponentSchema } from '@/lib/validations'
import { withAuth } from '@/lib/auth-middleware'

// Management handlers for a single Component by id
// Note: We read the id from the URL to avoid altering withAuth context typing

export const PUT = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { pathname } = new URL(request.url)
    const id = pathname.split('/').pop() as string

    if (!id) return apiError('Missing component id', 400)

    const body = await request.json()
    const validation = validateRequestBody(body, updateComponentSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const db = prisma as any

    const existing = await db.component.findUnique({ where: { id } })
    if (!existing) return apiError('Component not found', 404)

    // Ownership or admin check
    const isOwner = existing.creator_id === user.id
    let isAdmin = false
    if (!isOwner) {
      const profile = await db.profile.findUnique({
        where: { id: user.id },
        select: { role: true },
      })
      isAdmin = profile?.role === 'admin'
    }
    if (!isOwner && !isAdmin) return apiError('Forbidden', 403)

    const data = validation.data as any

    const updated = await db.component.update({
      where: { id },
      data: {
        // Keep slug stable to avoid breaking links
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        category: data.category ?? undefined,
        tags: data.tags ?? undefined,
        prompt: data.prompt ?? undefined,
        preview_image_url: data.preview_image_url ?? undefined,
        is_public: data.is_public ?? undefined,
      },
      include: { creator: { select: { name: true, avatar_url: true } } },
    })

    // Return consistent shape with list endpoint
    return apiResponse({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      category: updated.category,
      tags: updated.tags,
      prompt: updated.prompt,
      downloads: updated.download_count,
      stars: updated.stars,
      preview_image_url: updated.preview_image_url,
      creator: updated.creator,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
      slug: updated.slug,
    })
  } catch (error) {
    console.error('Update component error:', error)
    return apiError('Internal server error', 500)
  }
})

export const DELETE = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { pathname } = new URL(request.url)
    const id = pathname.split('/').pop() as string

    if (!id) return apiError('Missing component id', 400)

    const db = prisma as any

    const existing = await db.component.findUnique({ where: { id } })
    if (!existing) return apiError('Component not found', 404)

    const isOwner = existing.creator_id === user.id
    let isAdmin = false
    if (!isOwner) {
      const profile = await db.profile.findUnique({
        where: { id: user.id },
        select: { role: true },
      })
      isAdmin = profile?.role === 'admin'
    }
    if (!isOwner && !isAdmin) return apiError('Forbidden', 403)

    await db.component.delete({ where: { id } })
    return apiResponse({ success: true }, 200)
  } catch (error) {
    console.error('Delete component error:', error)
    return apiError('Internal server error', 500)
  }
})
