import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export type UserRole = 'user' | 'admin' | 'moderator'

export interface AuthenticatedUser {
  id: string
  email: string
  role: UserRole
}

export async function getUserWithRole(
  userId: string
): Promise<AuthenticatedUser | null> {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
    }
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function requireRole(requiredRole: UserRole) {
  return function (
    handler: (
      request: NextRequest,
      context: { user: AuthenticatedUser }
    ) => Promise<NextResponse>
  ) {
    return async (request: NextRequest) => {
      const authHeader = request.headers.get('authorization')

      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)

      try {
        const {
          data: { user },
          error,
        } = await supabaseAdmin.auth.getUser(token)

        if (error || !user) {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          )
        }

        const userWithRole = await getUserWithRole(user.id)

        if (!userWithRole) {
          return NextResponse.json(
            { error: 'User profile not found' },
            { status: 404 }
          )
        }

        if (!hasRole(userWithRole.role, requiredRole)) {
          return NextResponse.json(
            { error: `${requiredRole} role required` },
            { status: 403 }
          )
        }

        return handler(request, { user: userWithRole })
      } catch (error) {
        console.error('Role-based auth error:', error)
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 500 }
        )
      }
    }
  }
}

export function requireAdmin() {
  return requireRole('admin')
}

export function requireModerator() {
  return requireRole('moderator')
}
