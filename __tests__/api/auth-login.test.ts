import { POST } from '@/app/api/v1/auth/login/route'

// Mock rate limiting passthrough
jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: (handler: any) => handler,
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

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock password verification
jest.mock('@/lib/password', () => ({
  verifyPassword: jest.fn(),
}))

// Mock JWT signer
jest.mock('@/lib/auth', () => ({
  signAccessToken: jest.fn(),
}))

const { prisma } = require('@/lib/prisma')
const { verifyPassword } = require('@/lib/password')
const { signAccessToken } = require('@/lib/auth')
const { validateRequestBody } = require('@/lib/api-utils')

describe('/api/v1/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should login user with valid credentials', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'user',
        name: 'Test User',
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        password_hash: 'hashed',
      }

      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'password123' },
      })

      prisma.profile.findUnique.mockResolvedValue(mockProfile)
      ;(verifyPassword as jest.Mock).mockResolvedValue(true)
      ;(signAccessToken as jest.Mock).mockReturnValue('mock-token')

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as any

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.id).toBe(mockProfile.id)
      expect(data.user.email).toBe(mockProfile.email)
      expect(data.session.access_token).toBe('mock-token')
    })

    it('should return error for invalid credentials (wrong password)', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'user',
        name: 'Test User',
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        password_hash: 'hashed',
      }

      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'wrongpassword' },
      })

      prisma.profile.findUnique.mockResolvedValue(mockProfile)
      ;(verifyPassword as jest.Mock).mockResolvedValue(false)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      } as any

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should validate email format', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: false,
        errors: [{ path: 'email', message: 'Invalid email' }],
      })

      const request = {
        json: async () => ({ email: 'invalid-email', password: 'password123' }),
      } as any

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data.error).toBe('Validation failed')
    })

    it('should require password', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: false,
        errors: [{ path: 'password', message: 'Required' }],
      })

      const request = {
        json: async () => ({ email: 'test@example.com' }),
      } as any

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data.error).toBe('Validation failed')
    })
  })
})
