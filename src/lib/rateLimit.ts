import { NextRequest, NextResponse } from 'next/server'

/**
 * Rate Limiting for API Routes
 *
 * Simple in-memory rate limiter using Map.
 * For production with multiple serverless instances, consider using:
 * - Vercel Edge Config
 * - Upstash Redis
 * - Supabase with TTL
 */

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number

  /**
   * Time window in seconds
   */
  windowSeconds: number

  /**
   * Custom identifier function (defaults to IP address)
   */
  identifier?: (req: NextRequest) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (will reset on serverless function cold start)
const store = new Map<string, RateLimitEntry>()

/**
 * Get client identifier (IP address or custom identifier)
 */
function getClientIdentifier(req: NextRequest, customIdentifier?: (req: NextRequest) => string): string {
  if (customIdentifier) {
    return customIdentifier(req)
  }

  // Try to get real IP from headers (works with proxies/CDN)
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to connection IP (may not work in serverless)
  return req.ip || 'unknown'
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or error response if rate limited
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig
): { limited: boolean; remaining: number; reset: number } {
  const identifier = getClientIdentifier(req, config.identifier)
  const key = `${req.nextUrl.pathname}:${identifier}`
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  // Get or create entry
  let entry = store.get(key)

  // Clean up expired entries periodically (1% chance per request)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  // Reset if window has passed
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    store.set(key, entry)

    return {
      limited: false,
      remaining: config.maxRequests - 1,
      reset: entry.resetTime,
    }
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Create rate limit response with proper headers
 */
export function createRateLimitResponse(
  remaining: number,
  reset: number,
  limited: boolean = false
): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000)

  if (limited) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      { status: 429 }
    )

    response.headers.set('Retry-After', retryAfter.toString())
    response.headers.set('X-RateLimit-Limit', '0')
    response.headers.set('X-RateLimit-Remaining', '0')
    response.headers.set('X-RateLimit-Reset', reset.toString())

    return response
  }

  // Not rate limited, but add headers for client info
  const response = NextResponse.json({ success: true })
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())

  return response
}

/**
 * Wrapper for API route handlers with rate limiting
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { limited, remaining, reset } = checkRateLimit(req, config)

    if (limited) {
      return createRateLimitResponse(remaining, reset, true)
    }

    // Add rate limit headers to response
    const response = await handler(req)
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())

    return response
  }
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries() {
  const now = Date.now()
  const keysToDelete: string[] = []

  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  }

  for (const key of keysToDelete) {
    store.delete(key)
  }
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
  /**
   * Strict limit for auth endpoints (login, signup, password reset)
   * 10 requests per 15 minutes
   */
  AUTH: {
    maxRequests: 10,
    windowSeconds: 15 * 60,
  },

  /**
   * Moderate limit for email endpoints
   * 20 requests per hour
   */
  EMAIL: {
    maxRequests: 20,
    windowSeconds: 60 * 60,
  },

  /**
   * Standard limit for general API endpoints
   * 100 requests per minute
   */
  STANDARD: {
    maxRequests: 100,
    windowSeconds: 60,
  },

  /**
   * Generous limit for read-only endpoints
   * 300 requests per minute
   */
  READONLY: {
    maxRequests: 300,
    windowSeconds: 60,
  },
} as const
