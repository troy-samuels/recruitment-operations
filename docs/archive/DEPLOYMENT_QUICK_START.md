# Quick Deployment Reference

⚡ **Fast track to deploy jobwall.co.uk to production**

## 🎯 30-Second Overview

1. Domain configured in Vercel ✅
2. DNS pointed to Vercel ✅
3. Environment variables set ✅
4. Deploy to production ✅

---

## 📋 Quick Checklist

### ✅ Prerequisites (Already Done)
- [x] `vercel.json` updated with production config
- [x] `next.config.js` has www redirect (line 3-14)
- [x] Vercel project exists (ID: prj_L9LmWn0IpLZWVwT6XleJO5reir6Y)

### 🚀 To Do Now

#### 1. Add Domains in Vercel (2 minutes)
```
vercel.com/[team]/recruitment-operations/settings/domains
→ Add: jobwall.co.uk
→ Add: www.jobwall.co.uk
```

#### 2. Configure DNS (5 minutes)
**Option A:** Use Vercel nameservers (recommended)
```


```

**Option B:** Add A/CNAME records manually
```
A    @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

#### 3. Set Environment Variables (5 minutes)
Go to: `vercel.com/[team]/recruitment-operations/settings/environment-variables`

**Set to Production environment only:**

Public (7 vars):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://votpasanvrutqwyzxzmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_NAME=Recruitment Operations
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://jobwall.co.uk
NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID=price_1SDNCvRhxoPVzYstHizZfvgC
```

Secret (3 vars):
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_STRIPE_PUBLISHABLE_KEY=pk_live_... (⚠️ Use LIVE key)
NEXT_STRIPE_SECRET_KEY=sk_live_... (⚠️ Use LIVE key)
STRIPE_WEBHOOK_SECRET=whsec_... (⚠️ Use LIVE webhook secret)
```

#### 4. Deploy (1 minute)
```bash
cd "/Users/troysamuels/recruitment ops dashboard/recruitment-operations"
vercel --prod
```

---

## ✅ Verification (30 seconds)

```bash
# Test apex domain
curl -I https://jobwall.co.uk
# Expected: HTTP/2 200

# Test www redirect
curl -I https://www.jobwall.co.uk
# Expected: HTTP/2 308 → https://jobwall.co.uk/

# Test API
curl https://jobwall.co.uk/api/billing/status
# Expected: JSON response
```

---

## 🔥 Critical Notes

1. **Stripe Keys:** Must use LIVE keys (`pk_live_*`, `sk_live_*`) for production
2. **Webhook URL:** Create webhook at `https://jobwall.co.uk/api/stripe/webhook`
3. **DNS:** May take up to 48 hours to propagate
4. **CORS:** Already configured for `https://jobwall.co.uk`

---

## 📞 Need More Details?

See: `PRODUCTION_DEPLOYMENT.md` for full step-by-step guide

---

## 🎯 Expected Results

After deployment:
- ✅ `jobwall.co.uk` serves app (200)
- ✅ `www.jobwall.co.uk` redirects to apex (308)
- ✅ All 17 API routes work (200)
- ✅ SSL auto-configured
- ✅ Security headers active
- ✅ UK region (lhr1) for performance
