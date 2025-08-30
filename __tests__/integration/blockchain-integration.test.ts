// Node tests: avoid '@testing-library/jest-dom' and NextRequest; use plain objects
import { POST, GET, PUT } from '@/app/api/v1/blockchain/wallet/route'

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  JWT_SECRET: 'test-jwt-secret',
}

// Mock modules
jest.mock('@/lib/supabase', () => {
  const tableOps: any = {}
  tableOps.select = jest.fn(() => tableOps)
  tableOps.insert = jest.fn(() => tableOps)
  tableOps.update = jest.fn(() => tableOps)
  tableOps.eq = jest.fn(() => tableOps)
  tableOps.single = jest.fn()
  const supabaseAdmin = {
    from: jest.fn(() => tableOps),
  }
  return { supabaseAdmin }
})

jest.mock('@/lib/auth-middleware', () => ({
  withAuth: (handler: any) => (request: any, context: any) =>
    handler(request, { user: mockUser }),
}))

jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: (handler: any) => (request: any, context: any) =>
    handler(request, context),
}))

jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any, status: number = 200) => ({
    status,
    json: async () => data,
  }),
  apiError: (message: string, status: number) => ({
    status,
    json: async () => ({ error: message }),
  }),
  // Default: accept body as-is; individual tests can override with mockReturnValueOnce
  validateRequestBody: jest.fn((body: any) => ({ success: true, data: body })),
}))

// Access the supabaseAdmin mock instance
const { supabaseAdmin: mockSupabaseAdmin } = require('@/lib/supabase')

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
}

describe('Blockchain Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.entries(mockEnv).forEach(([key, value]) => {
      process.env[key] = value
    })
  })

  describe('Wallet Management Flow', () => {
    it('should create wallet, check balance, and perform transfer', async () => {
      // Step 1: Create wallet
      const mockWallet = {
        id: 'wallet-123',
        user_id: 'user-123',
        name: 'Test Wallet',
        public_key: 'test-public-key',
        balance: 0,
        blockchain: 'solana',
      }

      // Mock successful wallet creation (insert().select().single())
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: mockWallet,
        error: null,
      })

      const createRequest = {
        json: async () => ({ name: 'Test Wallet' }),
      } as any

      const createResponse = await POST(createRequest)
      const createData = await createResponse.json()

      expect(createResponse.status).toBe(200)
      expect(createData.wallet.name).toBe('Test Wallet')

      // Step 2: Check wallet balance
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: { ...mockWallet, balance: 10.5 },
        error: null,
      })

      // No need to mock return; we only assert call args for update

      const balanceRequest = {
        url: 'http://localhost:3000/api/v1/blockchain/wallet?walletId=wallet-123',
      } as any

      const balanceResponse = await GET(balanceRequest)
      const balanceData = await balanceResponse.json()

      expect(balanceResponse.status).toBe(200)
      expect(balanceData.publicKey).toBe('test-public-key')

      // Step 3: Perform transfer
      const { validateRequestBody } = require('@/lib/api-utils')
      validateRequestBody.mockReturnValue({
        success: true,
        data: {
          fromWallet: 'wallet-123',
          toAddress: 'recipient-address',
          amount: 5.0,
        },
      })

      // Mock wallet with sufficient balance
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: { ...mockWallet, balance: 10.5 },
        error: null,
      })

      // Mock transaction logging
      mockSupabaseAdmin.from().insert.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      // No need to mock update return

      const transferRequest = {
        json: async () => ({
          fromWallet: 'wallet-123',
          toAddress: 'recipient-address',
          amount: 5.0,
        }),
      } as any

      const transferResponse = await PUT(transferRequest)
      const transferData = await transferResponse.json()

      expect(transferResponse.status).toBe(200)
      expect(transferData.amount).toBe(5.0)
      expect(transferData.status).toBe('confirmed')
      expect(transferData.blockchain).toBe('solana')
    })

    it('should handle insufficient balance error', async () => {
      const { validateRequestBody } = require('@/lib/api-utils')
      validateRequestBody.mockReturnValue({
        success: true,
        data: {
          fromWallet: 'wallet-123',
          toAddress: 'recipient-address',
          amount: 15.0,
        },
      })

      // Mock wallet with insufficient balance
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: {
          id: 'wallet-123',
          user_id: 'user-123',
          balance: 5.0,
        },
        error: null,
      })

      const transferRequest = {
        json: async () => ({
          fromWallet: 'wallet-123',
          toAddress: 'recipient-address',
          amount: 15.0,
        }),
      } as any

      const transferResponse = await PUT(transferRequest)
      const transferData = await transferResponse.json()

      expect(transferResponse.status).toBe(400)
      expect(transferData.error).toBe('Insufficient balance')
    })

    it('should handle wallet not found error', async () => {
      const { validateRequestBody } = require('@/lib/api-utils')
      validateRequestBody.mockReturnValue({
        success: true,
        data: {
          fromWallet: 'nonexistent-wallet',
          toAddress: 'recipient-address',
          amount: 5.0,
        },
      })

      // Mock wallet not found
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Wallet not found' },
      })

      const transferRequest = {
        json: async () => ({
          fromWallet: 'nonexistent-wallet',
          toAddress: 'recipient-address',
          amount: 5.0,
        }),
      } as any

      const transferResponse = await PUT(transferRequest)
      const transferData = await transferResponse.json()

      expect(transferResponse.status).toBe(404)
      expect(transferData.error).toBe('Wallet not found')
    })
  })

  describe('Blockchain Data Consistency', () => {
    it('should maintain transaction history integrity', async () => {
      // Test that transactions are properly logged
      const { validateRequestBody } = require('@/lib/api-utils')
      validateRequestBody.mockReturnValue({
        success: true,
        data: {
          fromWallet: 'wallet-123',
          toAddress: 'recipient-address',
          amount: 2.5,
        },
      })

      // Mock wallet
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: {
          id: 'wallet-123',
          user_id: 'user-123',
          balance: 10.0,
          public_key: 'test-public-key',
        },
        error: null,
      })

      // Mock transaction logging
      mockSupabaseAdmin.from().insert.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      // No need to mock update return

      const transferRequest = {
        json: async () => ({
          fromWallet: 'wallet-123',
          toAddress: 'recipient-address',
          amount: 2.5,
        }),
      } as any

      await PUT(transferRequest)

      // Verify transaction was logged
      expect(mockSupabaseAdmin.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          wallet_id: 'wallet-123',
          from_address: 'test-public-key',
          to_address: 'recipient-address',
          amount: 2.5,
          type: 'transfer',
          status: 'confirmed',
          blockchain: 'solana',
        })
      )

      // Verify balance was updated
      expect(mockSupabaseAdmin.from().update).toHaveBeenCalledWith({
        balance: 7.5,
        updated_at: expect.any(String),
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error during wallet creation (insert().select().single())
      mockSupabaseAdmin.from().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database connection failed' },
      })

      const createRequest = {
        json: async () => ({ name: 'Test Wallet' }),
      } as any

      const createResponse = await POST(createRequest)
      const createData = await createResponse.json()

      expect(createResponse.status).toBe(500)
      expect(createData.error).toBe('Failed to create wallet')
    })

    it('should handle missing wallet ID in balance check', async () => {
      const balanceRequest = {
        url: 'http://localhost:3000/api/v1/blockchain/wallet',
      } as any

      const balanceResponse = await GET(balanceRequest)
      const balanceData = await balanceResponse.json()

      expect(balanceResponse.status).toBe(400)
      expect(balanceData.error).toBe('Wallet ID is required')
    })
  })
})
