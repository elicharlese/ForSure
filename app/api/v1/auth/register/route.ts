import { NextRequest } from 'next/server'
import { registerSchema } from '@/lib/validations'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = validateRequestBody(body, registerSchema)
    if (!validation.success) {
      return apiError('Validation failed', 422, validation.errors)
    }

    const { email, password, name } = validation.data as {
      email: string
      password: string
      name: string
    }

    // Ensure email uniqueness
    const existing = await prisma.profile.findUnique({ where: { email } })
    if (existing) {
      return apiError('Email already in use', 409)
    }

    const password_hash = await hashPassword(password)

    const profile = await prisma.profile.create({
      data: {
        email,
        name,
        role: 'user',
        password_hash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar_url: true,
        bio: true,
        created_at: true,
      },
    })

    return apiResponse(
      {
        user: profile,
        message: 'Registration successful.',
      },
      201
    )
  } catch (error) {
    console.error('Registration error:', error)
    return apiError('Internal server error', 500)
  }
}
