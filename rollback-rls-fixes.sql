-- =============================================
-- RLS SECURITY FIXES - ROLLBACK SCRIPT
-- =============================================
-- Project: Recruitment Operations Dashboard
-- Date: 2025-10-02
-- Purpose: Rollback RLS security fixes if issues occur
--
-- WARNING: Only use this script if the RLS fixes cause problems
-- This will restore the database to the state before applying fixes
--
-- SAFETY: This script is idempotent and can be run multiple times
-- =============================================

-- =============================================
-- ROLLBACK: Materialized View Security Functions
-- =============================================

-- Drop secure wrapper functions
DROP FUNCTION IF EXISTS get_events_company_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS get_events_user_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS get_events_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS get_user_workspace_id();

-- =============================================
-- ROLLBACK: profiles table
-- =============================================

-- Drop new INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Restore original policies
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view profiles in their workspace" ON profiles
FOR SELECT USING (
    workspace_id = (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (id = auth.uid());

-- =============================================
-- ROLLBACK: workspaces table
-- =============================================

-- Drop new INSERT/UPDATE policies
DROP POLICY IF EXISTS "Users can insert their own workspace" ON workspaces;
DROP POLICY IF EXISTS "Admins can update their workspace" ON workspaces;

-- Restore original SELECT-only policy
DROP POLICY IF EXISTS "Users can view their own workspace" ON workspaces;

CREATE POLICY "Users can view their own workspace" ON workspaces
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.workspace_id = workspaces.id
        AND profiles.id = auth.uid()
    )
);

-- =============================================
-- ROLLBACK: workspace_subscriptions table
-- =============================================

-- Drop service role policy
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON workspace_subscriptions;

-- Restore original SELECT-only policy
DROP POLICY IF EXISTS "Users can view their workspace subscription" ON workspace_subscriptions;

CREATE POLICY "Users can view their workspace subscription" ON workspace_subscriptions
FOR SELECT USING (
    workspace_id = (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
);

-- =============================================
-- ROLLBACK: leads table
-- =============================================

-- Drop all policies and disable RLS
DROP POLICY IF EXISTS "Service role can read leads" ON leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;

ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- =============================================
-- ROLLBACK: client_response_stats table
-- =============================================

-- Drop workspace-scoped policy and disable RLS
DROP POLICY IF EXISTS "Users can access client_response_stats in their workspace" ON client_response_stats;

ALTER TABLE client_response_stats DISABLE ROW LEVEL SECURITY;

-- =============================================
-- ROLLBACK: auto_task_rules table
-- =============================================

-- Drop workspace-scoped policy and disable RLS
DROP POLICY IF EXISTS "Users can access auto_task_rules in their workspace" ON auto_task_rules;

ALTER TABLE auto_task_rules DISABLE ROW LEVEL SECURITY;

-- =============================================
-- REVOKE PERMISSIONS
-- =============================================

-- Revoke permissions on dropped functions (if they still exist)
REVOKE EXECUTE ON FUNCTION get_user_workspace_id() FROM authenticated;
REVOKE EXECUTE ON FUNCTION get_events_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) FROM authenticated;
REVOKE EXECUTE ON FUNCTION get_events_user_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) FROM authenticated;
REVOKE EXECUTE ON FUNCTION get_events_company_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) FROM authenticated;

-- =============================================
-- VERIFICATION AFTER ROLLBACK
-- =============================================

-- Check RLS status after rollback
SELECT
    tablename,
    CASE
        WHEN c.relrowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as rls_status
FROM pg_tables t
LEFT JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
    AND tablename IN (
        'auto_task_rules',
        'client_response_stats',
        'leads',
        'workspace_subscriptions',
        'workspaces',
        'profiles'
    )
ORDER BY tablename;

-- List remaining policies
SELECT
    tablename,
    COUNT(policyname) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN (
        'auto_task_rules',
        'client_response_stats',
        'leads',
        'workspace_subscriptions',
        'workspaces',
        'profiles'
    )
GROUP BY tablename
ORDER BY tablename;

-- =============================================
-- ROLLBACK COMPLETE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'RLS SECURITY FIXES ROLLBACK COMPLETED';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Rolled back changes:';
    RAISE NOTICE '  ↩ auto_task_rules - RLS disabled';
    RAISE NOTICE '  ↩ client_response_stats - RLS disabled';
    RAISE NOTICE '  ↩ leads - RLS disabled';
    RAISE NOTICE '  ↩ Materialized view functions - Dropped';
    RAISE NOTICE '  ↩ workspace_subscriptions - Restored original';
    RAISE NOTICE '  ↩ workspaces - Restored original';
    RAISE NOTICE '  ↩ profiles - Restored original';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'WARNING: Security vulnerabilities are now present!';
    RAISE NOTICE '  - auto_task_rules: No workspace isolation';
    RAISE NOTICE '  - client_response_stats: No workspace isolation';
    RAISE NOTICE '  - leads: Publicly readable';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Investigate why rollback was necessary';
    RAISE NOTICE '  2. Fix the root cause';
    RAISE NOTICE '  3. Re-apply fixes with adjustments';
    RAISE NOTICE '==================================================';
END $$;

-- =============================================
-- OPTIONAL: Re-enable RLS without policies
-- =============================================
-- If you want to keep RLS enabled but remove policies:
-- (Uncomment these lines if needed)

-- ALTER TABLE auto_task_rules ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE client_response_stats ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Note: This will block ALL access to these tables for non-superusers
-- until proper policies are added again

-- =============================================
-- TROUBLESHOOTING GUIDE
-- =============================================

-- If you rolled back due to access issues, check:

-- 1. Which user is experiencing issues?
/*
SELECT
    auth.uid() as current_user_id,
    auth.email() as current_user_email,
    auth.jwt() ->> 'role' as auth_role;
*/

-- 2. What is their workspace?
/*
SELECT
    id,
    email,
    workspace_id,
    role
FROM profiles
WHERE id = auth.uid();
*/

-- 3. Can they see any workspaces?
/*
SELECT * FROM workspaces
WHERE id IN (
    SELECT workspace_id FROM profiles WHERE id = auth.uid()
);
*/

-- 4. Are there any policy violations in logs?
-- Check Supabase Dashboard > Logs > Database for RLS policy denials

-- =============================================
-- SAFE RE-APPLICATION STEPS
-- =============================================

-- After fixing issues:
-- 1. Test policies in a staging environment first
-- 2. Apply one table at a time
-- 3. Verify each table before proceeding
-- 4. Monitor application logs during deployment
-- 5. Have this rollback script ready

-- To re-apply fixes after rollback:
-- Run: database-schema-rls-fixes.sql

-- =============================================
-- END OF ROLLBACK SCRIPT
-- =============================================
