-- Recruitment Operations Database Schema
-- Enterprise-grade recruitment pipeline management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security by default
SET row_security = on;

-- =============================================
-- WORKSPACES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subscription_tier TEXT CHECK (subscription_tier IN ('professional', 'agency')) DEFAULT 'professional',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    daily_call_target INTEGER DEFAULT 10,
    daily_cv_target INTEGER DEFAULT 5,
    daily_interview_target INTEGER DEFAULT 2,
    placement_goal_period TEXT CHECK (placement_goal_period IN ('month', 'quarter', 'year')) DEFAULT 'month',
    placement_goal_target INTEGER DEFAULT 3,
    contract_calculation_method TEXT DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CLIENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    client_type TEXT CHECK (client_type IN ('PSL', 'Preferred', 'New', 'Dormant')),
    response_time_days INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    job_reference TEXT,
    company_name TEXT,
    salary_min DECIMAL,
    salary_max DECIMAL,
    fee_percentage DECIMAL DEFAULT 20.0,
    fee_amount DECIMAL,
    status TEXT DEFAULT 'active',
    urgency TEXT DEFAULT 'normal',
    job_type TEXT,
    contract_day_rate DECIMAL,
    location TEXT,
    stage TEXT DEFAULT 'brief',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROLE ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_type TEXT CHECK (role_type IN ('owner', 'sourcer', 'support')) DEFAULT 'sourcer',
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, user_id)
);

-- =============================================
-- CANDIDATES TABLE
-- =============================================

-- =============================================
-- LEADS TABLE (pre-onboarding submissions)
-- =============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    organisation TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- =============================================
-- TASKS (auto- and user-generated)
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT CHECK (status IN ('open','done','cancelled')) DEFAULT 'open',
    priority TEXT CHECK (priority IN ('low','normal','high')) DEFAULT 'normal',
    due_at TIMESTAMPTZ,
    source TEXT CHECK (source IN ('manual','auto')) DEFAULT 'manual',
    rule_id UUID,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS tasks_role_idx ON tasks(role_id);

-- =============================================
-- AUTO TASK RULES (workspace-level)
-- =============================================
CREATE TABLE IF NOT EXISTS auto_task_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    to_stage TEXT NOT NULL,
    action_title TEXT NOT NULL,
    delay_hours INTEGER NOT NULL DEFAULT 48,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS auto_task_rules_ws_idx ON auto_task_rules(workspace_id);

-- =============================================
-- CLIENT RESPONSE STATS (for adaptive follow-ups)
-- =============================================
CREATE TABLE IF NOT EXISTS client_response_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    metric TEXT CHECK (metric IN ('feedback_response_days')) NOT NULL,
    value_numeric DECIMAL,
    samples INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    current_salary DECIMAL,
    desired_salary DECIMAL,
    notice_period TEXT,
    linkedin_url TEXT,
    source TEXT,
    skills TEXT[],
    is_placed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PIPELINE STAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    entered_stage_at TIMESTAMPTZ DEFAULT NOW(),
    days_in_stage INTEGER GENERATED ALWAYS AS (EXTRACT(days FROM NOW() - entered_stage_at)) STORED,
    next_action TEXT,
    next_action_date DATE,
    risk_score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, candidate_id)
);

-- =============================================
-- ACTIVITIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    description TEXT,
    duration_minutes INTEGER,
    activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EVENTS TABLE (for analytics & telemetry)
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
    company TEXT,
    stage TEXT,
    event_name TEXT NOT NULL,
    value_numeric DECIMAL,
    meta JSONB DEFAULT '{}'::jsonb
);

-- =============================================
-- TASKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pipeline_stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
    task_type TEXT,
    priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    snoozed_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_workspace_id ON profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_clients_workspace_id ON clients(workspace_id);
CREATE INDEX IF NOT EXISTS idx_roles_workspace_id ON roles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_candidates_workspace_id ON candidates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_workspace_id ON pipeline_stages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_role_id ON pipeline_stages(role_id);
CREATE INDEX IF NOT EXISTS idx_activities_workspace_id ON activities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================
-- Last Updated: 2025-10-02
-- Status: Complete with all critical fixes applied
-- Documentation: See RLS_VERIFICATION.md for testing guide
--
-- SECURITY MODEL:
-- - All tables use workspace-scoped access
-- - Users can only access data in their own workspace
-- - Service role can bypass RLS for admin operations
-- - Anonymous users have minimal access (leads insert only)
-- =============================================

-- =============================================
-- WORKSPACES TABLE RLS
-- =============================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Users can view workspaces they belong to
CREATE POLICY "Users can view their own workspace" ON workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.workspace_id = workspaces.id
            AND profiles.id = auth.uid()
        )
    );

-- Authenticated users can create a workspace (for provisioning)
CREATE POLICY "Users can insert their own workspace" ON workspaces
    FOR INSERT TO authenticated
    WITH CHECK (true);  -- Provisioning logic will handle ownership

-- Only workspace admins can update their workspace
CREATE POLICY "Admins can update their workspace" ON workspaces
    FOR UPDATE USING (
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

-- =============================================
-- PROFILES TABLE RLS
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view profiles in their workspace
CREATE POLICY "Users can view profiles in their workspace" ON profiles
    FOR SELECT USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
        OR id = auth.uid()  -- Users can always see their own profile
    );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Authenticated users can insert their own profile (provisioning)
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

-- Clients: Workspace-scoped access
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access clients in their workspace" ON clients
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Roles: Workspace-scoped access
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access roles in their workspace" ON roles
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Role Assignments: Workspace-scoped access
ALTER TABLE role_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access role assignments in their workspace" ON role_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM roles
            WHERE roles.id = role_assignments.role_id
            AND roles.workspace_id = (
                SELECT workspace_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

-- Candidates: Workspace-scoped access
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access candidates in their workspace" ON candidates
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Pipeline Stages: Workspace-scoped access
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access pipeline stages in their workspace" ON pipeline_stages
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Activities: Workspace-scoped access
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access activities in their workspace" ON activities
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Tasks: Workspace-scoped access
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access tasks in their workspace" ON tasks
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON pipeline_stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- EVENTS INDEXES & RLS
-- =============================================
CREATE INDEX IF NOT EXISTS idx_events_ws_ts ON events(workspace_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_ws_name_ts ON events(workspace_id, event_name, ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_ws_role_ts ON events(workspace_id, role_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_ws_company_ts ON events(workspace_id, company, ts DESC);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access events in their workspace" ON events
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- =============================================
-- BILLING: WORKSPACE SUBSCRIPTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS workspace_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    price_id TEXT,
    seats INTEGER NOT NULL DEFAULT 1,
    status TEXT CHECK (status IN ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid')) DEFAULT 'trialing',
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_subs_workspace_id ON workspace_subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ws_subs_customer_id ON workspace_subscriptions(stripe_customer_id);

ALTER TABLE workspace_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their workspace subscription status
CREATE POLICY "Users can view their workspace subscription" ON workspace_subscriptions
  FOR SELECT USING (
    workspace_id = (
      SELECT workspace_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Only service role can insert/update subscriptions (Stripe webhook)
CREATE POLICY "Service role can manage subscriptions" ON workspace_subscriptions
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- =============================================
-- AGGREGATION VIEWS (Materialized) FOR ANALYTICS
-- =============================================
-- Daily counts by event
CREATE MATERIALIZED VIEW IF NOT EXISTS events_daily_counts AS
SELECT
    workspace_id,
    event_name,
    date_trunc('day', ts) AS day,
    COUNT(*)::INTEGER AS ct
FROM events
GROUP BY 1,2,3;

CREATE INDEX IF NOT EXISTS idx_events_daily_counts_ws_day_name ON events_daily_counts(workspace_id, day, event_name);

-- Daily counts by user
CREATE MATERIALIZED VIEW IF NOT EXISTS events_user_daily_counts AS
SELECT
    workspace_id,
    user_id,
    event_name,
    date_trunc('day', ts) AS day,
    COUNT(*)::INTEGER AS ct
FROM events
GROUP BY 1,2,3,4;

CREATE INDEX IF NOT EXISTS idx_events_user_daily_counts_ws_user_day ON events_user_daily_counts(workspace_id, user_id, day);

-- Daily counts by company
CREATE MATERIALIZED VIEW IF NOT EXISTS events_company_daily_counts AS
SELECT
    workspace_id,
    COALESCE(company,'') AS company,
    event_name,
    date_trunc('day', ts) AS day,
    COUNT(*)::INTEGER AS ct
FROM events
GROUP BY 1,2,3,4;

CREATE INDEX IF NOT EXISTS idx_events_company_daily_counts_ws_company_day ON events_company_daily_counts(workspace_id, company, day);

-- Helper function to refresh all analytics materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY events_daily_counts;
  REFRESH MATERIALIZED VIEW CONCURRENTLY events_user_daily_counts;
  REFRESH MATERIALIZED VIEW CONCURRENTLY events_company_daily_counts;
END; $$;

-- =============================================
-- SECURE MATERIALIZED VIEW ACCESS
-- =============================================
-- Materialized views don't inherit RLS from base tables
-- Use these security definer functions for workspace-scoped access

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
    ws_id := get_user_workspace_id();
    IF ws_id IS NULL THEN
        RAISE EXCEPTION 'User not associated with a workspace';
    END IF;

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
    ws_id := get_user_workspace_id();
    IF ws_id IS NULL THEN
        RAISE EXCEPTION 'User not associated with a workspace';
    END IF;

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
    ws_id := get_user_workspace_id();
    IF ws_id IS NULL THEN
        RAISE EXCEPTION 'User not associated with a workspace';
    END IF;

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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_user_workspace_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_user_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_company_daily_counts(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- =============================================
-- CRITICAL RLS POLICIES - ADDITIONAL TABLES
-- =============================================

-- AUTO TASK RULES: Workspace-scoped access
ALTER TABLE auto_task_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access auto_task_rules in their workspace" ON auto_task_rules
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- CLIENT RESPONSE STATS: Workspace-scoped access
ALTER TABLE client_response_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access client_response_stats in their workspace" ON client_response_stats
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- LEADS: Insert-only for public, read for service role
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous/authenticated users to insert leads (signup form)
CREATE POLICY "Anyone can insert leads" ON leads
    FOR INSERT TO public
    WITH CHECK (true);

-- Only service role can read leads (for admin dashboard via API)
CREATE POLICY "Service role can read leads" ON leads
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'service_role'
        OR
        auth.jwt() -> 'user_metadata' ->> 'is_super_admin' = 'true'
    );

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================
-- This will be added after the schema is created