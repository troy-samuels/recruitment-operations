itm # Stripe Testing Setup Guide

**Status**: ✅ Automated Setup Complete | ⏸️ Manual Steps Required
**Date**: October 2, 2025

---

## ✅ Completed (Automated)

### 1. CRON_SECRET Configuration
- ✅ Generated secure random secret: `pmeIFwKqQeb+ys0EMwXqV0crSvB/i1RMYZhpgAg+7F4=`
- ✅ Added to `.env.local` (line 31)
- ✅ Tested both authorization methods:
  - Bearer token: `curl -H "Authorization: Bearer <secret>" http://localhost:3000/api/cron/health`
  - Query string: `curl "http://localhost:3000/api/cron/health?key=<url_encoded_secret>"`

**Results:**
```json
{
  "ok": false,  // Expected: DB check fails without full Supabase config
  "checks": {
    "db": {"ok": false},
    "stripe": {"ok": true, "status": 200},
    "analytics": {"ok": true, "status": 200}
  }
}
```

### 2. Stripe CLI Installation
- ✅ Installed Stripe CLI v1.31.0
- ✅ Location: `~/.local/bin/stripe`
- ✅ Added to PATH via `~/.zprofile`
- ✅ Verification: `stripe --version` → `stripe version 1.31.0`

### 3. Environment Backup
- ✅ Backed up `.env.local` → `.env.local.backup-live-keys`
- ✅ Backup contains LIVE Stripe keys (safe for recovery)

---

## ⚠️ CRITICAL: Current Stripe Key Status

**DANGER**: `.env.local` currently contains **LIVE** Stripe keys:
```bash
NEXT_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXX...  ❌ PRODUCTION
NEXT_STRIPE_SECRET_KEY=sk_live_XXXXXXXX...      ❌ PRODUCTION
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX...     ❌ PRODUCTION
```

**Impact**: Any test will affect **REAL customers** and create **REAL charges**.

**Action Required**: Switch to TEST keys before any testing (see Manual Steps below).

---

## 📋 Manual Steps Required

### Step 1: Authenticate Stripe CLI (5 minutes)

**Why**: Required for webhook forwarding and testing.

**Command**:
```bash
~/.local/bin/stripe login
```

**Process**:
1. Command will output a URL and pairing code
2. Browser window opens automatically
3. Login to your Stripe account
4. Enter the pairing code shown in terminal
5. Confirm authorization

**Verification**:
```bash
~/.local/bin/stripe config --list
# Should show: device_name, test_mode_api_key, live_mode_api_key
```

---

### Step 2: Get Stripe TEST Keys (5 minutes)

**Navigate to**: https://dashboard.stripe.com/test/apikeys

**Steps**:
1. Click your profile icon (top right)
2. Toggle **"Viewing test data"** ON (switch to test mode)
3. Go to: **Developers** → **API Keys**
4. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

**Expected Format**:
```
pk_test_51SDMu4Deu8Wg4BBs... (publishable)
sk_test_51SDMu4Deu8Wg4BBs... (secret)
```

---

### Step 3: Switch to TEST Keys in .env.local (2 minutes)

**IMPORTANT**: Backup already created at `.env.local.backup-live-keys`

**Edit `.env.local`**:
```bash
# REPLACE these lines (17-21):

# OLD (LIVE - DANGEROUS):
NEXT_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXX...
NEXT_STRIPE_SECRET_KEY=sk_live_XXXXXXXX...

# NEW (TEST - SAFE):
NEXT_STRIPE_PUBLISHABLE_KEY=pk_test_51SDMu4Deu8Wg4BBs...
NEXT_STRIPE_SECRET_KEY=sk_test_51SDMu4Deu8Wg4BBs...

# COMMENT OUT production webhook secret:
# STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX...  # Production only
```

**Verification**:
```bash
grep "pk_test" .env.local
# Should return the test publishable key

grep "sk_test" .env.local
# Should return the test secret key
```

---

### Step 4: Create Test Price in Stripe Dashboard (5 minutes)

**Why**: Need test mode price ID for checkout testing.

**Navigate to**: https://dashboard.stripe.com/test/products

**Steps**:
1. Ensure **"Viewing test data"** is ON
2. Click **"+ Add product"**
3. Configure:
   - **Name**: Professional (Test)
   - **Description**: Recruitment Operations Professional Plan (Test Mode)
   - **Pricing model**: Standard pricing
   - **Price**: £149.00 GBP
   - **Billing period**: Monthly
   - **Payment type**: Recurring
4. Click **"Save product"**
5. Copy **Price ID** (starts with `price_test_` or `price_1...`)

**Update `.env.local`**:
```bash
# REPLACE lines 19-20:
NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID=price_test_YOUR_PRICE_ID
STRIPE_DEFAULT_PRICE_ID=price_test_YOUR_PRICE_ID
```

**Verification**:
```bash
curl http://localhost:3000/api/stripe/pricing | jq
# Should return price data with "currency": "gbp", "unit_amount": 14900
```

---

### Step 5: Start Webhook Forwarding (Keep Running)

**Why**: Local dev server needs to receive webhook events from Stripe.

**Open NEW Terminal Window**:
```bash
cd "/Users/troysamuels/recruitment ops dashboard/recruitment-operations"
~/.local/bin/stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**Expected Output**:
```
> Ready! Your webhook signing secret is whsec_XXXXXXXX (^C to quit)
```

**Copy the `whsec_...` secret and add to `.env.local`**:
```bash
# Add this line (or replace commented production webhook secret):
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX
```

**Restart dev server** (in original terminal):
```bash
# Ctrl+C, then:
npm run dev
```

**Verification** (webhook terminal should show):
```
2025-10-02 18:30:00  --> Forwarding webhooks to http://localhost:3000/api/stripe/webhook
```

**⚠️ IMPORTANT**: Keep this terminal window open during testing!

---

## 🧪 Testing Workflows

### Test 1: Complete Checkout Flow (10 minutes)

**Terminal Setup**:
- Terminal 1: `npm run dev` (running)
- Terminal 2: `stripe listen --forward-to ...` (running)

**Browser Steps**:
1. Navigate to: http://localhost:3000/billing
2. Adjust seats (e.g., 3 seats)
3. Click **"Start Subscription"**
4. Redirected to Stripe Checkout
5. Enter test card details:
   - **Card**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits (e.g., 123)
   - **Name**: Test User
   - **Email**: test@example.com
6. Click **"Subscribe"**
7. Should redirect to: `http://localhost:3000/billing?success=1`

**Expected Webhook Events** (Terminal 2):
```
checkout.session.completed
customer.subscription.created
```

**Database Verification** (Supabase Dashboard):
```sql
SELECT * FROM workspace_subscriptions
WHERE stripe_customer_id LIKE 'cus_test_%'
ORDER BY created_at DESC LIMIT 1;

-- Expected:
-- stripe_customer_id: cus_test_...
-- stripe_subscription_id: sub_test_...
-- status: trialing
-- seats: 3
```

---

### Test 2: Subscription Update (5 minutes)

**Stripe Dashboard**:
1. Go to: https://dashboard.stripe.com/test/customers
2. Find your test customer (email: test@example.com)
3. Click on the active subscription
4. Click **"Update subscription"** → **"Update quantity"**
5. Change from 3 → 5 seats
6. Click **"Update subscription"**

**Expected Webhook** (Terminal 2):
```
customer.subscription.updated
```

**Database Verification**:
```sql
SELECT seats, subscription_tier
FROM workspace_subscriptions ws
JOIN workspaces w ON ws.workspace_id = w.id
WHERE stripe_subscription_id = 'sub_test_...';

-- Expected:
-- seats: 5
-- subscription_tier: agency (seats > 1)
```

---

### Test 3: Payment Method Testing (Advanced)

**Test Cards** (https://stripe.com/docs/testing):

| Card Number          | Scenario                          |
|---------------------|-----------------------------------|
| 4242 4242 4242 4242 | Success                           |
| 4000 0025 0000 3155 | Requires 3D Secure authentication |
| 4000 0000 0000 9995 | Declined (insufficient funds)     |
| 4000 0000 0000 0341 | Declined (card declined)          |

**Trigger Events via CLI**:
```bash
~/.local/bin/stripe trigger customer.subscription.trial_will_end
~/.local/bin/stripe trigger payment_intent.payment_failed
~/.local/bin/stripe trigger invoice.payment_succeeded
```

---

## 🔒 Security Checklist

- [x] Live keys backed up to `.env.local.backup-live-keys`
- [ ] `.env.local` switched to TEST keys
- [ ] Test price created in Stripe Dashboard
- [ ] Webhook forwarding active with test `whsec_...` secret
- [ ] Dev server restarted after env changes
- [ ] Never commit `.env.local` or `.env.local.backup*` to git

---

## 🔄 Switching Back to Live Keys (Production)

**When**: After testing complete, before production deployment

**Command**:
```bash
cp .env.local.backup-live-keys .env.local
# Verify:
grep "pk_live" .env.local  # Should return live key
```

**Or manually**:
```bash
# Edit .env.local, restore:
NEXT_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXX
NEXT_STRIPE_SECRET_KEY=sk_live_XXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX
NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID=price_1SDYLiDeu8Wg4BBsNhWbMXZO
STRIPE_DEFAULT_PRICE_ID=price_1SDYLiDeu8Wg4BBsNhWbMXZO
```

---

## 📊 Current Configuration Summary

| Setting | Status | Value/Location |
|---------|--------|----------------|
| CRON_SECRET | ✅ Set | `.env.local` line 31 |
| Stripe CLI | ✅ Installed | `~/.local/bin/stripe` (v1.31.0) |
| Stripe Auth | ⏸️ Pending | Run `stripe login` |
| Test Keys | ⏸️ Pending | Switch in `.env.local` |
| Test Price | ⏸️ Pending | Create in Dashboard |
| Webhook Forwarding | ⏸️ Pending | Run `stripe listen` |
| .env.local Backup | ✅ Created | `.env.local.backup-live-keys` |
| Dev Server | ✅ Running | http://localhost:3000 |

---

## 🆘 Troubleshooting

### Issue: "stripe: command not found"
**Solution**:
```bash
export PATH="$HOME/.local/bin:$PATH"
# Or use full path:
~/.local/bin/stripe --version
```

### Issue: Webhook signature verification failed
**Solution**:
1. Ensure `STRIPE_WEBHOOK_SECRET` in `.env.local` matches output from `stripe listen`
2. Restart dev server after changing `.env.local`
3. Check Terminal 2 for any connection errors

### Issue: "No such price: price_xxx"
**Solution**:
- Verify in test mode: https://dashboard.stripe.com/test/products
- Ensure price ID copied correctly (starts with `price_test_` or `price_1...`)
- Check `.env.local` has correct price ID in both variables

### Issue: Checkout redirects immediately
**Solution**:
- Clear browser cookies/localStorage
- Verify `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Check browser console for errors

### Issue: Database not updating after webhook
**Solution**:
1. Check Terminal 2 for webhook delivery
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check Supabase logs for RLS policy errors
4. Ensure workspace exists in database

---

## 📝 Next Steps

1. **Authenticate Stripe CLI**: `stripe login`
2. **Get test keys**: Stripe Dashboard → Toggle test mode → API Keys
3. **Update .env.local**: Replace live keys with test keys
4. **Create test price**: Stripe Dashboard → Products → Add product
5. **Start webhook forwarding**: `stripe listen --forward-to ...`
6. **Run checkout test**: Navigate to /billing and test subscription

**Estimated Time**: 30 minutes for complete setup + testing

---

**Generated**: October 2, 2025
**Location**: `recruitment-operations/STRIPE_TESTING_SETUP.md`
