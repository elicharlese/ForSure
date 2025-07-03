import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { updateProfileSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'

export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return apiError('Failed to fetch profile', 500)
    }

    return apiResponse(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    return apiError('Internal server error', 500)
  }
})

export const PUT = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()
    
    const validation = validateRequestBody(body, updateProfileSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const updateData = validation.data as any

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return apiError('Failed to update profile', 500)
    }

    return apiResponse(profile)
  } catch (error) {
    console.error('Update profile error:', error)
    return apiError('Internal server error', 500)
  }
})
