import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { registerSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = validateRequestBody(body, registerSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const { email, password, name } = validation.data as { email: string; password: string; name: string }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return apiError(authError.message, 400)
    }

    if (!authData.user) {
      return apiError('Registration failed', 400)
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: 'user',
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return apiError('Failed to create user profile', 500)
    }

    return apiResponse({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        ...profile,
      },
      message: 'Registration successful. Please check your email to verify your account.',
    }, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return apiError('Internal server error', 500)
  }
}
