# Production Deployment Guide - jobwall.co.uk

This guide walks you through deploying the Recruitment Operations Dashboard to production on Vercel with the custom domain jobwall.co.uk.

## ✅ Prerequisites Completed

- ✅ `vercel.json` configured with production settings
- ✅ `next.config.js` already has www → apex redirect (308)
- ✅ Vercel project exists (ID: `prj_L9LmWn0IpLZWVwT6XleJO5reir6Y`)

---

## 📋 Deployment Checklist

### Step 1: Configure Domain in Vercel Dashboard

1. **Navigate to Vercel Project Settings:**
   - Go to: https://vercel.com/[your-team]/recruitment-operations/settings/domains
   - Or: Dashboard → recruitment-operations → Settings → Domains

2. **Add Primary Domain:**
   - Click "Add Domain"
   - Enter: `jobwall.co.uk`
   - Click "Add"
   - Vercel will show DNS configuration needed (see Step 2)

3. **Add WWW Subdomain:**
   - Click "Add Domain"
   - Enter: `www.jobwall.co.uk`
   - Click "Add"
   - Vercel will automatically configure it to redirect to apex
   - The redirect is already handled by `next.config.js` (line 3-14)

**Expected Result:**
```
✅ jobwall.co.uk (Primary)
✅ www.jobwall.co.uk → Redirect to jobwall.co.uk (308)
```

---

### Step 2: Configure DNS Records

You have two options:

#### Option A: Use Vercel Nameservers (Recommended - Easiest)

1. **Get Vercel's nameservers from the domain page:**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. **Update nameservers at your domain registrar:**
   - Log in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains)
   - Navigate to DNS settings for `jobwall.co.uk`
   - Replace existing nameservers with Vercel's nameservers
   - Save changes

3. **Wait for propagation:**
   - DNS propagation can take 24-48 hours
   - Check status: https://www.whatsmydns.net/#NS/jobwall.co.uk

#### Option B: Manual DNS Records (If keeping current nameservers)

Add these DNS records at your domain registrar:

**For Apex Domain (jobwall.co.uk):**
```
Type: A
Name: @ (or blank)
Value: 76.76.21.21
TTL: 3600 (1 hour)
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (1 hour)
```

**Verify DNS records:**
```bash
# Check apex domain
dig jobwall.co.uk A

# Check www subdomain
dig www.jobwall.co.uk CNAME
```

---

### Step 3: Configure Environment Variables

1. **Navigate to Environment Variables:**
   - Go to: https://vercel.com/[your-team]/recruitment-operations/settings/environment-variables

2. **Add Production Environment Variables:**

**IMPORTANT:** For each variable below:
- Set Environment: **Production** (uncheck Preview and Development)
- Click "Add" after each entry

#### Public Variables (Client-side accessible)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL
Value: https://votpasanvrutqwyzxzmk.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdHBhc2FudnJ1dHF3eXp4em1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDk0MjQsImV4cCI6MjA3NDQ4NTQyNH0.9YNbNfu_qLDzhx94snqlbtJby5OLX34Axj1bhtAytlI

# Application Configuration
NEXT_PUBLIC_APP_NAME
Value: Recruitment Operations

NEXT_PUBLIC_APP_VERSION
Value: 1.0.0

NEXT_PUBLIC_APP_ENV
Value: production

NEXT_PUBLIC_SITE_URL
Value: https://jobwall.co.uk

# Stripe Public Configuration
NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID
Value: price_1SDNCvRhxoPVzYstHizZfvgC
```

#### Secret Variables (Server-side only)

```bash
# Supabase Service Role (Admin)
SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdHBhc2FudnJ1dHF3eXp4em1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwOTQyNCwiZXhwIjoyMDc0NDg1NDI0fQ._-uouFoVzzLGpbC2hdv7cDMTIZ9oQGCVjr0RyNA-C6Q

# Stripe Configuration (PRODUCTION KEYS)
NEXT_STRIPE_PUBLISHABLE_KEY
Value: pk_live_... (⚠️ REPLACE with your Stripe LIVE publishable key)

NEXT_STRIPE_SECRET_KEY
Value: sk_live_... (⚠️ REPLACE with your Stripe LIVE secret key)

STRIPE_WEBHOOK_SECRET
Value: whsec_... (⚠️ REPLACE with your Stripe LIVE webhook secret)
```

**⚠️ CRITICAL - Stripe Live Keys:**

You must switch from test keys to production keys:

1. **Get Stripe Live Keys:**
   - Go to: https://dashboard.stripe.com/apikeys
   - Toggle from "Test mode" to "Live mode" (top right)
   - Copy:
     - Publishable key (starts with `pk_live_`)
     - Secret key (starts with `sk_live_`)

2. **Create Webhook Endpoint:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://jobwall.co.uk/api/stripe/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)
   - Use this as `STRIPE_WEBHOOK_SECRET`

**Environment Variables Summary:**
```
Total: 10 variables
Public (NEXT_PUBLIC_*): 7 variables
Secret: 3 variables
```

---

### Step 4: Deploy to Production

#### Option A: Deploy from Local Machine

```bash
# Navigate to project directory
cd "/Users/troysamuels/recruitment ops dashboard/recruitment-operations"

# Login to Vercel (if not already)
npx vercel login

# Deploy to production
npx vercel --prod

# Or if vercel is installed globally
vercel --prod
```

#### Option B: Deploy from Vercel Dashboard

1. Go to: https://vercel.com/[your-team]/recruitment-operations
2. Click "Deployments" tab
3. Click "Deploy" → "Deploy main branch"
4. Select "Production" environment
5. Click "Deploy"

#### Option C: Git Push (Automatic)

If you've connected your Git repository:

```bash
# Commit the vercel.json changes
git add vercel.json
git commit -m "feat: add production Vercel configuration"

# Push to main branch
git push origin main
```

Vercel will automatically deploy to production when you push to `main`.

---

### Step 5: Verify Deployment

Once deployment completes (usually 2-5 minutes), verify everything works:

#### 1. Test Apex Domain (200 OK)

```bash
curl -I https://jobwall.co.uk

# Expected output:
HTTP/2 200
content-type: text/html; charset=utf-8
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 1; mode=block
```

#### 2. Test WWW Redirect (308 Permanent Redirect)

```bash
curl -I https://www.jobwall.co.uk

# Expected output:
HTTP/2 308
location: https://jobwall.co.uk/
```

#### 3. Test API Routes (200 OK)

```bash
# Test leads API
curl -X POST https://jobwall.co.uk/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "organisation": "Test Org"
  }'

# Expected output:
{"success":true,"message":"Lead captured successfully"}
```

#### 4. Test Stripe Checkout API

```bash
curl -X POST https://jobwall.co.uk/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1SDNCvRhxoPVzYstHizZfvgC",
    "quantity": 1
  }'

# Expected: {"url":"https://checkout.stripe.com/..."}
```

#### 5. Manual Browser Tests

1. **Open:** https://jobwall.co.uk
   - ✅ Landing page loads
   - ✅ No console errors
   - ✅ SSL certificate valid

2. **Test WWW redirect:**
   - Open: https://www.jobwall.co.uk
   - ✅ Redirects to https://jobwall.co.uk

3. **Test authentication:**
   - Click "Get Started"
   - ✅ Signup modal opens
   - ✅ Can submit email

4. **Test dashboard (after login):**
   - ✅ Dashboard loads at /dashboard
   - ✅ Kanban board renders
   - ✅ Drag and drop works

---

## 🔍 Troubleshooting

### Issue: Domain shows "Domain not configured"

**Solution:**
- Wait for DNS propagation (up to 48 hours)
- Check DNS with: `dig jobwall.co.uk`
- Verify nameservers: `dig NS jobwall.co.uk`

### Issue: APIs return 404

**Solution:**
- Check `vercel.json` is deployed (should show in deployment logs)
- Verify API routes exist in `src/app/api/`
- Check Vercel function logs: Dashboard → Functions

### Issue: Environment variables not working

**Solution:**
- Verify variables are set for **Production** environment
- Redeploy after adding variables
- Check deployment logs for variable issues

### Issue: Stripe webhooks not working

**Solution:**
- Verify webhook endpoint URL: `https://jobwall.co.uk/api/stripe/webhook`
- Check webhook signing secret matches `STRIPE_WEBHOOK_SECRET`
- Test webhook in Stripe dashboard: Webhooks → Your endpoint → Send test webhook
- Check Vercel function logs for errors

### Issue: CORS errors on API routes

**Solution:**
- Verify `vercel.json` headers are deployed
- Check `Access-Control-Allow-Origin` matches your domain
- Ensure API responses include proper headers

---

## 📊 Production Configuration Summary

**What was configured:**

1. **vercel.json:**
   - ✅ UK region (lhr1) for performance
   - ✅ API function timeout: 10 seconds
   - ✅ API function memory: 1GB
   - ✅ CORS headers for API routes
   - ✅ Security headers (CSP, X-Frame-Options, etc.)

2. **Domain Setup:**
   - ✅ jobwall.co.uk (primary domain)
   - ✅ www.jobwall.co.uk → 308 redirect to apex

3. **Environment Variables:**
   - ✅ 7 public variables (NEXT_PUBLIC_*)
   - ✅ 3 secret variables (Supabase service role, Stripe keys)

4. **Security:**
   - ✅ HTTPS enforced
   - ✅ Security headers active
   - ✅ CORS properly configured
   - ✅ Row Level Security (RLS) in Supabase

---

## 🚀 Post-Deployment Checklist

After successful deployment:

- [ ] Test all main pages (/, /dashboard, /analytics, /team)
- [ ] Test authentication flow (signup, login, logout)
- [ ] Test payment flow (Stripe checkout)
- [ ] Test API endpoints (leads, metrics, team invites)
- [ ] Monitor Vercel analytics dashboard
- [ ] Set up alerts for errors (Vercel → Settings → Notifications)
- [ ] Configure custom error pages if needed
- [ ] Set up monitoring (e.g., Sentry, LogRocket)
- [ ] Update Supabase production URLs if needed
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit

---

## 📞 Support & Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Supabase Production:** https://supabase.com/docs/guides/platform/going-into-prod

**Project-Specific Docs:**
- `CLAUDE.md` - Development guide
- `TECHNICAL_BUILD.md` - Technical architecture
- `business plan.md` - Business context

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ https://jobwall.co.uk returns 200 OK
2. ✅ https://www.jobwall.co.uk redirects with 308
3. ✅ All 17 API routes return 200 (or appropriate status)
4. ✅ SSL certificate is valid and auto-renewing
5. ✅ Environment variables are properly set
6. ✅ Stripe webhooks are receiving events
7. ✅ Supabase auth is working
8. ✅ No console errors in browser
9. ✅ Performance score >90 on Lighthouse
10. ✅ Mobile responsive design works

---

**Last Updated:** October 1, 2025
**Deployment Platform:** Vercel
**Framework:** Next.js 15.0.3
**Domain:** jobwall.co.uk
