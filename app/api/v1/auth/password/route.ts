import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { withRateLimit } from '@/lib/rate-limit'
import { apiResponse, apiError, validateRequestBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { hashPassword, comparePasswords } from '@/lib/auth'
import { z } from 'zod'

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

export const PUT = withRateLimit(
  withAuth(async (request: NextRequest, { user }) => {
    try {
      const body = await request.json()

      const validation = validateRequestBody(body, passwordChangeSchema)
      if (!validation.success) {
        return apiError('Invalid request', 400, validation.errors)
      }

      const { currentPassword, newPassword } = validation.data as z.infer<
        typeof passwordChangeSchema
      >

      // Get user with password hash
      const userProfile = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { password_hash: true },
      })

      if (!userProfile || !userProfile.password_hash) {
        return apiError('User not found or no password set', 404)
      }

      // Verify current password
      const isValidPassword = await comparePasswords(
        currentPassword,
        userProfile.password_hash
      )
      if (!isValidPassword) {
        return apiError('Current password is incorrect', 401)
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword)

      // Update password
      await prisma.profile.update({
        where: { id: user.id },
        data: {
          password_hash: newPasswordHash,
          updated_at: new Date(),
        },
      })

      return apiResponse({ message: 'Password updated successfully' })
    } catch (error) {
      console.error('Password change error:', error)
      return apiError('Internal server error', 500)
    }
  })
)
