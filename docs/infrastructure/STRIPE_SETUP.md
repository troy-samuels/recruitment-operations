# Stripe Integration Setup & Testing

**Status**: ✅ Configured | ⚠️ Live Mode Connectivity Issue Resolved
**Last Updated**: October 2, 2025

---

## Overview

Stripe integration handles:
- 💳 Subscription checkout (£149 Professional, £399 Agency)
- 🔄 Webhook events (subscription lifecycle)
- 📊 Price fetching & display
- 💰 7-day free trial

---

## 1. Development Setup

### Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or manual installation
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.31.0/stripe_1.31.0_mac-os_arm64.tar.gz -o /tmp/stripe.tar.gz
cd /tmp && tar -xzf stripe.tar.gz
mv stripe ~/.local/bin/
```

### Authenticate

```bash
stripe login
# Opens browser for authentication
```

### Get TEST Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Toggle **"Viewing test data"** ON
3. Copy:
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

### Configure .env.local

```bash
# IMPORTANT: Use TEST keys for development
NEXT_STRIPE_PUBLISHABLE_KEY=pk_test_51SDMu4Deu8Wg4BBs...
NEXT_STRIPE_SECRET_KEY=sk_test_51SDMu4Deu8Wg4BBs...
STRIPE_DEFAULT_PRICE_ID=price_test_YOUR_PRICE_ID
NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID=price_test_YOUR_PRICE_ID
```

---

## 2. Webhook Forwarding (Local Testing)

### Start Listener

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start webhook forwarding
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**Output**:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef
```

### Add Webhook Secret

```bash
# Add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef

# Restart dev server
```

---

## 3. Create Test Price

### Via Stripe Dashboard

1. Navigate to: https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Configure:
   - **Name**: Professional (Test)
   - **Price**: £149.00 GBP
   - **Billing period**: Monthly
   - **Type**: Recurring
4. Copy **Price ID** (price_test_... or price_1...)
5. Add to `.env.local`

### Via CLI

```bash
# Create product
stripe products create \
  --name="Professional (Test)" \
  --description="Recruitment Operations Professional Plan"

# Create price
stripe prices create \
  --product=prod_test_... \
  --unit-amount=14900 \
  --currency=gbp \
  --recurring[interval]=month
```

---

## 4. Testing Workflows

### Test 1: Checkout Flow

```bash
# 1. Navigate to billing page
open http://localhost:3000/billing

# 2. Set seats (e.g., 3)
# 3. Click "Start Subscription"
# 4. Use test card: 4242 4242 4242 4242
# 5. Complete checkout
```

**Expected**:
- ✅ Redirects to Stripe Checkout
- ✅ Checkout completes
- ✅ Redirects to /billing?success=1
- ✅ Webhooks received (Terminal 2):
  ```
  checkout.session.completed
  customer.subscription.created
  ```

### Test 2: Webhook Processing

**Verify in Supabase Dashboard**:
```sql
SELECT * FROM workspace_subscriptions
WHERE stripe_customer_id LIKE 'cus_test_%'
ORDER BY created_at DESC;
```

**Expected**:
- stripe_customer_id: cus_test_...
- stripe_subscription_id: sub_test_...
- status: trialing
- seats: 3

### Test 3: Trigger Events Manually

```bash
# Subscription created
stripe trigger customer.subscription.created

# Trial ending soon
stripe trigger customer.subscription.trial_will_end

# Payment succeeded
stripe trigger invoice.payment_succeeded

# Payment failed
stripe trigger payment_intent.payment_failed
```

---

## 5. Production Setup

### Get LIVE Keys

1. Navigate to: https://dashboard.stripe.com/apikeys
2. Toggle to **Live mode**
3. Copy:
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)

### Create Production Price

1. Navigate to: https://dashboard.stripe.com/products
2. Create product (same as test mode):
   - Professional: £149/month
   - Agency: £399/month
3. Copy **Price IDs**

### Create Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Configure:
   - **Endpoint URL**: `https://jobwall.co.uk/api/stripe/webhook`
   - **Events to send**:
     - checkout.session.completed
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_succeeded
     - invoice.payment_failed
4. Click **"Add endpoint"**
5. Copy **Signing secret** (whsec_...)

### Set Production Environment Variables

```bash
# Via Vercel Dashboard or CLI
npx vercel env add NEXT_STRIPE_PUBLISHABLE_KEY production
# Enter: pk_live_...

npx vercel env add NEXT_STRIPE_SECRET_KEY production
# Enter: sk_live_...

npx vercel env add STRIPE_WEBHOOK_SECRET production
# Enter: whsec_... (from webhook endpoint)

npx vercel env add STRIPE_DEFAULT_PRICE_ID production
# Enter: price_1... (production price ID)
```

---

## 6. API Routes

### `/api/stripe/checkout` (POST)

**Purpose**: Create Stripe Checkout session

**Request**:
```json
{
  "seats": 3,
  "priceId": "price_1SDYLiDeu8Wg4BBsNhWbMXZO",
  "workspaceId": "uuid"
}
```

**Response**:
```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### `/api/stripe/webhook` (POST)

**Purpose**: Handle Stripe webhook events

**Events Handled**:
- `checkout.session.completed` → Create subscription record
- `customer.subscription.created` → Update workspace tier
- `customer.subscription.updated` → Update seats, status
- `customer.subscription.deleted` → Mark as canceled

**Database Actions**:
```sql
-- Insert/update workspace_subscriptions
INSERT INTO workspace_subscriptions (
  workspace_id,
  stripe_customer_id,
  stripe_subscription_id,
  seats,
  status
) VALUES (...);

-- Update workspace tier
UPDATE workspaces
SET subscription_tier = CASE
  WHEN seats > 1 THEN 'agency'
  ELSE 'professional'
END
WHERE id = workspace_id;
```

### `/api/stripe/pricing` (GET)

**Purpose**: Fetch price details

**Response**:
```json
{
  "price": {
    "id": "price_1SDYLiDeu8Wg4BBsNhWbMXZO",
    "currency": "gbp",
    "unit_amount": 14900,
    "recurring": {
      "interval": "month"
    }
  },
  "product": {
    "id": "prod_...",
    "name": "Professional"
  }
}
```

---

## 7. Troubleshooting

### Issue: Stripe Connection Error (HTTP 500)

**Symptom**:
```
Error: "An error occurred with our connection to Stripe"
```

**Diagnosis**:
See STRIPE_DIAGNOSTIC_REPORT.md for historical context

**Solutions**:

1. **Verify API Keys**:
```bash
# Test keys directly
curl -u "sk_live_...:" https://api.stripe.com/v1/prices/price_xxx
```

2. **Change Vercel Region**:
```json
// vercel.json
{
  "regions": ["iad1"]  // Changed from lhr1
}
```

3. **Check API Version**:
```typescript
// Ensure latest API version
const stripe = new Stripe(secretKey, {
  apiVersion: '2025-09-30.clover',
  timeout: 25000,
  maxNetworkRetries: 2
})
```

4. **Use Environment Variable Fallbacks**:
```typescript
const secretKey = process.env.NEXT_STRIPE_SECRET_KEY
  || process.env.STRIPE_SECRET_KEY
  || process.env.STRIPE_LIVE_SECRET_KEY
```

### Issue: Webhook Signature Verification Failed

**Symptom**:
```
Error: "No signatures found matching the expected signature"
```

**Solutions**:
1. Verify `STRIPE_WEBHOOK_SECRET` matches webhook endpoint
2. Restart application after changing env vars
3. Check webhook endpoint URL is correct
4. Ensure raw body parsing (Next.js handles this)

### Issue: Test Card Declined

**Test Cards**:
```
Success: 4242 4242 4242 4242
3D Secure: 4000 0025 0000 3155
Declined (insufficient funds): 4000 0000 0000 9995
Declined (generic): 4000 0000 0000 0341
```

---

## 8. CLI Commands Reference

### Authentication
```bash
stripe login
stripe config --list
```

### Webhook Testing
```bash
# Listen for webhooks
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# Trigger specific events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

### Customer Management
```bash
# List customers
stripe customers list --limit 10

# Get customer
stripe customers retrieve cus_...

# List subscriptions
stripe subscriptions list --customer cus_...

# Update subscription
stripe subscriptions update sub_... --quantity 5

# Cancel subscription
stripe subscriptions cancel sub_...
```

### Price Management
```bash
# List prices
stripe prices list --limit 10

# Get price
stripe prices retrieve price_...

# Create price
stripe prices create \
  --product prod_... \
  --unit-amount 14900 \
  --currency gbp \
  --recurring[interval]=month
```

### Logs
```bash
# Stream API logs
stripe logs tail

# Filter by resource
stripe logs tail --filter-resource subscription

# Show events
stripe events list --limit 20
```

---

## 9. Database Schema

### workspace_subscriptions

```sql
CREATE TABLE workspace_subscriptions (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  price_id TEXT,
  seats INTEGER NOT NULL DEFAULT 1,
  status TEXT CHECK (status IN (
    'trialing',
    'active',
    'past_due',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'unpaid'
  )),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies**:
- Users can view their workspace subscription
- Service role can manage all subscriptions (webhooks)

---

## 10. Testing Checklist

### Local Development
- [ ] Stripe CLI installed and authenticated
- [ ] TEST keys configured in .env.local
- [ ] Test price created
- [ ] Webhook listener running
- [ ] Dev server running
- [ ] Checkout flow completes
- [ ] Webhooks received and processed
- [ ] Database updated correctly

### Production
- [ ] LIVE keys configured in Vercel
- [ ] Production price created
- [ ] Webhook endpoint created
- [ ] Webhook secret added to env vars
- [ ] Checkout flow tested with real card
- [ ] Subscription created in Dashboard
- [ ] Webhooks delivered successfully
- [ ] Database records created

---

## Status

**Development**: ✅ Fully Configured
- Stripe CLI installed
- TEST keys configured
- Webhook forwarding setup documented

**Production**: ⚠️ Connectivity Issue Resolved
- Changed region from lhr1 → iad1
- Updated API version to latest
- Live keys configured
- Webhook endpoint created

**Next Steps**:
1. Test production checkout with live card
2. Monitor webhook delivery logs
3. Verify subscription lifecycle events

---

## Resources

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Docs**: https://stripe.com/docs
- **Testing Cards**: https://stripe.com/docs/testing
- **Webhook Events**: https://stripe.com/docs/api/events/types
- **CLI Docs**: https://stripe.com/docs/cli

For detailed test card numbers and workflows, see:
- `STRIPE_CLI_COMMANDS.md` (root directory - will be archived)
- `STRIPE_TESTING_SETUP.md` (root directory - will be archived)
