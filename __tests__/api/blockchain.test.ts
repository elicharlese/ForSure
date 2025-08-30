import { POST } from '@/app/api/v1/blockchain/wallet/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}))

// Mock auth middleware
jest.mock('@/lib/auth-middleware', () => ({
  withAuth: (handler: any) => (request: any, context: any) =>
    handler(request, context),
}))

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: (handler: any) => (request: any, context: any) =>
    handler(request, context),
}))

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any, status: number = 200) => ({
    status,
    json: async () => data,
  }),
  apiError: (message: string, status: number) => ({
    status,
    json: async () => ({ error: message }),
  }),
  validateRequestBody: jest.fn(),
}))

// Mock crypto for wallet generation
global.crypto = {
  randomUUID: jest.fn(() => 'mock-uuid-123'),
  getRandomValues: jest.fn(arr => {
    // Fill with mock random values
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
    return arr
  }),
} as any

const { supabaseAdmin } = require('@/lib/supabase')
const { validateRequestBody } = require('@/lib/api-utils')

describe('/api/v1/blockchain/wallet', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST - Create Wallet', () => {
    it('should create a new wallet for user', async () => {
      const mockWallet = {
        id: 'wallet-123',
        user_id: 'user-123',
        name: 'My Solana Wallet',
        public_key: 'mock-public-key',
        encrypted_private_key: 'mock-encrypted-private-key',
        wallet_type: 'solana',
        is_active: true,
      }

      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { name: 'My Solana Wallet' },
      })

      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockWallet, error: null }),
      }
      supabaseAdmin.from.mockReturnValue(chain as any)

      const request = {
        json: async () => ({ name: 'My Solana Wallet' }),
      } as any

      const response = await (POST as any)(request, { user: mockUser })
      const data = await response.json()
      // Temporary debug: show response payload
      // eslint-disable-next-line no-console
      console.log('Create wallet response:', data)

      expect(response.status).toBe(200)
      expect(data.wallet).toBeDefined()
      expect(data.wallet.id).toBe(mockWallet.id)
      expect(data.wallet.name).toBeDefined()
      expect(data.wallet.publicKey).toBeDefined()
      expect(data.wallet.blockchain).toBe('solana')
    })

    it.skip('should return existing wallet if already exists', async () => {
      const existingWallet = {
        id: 'wallet-123',
        user_id: 'user-123',
        name: 'Existing Wallet',
        public_key: 'existing-public-key',
        wallet_type: 'solana',
        is_active: true,
      }
      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: existingWallet, error: null }),
      }
      supabaseAdmin.from.mockReturnValue(chain as any)

      const request = {
        json: async () => ({ name: 'My Solana Wallet' }),
      } as any

      const response = await (POST as any)(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.wallet).toBeDefined()
    })

    it('should validate required fields', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: false,
        errors: [{ path: 'name', message: 'Required' }],
      })

      const request = { json: async () => ({}) } as any

      const response = await (POST as any)(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data.error).toBe('Validation failed')
    })

    it.skip('should validate password strength', async () => {})

    it('should handle database errors', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { name: 'My Solana Wallet' },
      })

      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }
      supabaseAdmin.from.mockReturnValue(chain as any)

      const request = {
        json: async () => ({ name: 'My Solana Wallet' }),
      } as any

      const response = await (POST as any)(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create wallet')
    })
  })
})
