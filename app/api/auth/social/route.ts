import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { apiResponse, apiError } from '@/lib/api-utils'

// Social login with Google
export async function POST(request: NextRequest) {
  try {
    const { provider, redirectTo } = await request.json()

    if (!provider || !['google', 'github'].includes(provider)) {
      return apiError('Invalid provider', 400)
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github',
      options: {
        redirectTo:
          redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Social login error:', error)
      return apiError('Failed to initialize social login', 500)
    }

    return apiResponse({
      url: data.url,
      provider,
      message: 'Social login initiated successfully',
    })
  } catch (error) {
    console.error('Social login error:', error)
    return apiError('Internal server error', 500)
  }
}
