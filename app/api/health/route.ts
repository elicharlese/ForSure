import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()

    // Check Prisma database connectivity (SELECT 1)
    let prismaStatus: 'healthy' | 'unhealthy' = 'healthy'
    let prismaError: string | null = null
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (e) {
      prismaStatus = 'unhealthy'
      prismaError = e instanceof Error ? e.message : 'Unknown error'
    }
    const dbLatency = Date.now() - startTime

    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      jwtSecret: !!process.env.JWT_SECRET,
      databaseUrl: !!process.env.DATABASE_URL,
      directUrl: !!process.env.DIRECT_URL,
    }

    const allEnvVarsPresent = Object.values(envCheck).every(Boolean)

    // System info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    }

    // Overall health status
    const isHealthy = prismaStatus === 'healthy' && allEnvVarsPresent

    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: {
          status: prismaStatus,
          latency: `${dbLatency}ms`,
          error: prismaError,
        },
        environment: {
          status: allEnvVarsPresent ? 'healthy' : 'unhealthy',
          variables: envCheck,
        },
        system: systemInfo,
      },
    }

    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Health check error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
