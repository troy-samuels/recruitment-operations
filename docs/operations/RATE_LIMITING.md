# Rate Limiting Configuration

This document describes the rate limiting implementation for API endpoints in the Jobwall application.

## Overview

Rate limiting is implemented using an in-memory store with IP-based tracking. Each request includes rate limit headers to inform clients about their current usage.

## Implementation

**Location**: `src/lib/rateLimit.ts`

**Strategy**:
- IP-based tracking (uses `x-forwarded-for` header for real IP behind proxies)
- Sliding window rate limiting
- In-memory store (resets on serverless function cold start)
- Automatic cleanup of expired entries

**Response Headers**:
All rate-limited endpoints include these headers:
```
X-RateLimit-Remaining: <number>  # Requests remaining in current window
X-RateLimit-Reset: <timestamp>    # Unix timestamp when limit resets
Retry-After: <seconds>            # Seconds to wait (only on 429 responses)
```

## Rate Limit Configurations

### 1. EMAIL (Strict)
**Limit**: 20 requests per hour per IP
**Use**: Email sending endpoints
**Reason**: Prevent spam and abuse of email service

**Endpoints**:
- `POST /api/email/send` - Send custom emails
- `POST /api/email/test` - Test email integration

**429 Response Example**:
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in 1234 seconds.",
  "retryAfter": 1234
}
```

### 2. STANDARD (Moderate)
**Limit**: 100 requests per minute per IP
**Use**: General API endpoints
**Reason**: Balance between protection and usability

**Endpoints**:
- `POST /api/leads` - Lead capture

### 3. AUTH (Very Strict)
**Limit**: 10 requests per 15 minutes per IP
**Use**: Authentication endpoints
**Reason**: Prevent brute force attacks
**Status**: Available but not yet implemented (Supabase handles auth)

### 4. READONLY (Generous)
**Limit**: 300 requests per minute per IP
**Use**: Read-only endpoints
**Reason**: Low risk, high usability
**Status**: Available but not yet implemented

## Endpoints by Rate Limit Status

### ✅ Rate Limited (Implemented)
1. `POST /api/email/send` - EMAIL limit (20/hour)
2. `POST /api/email/test` - EMAIL limit (20/hour)
3. `POST /api/leads` - STANDARD limit (100/minute)

### 🔜 Recommended for Rate Limiting
4. `POST /api/team/invite` - STANDARD limit
5. `POST /api/stripe/checkout` - STANDARD limit
6. `POST /api/provision` - STANDARD limit
7. `POST /api/analytics/refresh` - STANDARD limit
8. `GET /api/analytics/*` - READONLY limit
9. `GET /api/billing/status` - READONLY limit
10. `GET /api/stripe/pricing` - READONLY limit

### ⏭️ No Rate Limiting Needed
- `POST /api/stripe/webhook` - Protected by Stripe webhook signature
- `POST /api/cron/refresh-analytics` - Protected by CRON_SECRET + x-vercel-cron header
- Internal/protected routes handled by middleware

## Usage Example

### Basic Implementation
```typescript
import { checkRateLimit, createRateLimitResponse, RateLimits } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Check rate limit
  const { limited, remaining, reset } = checkRateLimit(req, RateLimits.EMAIL)

  // Return 429 if limited
  if (limited) {
    return createRateLimitResponse(remaining, reset, true)
  }

  // Process request...
  const response = NextResponse.json({ ok: true })

  // Add rate limit headers
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())

  return response
}
```

### Custom Rate Limit
```typescript
const customLimit = {
  maxRequests: 50,
  windowSeconds: 300, // 5 minutes
}

const { limited, remaining, reset } = checkRateLimit(req, customLimit)
```

### Custom Identifier
```typescript
const customLimit = {
  maxRequests: 100,
  windowSeconds: 60,
  identifier: (req) => {
    // Use user ID instead of IP
    return req.headers.get('x-user-id') || 'anonymous'
  }
}
```

## Client-Side Handling

### Reading Headers
```typescript
const response = await fetch('/api/email/send', {
  method: 'POST',
  body: JSON.stringify({ ... })
})

const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0')
const reset = parseInt(response.headers.get('X-RateLimit-Reset') || '0')

if (response.status === 429) {
  const retryAfter = parseInt(response.headers.get('Retry-After') || '0')
  console.log(`Rate limited. Retry in ${retryAfter} seconds`)
}
```

### Proactive Checking
```typescript
function checkRateLimitBeforeRequest(remaining: number): boolean {
  if (remaining < 5) {
    console.warn('Approaching rate limit')
    return false
  }
  return true
}
```

## Production Considerations

### Current Implementation
- ✅ Works correctly for single serverless instance
- ✅ Simple, no external dependencies
- ✅ Fast, in-memory lookups
- ⚠️ Resets on cold start
- ⚠️ Not synchronized across multiple instances

### Upgrade Path for High Traffic
If rate limit inconsistencies become an issue (multiple serverless instances), consider:

1. **Vercel Edge Config** (Recommended for Vercel):
   ```bash
   npm install @vercel/edge-config
   ```
   - Fast, globally distributed
   - TTL support for automatic cleanup
   - ~10ms read latency

2. **Upstash Redis** (Best for accuracy):
   ```bash
   npm install @upstash/redis
   ```
   - Serverless Redis
   - Consistent across all instances
   - ~50ms latency

3. **Supabase with TTL**:
   - Use existing Supabase connection
   - Create rate_limits table with TTL
   - No additional service needed

### Example: Upstash Redis Implementation
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export async function checkRateLimitRedis(key: string, limit: number, window: number) {
  const current = await redis.incr(key)

  if (current === 1) {
    await redis.expire(key, window)
  }

  const ttl = await redis.ttl(key)

  return {
    limited: current > limit,
    remaining: Math.max(0, limit - current),
    reset: Date.now() + (ttl * 1000),
  }
}
```

## Monitoring

### Rate Limit Metrics to Track
1. **429 Response Rate**: Should be < 1% of total requests
2. **Top Rate Limited IPs**: Identify potential abuse
3. **Endpoint-Specific Limits**: Adjust limits based on usage patterns
4. **Time to Rate Limit**: How long until users hit limits

### Vercel Analytics
Rate limit responses (429) are automatically tracked in Vercel Analytics dashboard.

### Custom Logging
```typescript
if (limited) {
  console.warn('[RateLimit]', {
    path: req.nextUrl.pathname,
    ip: getClientIdentifier(req),
    timestamp: new Date().toISOString(),
  })
}
```

## Testing

### Test Rate Limiting Locally
```bash
# Test email endpoint (20 requests per hour limit)
for i in {1..25}; do
  curl -X POST http://localhost:3000/api/email/test \
    -H "Content-Type: application/json" \
    -d '{"to":"test@example.com"}' \
    -i | grep -E "HTTP|X-RateLimit"
  echo "Request $i"
done

# Should see 429 after request 20
```

### Test Headers
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}' \
  -i | grep "X-RateLimit"
```

Expected output:
```
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1709827200000
```

## Security Considerations

### Bypass Prevention
- Rate limit headers are informational only (client cannot modify server state)
- Limits are enforced server-side
- IP address is extracted server-side from trusted headers

### DDoS Protection
Rate limiting provides basic protection but is not a complete DDoS solution. For production:
- ✅ Use Vercel's built-in DDoS protection
- ✅ Configure Vercel Firewall rules
- ✅ Monitor for suspicious patterns
- 🔜 Consider Cloudflare for additional layer

### API Key Authentication
For higher limits, consider implementing API key authentication:
```typescript
const customLimit = {
  maxRequests: req.headers.get('x-api-key') ? 1000 : 100,
  windowSeconds: 60,
}
```

## Troubleshooting

### Issue: Rate limit resets unexpectedly
**Cause**: Serverless function cold start clears in-memory store
**Solution**: Upgrade to Redis-based rate limiting (see Production Considerations)

### Issue: Rate limit too strict for legitimate users
**Cause**: Limit configuration too low
**Solution**: Adjust limit in `src/lib/rateLimit.ts` RateLimits configuration

### Issue: Shared IP (corporate NAT) hitting limits
**Cause**: Multiple users behind same public IP
**Solution**: Implement user-based rate limiting (requires authentication)

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
**Status**: Production Ready ✅
