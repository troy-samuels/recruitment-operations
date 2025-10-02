# Monitoring & Error Tracking Configuration

This document describes the monitoring and error tracking setup for the Jobwall recruitment operations dashboard.

## Overview

The application uses a multi-layered monitoring approach:
1. **Vercel Analytics** - Page views, user behavior, conversion tracking
2. **Vercel Speed Insights** - Web Vitals and performance metrics
3. **Plausible Analytics** - Privacy-friendly analytics (optional)
4. **Error Boundaries** - Client-side error handling and logging
5. **Vercel Logs** - Server-side error tracking via function logs

## 1. Vercel Analytics

**Status**: ✅ Enabled (as of 2025-10-02)

**Installation**:
```bash
npm install @vercel/analytics
```

**Configuration** (src/app/layout.tsx:4, 57):
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Features**:
- Automatic page view tracking
- Event tracking via `track()` function
- Conversion funnel analysis
- Device and browser insights
- Geographic distribution

**Custom Event Tracking** (example usage):
```typescript
import { track } from '@vercel/analytics'

// Track custom events
track('signup_completed', {
  plan: 'professional',
  source: 'landing_page'
})

track('role_created', {
  workspace_id: workspace.id
})
```

**Accessing Data**:
- Dashboard: https://vercel.com/dashboard → Select project → Analytics tab
- Events: View custom events, page views, unique visitors
- Time range: Last 24h, 7d, 30d, all time

## 2. Vercel Speed Insights

**Status**: ✅ Enabled (as of 2025-10-02)

**Installation**:
```bash
npm install @vercel/speed-insights
```

**Configuration** (src/app/layout.tsx:5, 58):
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Metrics Tracked**:
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **TTFB (Time to First Byte)**: Target < 600ms
- **FCP (First Contentful Paint)**: Target < 1.8s

**Performance Budgets**:
```
Good: 90-100 score
Needs Improvement: 50-89 score
Poor: 0-49 score
```

**Accessing Data**:
- Dashboard: https://vercel.com/dashboard → Select project → Speed Insights tab
- Real User Monitoring (RUM) data from actual users
- Breakdown by page, device type, connection speed

## 3. Plausible Analytics

**Status**: ✅ Configured (optional, privacy-friendly alternative)

**Configuration** (src/app/layout.tsx:43-49):
```typescript
{process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
  <script
    defer
    data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
    src="https://plausible.io/js/script.js"
  />
) : null}
```

**Environment Variable**:
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jobwall.co.uk
```

**Features**:
- GDPR compliant (no cookies, no personal data)
- Lightweight script (~1KB)
- Page views, referrers, goals
- Simple, privacy-first dashboard

**Accessing Data**:
- Dashboard: https://plausible.io/jobwall.co.uk

## 4. Error Boundaries

**Status**: ✅ Implemented

**Client-Side Error Handling** (src/app/error.tsx):
```typescript
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to console (visible in Vercel logs)
    console.error('[Error Boundary]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return <ErrorUI error={error} reset={reset} />
}
```

**Global Error Handling** (src/app/global-error.tsx):
Catches errors in root layout and error boundaries themselves.

**404 Not Found** (src/app/not-found.tsx):
Custom 404 page with user-friendly messaging.

## 5. Vercel Function Logs

**Status**: ✅ Enabled by default

**Accessing Logs**:
1. Go to Vercel Dashboard → Select project
2. Click "Logs" tab
3. Filter by:
   - Time range
   - Function name
   - Log level (info, warn, error)
   - Search text

**Log Levels**:
```typescript
console.log('[Info]', ...)    // General information
console.warn('[Warning]', ...) // Potential issues
console.error('[Error]', ...)  // Errors and exceptions
```

**Example API Route Logging**:
```typescript
export async function POST(req: NextRequest) {
  try {
    console.log('[API]', {
      path: req.nextUrl.pathname,
      method: req.method,
      timestamp: new Date().toISOString(),
    })

    // Process request...

  } catch (error) {
    console.error('[API Error]', {
      path: req.nextUrl.pathname,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
    throw error
  }
}
```

**Log Retention**:
- Free plan: 1 day
- Pro plan: 7 days
- Enterprise: 30+ days

## 6. Supabase Monitoring

**Dashboard**: https://supabase.com/dashboard/project/votpasanvrutqwyzxzmk

**Metrics to Monitor**:

### Database
- **Database Size**: Check against plan limits (500MB Free, 8GB Pro)
- **Active Connections**: Max 15 (Free), 60 (Pro)
- **Query Performance**: Slow query log
- **Tables**: Row counts, indexes

### API
- **Request Count**: Daily/monthly API calls
- **Response Times**: Average, p95, p99
- **Error Rate**: Failed requests as % of total
- **Status Codes**: 2xx (success), 4xx (client error), 5xx (server error)

### Auth
- **MAU (Monthly Active Users)**: Track growth
- **Sign-ups**: New users per day/week/month
- **Failed Logins**: Potential security issues

**Accessing Data**:
- Reports tab: https://supabase.com/dashboard/project/votpasanvrutqwyzxzmk/reports
- Real-time: Update every 5 minutes
- Historical: Last 7 days (Free), 30 days (Pro)

## 7. Custom Application Metrics

**Status**: ✅ Implemented (src/lib/metrics.ts)

**Privacy-First Tracking**:
```typescript
import { trackEvent } from '@/lib/metrics'

// Track custom application events
trackEvent('role_created', {
  workspace_id: workspace.id,
  role_stage: 0,
})

trackEvent('task_completed', {
  role_id: role.id,
  task_type: 'follow_up',
})
```

**Features**:
- Respects Do Not Track (DNT) header
- Respects user privacy preferences
- Uses `sendBeacon` for reliability
- Stored in Supabase `events` table

**Querying Events**:
```sql
SELECT
  name,
  COUNT(*) as count,
  DATE(created_at) as date
FROM events
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY name, DATE(created_at)
ORDER BY date DESC, count DESC
```

## Monitoring Checklist

### Daily Monitoring
- [ ] Check Vercel logs for errors (status 500)
- [ ] Review Speed Insights scores (should be > 90)
- [ ] Monitor Supabase database size
- [ ] Check for rate limit violations (429 responses)

### Weekly Monitoring
- [ ] Review Vercel Analytics trends
- [ ] Check Supabase connection usage
- [ ] Review slow queries in Supabase
- [ ] Monitor user growth (sign-ups, MAU)
- [ ] Check email delivery rate (Resend dashboard)

### Monthly Monitoring
- [ ] Review overall performance trends
- [ ] Analyze conversion funnels
- [ ] Check database backup status
- [ ] Review and adjust rate limits if needed
- [ ] Plan for scaling if approaching limits

## Alerting (Recommended)

### Vercel Integrations
Consider enabling:
1. **Slack Integration**: Get deployment and error notifications
   - Setup: Vercel Dashboard → Integrations → Slack
   - Notifications: Deployments, errors, build failures

2. **Email Notifications**: Configure in Vercel project settings
   - Setup: Project Settings → Notifications
   - Options: Deployment success/failure, build errors

### Supabase Alerts (Pro Plan)
Configure alerts for:
- Database size > 80% of limit
- CPU usage > 80%
- Error rate > 5%
- Connection pool exhaustion

**Setup**: Supabase Dashboard → Project Settings → Alerts

## Advanced: Third-Party Error Tracking

For more comprehensive error tracking, consider integrating:

### Option 1: Sentry (Recommended)

**Installation**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configuration** (sentry.client.config.ts):
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

**Features**:
- Detailed error reports with stack traces
- User session replay
- Performance monitoring
- Release tracking
- Breadcrumbs (user actions before error)

**Pricing**: Free tier includes 5,000 errors/month

### Option 2: LogRocket

**Features**:
- Session replay with console logs
- Network monitoring
- Performance tracking
- Heatmaps

**Better for**: UX debugging and understanding user behavior

### Option 3: Datadog RUM

**Features**:
- Real User Monitoring
- APM (Application Performance Monitoring)
- Log aggregation
- Infrastructure monitoring

**Better for**: Large-scale applications with complex infrastructure

## Performance Optimization Tips

Based on monitoring data, here are common optimizations:

### 1. Slow Page Loads (LCP > 2.5s)
- Optimize images (use Next.js Image component)
- Reduce JavaScript bundle size
- Implement code splitting
- Use CDN for static assets

### 2. High Error Rate (> 5%)
- Check Vercel logs for patterns
- Review API route error handling
- Verify database connection limits
- Check rate limit configurations

### 3. Database Performance Issues
- Add indexes for frequently queried columns
- Use connection pooling
- Implement caching (Redis, SWR)
- Optimize N+1 queries

### 4. High API Response Times
- Implement caching
- Optimize database queries
- Use edge functions for static data
- Consider API rate limiting adjustments

## Security Monitoring

### What to Monitor
1. **Failed Login Attempts**: Unusual patterns might indicate attacks
2. **Rate Limit Violations**: Potential abuse or DDoS
3. **Unusual API Activity**: Check for unauthorized access
4. **Database Queries**: Monitor for SQL injection attempts

### Supabase Security Dashboard
- Navigate to: Authentication → Settings → Security
- Enable: Email rate limiting, password strength requirements
- Monitor: Failed login attempts, suspicious patterns

### Vercel Security
- Enable: Vercel Firewall (Pro plan)
- Configure: Attack Challenge Mode for DDoS protection
- Monitor: Unusual traffic patterns

## Troubleshooting

### Issue: Analytics not showing data
**Cause**: Script blocked by ad blocker or privacy extension
**Solution**: Analytics are client-side, some users may block them (expected)

### Issue: Errors not appearing in logs
**Cause**: Console logs not flushing before function timeout
**Solution**: Ensure console.error is called before response sent

### Issue: Slow Speed Insights scores
**Cause**: Multiple factors (images, JavaScript, fonts)
**Solution**: Use Lighthouse CI for detailed recommendations

### Issue: High database connection usage
**Cause**: Not closing connections, connection leaks
**Solution**: Use connection pooling, review API route patterns

---

## Quick Links

- **Vercel Analytics**: https://vercel.com/dashboard → Analytics
- **Vercel Speed Insights**: https://vercel.com/dashboard → Speed Insights
- **Vercel Logs**: https://vercel.com/dashboard → Logs
- **Supabase Reports**: https://supabase.com/dashboard/project/votpasanvrutqwyzxzmk/reports
- **Plausible Analytics**: https://plausible.io/jobwall.co.uk
- **Resend Dashboard**: https://resend.com/dashboard

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
**Status**: Production Ready ✅
