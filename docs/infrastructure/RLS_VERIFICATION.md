# RLS Security Verification Guide

**Project**: Recruitment Operations Dashboard
**Date**: 2025-10-02
**Purpose**: Comprehensive testing checklist for Row Level Security policies

---

## 📋 Quick Verification Checklist

- [ ] All tables have RLS enabled
- [ ] Critical tables are secure (auto_task_rules, client_response_stats)
- [ ] Materialized view access is workspace-scoped
- [ ] Workspace isolation works (User A cannot see User B's data)
- [ ] Service role can bypass RLS for admin operations
- [ ] Anonymous users can insert leads but not read them
- [ ] Stripe webhook can update subscriptions
- [ ] Users can create profiles and workspaces during provisioning

---

## 🔍 Verification Queries

### 1. Check All Tables Have RLS Enabled

```sql
-- Run this in Supabase SQL Editor
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

---

### 2. List All RLS Policies by Table

```sql
SELECT
    tablename,
    policyname,
    cmd as operation,
    CASE
        WHEN roles::text LIKE '%public%' THEN 'Public'
        WHEN roles::text LIKE '%authenticated%' THEN 'Authenticated'
        ELSE roles::text
    END as applies_to
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected**: Each table should have appropriate policies (see table below)

---

### 3. Verify Critical Tables Are Secured

```sql
-- Check that critical tables have RLS enabled
SELECT
    t.table_name,
    CASE
        WHEN c.relrowsecurity THEN '✅ Secured'
        ELSE '❌ VULNERABLE'
    END as status,
    COUNT(p.policyname) as policy_count
FROM information_schema.tables t
LEFT JOIN pg_class c ON c.relname = t.table_name
LEFT JOIN pg_policies p ON p.tablename = t.table_name
WHERE t.table_schema = 'public'
    AND t.table_name IN (
        'auto_task_rules',
        'client_response_stats',
        'workspace_subscriptions',
        'leads'
    )
GROUP BY t.table_name, c.relrowsecurity
ORDER BY t.table_name;
```

**Expected**:
- `auto_task_rules`: ✅ Secured, 1 policy
- `client_response_stats`: ✅ Secured, 1 policy
- `workspace_subscriptions`: ✅ Secured, 2 policies
- `leads`: ✅ Secured, 2 policies

---

## 🧪 Manual Testing Scenarios

### Scenario 1: Workspace Isolation Test

**Goal**: Verify User A cannot see User B's data

#### Setup (Run as Admin/Service Role):
```sql
-- Create two test workspaces
INSERT INTO workspaces (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Test Workspace A'),
    ('22222222-2222-2222-2222-222222222222', 'Test Workspace B');

-- Create two test users (assumes auth.users already exist)
INSERT INTO profiles (id, email, workspace_id, role) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'userA@test.com', '11111111-1111-1111-1111-111111111111', 'admin'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'userB@test.com', '22222222-2222-2222-2222-222222222222', 'admin');

-- Create test data for each workspace
INSERT INTO clients (workspace_id, company_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Client for Workspace A'),
    ('22222222-2222-2222-2222-222222222222', 'Client for Workspace B');

INSERT INTO roles (workspace_id, job_title, company_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Developer A', 'Company A'),
    ('22222222-2222-2222-2222-222222222222', 'Developer B', 'Company B');
```

#### Test (Run as User A):
```sql
-- Set session to User A
SET request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- User A should only see their workspace
SELECT id, name FROM workspaces;
-- Expected: Only '11111111-1111-1111-1111-111111111111' (Workspace A)

-- User A should only see their clients
SELECT company_name FROM clients;
-- Expected: Only 'Client for Workspace A'

-- User A should only see their roles
SELECT job_title, company_name FROM roles;
-- Expected: Only 'Developer A' from 'Company A'
```

#### Test (Run as User B):
```sql
-- Set session to User B
SET request.jwt.claim.sub = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- User B should only see their workspace
SELECT id, name FROM workspaces;
-- Expected: Only '22222222-2222-2222-2222-222222222222' (Workspace B)

-- User B should only see their clients
SELECT company_name FROM clients;
-- Expected: Only 'Client for Workspace B'

-- User B should only see their roles
SELECT job_title, company_name FROM roles;
-- Expected: Only 'Developer B' from 'Company B'
```

#### Cleanup:
```sql
-- Delete test data (run as admin)
DELETE FROM roles WHERE workspace_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM clients WHERE workspace_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM profiles WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
DELETE FROM workspaces WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
```

---

### Scenario 2: Leads Table Security

**Goal**: Verify anonymous users can insert but not read leads

#### Test (Anonymous User):
```sql
-- Anonymous user can insert a lead
INSERT INTO leads (first_name, last_name, email, organisation, source)
VALUES ('John', 'Doe', 'john@test.com', 'Test Co', 'landing_page');
-- Expected: ✅ Success

-- Anonymous user CANNOT read leads
SELECT * FROM leads WHERE email = 'john@test.com';
-- Expected: ❌ Empty result (no access)
```

#### Test (Service Role):
```sql
-- Service role CAN read leads
SELECT * FROM leads WHERE email = 'john@test.com';
-- Expected: ✅ Returns the lead record
```

---

### Scenario 3: Workspace Subscriptions Security

**Goal**: Verify users can view but not modify billing, only service role can update

#### Setup:
```sql
-- Create test subscription (as service role)
INSERT INTO workspace_subscriptions (workspace_id, stripe_customer_id, seats, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'cus_test123', 5, 'active');
```

#### Test (Regular User):
```sql
-- Set session to User A
SET request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- User can VIEW subscription
SELECT stripe_customer_id, seats, status FROM workspace_subscriptions;
-- Expected: ✅ Returns subscription data

-- User CANNOT update subscription
UPDATE workspace_subscriptions SET seats = 10 WHERE workspace_id = '11111111-1111-1111-1111-111111111111';
-- Expected: ❌ Permission denied
```

#### Test (Service Role):
```sql
-- Service role CAN update subscription (Stripe webhook)
UPDATE workspace_subscriptions SET seats = 10, status = 'active' WHERE workspace_id = '11111111-1111-1111-1111-111111111111';
-- Expected: ✅ Success
```

---

### Scenario 4: Materialized View Security

**Goal**: Verify secure wrapper functions enforce workspace isolation

#### Setup:
```sql
-- Create test events for both workspaces
INSERT INTO events (workspace_id, user_id, event_name, value_numeric)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'role_created', 1),
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'role_moved', 1),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'role_created', 1);

-- Refresh materialized views
SELECT refresh_analytics_views();
```

#### Test (User A):
```sql
-- Set session to User A
SET request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- User A should only see their workspace events
SELECT event_name, ct FROM get_events_daily_counts(NOW() - INTERVAL '7 days', NOW());
-- Expected: Only events from Workspace A (role_created=1, role_moved=1)

-- Direct access to materialized view should fail or return no results
SELECT * FROM events_daily_counts;
-- Expected: ❌ No data or permission denied (materialized views don't inherit RLS)
```

---

### Scenario 5: Auto Task Rules Security

**Goal**: Verify workspace isolation for automation rules

#### Setup:
```sql
-- Create automation rules for both workspaces
INSERT INTO auto_task_rules (workspace_id, to_stage, action_title, delay_hours)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Interview', 'Send interview prep', 24),
    ('22222222-2222-2222-2222-222222222222', 'Offer', 'Check references', 48);
```

#### Test (User A):
```sql
-- Set session to User A
SET request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- User A should only see rules for Workspace A
SELECT to_stage, action_title FROM auto_task_rules;
-- Expected: Only 'Interview' / 'Send interview prep'

-- User A cannot see User B's rules
SELECT to_stage, action_title FROM auto_task_rules WHERE to_stage = 'Offer';
-- Expected: ❌ Empty result
```

---

## 📊 Expected RLS Policy Coverage

| Table | SELECT | INSERT | UPDATE | DELETE | Notes |
|-------|--------|--------|--------|--------|-------|
| `workspaces` | ✅ Users | ✅ Users | ✅ Admins | ❌ | Admin-only updates |
| `profiles` | ✅ Workspace | ✅ Self | ✅ Self | ❌ | Self-manage only |
| `clients` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Full workspace access |
| `roles` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Full workspace access |
| `role_assignments` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Via roles join |
| `candidates` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Full workspace access |
| `pipeline_stages` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Full workspace access |
| `activities` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Full workspace access |
| `tasks` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Full workspace access |
| `events` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | Analytics events |
| `leads` | ✅ Service | ✅ Public | ❌ | ❌ | Insert-only for public |
| `workspace_subscriptions` | ✅ Workspace | ✅ Service | ✅ Service | ✅ Service | Service-only writes |
| `auto_task_rules` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | **NEW** - Fixed |
| `client_response_stats` | ✅ Workspace | ✅ Workspace | ✅ Workspace | ✅ Workspace | **NEW** - Fixed |

---

## 🚨 Security Red Flags to Watch For

### ❌ BAD: Cross-Workspace Data Leakage
```sql
-- If this returns data from other workspaces, RLS is broken
SELECT COUNT(*) FROM (
    SELECT workspace_id FROM roles
    WHERE workspace_id != (SELECT workspace_id FROM profiles WHERE id = auth.uid())
) AS leaked_data;
-- Expected: 0 (no leaked data)
```

### ❌ BAD: Anonymous Users Reading Sensitive Data
```sql
-- Anonymous users should NOT be able to read most tables
SET ROLE anon;
SELECT COUNT(*) FROM profiles;
-- Expected: 0 or error
```

### ❌ BAD: Regular Users Updating Billing
```sql
-- Regular users should NOT update billing records
UPDATE workspace_subscriptions SET seats = 999 WHERE workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid());
-- Expected: Permission denied
```

---

## ✅ Success Criteria

1. **All tables have RLS enabled** (no exceptions)
2. **Workspace isolation works** (User A cannot see User B's data)
3. **Service role can bypass RLS** (for admin/webhook operations)
4. **Anonymous users have minimal access** (leads insert only)
5. **Materialized views are secured** (via wrapper functions)
6. **No data leakage** (all cross-workspace queries return empty)
7. **Performance is acceptable** (<100ms for typical queries)

---

## 🔧 Troubleshooting

### Problem: User cannot see their own data
**Solution**: Check that user has a valid workspace_id in profiles table
```sql
SELECT id, email, workspace_id FROM profiles WHERE id = auth.uid();
```

### Problem: Service role queries fail
**Solution**: Verify you're using the service role key, not anon key
```sql
SELECT auth.jwt() ->> 'role';
-- Expected: 'service_role'
```

### Problem: Policies are not being applied
**Solution**: Ensure RLS is enabled on the table
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Problem: Performance degradation
**Solution**: Check query plans and add indexes
```sql
EXPLAIN ANALYZE SELECT * FROM roles WHERE workspace_id = '...';
```

---

## 📝 Post-Deployment Checklist

- [ ] Run all verification queries above
- [ ] Test workspace isolation with real user accounts
- [ ] Verify Stripe webhook can update subscriptions
- [ ] Check analytics API endpoints work with secure functions
- [ ] Monitor Supabase logs for RLS policy violations
- [ ] Run performance benchmarks on key queries
- [ ] Update API routes to use new secure wrapper functions
- [ ] Document any breaking changes for frontend team

---

## 🔗 Related Files

- `database-schema-rls-fixes.sql` - Migration script to apply fixes
- `rollback-rls-fixes.sql` - Rollback script if issues occur
- `database-schema.sql` - Master schema with RLS documentation

---

**Last Updated**: 2025-10-02
**Reviewed By**: Security Team
**Status**: ✅ Ready for Production
