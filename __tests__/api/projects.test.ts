import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/v1/projects/route'
import { GET as getProject, PUT as putProject, DELETE as deleteProject } from '@/app/api/v1/projects/[id]/route'

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
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
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

describe('/api/v1/projects', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return user projects', async () => {
      const mockProjects = [
        {
          id: 'project-1',
          name: 'Test Project',
          description: 'Test Description',
          owner_id: 'user-123',
          status: 'active'
        }
      ]

      supabaseAdmin.from().select().order.mockResolvedValue({
        data: mockProjects,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects')
      const response = await GET(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
    })

    it('should handle database errors', async () => {
      supabaseAdmin.from().select().order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects')
      const response = await GET(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get projects')
    })
  })

  describe('POST', () => {
    it('should create a new project', async () => {
      const newProject = {
        name: 'New Project',
        description: 'New Description',
        status: 'active'
      }

      const mockCreatedProject = {
        id: 'project-123',
        ...newProject,
        owner_id: 'user-123'
      }

      supabaseAdmin.from().insert().select().single.mockResolvedValue({
        data: mockCreatedProject,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      })

      const response = await POST(request, { user: mockUser })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.project).toEqual(mockCreatedProject)
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/projects', {
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

describe('/api/v1/projects/[id]', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return project by id', async () => {
      const mockProject = {
        id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
        owner_id: 'user-123',
        status: 'active'
      }

      supabaseAdmin.from().select().eq().single.mockResolvedValue({
        data: mockProject,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects/project-1')
      const response = await getProject(request, { params: { id: 'project-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.project).toEqual(mockProject)
    })

    it('should return 404 for non-existent project', async () => {
      supabaseAdmin.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects/nonexistent')
      const response = await getProject(request, { params: { id: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Project not found')
    })
  })

  describe('PUT', () => {
    it('should update project', async () => {
      const updateData = {
        name: 'Updated Project',
        description: 'Updated Description'
      }

      const mockUpdatedProject = {
        id: 'project-1',
        ...updateData,
        owner_id: 'user-123'
      }

      supabaseAdmin.from().update().eq().select().single.mockResolvedValue({
        data: mockUpdatedProject,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects/project-1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const response = await putProject(request, { params: { id: 'project-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.project).toEqual(mockUpdatedProject)
    })
  })

  describe('DELETE', () => {
    it('should delete project', async () => {
      supabaseAdmin.from().delete().eq().single.mockResolvedValue({
        data: { id: 'project-1' },
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/v1/projects/project-1', {
        method: 'DELETE'
      })

      const response = await deleteProject(request, { params: { id: 'project-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Project deleted successfully')
    })
  })
})
