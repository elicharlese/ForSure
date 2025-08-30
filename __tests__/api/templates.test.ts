import { GET, POST } from '@/app/api/v1/templates/route'

// Mock Prisma for GET endpoints
jest.mock('@/lib/prisma', () => ({
  prisma: {
    template: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

// Mock auth middleware
jest.mock('@/lib/auth-middleware', () => ({
  withAuth: (handler: any) => handler,
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

const { prisma } = require('@/lib/prisma')
const { supabase } = require('@/lib/supabase')
const { validateRequestBody } = require('@/lib/api-utils')

describe('/api/v1/templates', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return public templates', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { page: 1, limit: 10, order: 'desc' },
      })

      const now = new Date()
      const prismaRows = [
        {
          id: 'template-1',
          name: 'React Component',
          description: 'Basic React component template',
          category: 'React',
          content: { type: 'component', code: '<div />' },
          preview_image_url: null,
          is_public: true,
          download_count: 5,
          creator_id: 'user-456',
          tags: ['react'],
          version: '1.0.0',
          created_at: now,
          updated_at: now,
          creator: { name: 'Alice', avatar_url: 'http://img' },
        },
      ]

      prisma.template.count.mockResolvedValue(1)
      prisma.template.findMany.mockResolvedValue(prismaRows)

      const request = { url: 'http://localhost:3000/api/v1/templates' } as any
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.templates).toEqual([
        {
          id: 'template-1',
          name: 'React Component',
          description: 'Basic React component template',
          category: 'React',
          content: { type: 'component', code: '<div />' },
          preview_image_url: null,
          is_public: true,
          downloads: 5,
          author_id: 'user-456',
          tags: ['react'],
          version: '1.0.0',
          created_at: now,
          updated_at: now,
          profiles: { name: 'Alice', avatar_url: 'http://img' },
        },
      ])
    })

    it('should filter by category', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { page: 1, limit: 10, order: 'desc' },
      })

      const now = new Date()
      prisma.template.count.mockResolvedValue(1)
      prisma.template.findMany.mockResolvedValue([
        {
          id: 'template-1',
          name: 'React Component',
          description: null,
          category: 'React',
          content: {},
          preview_image_url: null,
          is_public: true,
          download_count: 0,
          creator_id: 'user-456',
          tags: [],
          version: '1.0.0',
          created_at: now,
          updated_at: now,
          creator: null,
        },
      ])

      const request = {
        url: 'http://localhost:3000/api/v1/templates?category=React',
      } as any
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.templates).toEqual([
        {
          id: 'template-1',
          name: 'React Component',
          description: null,
          category: 'React',
          content: {},
          preview_image_url: null,
          is_public: true,
          downloads: 0,
          author_id: 'user-456',
          tags: [],
          version: '1.0.0',
          created_at: now,
          updated_at: now,
          profiles: null,
        },
      ])
    })

    it('should handle database errors', async () => {
      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: { page: 1, limit: 10, order: 'desc' },
      })

      prisma.template.count.mockResolvedValue(0)
      prisma.template.findMany.mockRejectedValue(new Error('Database error'))

      const request = { url: 'http://localhost:3000/api/v1/templates' } as any
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get templates')
    })
  })

  describe('POST', () => {
    it('should create a new template', async () => {
      const newTemplate = {
        name: 'New Template',
        description: 'New Template Description',
        category: 'React',
        code: '<div>Hello</div>',
        featured: false,
      }

      ;(validateRequestBody as jest.Mock).mockReturnValue({
        success: true,
        data: newTemplate,
      })

      const mockCreatedTemplate = {
        id: 'template-123',
        ...newTemplate,
        author_id: 'user-123',
        downloads: 0,
        profiles: { name: 'Test User', avatar_url: null },
      }

      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: mockCreatedTemplate, error: null }),
      }
      supabase.from.mockReturnValue(chain)

      const request = { json: async () => newTemplate } as any

      const response = await (POST as any)(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockCreatedTemplate)
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
  })
})
