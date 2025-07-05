import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/v1/templates/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          limit: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [],
              error: null
            }))
          }))
        })),
        limit: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null
          }))
        })),
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      }))
    }))
  }
}))

// Mock auth middleware
jest.mock('@/lib/auth-middleware', () => ({
  withAuth: (handler: any) => handler
}))

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any) => new Response(JSON.stringify(data), { status: 200 }),
  apiError: (message: string, status: number) => new Response(JSON.stringify({ error: message }), { status }),
  validateRequestBody: jest.fn()
}))

const { supabaseAdmin } = require('@/lib/supabase')

describe('/api/v1/templates', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return public templates', async () => {
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'React Component',
          description: 'Basic React component template',
          category: 'React',
          is_public: true,
          creator_id: 'user-456'
        }
      ]

      supabaseAdmin.from().select().order.mockResolvedValue({
        data: mockTemplates,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/templates')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.templates).toEqual(mockTemplates)
    })

    it('should filter by category', async () => {
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'React Component',
          category: 'React',
          is_public: true
        }
      ]

      supabaseAdmin.from().select().eq().order.mockResolvedValue({
        data: mockTemplates,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/templates?category=React')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.templates).toEqual(mockTemplates)
    })

    it('should handle database errors', async () => {
      supabaseAdmin.from().select().order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })

      const request = new NextRequest('http://localhost:3000/api/v1/templates')
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
        content: {
          type: 'component',
          code: 'const Component = () => <div>Hello</div>'
        },
        is_public: true,
        tags: ['react', 'component']
      }

      const mockCreatedTemplate = {
        id: 'template-123',
        ...newTemplate,
        creator_id: 'user-123'
      }

      supabaseAdmin.from().insert().select().single.mockResolvedValue({
        data: mockCreatedTemplate,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toEqual(mockCreatedTemplate)
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('name')
    })
  })
})
