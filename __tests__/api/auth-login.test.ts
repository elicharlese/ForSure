import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/v1/auth/login/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  },
}))

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: (handler: any) => handler
}))

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any) => new Response(JSON.stringify(data), { status: 200 }),
  apiError: (message: string, status: number) => new Response(JSON.stringify({ error: message }), { status }),
  validateRequestBody: jest.fn()
}))

const { supabase } = require('@/lib/supabase')
const { validateRequestBody } = require('@/lib/api-utils')

describe('/api/v1/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        access_token: 'mock-token'
      }

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'mock-token' } },
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(mockUser)
      expect(data.token).toBe('mock-token')
    })

    it('should return error for invalid credentials', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      })

      const request = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should validate email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('email')
    })

    it('should require password', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('password')
    })
  })
})
