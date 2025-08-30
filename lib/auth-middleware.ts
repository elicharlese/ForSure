import type { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBearerToken, verifyAccessToken } from '@/lib/auth'

type AuthSuccess = { user: any; error: null; status?: never }
type AuthFailure = { error: string; status: number; user?: never }
type AuthResult = AuthSuccess | AuthFailure

export async function authMiddleware(
  request: NextRequest
): Promise<AuthResult> {
  const token = getBearerToken(request.headers.get('authorization'))

  if (!token) {
    return { error: 'Missing or invalid authorization header', status: 401 }
  }

  try {
    const payload = verifyAccessToken(token)
    const user = { id: payload.sub, email: payload.email }
    return { user, error: null }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Auth middleware error:', error)
    }
    return { error: 'Invalid or expired token', status: 401 }
  }
}

// Lazy JSON response creator to avoid importing NextResponse at module load in tests
async function toNextJson(body: any, init?: { status?: number }) {
  const { NextResponse } = await import('next/server')
  return NextResponse.json(body, init)
}

export function withAuth(
  handler: (
    request: NextRequest,
    context: { user: any }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authMiddleware(request)

    if (authResult.error) {
      return toNextJson(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    return handler(request, { user: authResult.user })
  }
}

export function withAdminAuth(
  handler: (
    request: NextRequest,
    context: { user: any }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authMiddleware(request)

    if (authResult.error) {
      return toNextJson(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    // Check if user has admin role via Prisma
    const profile = await prisma.profile.findUnique({
      where: { id: authResult.user.id },
      select: { role: true },
    })

    if (profile?.role !== 'admin') {
      return toNextJson({ error: 'Admin access required' }, { status: 403 })
    }

    return handler(request, { user: authResult.user })
  }
}
