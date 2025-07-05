import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/v1/blockchain/wallet/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }
}))

// Mock auth middleware
jest.mock('@/lib/auth-middleware', () => ({
  withAuth: (handler: any) => (request: any, context: any) => handler(request, context)
}))

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: (handler: any) => (request: any, context: any) => handler(request, context)
}))

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any) => new Response(JSON.stringify(data), { status: 200 }),
  apiError: (message: string, status: number) => new Response(JSON.stringify({ error: message }), { status }),
  validateRequestBody: jest.fn()
}))

// Mock crypto for wallet generation
global.crypto = {
  randomUUID: jest.fn(() => 'mock-uuid-123'),
  getRandomValues: jest.fn((arr) => {
    // Fill with mock random values
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
    return arr
  })
} as any

const { supabaseAdmin } = require('@/lib/supabase')

describe('/api/v1/blockchain/wallet', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST - Create Wallet', () => {
    it('should create a new wallet for user', async () => {
      const mockWallet = {
        id: 'wallet-123',
        user_id: 'user-123',
        public_key: 'mock-public-key',
        encrypted_private_key: 'mock-encrypted-private-key',
        wallet_type: 'solana',
        is_active: true
      }

      supabaseAdmin.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'No wallet found' }
      })

      supabaseAdmin.from().insert().select().single.mockResolvedValue({
        data: mockWallet,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/blockchain/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'My Solana Wallet'
        })
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.wallet).toEqual(mockWallet)
      expect(data.message).toBe('Wallet created successfully')
    })

    it('should return existing wallet if already exists', async () => {
      const existingWallet = {
        id: 'wallet-123',
        user_id: 'user-123',
        public_key: 'existing-public-key',
        wallet_type: 'solana',
        is_active: true
      }

      supabaseAdmin.from().select().eq().single.mockResolvedValue({
        data: existingWallet,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/blockchain/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'solana',
          password: 'secure-password-123'
        })
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.wallet).toEqual(existingWallet)
      expect(data.message).toBe('Wallet already exists')
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/blockchain/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('walletType')
    })

    it('should validate password strength', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/blockchain/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'solana',
          password: '123'
        })
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('password')
    })

    it('should handle database errors', async () => {
      supabaseAdmin.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'No wallet found' }
      })

      supabaseAdmin.from().insert().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })

      const request = new NextRequest('http://localhost:3000/api/v1/blockchain/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'solana',
          password: 'secure-password-123'
        })
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create wallet')
    })
  })
})
