interface LogLevel {
  INFO: 'info'
  WARN: 'warn'
  ERROR: 'error'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug',
}

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  metadata?: Record<string, any>
  userId?: string
  requestId?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private serviceName = 'forsure-api'

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, metadata, userId, requestId } = entry

    const meta = {
      service: this.serviceName,
      ...(userId && { userId }),
      ...(requestId && { requestId }),
      ...(metadata && { metadata }),
    }

    return JSON.stringify({
      level,
      message,
      timestamp,
      ...meta,
    })
  }

  private log(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    requestId?: string
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId,
      requestId,
    }

    const formattedMessage = this.formatMessage(entry)

    if (this.isDevelopment) {
      // Pretty print in development
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
        metadata ? metadata : ''
      )
    } else {
      // Structured logging in production
      console.log(formattedMessage)
    }

    // Send to external monitoring service in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToMonitoring(entry)
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // Send to Sentry, LogRocket, or other monitoring service
      if (process.env.SENTRY_DSN) {
        // TODO: Implement Sentry integration
      }
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error)
    }
  }

  info(
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    requestId?: string
  ) {
    this.log(LOG_LEVELS.INFO, message, metadata, userId, requestId)
  }

  warn(
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    requestId?: string
  ) {
    this.log(LOG_LEVELS.WARN, message, metadata, userId, requestId)
  }

  error(
    message: string,
    error?: Error,
    metadata?: Record<string, any>,
    userId?: string,
    requestId?: string
  ) {
    const errorMetadata = {
      ...metadata,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    }
    this.log(LOG_LEVELS.ERROR, message, errorMetadata, userId, requestId)
  }

  debug(
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    requestId?: string
  ) {
    if (this.isDevelopment || process.env.LOG_LEVEL === 'debug') {
      this.log(LOG_LEVELS.DEBUG, message, metadata, userId, requestId)
    }
  }

  // API request logging
  apiRequest(
    method: string,
    path: string,
    userId?: string,
    requestId?: string,
    metadata?: Record<string, any>
  ) {
    this.info(
      `${method} ${path}`,
      {
        type: 'api_request',
        method,
        path,
        ...metadata,
      },
      userId,
      requestId
    )
  }

  apiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string,
    requestId?: string
  ) {
    this.info(
      `${method} ${path} - ${statusCode} (${duration}ms)`,
      {
        type: 'api_response',
        method,
        path,
        statusCode,
        duration,
      },
      userId,
      requestId
    )
  }

  apiError(
    method: string,
    path: string,
    error: Error,
    userId?: string,
    requestId?: string
  ) {
    this.error(
      `${method} ${path} - Error`,
      error,
      {
        type: 'api_error',
        method,
        path,
      },
      userId,
      requestId
    )
  }

  // Database logging
  dbQuery(
    query: string,
    duration: number,
    userId?: string,
    requestId?: string
  ) {
    this.debug(
      'Database query executed',
      {
        type: 'db_query',
        query: query.substring(0, 200), // Truncate long queries
        duration,
      },
      userId,
      requestId
    )
  }

  dbError(query: string, error: Error, userId?: string, requestId?: string) {
    this.error(
      'Database query failed',
      error,
      {
        type: 'db_error',
        query: query.substring(0, 200),
      },
      userId,
      requestId
    )
  }

  // Auth logging
  authSuccess(userId: string, method: string, requestId?: string) {
    this.info(
      `Authentication successful: ${method}`,
      {
        type: 'auth_success',
        method,
      },
      userId,
      requestId
    )
  }

  authFailure(
    reason: string,
    method: string,
    requestId?: string,
    metadata?: Record<string, any>
  ) {
    this.warn(
      `Authentication failed: ${method} - ${reason}`,
      {
        type: 'auth_failure',
        method,
        reason,
        ...metadata,
      },
      undefined,
      requestId
    )
  }
}

// Export singleton instance
export const logger = new Logger()

// Express-like middleware for request logging
export function requestLogger() {
  return (handler: Function) => {
    return async (request: Request, ...args: any[]) => {
      const requestId = crypto.randomUUID()
      const start = Date.now()
      const method = request.method
      const url = new URL(request.url)
      const path = url.pathname

      logger.apiRequest(method, path, undefined, requestId)

      try {
        const response = await handler(request, ...args)
        const duration = Date.now() - start
        const status = response.status || 200

        logger.apiResponse(method, path, status, duration, undefined, requestId)

        return response
      } catch (error) {
        const duration = Date.now() - start
        logger.apiError(method, path, error as Error, undefined, requestId)
        throw error
      }
    }
  }
}
