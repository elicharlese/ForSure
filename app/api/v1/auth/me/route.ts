import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { apiResponse, apiError } from '@/lib/api-utils'

export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return apiError('Failed to fetch user profile', 500)
    }

    return apiResponse({
      id: user.id,
      email: user.email,
      ...profile,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return apiError('Internal server error', 500)
  }
})
