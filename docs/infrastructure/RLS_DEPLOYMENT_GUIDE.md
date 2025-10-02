# RLS Security Fixes - Deployment Guide

**Project**: Recruitment Operations Dashboard
**Date**: 2025-10-02
**Priority**: 🚨 **CRITICAL** - Security vulnerabilities fixed
**Estimated Time**: 15-30 minutes

---

## 📋 Executive Summary

### Issues Fixed
- **3 Critical vulnerabilities** - Cross-workspace data leakage
- **4 Moderate issues** - Incomplete access controls
- **Total tables secured**: 14 tables + 3 materialized views

### Impact
- ✅ Workspace isolation enforced (users cannot see other workspaces)
- ✅ Sensitive billing data protected
- ✅ Analytics data secured with workspace filtering
- ✅ Lead capture forms secured (insert-only)

---

## 🚀 Quick Deployment (Production)

### Step 1: Backup Database (5 minutes)
```bash
# Via Supabase Dashboard:
# 1. Go to Database > Backups
# 2. Click "Create backup now"
# 3. Wait for confirmation
# OR use pg_dump if you have direct access
```

### Step 2: Apply Migration (5 minutes)
```bash
# Option A: Via Supabase Dashboard (Recommended)
# 1. Go to SQL Editor
# 2. Create new query
# 3. Copy/paste contents of: database-schema-rls-fixes.sql
# 4. Click "Run"
# 5. Verify success messages in output

# Option B: Via Supabase CLI
supabase db push --file database-schema-rls-fixes.sql
```

### Step 3: Verify Deployment (5 minutes)
Run verification queries from `RLS_VERIFICATION.md`:

```sql
-- Check all tables have RLS enabled
SELECT
    tablename,
    CASE
        WHEN c.relrowsecurity THEN '✅ Enabled'
        ELSE '❌ DISABLED'
    END as rls_status
FROM pg_tables t
LEFT JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
ORDER BY rls_status, tablename;
```

**Expected**: All tables should show "✅ Enabled"

### Step 4: Test with Real Users (10 minutes)
1. Log in as User A from Workspace A
2. Verify you can only see Workspace A data
3. Log in as User B from Workspace B
4. Verify you can only see Workspace B data
5. Verify User A cannot see User B's data

### Step 5: Monitor (Ongoing)
```bash
# Check Supabase logs for RLS policy violations
# Dashboard > Logs > Database
# Look for: "permission denied" or "RLS policy violation"
```

---

## 📁 Files Created

### 1. `database-schema-rls-fixes.sql` (Main Migration)
- **Purpose**: Apply all RLS security fixes
- **When to use**: Initial deployment to production
- **Idempotent**: Yes (safe to run multiple times)
- **Size**: ~500 lines
- **Execution time**: ~10-15 seconds

### 2. `RLS_VERIFICATION.md` (Testing Guide)
- **Purpose**: Comprehensive testing checklist
- **When to use**: After applying migration, for ongoing verification
- **Contains**:
  - Verification queries
  - Manual test scenarios
  - Expected results
  - Troubleshooting guide

### 3. `rollback-rls-fixes.sql` (Emergency Rollback)
- **Purpose**: Revert changes if issues occur
- **When to use**: ONLY if critical bugs found after deployment
- **Warning**: Re-introduces security vulnerabilities
- **Execution time**: ~5 seconds

### 4. `database-schema.sql` (Updated Master Schema)
- **Purpose**: Complete schema with all RLS policies documented
- **When to use**: For new database setups or reference
- **Status**: Fully updated with all fixes

### 5. `RLS_DEPLOYMENT_GUIDE.md` (This File)
- **Purpose**: Step-by-step deployment instructions
- **Audience**: DevOps, Backend engineers, DBAs

---

## 🔐 Security Model Overview

### Before (VULNERABLE)
```
❌ auto_task_rules: No RLS - Anyone could see all workspaces' rules
❌ client_response_stats: No RLS - Cross-workspace data leakage
❌ Materialized views: No protection - Analytics data exposed
⚠️ leads: No policies - Anyone could read pre-signup data
⚠️ workspace_subscriptions: Incomplete - Users could modify billing
```

### After (SECURED)
```
✅ auto_task_rules: Workspace-scoped (users see only their rules)
✅ client_response_stats: Workspace-scoped (no cross-workspace access)
✅ Materialized views: Secure functions enforce workspace filtering
✅ leads: INSERT-only for public, SELECT for service role only
✅ workspace_subscriptions: Users read-only, service role modifies
✅ workspaces: Users can create, admins can update
✅ profiles: Users can create their own, update their own only
```

---

## 🧪 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] Database backup completed
- [ ] Read the migration script (`database-schema-rls-fixes.sql`)
- [ ] Staging environment tested (if available)
- [ ] Rollback script available (`rollback-rls-fixes.sql`)
- [ ] Team notified of deployment window
- [ ] Monitoring/alerting configured

---

## 🔧 Deployment Options

### Option 1: Zero-Downtime Deployment (Recommended)
RLS policies are applied instantly without locking tables.

```sql
-- Run database-schema-rls-fixes.sql via Supabase SQL Editor
-- No downtime required
-- Users may experience slight latency during policy evaluation
```

**Advantages**:
- No service interruption
- Fast deployment (<1 minute)
- Safe for production

**Disadvantages**:
- Cannot test rollback without affecting users

### Option 2: Maintenance Window Deployment
Schedule a brief maintenance window for maximum safety.

```bash
# 1. Put site in maintenance mode (2 minutes)
# 2. Apply migration (5 minutes)
# 3. Run verification queries (5 minutes)
# 4. Test with sample users (5 minutes)
# 5. Remove maintenance mode
# Total: 15-20 minutes
```

**Advantages**:
- Can thoroughly test before going live
- Easy rollback if issues found

**Disadvantages**:
- Requires user notification
- Brief service interruption

---

## 🚨 Rollback Procedure

If critical issues occur after deployment:

### Step 1: Assess Impact
- What is broken?
- Which users are affected?
- Is data still protected?

### Step 2: Execute Rollback (If Necessary)
```sql
-- Run rollback-rls-fixes.sql in Supabase SQL Editor
-- This will restore pre-migration state
-- WARNING: Re-introduces security vulnerabilities
```

### Step 3: Investigate Root Cause
- Check application logs
- Review user reports
- Test locally with same data

### Step 4: Fix and Re-Deploy
- Adjust policies as needed
- Test in staging
- Re-apply fixed migration

---

## 📊 Expected Changes

### Database Objects Created/Modified

| Object Type | Count | Action |
|-------------|-------|--------|
| RLS Policies | 17 | Created/Updated |
| Functions | 4 | Created |
| Tables | 7 | RLS Enabled |
| Permissions | 4 | Granted |

### Policy Distribution

| Table | Policies Added | Type |
|-------|----------------|------|
| `workspaces` | 2 new | INSERT, UPDATE |
| `profiles` | 1 new | INSERT |
| `workspace_subscriptions` | 1 new | ALL (service role) |
| `auto_task_rules` | 1 new | ALL (workspace-scoped) |
| `client_response_stats` | 1 new | ALL (workspace-scoped) |
| `leads` | 2 new | INSERT (public), SELECT (service) |

---

## 🎯 Post-Deployment Tasks

### Immediate (Within 1 hour)
- [ ] Run all verification queries
- [ ] Test with 2+ different user accounts
- [ ] Monitor error logs for RLS violations
- [ ] Check application performance (should be minimal impact)

### Short-term (Within 24 hours)
- [ ] Update API routes to use secure wrapper functions for analytics
- [ ] Document any edge cases discovered
- [ ] Update frontend code if needed
- [ ] Notify team of completion

### Long-term (Within 1 week)
- [ ] Performance audit on RLS query plans
- [ ] Add indexes if needed for RLS performance
- [ ] Update developer documentation
- [ ] Train team on new security model

---

## 🔍 API Routes That Need Updates

After deploying RLS fixes, update these API routes to use secure wrapper functions:

### Analytics Routes (`/api/analytics/*`)

**Before:**
```typescript
// ❌ Direct materialized view access (no workspace filtering)
const { data } = await supabase
  .from('events_daily_counts')
  .select('*');
```

**After:**
```typescript
// ✅ Use secure wrapper function (workspace-scoped)
const { data } = await supabase
  .rpc('get_events_daily_counts', {
    p_start_date: startDate,
    p_end_date: endDate
  });
```

### Affected Files:
- `src/app/api/analytics/summary/route.ts`
- `src/app/api/analytics/timeseries/route.ts`
- `src/app/api/analytics/heatmap/route.ts`

---

## 💡 Troubleshooting Common Issues

### Issue: "permission denied for table X"
**Cause**: User trying to access data outside their workspace
**Solution**: This is expected behavior - RLS is working correctly

### Issue: "User not associated with a workspace"
**Cause**: User profile missing workspace_id
**Solution**:
```sql
-- Check user's workspace
SELECT id, email, workspace_id FROM profiles WHERE id = auth.uid();

-- Fix if needed (run as admin)
UPDATE profiles SET workspace_id = 'xxx' WHERE id = 'user-id';
```

### Issue: Stripe webhook failing
**Cause**: Service role key not configured
**Solution**: Ensure webhook uses `SUPABASE_SERVICE_ROLE_KEY` not anon key

### Issue: Analytics dashboard blank
**Cause**: Not using secure wrapper functions
**Solution**: Update API routes to use `get_events_*` functions

### Issue: Performance degradation
**Cause**: RLS subqueries not optimized
**Solution**:
```sql
-- Check query plan
EXPLAIN ANALYZE SELECT * FROM roles WHERE workspace_id = 'xxx';

-- Add indexes if needed
CREATE INDEX IF NOT EXISTS idx_roles_workspace_id ON roles(workspace_id);
```

---

## 📞 Support & Resources

### Documentation
- `RLS_VERIFICATION.md` - Testing and verification guide
- `database-schema.sql` - Complete schema reference
- `database-schema-rls-fixes.sql` - Migration script with comments

### Supabase Resources
- [RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Security Best Practices](https://supabase.com/docs/guides/security)
- [Troubleshooting Guide](https://supabase.com/docs/guides/platform/troubleshooting)

### Team Contacts
- **Security Issues**: [Create GitHub issue with [SECURITY] tag]
- **Deployment Help**: [DevOps team]
- **Database Questions**: [Backend team lead]

---

## ✅ Success Criteria

Deployment is successful when:

1. ✅ All tables have RLS enabled
2. ✅ No RLS policy violations in logs
3. ✅ Users can only see their workspace data
4. ✅ Service role can bypass RLS for admin operations
5. ✅ Stripe webhooks work correctly
6. ✅ Analytics dashboard shows correct data
7. ✅ Performance is acceptable (<100ms overhead)
8. ✅ No user-reported access issues

---

## 🎉 Deployment Complete!

Once all checks pass, the security vulnerabilities are fixed and your database is properly secured with comprehensive Row Level Security policies.

**Next Steps**:
1. Mark deployment as complete in project tracker
2. Update status page (if applicable)
3. Monitor for 24-48 hours for any edge cases
4. Schedule follow-up review in 1 week

---

**Deployed By**: _________________
**Date**: _________________
**Time**: _________________
**Verified By**: _________________
**Issues Found**: _________________

---

**Last Updated**: 2025-10-02
**Version**: 1.0
**Status**: ✅ Ready for Production
