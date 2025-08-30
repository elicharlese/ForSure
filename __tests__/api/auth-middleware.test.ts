// Note: Use plain request-like objects; avoid importing NextRequest in tests
import { authMiddleware } from '@/lib/auth-middleware'

// Mock JWT verification helpers
jest.mock('@/lib/auth', () => ({
  getBearerToken: jest.requireActual('@/lib/auth').getBearerToken,
  verifyAccessToken: jest.fn(),
}))

const { verifyAccessToken } = require('@/lib/auth')

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('authMiddleware', () => {
    it('should return error for missing authorization header', async () => {
      const request = { headers: { get: () => null } } as any

      const result = await authMiddleware(request)

      expect(result.error).toBe('Missing or invalid authorization header')
      expect(result.status).toBe(401)
    })

    it('should return error for invalid authorization header format', async () => {
      const request = {
        headers: { get: () => 'InvalidFormat token123' },
      } as any

      const result = await authMiddleware(request)

      expect(result.error).toBe('Missing or invalid authorization header')
      expect(result.status).toBe(401)
    })

    it('should return error for invalid token', async () => {
      ;(verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('jwt malformed')
      })

      const request = {
        headers: {
          get: (k: string) =>
            k === 'authorization' ? 'Bearer invalid-token' : null,
        },
      } as any

      const result = await authMiddleware(request)

      expect(result.error).toBe('Invalid or expired token')
      expect(result.status).toBe(401)
    })

    it('should return user for valid token', async () => {
      ;(verifyAccessToken as jest.Mock).mockReturnValue({
        sub: 'user-123',
        email: 'test@example.com',
      })

      const request = {
        headers: {
          get: (k: string) =>
            k === 'authorization' ? 'Bearer valid-token' : null,
        },
      } as any

      const result = await authMiddleware(request)

      expect(result.user).toEqual({ id: 'user-123', email: 'test@example.com' })
      expect(result.error).toBeNull()
    })

    it('should treat unexpected errors as invalid token', async () => {
      ;(verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected')
      })

      const request = {
        headers: {
          get: (k: string) =>
            k === 'authorization' ? 'Bearer valid-token' : null,
        },
      } as any

      const result = await authMiddleware(request)

      expect(result.error).toBe('Invalid or expired token')
      expect(result.status).toBe(401)
    })
  })
})
