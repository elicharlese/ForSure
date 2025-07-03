import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    version: 'v1',
    name: 'ForSure API',
    description: 'ForSure application backend API',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users', 
      projects: '/api/v1/projects',
      blog: '/api/v1/blog',
      careers: '/api/v1/careers',
      templates: '/api/v1/templates',
      upload: '/api/v1/upload'
    },
    status: 'active',
    timestamp: new Date().toISOString()
  })
}
