import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { apiResponse, apiError } from '@/lib/api-utils'

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'uploads'
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return apiError('No file provided', 400)
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ]
    if (!allowedTypes.includes(file.type)) {
      return apiError('File type not allowed', 400)
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return apiError('File size too large (max 10MB)', 400)
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return apiError('Failed to upload file', 500)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return apiResponse({
      path: data.path,
      url: publicUrlData.publicUrl,
      size: file.size,
      type: file.type,
      name: file.name,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return apiError('Internal server error', 500)
  }
})
