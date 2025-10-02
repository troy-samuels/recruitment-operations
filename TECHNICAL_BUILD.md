# Technical Build Documentation
## Recruitment Operations Dashboard

**Last Updated:** September 30, 2025
**Version:** 0.1.0
**Status:** Active Development - Post-Nuclear Reset

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Map](#architecture-map)
4. [Database Schema](#database-schema)
5. [Key Technical Implementations](#key-technical-implementations)
6. [Configuration & Build](#configuration--build)
7. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

### Business Context
- **Problem:** UK recruitment consultants lose 2-3 placements monthly (£24k-36k lost revenue/year) due to poor pipeline visibility
- **Solution:** Real-time pipeline dashboard preventing lost placements through superior operational visibility
- **Target Market:** 100,000+ UK recruitment consultants across 30,035 agencies

### Pricing Model
- **Professional Plan:** £149/month (individual consultants)
- **Agency Plan:** £399/month (teams up to 10 members)
- **Average Placement Value:** £12k (realistic UK recruitment fees)
- **ROI:** 7-8x return on investment

### Current Project Status
- **Recent Reset:** TRUE NUCLEAR RESET completed (commit: 3d785ed)
- **Clean Slate:** All legacy code removed, modern stack initialized
- **Focus:** Next.js 15 + Supabase + TypeScript strict mode
- **Files:** 40 TypeScript files, 449MB node_modules

---

## 🛠️ Technology Stack

### Core Framework
```json
{
  "framework": "Next.js 15.0.3",
  "react": "18.3.1",
  "runtime": "Node.js (ES2023 target)",
  "packageManager": "npm"
}
```

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.0.3 | App Router, SSR, React Server Components |
| **React** | 18.3.1 | UI library with hooks, strict mode enabled |
| **TypeScript** | 5.6.3 | Type safety, strict mode enforced |
| **Tailwind CSS** | 3.4.13 | Utility-first styling, JIT compilation |
| **Lucide React** | 0.446.0 | Icon library (tree-shaken in next.config) |

### Drag & Drop System
| Package | Version | Purpose |
|---------|---------|---------|
| **@dnd-kit/core** | 6.3.1 | Core drag-drop engine |
| **@dnd-kit/sortable** | 10.0.0 | Sortable list support |
| **@dnd-kit/modifiers** | 9.0.0 | Drag behavior modifiers |
| **@dnd-kit/utilities** | 3.2.2 | Helper utilities |

### Backend & Database
```json
{
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth (magic links, OAuth)",
  "realtime": "Supabase Realtime subscriptions",
  "storage": "@supabase/supabase-js 2.45.0"
}
```

### Development Tools
- **ESLint:** 8.57.1 with Next.js config
- **PostCSS:** 8.4.47 with autoprefixer
- **TypeScript Config:** Strict mode, ES2023 target, ESNext module

---

## 🗺️ Architecture Map

### Project Structure (40 TypeScript Files)

```
recruitment-operations/
├── src/
│   ├── app/                          # Next.js App Router (12 routes)
│   │   ├── layout.tsx                # Root layout with AuthProvider
│   │   ├── page.tsx                  # Landing page (all sections)
│   │   ├── globals.css               # Global styles, animations
│   │   │
│   │   ├── get-started/              # Lead capture flow
│   │   │   └── page.tsx
│   │   ├── login/                    # Authentication
│   │   │   └── page.tsx
│   │   ├── reset/                    # Password reset
│   │   │   └── page.tsx
│   │   ├── update-password/          # Password update
│   │   │   └── page.tsx
│   │   ├── onboarding/               # Setup wizard
│   │   │   └── page.tsx
│   │   │
│   │   ├── dashboard/                # Protected dashboard
│   │   │   ├── layout.tsx            # Dashboard shell (Protected + WorkspaceProvider)
│   │   │   └── page.tsx              # Main Kanban dashboard
│   │   │
│   │   ├── profile/                  # User profile
│   │   │   └── page.tsx
│   │   ├── settings/                 # Settings
│   │   │   └── page.tsx
│   │   ├── billing/                  # Billing management
│   │   │   └── page.tsx
│   │   ├── analytics/                # Analytics dashboard
│   │   │   └── page.tsx
│   │   ├── help/                     # Help center
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                      # API routes
│   │       └── leads/route.ts        # Lead submission endpoint
│   │
│   ├── components/                   # React components (23 files)
│   │   │
│   │   ├── [Authentication & Providers]
│   │   ├── AuthProvider.tsx          # Supabase auth context
│   │   ├── WorkspaceProvider.tsx     # Workspace/permissions context
│   │   ├── Protected.tsx             # Route protection HOC
│   │   │
│   │   ├── [Landing Page Components]
│   │   ├── Header.tsx                # Landing header with CTA
│   │   ├── TrustIndicators.tsx       # 47 consultants, 8 cities, £89k
│   │   ├── RealTimeCounter.tsx       # Live loss tracker
│   │   ├── CaseStudySpotlight.tsx    # Sarah Johnson testimonial
│   │   ├── FeaturesSection.tsx       # Product features grid
│   │   ├── ResourceHub.tsx           # Resources section
│   │   ├── PricingSection.tsx        # £149/£399 pricing
│   │   ├── FAQSection.tsx            # FAQ accordion
│   │   ├── Footer.tsx                # Landing footer
│   │   ├── SignupModal.tsx           # Email capture modal
│   │   ├── SocialProofMarquee.tsx    # Social proof carousel
│   │   │
│   │   ├── [Dashboard Components]
│   │   ├── DashboardLayout.tsx       # Dashboard chrome (top bar + nav)
│   │   ├── DashboardTopBar.tsx       # Top bar with profile/actions
│   │   ├── LeftNavigation.tsx        # Collapsible sidebar nav
│   │   ├── PreviewDashboard.tsx      # Dashboard preview for landing
│   │   ├── AnimatedKanban.tsx        # ⭐ Core drag-drop board (1089 lines)
│   │   ├── AddRoleSlideOver.tsx      # Role creation slide-out
│   │   ├── RoleEditorPopup.tsx       # Role editing modal
│   │   ├── TeamInviteModal.tsx       # Team invitation modal
│   │   └── RightPanel.tsx            # Right sidebar (future use)
│   │
│   └── lib/                          # Utilities
│       ├── supabaseClient.ts         # Browser Supabase client
│       └── supabaseAdmin.ts          # Server-side admin client
│
├── [Configuration Files]
├── package.json                      # Dependencies manifest
├── tsconfig.json                     # TypeScript strict config
├── next.config.js                    # Next.js config (Lucide optimization)
├── tailwind.config.ts                # Custom theme (fonts, colors)
├── postcss.config.js                 # PostCSS with autoprefixer
├── .next/                            # Build output (generated)
│
├── [Documentation]
├── CLAUDE.md                         # Developer instructions
├── business plan.md                  # Business strategy
├── database-schema.sql               # Complete DB schema with RLS
├── test-drag-drop.md                 # Drag-drop testing notes
└── TECHNICAL_BUILD.md                # This document
```

### Route Architecture

#### Public Routes (No Auth Required)
- `/` - Landing page with all marketing sections
- `/get-started` - Lead capture flow
- `/login` - Authentication page
- `/reset` - Password reset
- `/update-password` - Password update

#### Protected Routes (Auth Required)
- `/onboarding` - First-time setup wizard
- `/dashboard` - Main Kanban board
- `/profile` - User profile management
- `/settings` - Application settings
- `/billing` - Subscription & billing
- `/analytics` - Usage analytics
- `/help` - Help documentation

### Component Hierarchy

```
RootLayout (layout.tsx)
└── AuthProvider
    ├── [Public Pages] → Header, Footer, Landing Sections
    └── DashboardShell (dashboard/layout.tsx)
        └── Protected
            └── WorkspaceProvider
                └── DashboardLayout
                    ├── DashboardTopBar
                    ├── LeftNavigation
                    └── [Dashboard Pages]
                        └── AnimatedKanban
                            ├── DraggableCard
                            ├── DroppableColumn
                            └── DragOverlay
```

---

## 🗄️ Database Schema

### Overview
- **Database:** PostgreSQL via Supabase
- **Tables:** 11 core tables
- **Security:** Row Level Security (RLS) enabled on all tables
- **Extensions:** uuid-ossp for UUID generation

### Core Tables

#### 1. **workspaces**
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subscription_tier TEXT CHECK (subscription_tier IN ('professional', 'agency')) DEFAULT 'professional',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**Purpose:** Multi-tenant workspace isolation
**Subscription Tiers:** 'professional' (£149), 'agency' (£399)

#### 2. **profiles**
```sql
CREATE TABLE profiles (
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
```
**Purpose:** User profiles with performance targets
**Roles:** 'admin', 'member'

#### 3. **clients**
```sql
CREATE TABLE clients (
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
```
**Purpose:** Client company records
**Types:** PSL, Preferred, New, Dormant

#### 4. **roles**
```sql
CREATE TABLE roles (
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
```
**Purpose:** Job roles/vacancies being recruited for
**Default Fee:** 20% of placement

#### 5. **role_assignments**
```sql
CREATE TABLE role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_type TEXT CHECK (role_type IN ('owner', 'sourcer', 'support')) DEFAULT 'sourcer',
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, user_id)
);
```
**Purpose:** Multi-user role assignments
**Assignment Types:** owner, sourcer, support

#### 6. **candidates**
```sql
CREATE TABLE candidates (
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
```
**Purpose:** Candidate database with skills array

#### 7. **pipeline_stages**
```sql
CREATE TABLE pipeline_stages (
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
```
**Purpose:** Tracks candidate progression through stages
**Computed Column:** days_in_stage (auto-calculated)

#### 8. **activities**
```sql
CREATE TABLE activities (
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
```
**Purpose:** Activity tracking for analytics

#### 9. **tasks**
```sql
CREATE TABLE tasks (
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
```
**Purpose:** Task management with priorities

#### 10. **leads** (Pre-onboarding)
```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    organisation TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX leads_email_idx ON leads(email);
```
**Purpose:** Pre-authentication lead capture

### Row Level Security (RLS) Policies

All tables implement workspace-scoped RLS policies:

```sql
-- Example: Workspaces policy
CREATE POLICY "Users can view their own workspace" ON workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.workspace_id = workspaces.id
            AND profiles.id = auth.uid()
        )
    );

-- Example: Workspace-scoped data access
CREATE POLICY "Users can access roles in their workspace" ON roles
    FOR ALL USING (
        workspace_id = (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );
```

**Security Model:**
- All data is workspace-isolated
- Users can only access data within their workspace
- Profile updates restricted to own profile
- Admin actions checked via application logic

### Database Triggers

**Auto-update `updated_at` timestamps:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applied to: workspaces, profiles, clients, roles, candidates, pipeline_stages
```

### Performance Indexes

```sql
-- Workspace-scoped queries
CREATE INDEX idx_profiles_workspace_id ON profiles(workspace_id);
CREATE INDEX idx_clients_workspace_id ON clients(workspace_id);
CREATE INDEX idx_roles_workspace_id ON roles(workspace_id);
CREATE INDEX idx_candidates_workspace_id ON candidates(workspace_id);
CREATE INDEX idx_pipeline_stages_workspace_id ON pipeline_stages(workspace_id);

-- Relational queries
CREATE INDEX idx_pipeline_stages_role_id ON pipeline_stages(role_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Date-based queries
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Lead lookups
CREATE INDEX leads_email_idx ON leads(email);
```

---

## 🔑 Key Technical Implementations

### 1. Drag & Drop System (AnimatedKanban.tsx)

**Location:** `src/components/AnimatedKanban.tsx` (1089 lines)

#### Core Architecture
```typescript
// Multi-sensor setup for cross-device support
const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: { distance: 5 } // Desktop: precise
  }),
  useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 8 } // Mobile: delay for scroll distinction
  }),
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 } // Stylus/other: balanced
  })
)
```

#### Collision Detection Strategy
**Multi-stage algorithm (lines 574-659):**
1. **Stage 1:** Pointer-based detection (precise targeting)
2. **Stage 2:** Rectangle intersection (overlap detection)
3. **Stage 3:** Proximity-based fallback (20px magnetic effect)
4. **Stage 4:** Closest corners (last resort)

```typescript
const collisionDetectionAlgorithm = (args: any) => {
  // 1. Pointer-based (prioritize columns)
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) {
    const columnCollisions = pointerCollisions.filter(c =>
      c.id.toString().startsWith('column-')
    )
    if (columnCollisions.length > 0) return columnCollisions
  }

  // 2. Rectangle intersection
  const intersectionCollisions = rectIntersection(args)
  // ... similar column prioritization

  // 3. Proximity-based (magnetic 20px expansion)
  // ... distance calculation with threshold

  // 4. Fallback
  return closestCorners(args)
}
```

#### Critical Features
- **Scroll Prevention:** During drag, disable container scroll to prevent conflicts
- **Coordinate Fallback:** When `over` is null, use coordinate-based stage detection
- **State Management:** `stageOrder` maintains per-stage card ordering
- **Real-time Updates:** Listen for external events (`kanban-add-role`, `kanban-update-card`, etc.)

#### Event System
```typescript
// External role addition
window.addEventListener('kanban-add-role', (e) => {
  const payload = e.detail // { id, jobTitle, company, stage, controlLevel, tasks }
  const newCard = { ...payload, createdAt: Date.now() }
  setJobCards(prev => [newCard, ...prev])
})

// Card updates from editor
window.addEventListener('kanban-update-card', (e) => {
  const { card, candidates, tasks } = e.detail
  setJobCards(prev => prev.map(c => c.id === card.id ? { ...c, ...card } : c))
})

// Card deletion (admin only)
window.addEventListener('kanban-delete-card', (e) => {
  const { id } = e.detail
  setJobCards(prev => prev.filter(c => c.id !== id))
})
```

#### Urgency Rules
```typescript
// Configurable at onboarding
const urgencyRules = {
  maxStageHours: [24, 48, 72, Infinity], // Per-stage limits
  maxTotalHours: Infinity
}

// Real-time urgent count calculation
const computeUrgentCount = () => {
  const now = Date.now()
  jobCards.forEach(card => {
    const ageHours = (now - card.stageUpdatedAt) / 36e5
    const stageLimit = urgencyRules.maxStageHours[card.stage]
    if (ageHours > stageLimit) urgentCount++
  })
}
```

### 2. Authentication System

**Location:** `src/components/AuthProvider.tsx`, `src/lib/supabaseClient.ts`

#### Supabase Client Setup
```typescript
// Browser-only singleton client
export function getSupabaseClient(): SupabaseClient {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  browserClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  return browserClient
}
```

#### Auth Methods
```typescript
// Magic link (passwordless)
const signInWithEmail = async (email: string, redirectTo?: string) => {
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo || window.location.origin }
  })
}

// OAuth providers
const signInWithGoogle = async (redirectTo?: string) => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectTo || window.location.origin }
  })
}

const signInWithMicrosoft = async (redirectTo?: string) => {
  await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: { redirectTo: redirectTo || window.location.origin }
  })
}
```

#### Auth State Management
```typescript
const AuthProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user)
      setInitialized(true)
    })

    // Real-time auth state listener
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user)
      setInitialized(true)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, session, initialized, ... }}>
}
```

#### Protected Routes
```typescript
// src/components/Protected.tsx
const Protected: React.FC = ({ children }) => {
  const { user, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) router.replace('/login')
  }, [initialized, user])

  if (!initialized) return <div>Loading...</div>
  if (!user) return null
  return <>{children}</>
}
```

### 3. Workspace & Permissions System

**Location:** `src/components/WorkspaceProvider.tsx`

#### Workspace Context
```typescript
interface WorkspaceContextValue {
  workspaceTier: 'individual' | 'team'
  userRole: 'admin' | 'member'
  whoCanCreateRoles: 'admin_only' | 'any_member'
  seatsPurchased: number
  seatsUsed: number
  seatsLeft: number
  view: 'individual' | 'team'
  setView: (v: 'individual' | 'team') => void
  canCreateRoles: () => boolean
  canDeleteRoles: () => boolean
  canInvite: () => boolean
}
```

#### Permission Logic
```typescript
const canCreateRoles = useCallback(() => {
  // Individual tier: always allowed
  if (workspaceTier === 'individual') return true

  // Team tier: depends on policy
  return whoCanCreateRoles === 'any_member' || userRole === 'admin'
}, [workspaceTier, whoCanCreateRoles, userRole])

const canDeleteRoles = useCallback(() => {
  // Only admins can delete
  return userRole === 'admin'
}, [userRole])

const canInvite = useCallback(() => {
  // Only team tier admins can invite
  return workspaceTier === 'team' && userRole === 'admin'
}, [workspaceTier, userRole])
```

#### localStorage Integration
```typescript
useEffect(() => {
  const tier = localStorage.getItem('subscription_tier') || 'individual'
  const role = localStorage.getItem('user_role') || 'admin'
  const seats = Number(localStorage.getItem('seats_purchased') || 1)

  const settingsRaw = localStorage.getItem('onboarding_settings')
  if (settingsRaw) {
    const settings = JSON.parse(settingsRaw)
    if (settings.permissions?.whoCanCreateRoles) {
      setWhoCanCreateRoles(settings.permissions.whoCanCreateRoles)
    }
  }

  setWorkspaceTier(tier)
  setUserRole(role)
  setSeatsPurchased(Math.max(1, seats))
}, [])
```

### 4. Onboarding Flow

**Location:** `src/app/onboarding/page.tsx`

#### Configuration Capture
```typescript
const OnboardingPage = () => {
  const [currentQuarter, setCurrentQuarter] = useState<'Q1'|'Q2'|'Q3'|'Q4'>('Q2')
  const [quarterEndDate, setQuarterEndDate] = useState<string>('2025-06-30')
  const [maxStageHours, setMaxStageHours] = useState<number>(72)
  const [sourceWithinDays, setSourceWithinDays] = useState<number>(3)
  const [individualTarget, setIndividualTarget] = useState<number>(10)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const settings = {
      currentQuarter,
      quarterEndDate,
      urgentRules: { maxStageHours },
      sourcing: { sourceWithinHours: sourceWithinDays * 24 },
      targets: { individualPlacements: individualTarget },
      defaultView: 'individual'
    }

    localStorage.setItem('onboarding_settings', JSON.stringify(settings))
    localStorage.setItem('onboarding_complete', '1')
    localStorage.setItem('just_onboarded', '1') // Trigger dashboard coachmark

    router.push('/dashboard')
  }
}
```

#### Custom Date Picker
Built-in date picker component (no dependencies):
- Inline calendar UI
- Month navigation
- Click-outside-to-close
- Formatted date display

### 5. Dashboard Layout System

**Location:** `src/components/DashboardLayout.tsx`

#### Collapsible Sidebar
```typescript
const DashboardLayout = ({ children }) => {
  const [leftCollapsed, setLeftCollapsed] = useState(true)

  // Auto-expand on events
  useEffect(() => {
    const expandOnAddRole = () => {
      const wasCollapsed = leftCollapsed
      if (leftCollapsed) setLeftCollapsed(false)

      // After transition, open add-role panel
      const delay = wasCollapsed ? 250 : 0
      setTimeout(() => {
        window.dispatchEvent(new Event('open-add-role-now'))
      }, delay)
    }

    window.addEventListener('open-add-role', expandOnAddRole)
    return () => window.removeEventListener('open-add-role', expandOnAddRole)
  }, [leftCollapsed])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardTopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-all duration-300 ${leftCollapsed ? 'w-16' : 'w-64'}`}>
          <LeftNavigation collapsed={leftCollapsed} />
        </div>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### Layout Structure
```
DashboardLayout
├── DashboardTopBar (fixed height)
├── Flex Container (flex-1)
│   ├── LeftNavigation (w-16 | w-64, collapsible)
│   └── Main Content (flex-1, overflow-hidden)
```

### 6. Styling System

**Location:** `src/app/globals.css`, `tailwind.config.ts`

#### Custom Fonts
```css
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700;800&family=Figtree:wght@400;500;600&display=swap');

/* Applied via Tailwind utilities */
.font-heading /* Work Sans */
.font-body    /* Figtree */
.font-display /* Work Sans */
```

#### Custom Colors (tailwind.config.ts)
```typescript
colors: {
  primary: {
    50: '#f0f4f7',
    100: '#dae6ed',
    400: '#4a6b7a',
    500: '#152B3C', // Main dark blue
    600: '#0f1f2a',
    700: '#0a161d'
  },
  accent: {
    50: '#fdf5f3',
    100: '#fae8e3',
    400: '#e17b5a',
    500: '#D46240', // Main orange
    600: '#b8502e',
    700: '#9a3e21'
  },
  success: {
    500: '#2F906A' // Green
  },
  cream: {
    50: '#fefdfb',
    100: '#FBF2DA', // Primary background
    200: '#f7e8b5',
    300: '#f2dd90'
  }
}
```

#### Typography Scale
```typescript
fontSize: {
  'hero': ['60px', { lineHeight: '1.1' }],    // h1
  'heading': ['20px', { lineHeight: '1.4' }], // h2
  'body': ['14px', { lineHeight: '1.5' }]     // p
}
```

#### Custom Animations (globals.css)
```css
@keyframes dragFloat {
  0% { transform: translateY(0) scale(1) rotate(0deg); }
  25% { transform: translateY(-8px) scale(1.05) rotate(-1deg); }
  50% { transform: translateY(-12px) scale(1.08) rotate(-2deg); }
  100% { transform: translateY(0) scale(1) rotate(0deg); }
}

@keyframes dropSuccess {
  0% { transform: scale(1); background-color: transparent; }
  30% { transform: scale(1.05); background-color: rgba(34, 197, 94, 0.1); }
  100% { transform: scale(1); background-color: transparent; }
}
```

---

## ⚙️ Configuration & Build

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,              // ⚠️ Strict mode enforced
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]         // Path alias for imports
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key Points:**
- **Strict Mode:** No `any` types allowed
- **Path Aliases:** `@/*` maps to `src/*`
- **ES2023 Target:** Modern JavaScript features
- **Bundler Resolution:** Next.js optimized

### Next.js Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'], // Tree-shake icon imports
  },
}

module.exports = nextConfig
```

**Optimizations:**
- **React Strict Mode:** Enabled for development checks
- **Lucide Tree-Shaking:** Only import used icons

### Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Work Sans', 'system-ui', 'sans-serif'],
        'display': ['Work Sans', 'system-ui', 'sans-serif'],
        'body': ['Figtree', 'system-ui', 'sans-serif'],
      },
      fontSize: { /* ... */ },
      colors: { /* ... */ }
    }
  },
  plugins: []
}
```

**JIT Compilation:** Enabled by default in Tailwind 3.x

### PostCSS Configuration (postcss.config.js)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Purpose:** Process Tailwind directives and add vendor prefixes

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",        // Development server (usually :3000)
    "build": "next build",    // Production build
    "start": "next start",    // Production server
    "lint": "next lint"       // ESLint checks
  }
}
```

### Environment Variables

**Required for production:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Optional (server-side admin):**
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Location:** `.env.local` (not committed to git)

---

## 🚀 Development Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/troy-samuels/recruitment-operations.git
cd recruitment-operations

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with Supabase credentials

# Run database migrations
# (Execute database-schema.sql in Supabase SQL Editor)

# Start development server
npm run dev
```

### Development Commands

```bash
# Development server (hot reload)
npm run dev
# Usually runs on http://localhost:3000
# If port 3000 busy, tries 3001

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build

# Test production build locally
npm run start
```

### File Creation Workflow

**Component Creation:**
```typescript
// src/components/MyComponent.tsx
'use client' // If using client-side features

import React from 'react'

interface MyComponentProps {
  title: string
  count: number
}

const MyComponent: React.FC<MyComponentProps> = ({ title, count }) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="font-heading text-lg">{title}</h3>
      <p className="font-body text-sm">{count} items</p>
    </div>
  )
}

export default MyComponent
```

**Page Creation:**
```typescript
// src/app/my-page/page.tsx
import MyComponent from '@/components/MyComponent'

export default function MyPage() {
  return (
    <div className="container mx-auto py-8">
      <MyComponent title="Example" count={5} />
    </div>
  )
}
```

**API Route Creation:**
```typescript
// src/app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### Database Development

**Running Migrations:**
1. Open Supabase Dashboard → SQL Editor
2. Paste migration SQL
3. Execute query
4. Verify in Table Editor

**Testing RLS Policies:**
```sql
-- Test as specific user
SET LOCAL role = 'authenticated';
SET LOCAL request.jwt.claims = '{"sub": "user-uuid-here"}';

-- Run test queries
SELECT * FROM roles WHERE workspace_id = 'workspace-uuid';
```

### Common Development Tasks

**Adding a new Kanban stage:**
1. Update `stages` array in `AnimatedKanban.tsx`
2. Update `urgencyRules.maxStageHours` array
3. Update `stageOrder` initialization
4. Test drag-drop between new stages

**Adding a new permission:**
1. Update `WorkspaceProvider.tsx` interface
2. Add permission check function
3. Update onboarding settings capture
4. Implement UI guards in components

**Creating a new modal:**
1. Create component in `src/components/`
2. Add state management in parent
3. Use event system for cross-component triggers
4. Style with Tailwind utilities

### Git Workflow

```bash
# Current branch
git branch # main

# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add new feature description"

# Push to remote
git push origin feature/my-feature

# Merge back to main (after review)
git checkout main
git merge feature/my-feature
git push origin main
```

### Build Output

```bash
npm run build

# Output structure
.next/
├── cache/              # Build cache
├── server/             # Server-side code
│   ├── app/           # App Router pages
│   └── chunks/        # Code chunks
├── static/             # Static assets
│   ├── chunks/        # JavaScript chunks
│   └── css/           # Compiled CSS
└── types/             # Generated TypeScript types
```

**Production Bundle:**
- Initial load: <200KB target
- Per route: <50KB target
- Tree-shaken icons via Lucide optimization
- CSS purged by Tailwind JIT

### Deployment (Vercel)

```bash
# Deploy to Vercel
vercel

# Production deployment
vercel --prod

# Environment variables set in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Automatic Deployments:**
- Main branch → Production
- Feature branches → Preview deployments
- Commit hooks trigger builds

---

## 📊 Project Metrics

### Codebase Statistics
- **Total TypeScript Files:** 40
- **Lines of Code (estimated):** ~8,000
- **Largest Component:** AnimatedKanban.tsx (1,089 lines)
- **node_modules Size:** 449MB
- **Package Count:** 11 direct dependencies, 22 dev dependencies

### Performance Targets
- **First Contentful Paint (FCP):** <1.5s
- **Largest Contentful Paint (LCP):** <2.5s
- **Time to Interactive (TTI):** <3.5s
- **Cumulative Layout Shift (CLS):** <0.1

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** iOS Safari 14+, Chrome Android 90+
- **ES Features:** ES2023 target (async/await, optional chaining, nullish coalescing)

---

## 🔐 Security Considerations

### Authentication
- **Method:** Supabase Auth (magic links, OAuth)
- **Session Storage:** localStorage (persistent sessions)
- **Token Refresh:** Auto-refresh enabled
- **Route Protection:** `Protected` component guards

### Database Security
- **RLS Policies:** Enabled on all tables
- **Workspace Isolation:** All queries filtered by workspace_id
- **User Scoping:** auth.uid() used in policies
- **No Direct DB Access:** All queries via Supabase client

### Environment Security
- **Secrets:** Stored in .env.local (not committed)
- **Public Keys:** NEXT_PUBLIC_* safe for client exposure
- **Service Role:** Server-side only, never exposed to client

### Content Security
- **XSS Prevention:** React auto-escaping
- **SQL Injection:** Supabase parameterized queries
- **CSRF:** Same-origin policy enforced

---

## 🐛 Known Issues & TODOs

### Current Limitations
1. **Real-time sync:** Database subscriptions not yet implemented
2. **Offline support:** No service worker/PWA features
3. **File uploads:** Avatar upload not implemented
4. **Email templates:** Using default Supabase templates
5. **Analytics:** No tracking/analytics integration

### Planned Features
1. Supabase real-time subscriptions for live updates
2. Bulk candidate import (CSV/Excel)
3. Email integration (SMTP/IMAP)
4. Calendar sync (Google Calendar, Outlook)
5. Advanced analytics dashboard
6. Mobile app (React Native)

### Performance Optimizations Needed
1. Implement React.memo for expensive components
2. Add virtual scrolling for long lists
3. Lazy load dashboard modals
4. Optimize Kanban re-renders on drag
5. Implement request caching

---

## 📚 Additional Resources

### Documentation
- **CLAUDE.md** - Developer instructions for Claude Code
- **business plan.md** - Business strategy and market analysis
- **database-schema.sql** - Complete database schema
- **test-drag-drop.md** - Drag-drop testing notes

### External Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Repository
- **GitHub:** https://github.com/troy-samuels/recruitment-operations
- **Live Development:** http://localhost:3000 (or 3001)

---

## 🤝 Contributing

### Code Style
1. **TypeScript:** Strict mode, no `any` types
2. **Components:** Max 5 props, composition over inheritance
3. **Naming:** PascalCase for components, camelCase for functions
4. **Imports:** Use `@/*` path aliases
5. **CSS:** Tailwind utilities, no inline styles

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(dashboard): Add bulk candidate import

- Implement CSV parser
- Add validation logic
- Create import modal UI

Closes #123
```

---

**Document Version:** 1.0.0
**Last Updated:** September 30, 2025
**Maintainer:** Troy Samuels
