import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://forsure.vercel.app',
  'https://www.forsure.app',
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL
].filter(Boolean)

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin)

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin || '*' : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin || '*' : 'null',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
  }
}

export function withCors(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return corsMiddleware(request)
    }

    // Execute handler
    const response = await handler(request)
    
    // Add CORS headers to response
    const corsHeaders = corsMiddleware(request).headers
    if (corsHeaders) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }

    return response
  }
}
