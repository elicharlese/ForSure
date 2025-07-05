import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/social/route'
import { GET } from '@/app/api/auth/callback/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
      exchangeCodeForSession: jest.fn(),
    },
    from: jest.fn(() => ({
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }
}))

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any) => new Response(JSON.stringify(data), { status: 200 }),
  apiError: (message: string, status: number) => new Response(JSON.stringify({ error: message }), { status }),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

const { supabase } = require('@/lib/supabase')
const { redirect } = require('next/navigation')

describe('/api/auth/social', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST - Social Login', () => {
    it('should initiate Google social login', async () => {
      const mockAuthData = {
        url: 'https://accounts.google.com/oauth/authorize?...',
        provider: 'google'
      }

      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: mockAuthData,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          redirectTo: 'http://localhost:3000/auth/callback'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBe(mockAuthData.url)
      expect(data.provider).toBe('google')
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
    })

    it('should initiate GitHub social login', async () => {
      const mockAuthData = {
        url: 'https://github.com/login/oauth/authorize?...',
        provider: 'github'
      }

      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: mockAuthData,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'github'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.provider).toBe('github')
    })

    it('should reject invalid providers', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'invalid-provider'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid provider')
    })

    it('should handle authentication errors', async () => {
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: { message: 'OAuth failed' }
      })

      const request = new NextRequest('http://localhost:3000/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to initialize social login')
    })
  })
})

describe('/api/auth/callback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET - Auth Callback', () => {
    it('should handle successful authentication callback', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      }

      supabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/auth/callback?code=auth-code&next=/dashboard')

      await GET(request)

      expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('auth-code')
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle authentication errors', async () => {
      supabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: null,
        error: { message: 'Invalid code' }
      })

      const request = new NextRequest('http://localhost:3000/api/auth/callback?code=invalid-code')

      await GET(request)

      expect(redirect).toHaveBeenCalledWith('/login?error=Invalid%20code')
    })

    it('should redirect to default path when no next parameter', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {}
      }

      supabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/auth/callback?code=auth-code')

      await GET(request)

      expect(redirect).toHaveBeenCalledWith('/app')
    })
  })
})
