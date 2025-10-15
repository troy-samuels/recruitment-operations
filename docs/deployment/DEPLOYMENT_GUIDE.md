# Production Deployment Guide

**Project:** Recruitment Operations Dashboard (Jobwall)
**Domain:** jobwall.co.uk
**Platform:** Vercel
**Last Updated:** October 2, 2025

---

## Quick Start

```bash
# Deploy to production
cd "recruitment-operations"
npx vercel --prod

# Verify deployment
curl https://jobwall.co.uk/api/health
```

---

## Prerequisites

- ✅ Vercel account with project access
- ✅ Domain configured (jobwall.co.uk)
- ✅ Environment variables ready
- ✅ Stripe account (live keys)
- ✅ Supabase project (production instance)

---

## 1. Environment Configuration

### Core Environment Variables

**Public Variables** (NEXT_PUBLIC_*):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://votpasanvrutqwyzxzmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_NAME=Recruitment Operations
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://jobwall.co.uk
NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID=price_xxx
```

**Secret Variables**:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CRON_SECRET=<secure_random_32_char_string>
```

**Operational & Marketing Toggles** (recommended):
```bash
# Controls marketing preview copy in pricing components
NEXT_PUBLIC_BRAND_PREVIEW=0

# Shared logo URL for transactional email templates
NEXT_PUBLIC_LOGO_URL=https://jobwall.co.uk/logo.png

# Optional: override alert recipient for cron health checks
ALERT_EMAIL_TO=ops@jobwall.co.uk
```

### Setting Variables via CLI

```bash
# Add single variable
npx vercel env add VARIABLE_NAME production

# Or edit in dashboard
# https://vercel.com/your-team/recruitment-operations/settings/environment-variables
```

---

## 2. Domain Configuration

### DNS Records

**Option A: Vercel Nameservers** (Recommended)
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: Manual DNS**
```
A Record:
  Name: @
  Value: 76.76.21.21
  TTL: 3600

CNAME Record:
  Name: www
  Value: cname.vercel-dns.com
  TTL: 3600
```

### Verify DNS Propagation
```bash
dig jobwall.co.uk A
dig www.jobwall.co.uk CNAME
```

---

## 3. Stripe Live Mode Setup

### Get Live Keys

1. Navigate to: https://dashboard.stripe.com/apikeys
2. Toggle to **Live mode**
3. Copy:
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)

### Create Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Configure:
   - **URL**: `https://jobwall.co.uk/api/stripe/webhook`
   - **Events**:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Copy signing secret (whsec_...)
5. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

---

## 4. Deploy to Production

### Via Vercel CLI

```bash
# Navigate to project
cd "/Users/troysamuels/recruitment ops dashboard/recruitment-operations"

# Login (if needed)
npx vercel login

# Deploy
npx vercel --prod
```

### Via Git Push

```bash
# Push to main branch triggers auto-deploy
git push origin main
```

### Via Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select project: recruitment-operations
3. Click "Deployments"
4. Click "Redeploy" on latest deployment

---

## 5. Post-Deployment Verification

### Check Deployment Status

```bash
# Visit deployment URL
open https://jobwall.co.uk

# Check API health
curl https://jobwall.co.uk/api/billing/status

# Verify Stripe integration
curl https://jobwall.co.uk/api/stripe/pricing
```

### Verify Cron Jobs

```bash
# Manual trigger (requires CRON_SECRET)
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://jobwall.co.uk/api/cron/health

# Check Vercel logs
npx vercel logs --follow
```

### Test Critical Flows

1. **Authentication**:
   - Visit /login
   - Test magic link
   - Test OAuth (Google)

2. **Billing**:
   - Visit /billing
   - Test checkout flow (use test card: 4242 4242 4242 4242)
   - Verify webhook processing

3. **Dashboard**:
   - Visit /dashboard
   - Test drag-and-drop
   - Verify data persistence

---

## 6. Infrastructure Configuration

### vercel.json

```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "crons": [
    {
      "path": "/api/cron/refresh-analytics",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/health",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**Features**:
- ✅ London region (lhr1) for UK users
- ✅ 30s timeout for API routes
- ✅ 1GB memory for complex operations
- ✅ Automated cron jobs (analytics, health checks)

---

## 7. Common Issues & Solutions

### Issue: WWW Redirect Loop

**Symptom**: Infinite redirects between www and apex

**Solution**:
```javascript
// next.config.js already handles this
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.jobwall.co.uk' }],
      destination: 'https://jobwall.co.uk/:path*',
      permanent: true
    }
  ]
}
```

### Issue: Stripe Connection Error

**Symptom**: HTTP 500 on /api/stripe/* endpoints

**Solutions**:
1. Verify live keys are correct
2. Check API version compatibility
3. Try different Vercel region (iad1 vs lhr1)
4. Remove region lock in vercel.json

See: `/docs/infrastructure/STRIPE_SETUP.md` for detailed troubleshooting

### Issue: Environment Variables Not Loading

**Symptom**: Features not working despite variables set

**Solutions**:
1. Verify variables are set to "Production" environment
2. Redeploy after adding variables
3. Check for typos in variable names
4. Verify no trailing spaces in values

```bash
# List all variables
npx vercel env ls

# Pull variables locally
npx vercel env pull .env.production
```

---

## 8. Monitoring & Logs

### Vercel Logs

```bash
# Stream live logs
npx vercel logs --follow

# Filter by project
npx vercel logs --project recruitment-operations

# View specific deployment
npx vercel logs deployment_url
```

### Performance Monitoring

**Vercel Analytics**: https://vercel.com/analytics

**Metrics tracked**:
- Page views
- User behavior
- Conversion rates
- Web Vitals (LCP, FID, CLS)

**Plausible Analytics**: https://plausible.io/jobwall.co.uk

---

## 9. Rollback Procedure

### Quick Rollback

```bash
# List recent deployments
npx vercel ls

# Promote previous deployment
npx vercel promote <deployment_url> --prod
```

### Via Dashboard

1. Go to: https://vercel.com/dashboard/deployments
2. Find stable deployment
3. Click "..." menu
4. Click "Promote to Production"

---

## 10. Production Readiness Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] Domain DNS configured
- [ ] Stripe live keys tested
- [ ] Supabase RLS policies verified
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (`npm run lint`)

### Post-Deployment
- [ ] Domain loads (https://jobwall.co.uk)
- [ ] WWW redirects to apex
- [ ] Authentication works (magic link)
- [ ] Billing checkout functional
- [ ] Dashboard loads data
- [ ] API endpoints return 200
- [ ] Cron jobs executing
- [ ] Analytics tracking events

### Security
- [ ] Environment variables encrypted
- [ ] API routes protected
- [ ] RLS policies active
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS properly restricted

---

## Status Summary

**Current Deployment**:
- ✅ Domain: https://jobwall.co.uk
- ✅ Region: Washington DC (iad1)
- ✅ Framework: Next.js 15.0.3
- ✅ Node: 22.x
- ✅ Build: Successful
- ✅ Cron Jobs: Active

**Working Components**:
- ✅ Authentication (Supabase)
- ✅ Database (Supabase + RLS)
- ✅ Analytics (Vercel + Plausible)
- ✅ Team Management
- ✅ Dashboard & Kanban Board
- ✅ Cron Automation

**Partial/In Progress**:
- ⚠️ Stripe Integration (see STRIPE_SETUP.md for troubleshooting)

---

## Additional Resources

- **Infrastructure Docs**: `/docs/infrastructure/`
- **Operations Guide**: `/docs/operations/`
- **Troubleshooting**: `/docs/deployment/TROUBLESHOOTING.md`
- **Vercel Docs**: https://vercel.com/docs

---

**Last Deployment**: October 2, 2025
**Deployed By**: Troy Samuels
**Status**: ✅ Production Ready
