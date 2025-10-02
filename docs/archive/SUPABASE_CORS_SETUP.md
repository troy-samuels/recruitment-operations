# Supabase CORS Configuration Guide

**Project**: Recruitment Operations Dashboard
**Date**: 2025-10-02
**Allowed Origins**:
- Production: `https://jobwall.co.uk`
- Development: `http://localhost:3000`

---

## 🎯 Overview

Supabase has built-in CORS support, but you need to configure it properly for custom domains and localhost development.

---

## 🔧 Method 1: Supabase Dashboard (Recommended)

### Step 1: Access Project Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** (left sidebar)
4. Click on **API**

### Step 2: Configure Site URL
Scroll down to **Site URL** section:

```
Site URL: https://jobwall.co.uk
```

This is your primary production domain.

### Step 3: Configure Additional Redirect URLs
Scroll to **Redirect URLs** section and add:

```
https://jobwall.co.uk
https://jobwall.co.uk/*
http://localhost:3000
http://localhost:3000/*
```

**Note**: The `*` wildcard allows all paths under each domain.

### Step 4: Save Changes
Click **Save** at the bottom of the page.

---

## 🔧 Method 2: Environment Variables

Update your `.env.local` file to ensure proper configuration:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Site Configuration (for redirects)
NEXT_PUBLIC_SITE_URL=https://jobwall.co.uk

# For local development, Supabase automatically allows localhost
# No additional configuration needed in .env.local
```

---

## 🔧 Method 3: Custom API Route with CORS Headers

Your project already has a comprehensive CORS configuration in `src/lib/cors.ts`:

### Current Configuration ✅
```typescript
// src/lib/cors.ts
const ALLOWED_ORIGINS = [
  'https://jobwall.co.uk',
  'https://www.jobwall.co.uk',
  'http://localhost:3000',
  'http://localhost:3001', // Alternative port if 3000 is busy
]
```

This configuration:
- ✅ Allows production domain (`https://jobwall.co.uk`)
- ✅ Allows www subdomain (`https://www.jobwall.co.uk`)
- ✅ Allows localhost:3000 (primary dev port)
- ✅ Allows localhost:3001 (backup dev port)

### How to Use in API Routes

**Option 1: Use `withCors` wrapper (Recommended)**
```typescript
// src/app/api/your-route/route.ts
import { withCors } from '@/lib/cors'
import { NextRequest, NextResponse } from 'next/server'

async function handleRequest(req: NextRequest) {
  // Your API logic here
  return NextResponse.json({ message: 'Success' })
}

// Export with CORS wrapper
export const GET = withCors(handleRequest)
export const POST = withCors(handleRequest)
```

**Option 2: Manual CORS headers**
```typescript
// src/app/api/your-route/route.ts
import { addCorsHeaders } from '@/lib/cors'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')

  // Your API logic
  const data = { message: 'Success' }
  const response = NextResponse.json(data)

  // Add CORS headers
  return addCorsHeaders(response, origin)
}

// Handle preflight
export async function OPTIONS(req: NextRequest) {
  const { handleCorsPreflightRequest } = await import('@/lib/cors')
  return handleCorsPreflightRequest(req)
}
```

---

## 🔍 Verify CORS Configuration

### Test from Browser Console (Production)

Navigate to `https://jobwall.co.uk` and open DevTools Console:

```javascript
// Test Supabase CORS
fetch('https://your-project-ref.supabase.co/rest/v1/profiles', {
  headers: {
    'apikey': 'your_anon_key',
    'Authorization': 'Bearer your_anon_key'
  }
})
.then(res => res.json())
.then(data => console.log('✅ CORS working:', data))
.catch(err => console.error('❌ CORS error:', err))

// Test your API route
fetch('https://jobwall.co.uk/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    organisation: 'Test Co'
  })
})
.then(res => res.json())
.then(data => console.log('✅ API CORS working:', data))
.catch(err => console.error('❌ API CORS error:', err))
```

### Test from Local Development

Navigate to `http://localhost:3000` and open DevTools Console:

```javascript
// Should work without CORS issues
fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'Dev',
    last_name: 'Test',
    email: 'dev@example.com',
    organisation: 'Dev Co'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Local API working:', data))
.catch(err => console.error('❌ Error:', err))
```

---

## 🚨 Common CORS Issues & Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause**: Origin not in allowed list
**Solution**:
```typescript
// src/lib/cors.ts
const ALLOWED_ORIGINS = [
  'https://jobwall.co.uk',
  'https://www.jobwall.co.uk',
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your domain here
]
```

### Issue 2: "CORS policy: Response to preflight request doesn't pass"

**Cause**: Missing OPTIONS handler
**Solution**:
```typescript
// Ensure OPTIONS is exported
export const OPTIONS = (req: NextRequest) => handleCorsPreflightRequest(req)
```

### Issue 3: "Supabase client not working from browser"

**Cause**: Supabase project doesn't have your domain whitelisted
**Solution**: Update Supabase Dashboard > Settings > API > Redirect URLs

### Issue 4: "localhost:3001 blocked (port conflict)"

**Cause**: Port not in allowed origins
**Solution**: Already configured! `http://localhost:3001` is in the allowed list

### Issue 5: "Credentials not included in CORS request"

**Cause**: Missing credentials flag
**Solution**: Already configured! `Access-Control-Allow-Credentials: true` is set

---

## 📋 Supabase Dashboard Checklist

Login to [Supabase Dashboard](https://supabase.com/dashboard) and verify:

### Authentication Settings
- [ ] Navigate to **Authentication** > **URL Configuration**
- [ ] Set **Site URL**: `https://jobwall.co.uk`
- [ ] Add **Redirect URLs**:
  - `https://jobwall.co.uk/**`
  - `https://www.jobwall.co.uk/**`
  - `http://localhost:3000/**`
  - `http://localhost:3001/**`

### API Settings
- [ ] Navigate to **Settings** > **API**
- [ ] Verify **Project URL**: Should be `https://your-project-ref.supabase.co`
- [ ] Copy **anon public** key (for client-side)
- [ ] Copy **service_role** key (for server-side, keep secret!)

### Email Templates (OAuth Redirects)
- [ ] Navigate to **Authentication** > **Email Templates**
- [ ] Ensure magic link redirects to: `{{ .SiteURL }}/auth/callback`
- [ ] Ensure password reset redirects to: `{{ .SiteURL }}/update-password`

---

## 🔐 Security Best Practices

### 1. Never expose service_role key to client
```typescript
// ❌ BAD - Don't do this
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)

// ✅ GOOD - Use service role only on server
// src/lib/supabaseAdmin.ts (server-side only)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### 2. Validate origin on server
```typescript
// API routes should check origin
import { isOriginAllowed } from '@/lib/cors'

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')

  if (!isOriginAllowed(origin)) {
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403 }
    )
  }

  // Process request...
}
```

### 3. Use environment-specific URLs
```typescript
// next.config.js or env validation
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://jobwall.co.uk'
    : 'http://localhost:3000')
```

---

## 🌐 Production Domain Configuration

### Vercel Deployment (If using Vercel)

Ensure environment variables are set in Vercel Dashboard:

```bash
# Project Settings > Environment Variables

# Production
NEXT_PUBLIC_SITE_URL=https://jobwall.co.uk
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Preview (optional)
# Same values but can be different Supabase project

# Development
# Uses localhost automatically
```

### DNS Configuration

Ensure your domain points to the correct deployment:

```
A Record or CNAME:
jobwall.co.uk → your-vercel-app.vercel.app
www.jobwall.co.uk → your-vercel-app.vercel.app
```

---

## ✅ Testing Checklist

### Local Development (http://localhost:3000)
- [ ] Can fetch from Supabase client
- [ ] Can call custom API routes
- [ ] Auth magic links work
- [ ] OAuth redirects work

### Production (https://jobwall.co.uk)
- [ ] Can fetch from Supabase client
- [ ] Can call custom API routes
- [ ] Auth magic links work
- [ ] OAuth redirects work
- [ ] No CORS errors in browser console

### Cross-Origin Tests
- [ ] Fetch from production to Supabase works
- [ ] Fetch from localhost to Supabase works
- [ ] API routes accept requests from both origins
- [ ] Preflight OPTIONS requests succeed

---

## 📞 Support

### Supabase CORS Issues
- [Supabase CORS Documentation](https://supabase.com/docs/guides/api/cors)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

### Next.js CORS Issues
- [Next.js API Routes CORS](https://nextjs.org/docs/api-routes/api-middlewares)
- [Vercel CORS Configuration](https://vercel.com/docs/concepts/projects/project-configuration)

---

## 🎉 Summary

Your CORS configuration is **already set up correctly**! ✅

**Current Status**:
- ✅ `src/lib/cors.ts` configured with all required origins
- ✅ Production domain: `https://jobwall.co.uk`
- ✅ Development: `http://localhost:3000` and `http://localhost:3001`
- ✅ Helper functions available: `withCors()`, `addCorsHeaders()`, `isOriginAllowed()`

**Next Steps**:
1. Verify Supabase Dashboard settings (Site URL + Redirect URLs)
2. Test CORS from both localhost and production
3. Use `withCors()` wrapper in API routes that need CORS support

---

**Last Updated**: 2025-10-02
**Status**: ✅ Configured and Ready

<function_calls>
<invoke name="Read">
<parameter name="file_path">/Users/troysamuels/recruitment ops dashboard/recruitment-operations/src/lib/cors.ts