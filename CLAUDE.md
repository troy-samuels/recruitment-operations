# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Recruitment Operations Dashboard

## 🎯 Project Overview
**Problem**: UK recruitment consultants lose 2-3 placements monthly (£24k-36k lost revenue/year) due to poor pipeline visibility
**Solution**: Real-time pipeline dashboard preventing lost placements through superior operational visibility
**Market**: 100,000+ UK recruitment consultants across 30,035 agencies
**Brand**: Jobwall (jobwall.co.uk)

## 📊 Project Statistics
- **Total Size**: 798MB
- **TypeScript Files**: 63 files
- **Components**: 25+ React components
- **API Routes**: 17 endpoints
- **Framework**: Next.js 15.0.3 with App Router
- **Status**: Active development, production-ready

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server (usually port 3000, may use 3001 if 3000 busy)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

## 🏗️ Technical Architecture

### Technology Stack
- **Framework**: Next.js 15.0.3 with App Router (`src/app/`)
- **React**: 18.3.1 with strict mode enabled
- **Language**: TypeScript 5.6.3 (strict mode, no 'any' types allowed)
- **Styling**: Tailwind CSS 3.4.13 with custom configuration
- **Icons**: Lucide React 0.446.0 (tree-shaken in next.config.js)
- **Drag & Drop**: @dnd-kit suite (core 6.3.1, sortable 10.0.0, modifiers 9.0.0, utilities 3.2.2)
- **Database**: Supabase 2.45.0 (PostgreSQL + Auth + Realtime) - production integrated
- **Payments**: Stripe 19.0.0 + @stripe/stripe-js 8.0.0
- **Data Fetching**: SWR 2.3.6
- **Charts**: Recharts 3.2.1
- **Deployment**: Vercel

### Project Structure
```
recruitment-operations/
├── src/
│   ├── app/                          # Next.js App Router (12+ pages)
│   │   ├── layout.tsx                # Root layout with AuthProvider, metadata, Plausible
│   │   ├── page.tsx                  # Landing page (hero, features, demo, pricing, FAQ)
│   │   ├── globals.css               # Global styles, animations, custom keyframes
│   │   │
│   │   ├── dashboard/                # Main application
│   │   │   ├── layout.tsx            # Dashboard layout with sidebar & top bar
│   │   │   └── page.tsx              # Kanban board, modals, urgent actions
│   │   │
│   │   ├── analytics/                # Analytics dashboard
│   │   │   ├── layout.tsx            # Analytics layout
│   │   │   └── page.tsx              # Charts, metrics, insights
│   │   │
│   │   ├── onboarding/               # User onboarding flow
│   │   │   └── page.tsx              # Quarter setup, targets, rules configuration
│   │   │
│   │   ├── billing/                  # Subscription management
│   │   │   └── page.tsx              # Plans, checkout, subscription status
│   │   │
│   │   ├── team/                     # Team management
│   │   │   └── page.tsx              # Members, invitations, permissions
│   │   │
│   │   ├── profile/                  # User profile
│   │   │   └── page.tsx              # Profile settings, preferences
│   │   │
│   │   ├── settings/                 # Application settings
│   │   │   └── page.tsx              # Workspace settings, integrations
│   │   │
│   │   ├── login/                    # Authentication
│   │   │   └── page.tsx              # Login with magic link, OAuth
│   │   │
│   │   ├── get-started/              # Signup
│   │   │   └── page.tsx              # Signup form, plan selection
│   │   │
│   │   ├── reset/                    # Password reset
│   │   │   └── page.tsx              # Password reset flow
│   │   │
│   │   ├── update-password/          # Password update
│   │   │   └── page.tsx              # Update password form
│   │   │
│   │   ├── help/                     # Help center
│   │   │   └── page.tsx              # Documentation, support
│   │   │
│   │   ├── privacy/                  # Privacy policy
│   │   │   └── page.tsx              # Privacy policy content
│   │   │
│   │   ├── terms/                    # Terms of service
│   │   │   └── page.tsx              # Terms content
│   │   │
│   │   ├── cookies/                  # Cookie policy
│   │   │   └── page.tsx              # Cookie policy content
│   │   │
│   │   └── api/                      # API Routes (17 endpoints)
│   │       │
│   │       ├── provision/            # User & workspace provisioning
│   │       │   └── route.ts          # POST: Auto-create workspace on first login
│   │       │
│   │       ├── metrics/              # Analytics event tracking
│   │       │   └── route.ts          # POST: Track user events with DNT respect
│   │       │
│   │       ├── leads/                # Lead capture
│   │       │   └── route.ts          # POST: Capture leads from landing page
│   │       │
│   │       ├── stripe/               # Stripe integration
│   │       │   ├── checkout/
│   │       │   │   └── route.ts      # POST: Create checkout session with 7-day trial
│   │       │   ├── webhook/
│   │       │   │   └── route.ts      # POST: Handle subscription events
│   │       │   ├── pricing/
│   │       │   │   └── route.ts      # GET: Fetch price data
│   │       │   └── inspect/
│   │       │       └── route.ts      # GET: Debug Stripe data
│   │       │
│   │       ├── billing/              # Billing status
│   │       │   └── status/
│   │       │       └── route.ts      # GET: Check subscription status
│   │       │
│   │       ├── team/                 # Team management
│   │       │   ├── invite/
│   │       │   │   └── route.ts      # POST: Send team invitations
│   │       │   ├── remove/
│   │       │   │   └── route.ts      # POST: Remove team member
│   │       │   └── role/
│   │       │       └── route.ts      # POST: Update member role
│   │       │
│   │       └── analytics/            # Analytics endpoints
│   │           ├── summary/
│   │           │   └── route.ts      # GET: Dashboard summary stats
│   │           ├── timeseries/
│   │           │   └── route.ts      # GET: Time series data
│   │           ├── heatmap/
│   │           │   └── route.ts      # GET: Activity heatmap
│   │           ├── leaderboard/
│   │           │   └── route.ts      # GET: Performance rankings
│   │           ├── events/
│   │           │   └── route.ts      # GET: Event logs
│   │           └── refresh/
│   │               └── route.ts      # POST: Refresh analytics data
│   │
│   ├── components/                   # React Components (25+ files)
│   │   │
│   │   ├── [Core Providers]
│   │   ├── AuthProvider.tsx          # Auth context (Supabase, magic link, OAuth)
│   │   ├── WorkspaceProvider.tsx     # Workspace context (tier, permissions, seats)
│   │   ├── Protected.tsx             # Route protection HOC
│   │   │
│   │   ├── [Dashboard Layout]
│   │   ├── DashboardLayout.tsx       # Main dashboard container with sidebar
│   │   ├── DashboardTopBar.tsx       # Top navigation bar
│   │   ├── LeftNavigation.tsx        # Collapsible sidebar with navigation
│   │   ├── TrialBanner.tsx           # Trial status banner
│   │   │
│   │   ├── [Dashboard Core]
│   │   ├── AnimatedKanban.tsx        # Core drag-and-drop board (1339 lines)
│   │   ├── AddRoleSlideOver.tsx      # Role creation slide-over panel
│   │   ├── RoleEditorPopup.tsx       # Role editing modal with candidates & tasks
│   │   ├── TeamInviteModal.tsx       # Team invitation modal
│   │   │
│   │   ├── [Landing Page Components]
│   │   ├── Header.tsx                # Landing page header with navigation
│   │   ├── Footer.tsx                # Landing page footer with links
│   │   ├── SignupModal.tsx           # Signup modal overlay
│   │   ├── PreviewDashboard.tsx      # Interactive demo dashboard
│   │   ├── FeaturesSection.tsx       # Features showcase grid
│   │   ├── TrustIndicators.tsx       # Social proof (47 consultants, 8 cities)
│   │   ├── RealTimeCounter.tsx       # Live revenue loss tracker
│   │   ├── CaseStudySpotlight.tsx    # Sarah Johnson testimonial
│   │   ├── SocialProofMarquee.tsx    # Scrolling logo marquee
│   │   ├── ResourceHub.tsx           # Resources & guides section
│   │   ├── PricingSection.tsx        # Pricing cards (£149/£399)
│   │   ├── FAQSection.tsx            # FAQ accordion
│   │   └── RightPanel.tsx            # Right sidebar panel
│   │
│   └── lib/                          # Utilities & Helpers
│       ├── supabaseClient.ts         # Browser Supabase client (singleton)
│       ├── supabaseAdmin.ts          # Server Supabase admin client (service role)
│       └── metrics.ts                # Analytics tracking with DNT & user preferences
│
├── Configuration Files
├── .env.local                        # Environment variables (45+ vars, configured)
├── .env.example                      # Environment template with setup instructions
├── package.json                      # Dependencies (Next 15, React 18, Supabase, Stripe)
├── tsconfig.json                     # TypeScript strict mode, path aliases
├── tailwind.config.ts                # Custom fonts, colors, sizes
├── next.config.js                    # WWW redirect, React strict mode
├── postcss.config.js                 # PostCSS with autoprefixer
│
└── Documentation
    ├── CLAUDE.md                     # This file - AI development guide
    ├── TECHNICAL_BUILD.md            # Technical documentation (39KB)
    ├── business plan.md              # Business strategy & market analysis (15KB)
    └── test-drag-drop.md             # Drag & drop testing notes
```

## 🎨 Design System

### Typography (Tailwind Configuration)
- **Headings**: `font-heading` → **Work Sans** (weights: 400, 700, 800)
- **Body Text**: `font-body` → **Figtree** (weights: 400, 500, 600)
- **Display**: `font-display` → **Work Sans**
- **Font Loading**: Google Fonts with `display=swap` strategy
- **Font Sizes**:
  - `text-hero`: 60px / 1.1 line height
  - `text-heading`: 20px / 1.4 line height
  - `text-body`: 14px / 1.5 line height

### Colors (Extended Palette)
- **Primary**: Navy/Blue
  - 50: #f0f4f7 (lightest)
  - 100: #dae6ed
  - 400: #4a6b7a
  - 500: #152B3C (base)
  - 600: #0f1f2a
  - 700: #0a161d (darkest)

- **Accent**: Orange/Coral
  - 50: #fdf5f3
  - 100: #fae8e3
  - 400: #e17b5a
  - 500: #D46240 (base)
  - 600: #b8502e
  - 700: #9a3e21

- **Success**: Green
  - 50: #f0f9f5
  - 100: #dcf0e6
  - 400: #4ba373
  - 500: #2F906A (base)
  - 600: #247554
  - 700: #1a5940

- **Cream**: Warm Background
  - 50: #fefdfb
  - 100: #FBF2DA (base)
  - 200: #f7e8b5
  - 300: #f2dd90

- **Gray**: Neutral
  - 50: #f9fafb
  - 100: #f3f4f6
  - 400: #9ca3af
  - 500: #6b7280
  - 600: #4b5563
  - 900: #111827

### Animations (globals.css)
```css
@keyframes slideIn {
  /* Modal/panel entrance animation */
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes fadeInUp {
  /* Content reveal animation */
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dragFloat {
  /* Card dragging animation with shadow */
  /* Smooth floating effect during drag */
}
```

### Component Patterns
- All components use TypeScript interfaces (no `any` types)
- `'use client'` directive for client-side interactivity
- Lucide React icons throughout (tree-shaken)
- Mobile-first responsive design (320px-768px primary target)
- Accessible: WCAG 2.1 AA compliance, proper ARIA labels

## 🔧 Key Technical Implementation Details

### 1. Drag & Drop System (AnimatedKanban.tsx - 1339 lines)

**Multi-Sensor Setup:**
```typescript
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(MouseSensor),
  useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
)
```

**Pipeline Stages:**
- **0**: New Submission
- **1**: Client Review
- **2**: Interview Scheduled
- **3**: Interview Complete
- **4**: Offer Stage
- **5**: Placed

**JobCard Interface:**
```typescript
interface JobCard {
  id: string
  jobTitle: string
  candidateName: string
  stage: number            // 0-5
  salary: string
  company: string
  owner?: string           // Assignee email/name
  assignees?: string[]     // Multiple assignees
  controlLevel?: 'high' | 'medium' | 'low'  // Priority indicator
  createdAt?: number       // Timestamp
  stageUpdatedAt?: number  // Last stage change
}
```

**Smart Features:**
- **Stage Duration Tracking**: Monitors time in each stage
- **Urgent Alerts**: Auto-flags cards exceeding stage limits (default 72h)
- **Client Response Learning**: Tracks response times per company (localStorage)
- **Task Management**: Per-role tasks with due dates
- **Candidate Management**: Multiple candidates per role
- **Auto-Sourcing**: Prompts to source candidates within configurable days

### 2. Component Communication System

**Custom Window Events:**
```typescript
// Opening panels
window.dispatchEvent(new Event('open-add-role'))
window.dispatchEvent(new Event('open-urgent-actions'))
window.dispatchEvent(new Event('open-task-center'))
window.dispatchEvent(new Event('open-invite-modal'))

// Sidebar control
window.dispatchEvent(new Event('expand-sidebar'))
window.dispatchEvent(new Event('open-add-role-now'))

// Data requests
window.dispatchEvent(new Event('request-urgent-actions'))
window.dispatchEvent(new Event('request-all-tasks'))

// Data responses
window.dispatchEvent(new CustomEvent('respond-urgent-actions', {
  detail: { items: [...], tasks: [...] }
}))
window.dispatchEvent(new CustomEvent('respond-all-tasks', {
  detail: { items: [...] }
}))

// Kanban actions
window.dispatchEvent(new CustomEvent('kanban-add-role', {
  detail: { jobTitle, company, ... }
}))
window.dispatchEvent(new CustomEvent('kanban-mark-task-done', {
  detail: { roleId, taskId }
}))

// Badge updates
window.dispatchEvent(new CustomEvent('urgent-count-update', {
  detail: { count: number }
}))
```

**Props Drilling**: React props for parent-child communication
**State Management**: useState/useEffect hooks (no Redux/Zustand)
**Context**: AuthProvider, WorkspaceProvider for global state

### 3. Authentication & Authorization

**Supabase Auth Integration:**
```typescript
// Magic Link (Email OTP)
await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: window.location.origin }
})

// Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin }
})

// Microsoft/Azure OAuth
await supabase.auth.signInWithOAuth({
  provider: 'azure',
  options: { redirectTo: window.location.origin }
})
```

**Session Management:**
- Auto token refresh enabled
- Persistent sessions in localStorage
- HTTP-only cookie (`ro_session`) for middleware
- Auto-provisioning on first login (creates workspace, profile)

**Row Level Security (RLS):**
- PostgreSQL RLS policies active
- User can only access their workspace data
- Service role for admin operations

### 4. Workspace & Permissions System

**WorkspaceProvider Context:**
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

**Permission Logic:**
- **Individual Tier**: Single user, full access
- **Team Tier**: Multi-user with role-based permissions
- **Admin Role**: Full access, can invite, change settings
- **Member Role**: Limited access based on `whoCanCreateRoles` policy

**Seat Management:**
- Tracks purchased vs used seats
- Blocks invitations when seats full
- Stored in localStorage (will sync with Supabase)

### 5. Stripe Payment Integration

**Checkout Flow:**
```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: seats }],
  success_url: `${origin}/billing?success=1`,
  cancel_url: `${origin}/billing?canceled=1`,
  allow_promotion_codes: true,
  subscription_data: {
    trial_period_days: 7,  // 7-day free trial
    metadata: { seats, workspace_id }
  }
})
```

**Webhook Handling:**
- Listens for subscription events
- Updates workspace tier/status
- Handles trial expiration
- Processes payment failures

**Pricing:**
- Professional: £149/month (individual)
- Agency: £399/month (teams up to 10)
- Custom price IDs via environment variables

### 6. Analytics & Metrics System

**Privacy-First Tracking:**
```typescript
function trackEvent(name: string, props?: Record<string, any>) {
  // Respect Do Not Track
  if (navigator.doNotTrack === '1') return

  // Respect user preferences
  const settings = JSON.parse(localStorage.getItem('onboarding_settings'))
  if (settings?.analytics?.enabled === false) return

  // Use sendBeacon for reliability
  const payload = { name, props, ts: Date.now(), context: { url, referrer } }
  navigator.sendBeacon('/api/metrics', JSON.stringify({ events: [payload] }))
}
```

**Events Tracked:**
- Page views
- User actions (button clicks, form submits)
- Pipeline movements (card drags, stage changes)
- Task completions
- Urgent action triggers
- Team invitations
- Subscription events

**Analytics Dashboard:**
- Summary KPIs (total events, active users, etc.)
- Time series charts (Recharts)
- Activity heatmaps
- Performance leaderboards
- Event logs with filtering

### 7. Onboarding Flow

**Configuration Steps:**
1. **Quarter Selection**: Auto-detects current quarter (Q1-Q4)
2. **Quarter End Date**: Calendar picker for target deadline
3. **Stage Duration Limit**: Max hours per stage (default 72h)
4. **Individual Target**: Placements goal for the quarter
5. **Sourcing Timeframe**: Days to source candidates (default 3)

**Stored in localStorage:**
```typescript
{
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4',
  quarterEndDate: 'YYYY-MM-DD',
  maxStageHours: 72,
  individualTarget: 10,
  sourceWithinDays: 3,
  analytics: { enabled: true },
  permissions: { whoCanCreateRoles: 'admin_only' }
}
```

**Post-Onboarding:**
- Sets `just_onboarded` flag
- Auto-opens Add Role panel
- Shows coachmark tooltip

### 8. Database Schema (Supabase)

**Tables:**
```sql
-- User profiles
profiles (
  id UUID PRIMARY KEY,  -- matches auth.users.id
  email TEXT NOT NULL,
  name TEXT
)

-- Workspaces
workspaces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id)
)

-- Team memberships
role_assignments (
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES profiles(id),
  role TEXT  -- 'owner' | 'admin' | 'member'
)
```

**RLS Policies:**
- Users can only read/write their own workspace data
- Service role bypasses RLS for admin operations

**Real-time (Ready but Not Active):**
- Supabase real-time subscriptions configured
- Can enable for live multi-user collaboration

### 9. Environment Configuration

**Critical Variables (45+ total):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_DEFAULT_PRICE_ID=price_xxx

# Application
NEXT_PUBLIC_SITE_URL=https://jobwall.co.uk
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jobwall.co.uk

# Email (Postmark)
POSTMARK_API_TOKEN=xxx
POSTMARK_SENDER_EMAIL=noreply@jobwall.co.uk

# Security
NEXTAUTH_SECRET=xxx
ENCRYPTION_KEY=xxx
JWT_SECRET=xxx
```

**Feature Flags:**
```bash
# Active features (enabled)
VITE_FEATURE_PIPELINE_BOARD=true
VITE_FEATURE_ACTIVITY_TRACKING=true
VITE_FEATURE_SMART_REMINDERS=true
VITE_FEATURE_METRICS_DASHBOARD=true

# Future features (disabled)
VITE_FEATURE_AI_INSIGHTS=false
VITE_FEATURE_CALENDAR_INTEGRATION=false
VITE_FEATURE_EMAIL_AUTOMATION=false
VITE_FEATURE_TEAM_COLLABORATION=false
```

### 10. Performance Optimizations

**Next.js 15 Optimizations:**
- App Router with React Server Components
- Automatic code splitting per route
- Static optimization where possible
- Edge functions for API routes

**Bundle Optimization:**
- Lucide React tree-shaking via next.config.js
- Tailwind CSS JIT compilation (only used classes)
- TypeScript strict mode (better minification)

**Performance Targets:**
- Initial bundle: <200KB
- Per-route bundle: <50KB
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Monitoring:**
- Plausible analytics for privacy-friendly tracking
- Web Vitals tracking enabled
- Sentry for error monitoring (optional)

## 💼 Business Context & Values

### Pricing & ROI
- **Professional Plan**: £149/month (individual consultants)
- **Agency Plan**: £399/month (teams up to 10 members)
- **Average Placement Value**: £12k (realistic UK recruitment fees)
- **ROI**: 7-8x return on investment (preventing 1 lost placement monthly)
- **Annual Revenue Loss Prevented**: £24k-36k (2-3 lost placements × £12k each)

### Trust Indicators (Authentic Statistics)
- **Active Consultants**: 47 (modest, growing number)
- **Geographic Coverage**: 8 UK cities
- **Monthly Revenue Secured**: £89k
- **Messaging**: "Built by recruitment professionals" + GDPR compliance

### Case Study Metrics
- **Sarah Johnson, Thames Recruitment**: 12→2 lost placements, £96k annual savings
- **Pipeline Visibility**: 30%→95% improvement
- **Additional Benefits**: 40% productivity increase, stress reduction

## 🚀 Key Features Overview

### Core Pipeline Management
1. **Unified Kanban Board**: Drag-and-drop interface with 6 stages
2. **Multi-Role Tracking**: Manage unlimited roles simultaneously
3. **Candidate Management**: Multiple candidates per role with status tracking
4. **Task System**: Manual & auto-generated tasks with due dates

### Smart Automation
1. **Urgent Actions**: Auto-flags roles/tasks requiring attention
   - Stage duration alerts (default: >72h in one stage)
   - Task due date reminders
   - Client response tracking

2. **Client Response Learning**:
   - Tracks response times per company
   - Calculates averages
   - Provides intelligent nudges

3. **Auto-Sourcing Prompts**:
   - Reminds to source candidates within X days
   - Configurable timeframe

### Team Collaboration
1. **Workspace Tiers**: Individual vs Team mode
2. **Role-Based Permissions**: Admin vs Member access
3. **Team Invitations**: Email-based invites
4. **Seat Management**: Track usage vs purchased seats

### Analytics & Insights
1. **Dashboard Metrics**: Summary KPIs, trends
2. **Time Series Charts**: Activity over time
3. **Heatmaps**: Activity patterns by day/hour
4. **Leaderboards**: Performance rankings
5. **Event Logs**: Detailed activity tracking

## 🚨 Critical Development Guidelines

### TypeScript Strict Mode
- **No `any` types allowed** - use proper interfaces/types
- **Strict null checks** - handle undefined/null explicitly
- **No implicit any** - all function params typed
- **Path aliases**: Use `@/*` for `src/*` imports

### Component Design Principles
1. **Maximum 5 props** per component - use composition for complexity
2. **Single Responsibility** - each component does one thing well
3. **TypeScript Interfaces** - define prop interfaces above component
4. **'use client'** - add directive for client-side interactivity
5. **Mobile-First** - design for 320px-768px first, then scale up

### State Management Patterns
1. **Custom Events** for cross-component communication
2. **Context** for global state (Auth, Workspace)
3. **useState/useEffect** for local component state
4. **localStorage** for persistence (settings, preferences)
5. **No external state libraries** (Redux/Zustand) - keep it simple

### Performance Requirements
1. **Initial Bundle**: <200KB
2. **Per-Route**: <50KB
3. **LCP**: <2.5s
4. **FID**: <100ms
5. **CLS**: <0.1

### Accessibility (WCAG 2.1 AA)
1. **Semantic HTML** - proper heading hierarchy
2. **ARIA Labels** - screen reader support
3. **Keyboard Navigation** - all actions keyboard-accessible
4. **Color Contrast** - minimum 4.5:1 ratio
5. **Focus Indicators** - visible focus states

### Data Handling
1. **Authentic Statistics** - use realistic, modest numbers that can grow
2. **GDPR Compliance** - respect privacy, provide opt-outs
3. **DNT Respect** - honor Do Not Track headers
4. **User Preferences** - respect analytics opt-out

### Security Best Practices
1. **Row Level Security** - Supabase RLS for all tables
2. **Environment Variables** - never commit secrets
3. **API Route Protection** - validate auth on server routes
4. **Input Validation** - sanitize all user inputs
5. **HTTPS Only** - enforce secure connections

## 📚 Key Documentation Files

- **CLAUDE.md** (this file): AI development guide with architecture & patterns
- **TECHNICAL_BUILD.md**: Detailed technical documentation (39KB, 900+ lines)
- **business plan.md**: Market analysis, go-to-market strategy (15KB, 250+ lines)
- **test-drag-drop.md**: Drag & drop testing notes

## 🔗 Important Links

- **Repository**: https://github.com/troy-samuels/recruitment-operations
- **Live Site**: https://jobwall.co.uk
- **Development**: http://localhost:3000 (or 3001 if port conflict)
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Vercel Dashboard**: https://vercel.com/dashboard

## 🎯 Current Development Status

**Version**: 0.1.0
**Status**: Active development, production-ready core features
**Deployment**: Vercel (jobwall.co.uk)
**Database**: Supabase production instance
**Payments**: Stripe test mode (ready for production)

**Completed Features:**
✅ Full authentication flow (magic link, OAuth)
✅ Drag-and-drop Kanban board with 6 stages
✅ Team management with permissions
✅ Billing integration with Stripe (7-day trial)
✅ Analytics tracking with privacy respect
✅ Landing page with all sections
✅ Onboarding flow with configuration
✅ Urgent actions & task management
✅ Client response learning
✅ Mobile-responsive design

**Next Up (Feature Flags Off):**
🔲 AI-powered insights
🔲 Calendar integration
🔲 Email automation
🔲 Advanced team collaboration

---

**Note for AI Assistants**: This codebase follows strict TypeScript practices, uses custom window events for component communication, and prioritizes user privacy. Always check existing patterns before introducing new dependencies or architectural changes. The project is production-ready but still evolving - maintain backward compatibility and document breaking changes.
