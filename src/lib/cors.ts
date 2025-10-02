import { NextRequest, NextResponse } from 'next/server'

/**
 * CORS configuration for API routes
 * Allows requests from production and local development origins
 */

const ALLOWED_ORIGINS = [
  'https://jobwall.co.uk',
  'https://www.jobwall.co.uk',
  'http://localhost:3000',
  'http://localhost:3001', // Alternative port if 3000 is busy
]

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin)
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    )
  }
  return response
}

/**
 * Handle CORS preflight (OPTIONS) requests
 */
export function handleCorsPreflightRequest(req: NextRequest): NextResponse {
  const origin = req.headers.get('origin')
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, origin)
}

/**
 * Wrapper for API route handlers that adds CORS support
 */
export function withCors(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const origin = req.headers.get('origin')

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return handleCorsPreflightRequest(req)
    }

    // Handle actual request
    const response = await handler(req)
    return addCorsHeaders(response, origin)
  }
}
