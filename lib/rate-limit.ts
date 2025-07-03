import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
}

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const now = Date.now()
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous'
    const key = `rate_limit:${ip}`

    // Clean up expired entries
    for (const [k, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(k)
      }
    }

    const entry = store.get(key)

    if (!entry) {
      // First request from this IP
      store.set(key, {
        count: 1,
        resetTime: now + finalConfig.windowMs,
      })
      return null // Allow request
    }

    if (now > entry.resetTime) {
      // Window has expired, reset
      store.set(key, {
        count: 1,
        resetTime: now + finalConfig.windowMs,
      })
      return null // Allow request
    }

    if (entry.count >= finalConfig.maxRequests) {
      // Rate limit exceeded
      const remainingTime = Math.ceil((entry.resetTime - now) / 1000)
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${remainingTime} seconds.`,
          retryAfter: remainingTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': remainingTime.toString(),
            'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      )
    }

    // Increment counter
    entry.count++
    store.set(key, entry)

    return null // Allow request
  }
}

export function withRateLimit(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  config?: Partial<RateLimitConfig>
) {
  const rateLimiter = createRateLimiter(config)

  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const rateLimitResponse = await rateLimiter(request)
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    return handler(request, ...args)
  }
}

// Predefined rate limiters for different use cases
export const authRateLimit = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes for auth endpoints
})

export const apiRateLimit = createRateLimiter({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 100 requests per 15 minutes for general API
})

export const uploadRateLimit = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 10 uploads per hour
})
