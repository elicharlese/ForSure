import type { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { withRateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { signAccessToken } from '@/lib/auth'

export const POST = withRateLimit(
  async (request: NextRequest) => {
    try {
      const body = await request.json()

      const validation = validateRequestBody(body, loginSchema)
      if (!validation.success) {
        return apiError('Validation failed', 422, validation.errors)
      }

      const { email, password } = validation.data as {
        email: string
        password: string
      }

      // Find user by email (select fields including password_hash)
      const profile = await prisma.profile.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          avatar_url: true,
          bio: true,
          created_at: true,
          password_hash: true,
        },
      })
      if (!profile || !profile.password_hash) {
        return apiError('Invalid credentials', 401)
      }

      // Verify password
      const ok = await verifyPassword(password, profile.password_hash)
      if (!ok) {
        return apiError('Invalid credentials', 401)
      }

      // Sign JWT and return backward-compatible session shape
      const token = signAccessToken({
        sub: profile.id,
        email: profile.email,
        role: profile.role,
      })

      const { password_hash, ...safeProfile } = profile as any

      return apiResponse({
        user: {
          id: profile.id,
          email: profile.email,
          ...safeProfile,
        },
        session: { access_token: token, token_type: 'bearer' },
      })
    } catch (error) {
      console.error('Login error:', error)
      return apiError('Internal server error', 500)
    }
  },
  {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 login attempts per 15 minutes
  }
)
