import { GET, POST } from '@/app/api/v1/projects/route'
import {
  GET as getProject,
  PUT as putProject,
  DELETE as deleteProject,
} from '@/app/api/v1/projects/[id]/route'

// Use default Supabase mock from jest.setup.js

// Mock auth middleware
jest.mock('@/lib/auth-middleware', () => {
  const defaultUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }
  const authMiddleware = jest
    .fn()
    .mockResolvedValue({ user: defaultUser, error: null })
  const withAuth = (handler: any) => async (request: any) =>
    handler(request, { user: defaultUser })
  return { withAuth, authMiddleware }
})

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiResponse: (data: any, status: number = 200) => ({
    status,
    json: async () => data,
  }),
  apiError: (message: string, status: number, details?: any) => ({
    status,
    json: async () => ({ error: message, details }),
  }),
  validateRequestBody: (body: any, schema: any) => {
    try {
      const validatedData = schema.parse(body)
      return { success: true, data: validatedData }
    } catch (error: any) {
      return { success: false, errors: error.errors }
    }
  },
}))

const { supabase } = require('@/lib/supabase')
const { authMiddleware } = require('@/lib/auth-middleware')

describe('/api/v1/projects', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(authMiddleware as jest.Mock).mockResolvedValue({
      user: mockUser,
      error: null,
    })
  })

  describe('GET', () => {
    it('should return user projects', async () => {
      const mockProjects = [
        {
          id: 'project-1',
          title: 'Test Project',
          description: 'Test Description',
          owner_id: 'user-123',
          status: 'active',
        },
      ]

      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: mockProjects,
          error: null,
          count: mockProjects.length,
        }),
      })

      const request = { url: 'http://localhost:3000/api/v1/projects' } as any
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
    })

    it('should handle database errors', async () => {
      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
          count: null,
        }),
      })

      const request = { url: 'http://localhost:3000/api/v1/projects' } as any
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch projects')
    })
  })

  describe('POST', () => {
    it('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'New Description',
        status: 'active',
      }

      const mockCreatedProject = {
        id: 'project-123',
        ...newProject,
        owner_id: 'user-123',
      }

      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreatedProject,
          error: null,
        }),
      })

      const request = {
        json: async () => newProject,
      } as any

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockCreatedProject)
    })

    it('should validate required fields', async () => {
      const request = {
        json: async () => ({}),
      } as any

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data.error).toBe('Validation failed')
    })
  })
})

describe('/api/v1/projects/[id]', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(authMiddleware as jest.Mock).mockResolvedValue({
      user: mockUser,
      error: null,
    })
  })

  describe('GET', () => {
    it('should return project by id', async () => {
      const mockProject = {
        id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
        owner_id: 'user-123',
        status: 'active',
      }

      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProject,
          error: null,
        }),
      })

      const request = {} as any
      const response = await getProject(request, {
        params: { id: 'project-1' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProject)
    })

    it('should return 404 for non-existent project', async () => {
      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      })

      const request = {} as any
      const response = await getProject(request, {
        params: { id: 'nonexistent' },
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Project not found')
    })
  })

  describe('PUT', () => {
    it('should update project', async () => {
      const updateData = {
        title: 'Updated Project',
        description: 'Updated Description',
      }

      const mockUpdatedProject = {
        id: 'project-1',
        ...updateData,
        owner_id: 'user-123',
      }

      // Owner check
      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { owner_id: 'user-123' },
          error: null,
        }),
      })

      // Update
      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUpdatedProject,
          error: null,
        }),
      })

      const request = {
        json: async () => updateData,
      } as any

      const response = await putProject(request, {
        params: { id: 'project-1' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdatedProject)
    })
  })

  describe('DELETE', () => {
    it('should delete project', async () => {
      // Owner check
      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { owner_id: 'user-123' },
          error: null,
        }),
      })

      // Delete
      ;(supabase.from as jest.Mock).mockReturnValueOnce({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      const request = {} as any

      const response = await deleteProject(request, {
        params: { id: 'project-1' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Project deleted successfully')
    })
  })
})
