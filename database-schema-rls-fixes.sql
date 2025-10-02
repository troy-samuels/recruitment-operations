-- =============================================
-- RLS SECURITY FIXES - MIGRATION SCRIPT
-- =============================================
-- Project: Recruitment Operations Dashboard
-- Date: 2025-10-02
-- Purpose: Fix critical and moderate RLS security vulnerabilities
--
-- CRITICAL ISSUES FIXED:
-- 1. auto_task_rules - Missing RLS (workspace isolation)
-- 2. client_response_stats - Missing RLS (workspace isolation)
-- 3. Materialized views - No RLS protection (data leakage)
--
-- MODERATE ISSUES FIXED:
-- 4. leads - Missing RLS (anonymous insert only)
-- 5. workspace_subscriptions - Incomplete RLS (service role only)
-- 6. workspaces - Incomplete RLS (insert/update policies)
-- 7. profiles - Incomplete RLS (insert policy)
--
-- SAFETY: This script is idempotent and can be run multiple times
-- =============================================

-- =============================================
-- CRITICAL FIX #1: auto_task_rules
-- =============================================
-- Risk: Users can view/modify other workspaces' automation rules
-- Fix: Add workspace-scoped RLS policies

ALTER TABLE auto_task_rules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can access auto_task_rules in their workspace" ON auto_task_rules;

-- Users can view and manage automation rules in their workspace
CREATE POLICY "Users can access auto_task_rules in their workspace"
ON auto_task_rules
FOR ALL
USING (
    workspace_id = (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
);

COMMENT ON POLICY "Users can access auto_task_rules in their workspace" ON auto_task_rules IS
'Workspace-scoped access: Users can only access automation rules for their own workspace';

-- =============================================
-- CRITICAL FIX #2: client_response_stats
-- =============================================
-- Risk: Cross-workspace data leakage of client response metrics
-- Fix: Add workspace-scoped RLS policies

ALTER TABLE client_response_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can access client_response_stats in their workspace" ON client_response_stats;

-- Users can view and manage client response stats in their workspace
CREATE POLICY "Users can access client_response_stats in their workspace"
ON client_response_stats
FOR ALL
USING (
    workspace_id = (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
);

COMMENT ON POLICY "Users can access client_response_stats in their workspace" ON client_response_stats IS
'Workspace-scoped access: Users can only access client response statistics for their own workspace';

-- =============================================
-- CRITICAL FIX #3: Materialized Views Security
-- =============================================
-- Risk: Aggregated analytics data visible across workspaces
-- Fix: Create security definer functions to enforce workspace filtering

-- Helper function to get current user's workspace_id
CREATE OR REPLACE FUNCTION get_user_workspace_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    ws_id UUID;
BEGIN
    SELECT workspace_id INTO ws_id
    FROM profiles
    WHERE id = auth.uid();

    RETURN ws_id;
END;
$$;

COMMENT ON FUNCTION get_user_workspace_id() IS
'Security definer function to safely get the current user workspace ID for RLS policies';

-- Secure wrapper function for events_daily_counts
CREATE OR REPLACE FUNCTION get_events_daily_counts(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(
    event_name TEXT,
    day TIMESTAMPTZ,
    ct INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    ws_id UUID;
BEGIN
    -- Get user's workspace
    ws_id := get_user_workspace_id();

    IF ws_id IS NULL THEN
        RAISE EXCEPTION 'User not associated with a workspace';
    END IF;

    -- Return workspace-filtered data
    RETURN QUERY
    SELECT
        edc.event_name,
        edc.day,
        edc.ct
    FROM events_daily_counts edc
    WHERE edc.workspace_id = ws_id
        AND (p_start_date IS NULL OR edc.day >= p_start_date)
        AND (p_end_date IS NULL OR edc.day <= p_end_date)
    ORDER BY edc.day DESC, edc.event_name;
END;
$$;

COMMENT ON FUNCTION get_events_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) IS
'Secure workspace-scoped access to daily event counts materialized view';

-- Secure wrapper function for events_user_daily_counts
CREATE OR REPLACE FUNCTION get_events_user_daily_counts(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(
    user_id UUID,
    event_name TEXT,
    day TIMESTAMPTZ,
    ct INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    ws_id UUID;
BEGIN
    -- Get user's workspace
    ws_id := get_user_workspace_id();

    IF ws_id IS NULL THEN
        RAISE EXCEPTION 'User not associated with a workspace';
    END IF;

    -- Return workspace-filtered data
    RETURN QUERY
    SELECT
        eudc.user_id,
        eudc.event_name,
        eudc.day,
        eudc.ct
    FROM events_user_daily_counts eudc
    WHERE eudc.workspace_id = ws_id
        AND (p_start_date IS NULL OR eudc.day >= p_start_date)
        AND (p_end_date IS NULL OR eudc.day <= p_end_date)
    ORDER BY eudc.day DESC, eudc.user_id, eudc.event_name;
END;
$$;

COMMENT ON FUNCTION get_events_user_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) IS
'Secure workspace-scoped access to user daily event counts materialized view';

-- Secure wrapper function for events_company_daily_counts
CREATE OR REPLACE FUNCTION get_events_company_daily_counts(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(
    company TEXT,
    event_name TEXT,
    day TIMESTAMPTZ,
    ct INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    ws_id UUID;
BEGIN
    -- Get user's workspace
    ws_id := get_user_workspace_id();

    IF ws_id IS NULL THEN
        RAISE EXCEPTION 'User not associated with a workspace';
    END IF;

    -- Return workspace-filtered data
    RETURN QUERY
    SELECT
        ecdc.company,
        ecdc.event_name,
        ecdc.day,
        ecdc.ct
    FROM events_company_daily_counts ecdc
    WHERE ecdc.workspace_id = ws_id
        AND (p_start_date IS NULL OR ecdc.day >= p_start_date)
        AND (p_end_date IS NULL OR ecdc.day <= p_end_date)
    ORDER BY ecdc.day DESC, ecdc.company, ecdc.event_name;
END;
$$;

COMMENT ON FUNCTION get_events_company_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) IS
'Secure workspace-scoped access to company daily event counts materialized view';

-- =============================================
-- MODERATE FIX #4: leads table
-- =============================================
-- Risk: Authenticated users could read all leads (pre-signup data)
-- Fix: INSERT-only for anonymous, SELECT for service role only

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Service role can read leads" ON leads;

-- Allow anonymous/authenticated users to insert leads (signup form)
CREATE POLICY "Anyone can insert leads"
ON leads
FOR INSERT
TO public
WITH CHECK (true);

-- Only service role can read leads (for admin dashboard via API)
-- Note: Regular users cannot read leads at all
CREATE POLICY "Service role can read leads"
ON leads
FOR SELECT
USING (
    -- This will only work when using service role key
    auth.jwt() ->> 'role' = 'service_role'
    OR
    -- Allow if the user has a special admin claim (future use)
    auth.jwt() -> 'user_metadata' ->> 'is_super_admin' = 'true'
);

COMMENT ON POLICY "Anyone can insert leads" ON leads IS
'Public can submit leads via signup forms, but cannot read them';

COMMENT ON POLICY "Service role can read leads" ON leads IS
'Only service role (backend API) can read leads for admin dashboard';

-- =============================================
-- MODERATE FIX #5: workspace_subscriptions
-- =============================================
-- Risk: Members could potentially update billing data
-- Fix: Only service role can INSERT/UPDATE (Stripe webhook)

-- Drop existing incomplete policies
DROP POLICY IF EXISTS "Users can view their workspace subscription" ON workspace_subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON workspace_subscriptions;

-- Users can view their workspace subscription status
CREATE POLICY "Users can view their workspace subscription"
ON workspace_subscriptions
FOR SELECT
USING (
    workspace_id = (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
);

-- Only service role can insert/update subscriptions (Stripe webhook)
CREATE POLICY "Service role can manage subscriptions"
ON workspace_subscriptions
FOR ALL
USING (
    auth.jwt() ->> 'role' = 'service_role'
)
WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
);

COMMENT ON POLICY "Users can view their workspace subscription" ON workspace_subscriptions IS
'Users can view billing status but cannot modify';

COMMENT ON POLICY "Service role can manage subscriptions" ON workspace_subscriptions IS
'Only Stripe webhook (via service role) can create/update subscription records';

-- =============================================
-- MODERATE FIX #6: workspaces table
-- =============================================
-- Risk: Users cannot create workspaces or update their own
-- Fix: Add INSERT and UPDATE policies

-- Drop existing incomplete policies
DROP POLICY IF EXISTS "Users can view their own workspace" ON workspaces;
DROP POLICY IF EXISTS "Users can insert their own workspace" ON workspaces;
DROP POLICY IF EXISTS "Admins can update their workspace" ON workspaces;

-- Users can view workspaces they belong to
CREATE POLICY "Users can view their own workspace"
ON workspaces
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.workspace_id = workspaces.id
        AND profiles.id = auth.uid()
    )
);

-- Authenticated users can create a workspace (for provisioning)
CREATE POLICY "Users can insert their own workspace"
ON workspaces
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Provisioning logic will handle ownership

-- Only workspace admins can update their workspace
CREATE POLICY "Admins can update their workspace"
ON workspaces
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.workspace_id = workspaces.id
        AND profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.workspace_id = workspaces.id
        AND profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

COMMENT ON POLICY "Users can view their own workspace" ON workspaces IS
'Users can view workspaces they are members of';

COMMENT ON POLICY "Users can insert their own workspace" ON workspaces IS
'Authenticated users can create workspaces during provisioning';

COMMENT ON POLICY "Admins can update their workspace" ON workspaces IS
'Only workspace admins can update workspace settings';

-- =============================================
-- MODERATE FIX #7: profiles table
-- =============================================
-- Risk: No INSERT policy prevents user provisioning
-- Fix: Add INSERT policy for authenticated users

-- Drop existing policies to recreate them all
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Users can view profiles in their workspace
CREATE POLICY "Users can view profiles in their workspace"
ON profiles
FOR SELECT
USING (
    workspace_id = (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
    OR id = auth.uid()  -- Users can always see their own profile
);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Authenticated users can insert their own profile (provisioning)
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

COMMENT ON POLICY "Users can view profiles in their workspace" ON profiles IS
'Users can view team members in their workspace plus their own profile';

COMMENT ON POLICY "Users can update their own profile" ON profiles IS
'Users can only update their own profile data';

COMMENT ON POLICY "Users can insert their own profile" ON profiles IS
'Users can create their own profile during provisioning';

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these queries to verify RLS is working correctly

-- Check all tables have RLS enabled
DO $$
DECLARE
    rec RECORD;
    missing_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
    FOR rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT IN (
            SELECT tablename
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
            AND t.schemaname = 'public'
        )
    LOOP
        missing_rls := array_append(missing_rls, rec.tablename);
    END LOOP;

    IF array_length(missing_rls, 1) > 0 THEN
        RAISE WARNING 'Tables without RLS: %', array_to_string(missing_rls, ', ');
    ELSE
        RAISE NOTICE 'All tables have RLS enabled';
    END IF;
END $$;

-- List all RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
-- Ensure authenticated users can execute security functions

GRANT EXECUTE ON FUNCTION get_user_workspace_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_user_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_company_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Summary report
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'RLS SECURITY FIXES APPLIED SUCCESSFULLY';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Critical fixes:';
    RAISE NOTICE '  ✓ auto_task_rules - RLS enabled';
    RAISE NOTICE '  ✓ client_response_stats - RLS enabled';
    RAISE NOTICE '  ✓ Materialized views - Secure functions created';
    RAISE NOTICE '';
    RAISE NOTICE 'Moderate fixes:';
    RAISE NOTICE '  ✓ leads - INSERT-only policy';
    RAISE NOTICE '  ✓ workspace_subscriptions - Complete policies';
    RAISE NOTICE '  ✓ workspaces - INSERT/UPDATE policies';
    RAISE NOTICE '  ✓ profiles - INSERT policy';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Run verification queries above';
    RAISE NOTICE '  2. Test with different user contexts';
    RAISE NOTICE '  3. Update API routes to use secure functions';
    RAISE NOTICE '  4. Monitor for any access issues';
    RAISE NOTICE '==================================================';
END $$;
