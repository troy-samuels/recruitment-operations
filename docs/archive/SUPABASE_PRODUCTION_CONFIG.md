# Supabase Production Configuration Checklist

This document provides a comprehensive checklist for verifying and configuring Supabase in production for the Jobwall recruitment operations dashboard.

## ✅ Authentication Configuration

### Email Authentication (Magic Link/OTP)
**Status**: ✅ Implemented in code (AuthProvider.tsx:86)

**Supabase Dashboard Settings to Verify**:

1. **Navigate to**: Authentication → Providers → Email
   - ✅ Email provider should be **ENABLED**
   - ✅ "Enable email confirmations" - **RECOMMENDED: ON**
   - ✅ "Secure email change" - **RECOMMENDED: ON**

2. **Email Templates** (Authentication → Email Templates):

   **Confirmation Email** (Magic Link):
   ```
   Subject: Log in to Jobwall
   Body: Click here to log in: {{ .ConfirmationURL }}
   ```

   **Invite Email** (for team members):
   ```
   Subject: You've been invited to Jobwall
   Body: Click here to accept: {{ .ConfirmationURL }}
   ```

   **Password Reset**:
   ```
   Subject: Reset your Jobwall password
   Body: Click here to reset: {{ .ConfirmationURL }}
   ```

3. **Auth Settings** (Authentication → Settings):
   - ✅ Site URL: `https://jobwall.co.uk`
   - ✅ Redirect URLs (add these):
     - `https://jobwall.co.uk/dashboard`
     - `https://jobwall.co.uk/onboarding`
     - `http://localhost:3000/dashboard` (for local development)
     - `http://localhost:3000/onboarding` (for local development)

4. **Rate Limits** (Authentication → Rate Limits):
   - **Recommended**: 30 requests per hour for email OTP
   - **Recommended**: 10 requests per hour for password reset

### OAuth Providers (Optional)
**Status**: ✅ Code supports Google & Microsoft (AuthProvider.tsx:94-110)

1. **Google OAuth** (if enabled):
   - Configure Google Cloud Console OAuth client
   - Add client ID and secret to Supabase dashboard
   - Redirect URL: `https://votpasanvrutqwyzxzmk.supabase.co/auth/v1/callback`

2. **Microsoft/Azure OAuth** (if enabled):
   - Configure Azure AD application
   - Add client ID and secret to Supabase dashboard
   - Redirect URL: `https://votpasanvrutqwyzxzmk.supabase.co/auth/v1/callback`

---

## ✅ Database Configuration

### Row Level Security (RLS)
**Status**: ✅ Enabled on all 11 core tables

Tables with RLS enabled:
1. ✅ `workspaces` - Workspace-scoped access
2. ✅ `profiles` - User profiles linked to auth.uid()
3. ✅ `clients` - Client companies
4. ✅ `roles` - Job roles/placements
5. ✅ `role_assignments` - Team member assignments
6. ✅ `candidates` - Candidate records
7. ✅ `pipeline_stages` - Custom pipeline stages
8. ✅ `activities` - Activity tracking
9. ✅ `tasks` - Task management
10. ✅ `events` - Event logs
11. ✅ `workspace_subscriptions` - Billing/subscription data

**Verification Query** (run in Supabase SQL Editor):
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'workspaces', 'profiles', 'clients', 'roles',
    'role_assignments', 'candidates', 'pipeline_stages',
    'activities', 'tasks', 'events', 'workspace_subscriptions'
  );
```
All rows should show `rowsecurity = true`.

### Database Backups
**Supabase Dashboard**: Project Settings → Backups

- ✅ **Daily Backups**: Enabled by default (Pro plan and above)
- ✅ **Point-in-Time Recovery (PITR)**: Available on Pro plan
- ✅ **Retention**: 7 days (Free), 14-30 days (Pro+)

**Manual Backup Command** (local development):
```bash
# Export schema
pg_dump -U postgres -h db.votpasanvrutqwyzxzmk.supabase.co \
  -d postgres --schema-only > schema-backup.sql

# Export data
pg_dump -U postgres -h db.votpasanvrutqwyzxzmk.supabase.co \
  -d postgres --data-only > data-backup.sql
```

---

## ✅ CORS Configuration

### Supabase API CORS
**Navigate to**: Project Settings → API

**Allowed Origins** should include:
- ✅ `https://jobwall.co.uk` (production)
- ✅ `http://localhost:3000` (local development)
- ✅ `http://localhost:3001` (alternative local port)

**Note**: For same-origin requests (frontend and API on same domain), CORS is not an issue. The CORS configuration in vercel.json handles production API requests.

---

## ✅ Security & Performance

### API Keys
**Status**: ✅ Configured in .env.local

Verify these environment variables are set:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://votpasanvrutqwyzxzmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (public, safe to expose)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (secret, server-side only)
```

**Security Notes**:
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (protected by RLS)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` **MUST** remain secret (bypasses RLS)
- ✅ Never commit `.env.local` to git

### Connection Pooling
**Navigate to**: Project Settings → Database → Connection Pooling

- ✅ **Mode**: Transaction
- ✅ **Pool Size**: Default (15) for Free tier, increase for higher plans
- ✅ **Connection String**: Use pooling string for serverless functions

### Database Indexes
**Verification Query**:
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Recommended Indexes** (should already exist from schema):
- `profiles.workspace_id` - Foreign key index
- `roles.workspace_id` - Foreign key index
- `clients.workspace_id` - Foreign key index
- `candidates.role_id` - Foreign key index
- `tasks.role_id` - Foreign key index

---

## ✅ Monitoring & Analytics

### Supabase Dashboard Monitoring
**Navigate to**: Reports

Key metrics to monitor:
1. **Database**:
   - Database size (check against plan limits)
   - Active connections
   - Query performance

2. **API**:
   - Request count
   - Response times
   - Error rates

3. **Auth**:
   - Daily/monthly active users
   - Sign-up rate
   - Failed login attempts

### Alerts (Pro plan and above)
**Navigate to**: Project Settings → Alerts

Recommended alerts:
- ✅ Database size > 80% of plan limit
- ✅ CPU usage > 80%
- ✅ High error rate (> 5% of requests)

---

## ✅ Email Integration (Resend)

**Status**: ✅ Configured with custom domain

**Environment Variables**:
```bash
RESEND_API_KEY=re_BRPnMF2J_MkgzNLxfdQrY1D9rm2CS62a5
RESEND_FROM_EMAIL=onboarding@send.jobwall.co.uk
```

**DNS Records** (configured in Vercel):
- ✅ MX record for send.jobwall.co.uk
- ✅ SPF record (TXT)
- ✅ DKIM record (TXT)
- ✅ DMARC record (TXT)

**Email Templates** (src/lib/resend.ts):
- ✅ Welcome email (sendWelcomeEmail)
- ✅ Activity reminder email (sendActivityReminderEmail)

---

## ✅ Cron Jobs & Scheduled Tasks

**Vercel Cron Configuration** (vercel.json:11-15):
```json
"crons": [
  {
    "path": "/api/cron/refresh-analytics",
    "schedule": "0 */6 * * *"
  }
]
```

**Schedule**: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)

**Endpoint**: `/api/cron/refresh-analytics`
- ✅ Protected with `CRON_SECRET` environment variable
- ✅ Validates `x-vercel-cron` header
- ✅ Refreshes analytics data for all workspaces

**Test Cron Endpoint** (locally):
```bash
curl -X POST http://localhost:3000/api/cron/refresh-analytics \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

---

## ✅ Production Readiness Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Supabase auth redirect URLs configured
- [ ] Email templates customized and tested
- [ ] RLS policies verified on all tables
- [ ] Database indexes created
- [ ] CORS settings configured

### Post-Deployment
- [ ] Test email authentication (magic link)
- [ ] Test OAuth providers (if enabled)
- [ ] Verify API endpoints return expected data
- [ ] Test cron job execution (check Vercel logs)
- [ ] Monitor error rates for first 24 hours
- [ ] Verify email delivery (check Resend dashboard)

### Ongoing Monitoring
- [ ] Daily: Check error rates in Vercel and Supabase dashboards
- [ ] Weekly: Review database size and connection usage
- [ ] Monthly: Review user growth and adjust rate limits if needed
- [ ] Quarterly: Test backup restoration procedure

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/votpasanvrutqwyzxzmk
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Resend Dashboard**: https://resend.com/dashboard
- **Production Site**: https://jobwall.co.uk
- **Local Development**: http://localhost:3000

---

## 📧 Support

For issues with:
- **Supabase**: https://supabase.com/docs or support@supabase.com
- **Vercel**: https://vercel.com/docs or support@vercel.com
- **Resend**: https://resend.com/docs or support@resend.com

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
**Maintained by**: Recruitment Operations Team
