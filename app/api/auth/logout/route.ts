import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { apiResponse, apiError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return apiError('Missing authorization header', 401)
    }

    const token = authHeader.substring(7)

    const { error } = await supabase.auth.admin.signOut(token)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return apiError('Internal server error', 500)
  }
}
