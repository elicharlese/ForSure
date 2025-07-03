import { NextRequest } from 'next/server'
import { authMiddleware } from '@/lib/auth-middleware'

// Mock the Supabase admin
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
  },
}))

const { supabaseAdmin } = require('@/lib/supabase')

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('authMiddleware', () => {
    it('should return error for missing authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/test')
      
      const result = await authMiddleware(request)
      
      expect(result.error).toBe('Missing or invalid authorization header')
      expect(result.status).toBe(401)
    })

    it('should return error for invalid authorization header format', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'InvalidFormat token123'
        }
      })
      
      const result = await authMiddleware(request)
      
      expect(result.error).toBe('Missing or invalid authorization header')
      expect(result.status).toBe(401)
    })

    it('should return error for invalid token', async () => {
      supabaseAdmin.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      })

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      })
      
      const result = await authMiddleware(request)
      
      expect(result.error).toBe('Invalid or expired token')
      expect(result.status).toBe(401)
    })

    it('should return user for valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com'
      }

      supabaseAdmin.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer valid-token'
        }
      })
      
      const result = await authMiddleware(request)
      
      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      supabaseAdmin.auth.getUser.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer valid-token'
        }
      })
      
      const result = await authMiddleware(request)
      
      expect(result.error).toBe('Authentication failed')
      expect(result.status).toBe(500)
    })
  })
})
