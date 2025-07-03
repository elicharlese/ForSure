import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { loginSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { withRateLimit } from '@/lib/rate-limit'

export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json()
    
    const validation = validateRequestBody(body, loginSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const { email, password } = validation.data as { email: string; password: string }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return apiError(error.message, 401)
    }

    if (!data.user || !data.session) {
      return apiError('Login failed', 401)
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return apiResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
      },
      session: data.session,
    })
  } catch (error) {
    console.error('Login error:', error)
    return apiError('Internal server error', 500)
  }
}, {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 login attempts per 15 minutes
})
