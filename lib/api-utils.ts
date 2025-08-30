import { NextResponse } from 'next/server'

export function apiResponse<T>(
  data: T,
  status: number = 200,
  message?: string
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

export function apiError(message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

export function apiValidationError(errors: any) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString(),
    },
    { status: 422 }
  )
}

export async function handleApiRequest<T>(
  handler: () => Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<NextResponse> {
  try {
    const result = await handler()
    return apiResponse(result)
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof Error) {
      return apiError(error.message, 500)
    }

    return apiError(errorMessage, 500)
  }
}

export function validateRequestBody<T>(
  body: any,
  schema: any
): { success: true; data: T } | { success: false; errors: any } {
  try {
    const validatedData = schema.parse(body)
    return { success: true, data: validatedData }
  } catch (error: any) {
    return { success: false, errors: error.errors }
  }
}
