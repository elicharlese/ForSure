import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  avatar_url: z.string().url('Invalid URL').optional(),
})

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  status: z.enum(['active', 'completed', 'archived']).optional(),
})

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long').optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  collaborators: z.array(z.string().uuid()).optional(),
})

// Blog schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long'),
  tags: z.array(z.string()).optional(),
  featured_image: z.string().url('Invalid URL').optional(),
  published: z.boolean().optional(),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

// Career schemas
export const createCareerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  department: z.string().min(1, 'Department is required'),
  salary_range: z.string().optional(),
  active: z.boolean().optional(),
})

export const updateCareerSchema = createCareerSchema.partial()

// Template schemas
export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  code: z.string().min(1, 'Code is required'),
  featured: z.boolean().optional(),
})

export const updateTemplateSchema = createTemplateSchema.partial()

// File upload schema
export const fileUploadSchema = z.object({
  file: z.any(), // Will be validated in the handler
  bucket: z.string().optional(),
  folder: z.string().optional(),
})

// Query schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
})
