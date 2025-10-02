# Stripe CLI Quick Reference

**Stripe CLI Version**: 1.31.0
**Installation Path**: `~/.local/bin/stripe`

---

## 🔐 Authentication

```bash
# Login (opens browser)
stripe login

# Check config
stripe config --list

# Set API key manually (alternative to login)
stripe config --set test_mode_api_key sk_test_...
```

---

## 🎧 Webhook Forwarding

### Basic Forwarding
```bash
# Forward to local endpoint
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# Forward with specific events only
stripe listen \
  --forward-to http://localhost:3000/api/stripe/webhook \
  --events checkout.session.completed,customer.subscription.updated
```

### Output Analysis
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef
> 2025-10-02 18:30:00  --> checkout.session.completed [evt_test_...]
> 2025-10-02 18:30:01  --> customer.subscription.created [evt_test_...]
```

**Action**: Copy `whsec_...` to `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Trigger Test Events

### Subscription Events
```bash
# New subscription checkout
stripe trigger checkout.session.completed

# Trial ending soon
stripe trigger customer.subscription.trial_will_end

# Subscription updated
stripe trigger customer.subscription.updated

# Subscription deleted/cancelled
stripe trigger customer.subscription.deleted
```

### Payment Events
```bash
# Successful payment
stripe trigger payment_intent.succeeded

# Failed payment
stripe trigger payment_intent.payment_failed

# Invoice paid
stripe trigger invoice.payment_succeeded

# Invoice payment failed
stripe trigger invoice.payment_failed
```

### Custom Trigger (Advanced)
```bash
# Trigger with specific data
stripe trigger customer.subscription.created \
  --add customer:metadata.workspace_id=00000000-0000-0000-0000-000000000001 \
  --add items[0].quantity=5
```

---

## 💰 Prices & Products

```bash
# List all prices (test mode)
stripe prices list --limit 10

# Get specific price
stripe prices retrieve price_test_...

# Create new price
stripe prices create \
  --product prod_test_... \
  --unit-amount 14900 \
  --currency gbp \
  --recurring[interval]=month

# List products
stripe products list --limit 10
```

---

## 👥 Customers & Subscriptions

```bash
# List customers
stripe customers list --limit 10

# Get customer details
stripe customers retrieve cus_test_...

# List customer subscriptions
stripe subscriptions list --customer cus_test_...

# Get subscription details
stripe subscriptions retrieve sub_test_...

# Update subscription quantity (seats)
stripe subscriptions update sub_test_... --quantity 5

# Cancel subscription
stripe subscriptions cancel sub_test_...
```

---

## 💳 Test Cards

### Via CLI
```bash
# Create test payment method
stripe payment_methods create \
  --type card \
  --card[number]=4242424242424242 \
  --card[exp_month]=12 \
  --card[exp_year]=2034 \
  --card[cvc]=123
```

### In Browser Checkout

| Card Number          | Scenario                          |
|---------------------|-----------------------------------|
| 4242 4242 4242 4242 | ✅ Success                        |
| 4000 0025 0000 3155 | 🔐 Requires 3D Secure             |
| 4000 0000 0000 9995 | ❌ Insufficient funds             |
| 4000 0000 0000 0341 | ❌ Card declined                  |
| 4000 0000 0000 0002 | ❌ Generic decline                |
| 4000 0084 0000 1629 | ❌ Expired card                   |
| 4000 0000 0000 0069 | ❌ CVC check fails                |

**All test cards**:
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any valid postal code

---

## 📜 Logs & Events

```bash
# Stream live API logs
stripe logs tail

# Filter by resource
stripe logs tail --filter-resource subscription

# Filter by status code
stripe logs tail --filter-status-code 200

# Show recent events
stripe events list --limit 20

# Get specific event
stripe events retrieve evt_test_...
```

---

## 🔍 Debugging

```bash
# Test webhook endpoint manually
stripe trigger checkout.session.completed \
  --override checkout_session:metadata.workspace_id=test-workspace

# Verify price configuration
curl http://localhost:3000/api/stripe/pricing | jq

# Check current Stripe mode
stripe config --list | grep mode
```

---

## 🎯 Common Workflows

### Workflow 1: Test Subscription Lifecycle
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start webhook listener
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# Terminal 3: Trigger events in sequence
stripe trigger checkout.session.completed
sleep 2
stripe trigger customer.subscription.created
sleep 5
stripe trigger customer.subscription.updated
sleep 5
stripe trigger customer.subscription.deleted
```

### Workflow 2: Test Trial Expiration
```bash
# Create subscription with trial
stripe trigger checkout.session.completed

# Wait 3 days (simulate with event)
stripe trigger customer.subscription.trial_will_end

# Expire trial
stripe trigger invoice.payment_succeeded
```

### Workflow 3: Test Payment Failures
```bash
# Create subscription
stripe trigger checkout.session.completed

# Fail payment
stripe trigger invoice.payment_failed

# Retry payment (success)
stripe trigger invoice.payment_succeeded
```

---

## 🚨 Emergency Commands

### Kill Webhook Listener
```bash
# Find process
lsof -i :3000 | grep stripe

# Or just Ctrl+C in the terminal
```

### Clear Test Data
```bash
# Delete all test customers (use carefully!)
# No bulk delete in CLI - use Dashboard instead
# Dashboard → Test Mode → Customers → Select All → Delete
```

### Verify Environment
```bash
# Check which keys are loaded
env | grep STRIPE

# Verify test mode
stripe config --list | grep test_mode_api_key
```

---

## 🔗 Useful Links

- **Stripe CLI Docs**: https://stripe.com/docs/cli
- **Test Cards**: https://stripe.com/docs/testing
- **Webhook Events**: https://stripe.com/docs/api/events/types
- **Trigger Events**: https://stripe.com/docs/cli/trigger

---

## 💡 Tips & Best Practices

1. **Always verify test mode**: Check for `_test_` in IDs (e.g., `cus_test_...`, `sub_test_...`)
2. **Keep webhook listener running**: Separate terminal window, don't close
3. **Use descriptive metadata**: Add `workspace_id`, `user_email` to help debugging
4. **Monitor both terminals**: Watch webhook events in Terminal 2, API responses in browser console
5. **Clear browser cache**: After env changes, clear localStorage/cookies
6. **Copy webhook secret immediately**: From `stripe listen` output to `.env.local`

---

## 🐛 Common Errors

### "No webhook signature found"
```bash
# Verify STRIPE_WEBHOOK_SECRET matches stripe listen output
# Restart dev server after changing .env.local
```

### "Authentication required"
```bash
stripe login
# Follow browser prompts
```

### "Resource not found"
```bash
# Verify you're in test mode
stripe config --list | grep mode

# Check Dashboard is in test mode (toggle top-right)
```

---

**Last Updated**: October 2, 2025
**For Project**: Recruitment Operations Dashboard (Jobwall)
