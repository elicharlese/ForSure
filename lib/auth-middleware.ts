import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function authMiddleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 }
  }

  const token = authHeader.substring(7)

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return { error: 'Invalid or expired token', status: 401 }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return { error: 'Authentication failed', status: 500 }
  }
}

export function withAuth(handler: (request: NextRequest, context: { user: any }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await authMiddleware(request)
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error }, 
        { status: authResult.status }
      )
    }

    return handler(request, { user: authResult.user })
  }
}

export function withAdminAuth(handler: (request: NextRequest, context: { user: any }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await authMiddleware(request)
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error }, 
        { status: authResult.status }
      )
    }

    // Check if user has admin role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', authResult.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' }, 
        { status: 403 }
      )
    }

    return handler(request, { user: authResult.user })
  }
}
