# Recruitment Operations - Core Project Fundamentals

## 🎯 Project Vision
**Problem**: UK recruitment consultants lose 2-3 placements monthly (£108k-162k lost revenue/year) due to poor pipeline visibility

**Solution**: Real-time pipeline dashboard preventing lost placements through superior operational visibility

**Market**: 100,000+ UK recruitment consultants across 30,035 agencies

## 🛠️ Technology Foundation
- **Frontend**: React 18 + TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🏗️ Architecture Principles
- **Mobile-first**: 60%+ users on mobile
- **Performance**: <3s load time, 90+ Lighthouse scores
- **Security**: Zero tolerance - magic links, RLS, encryption
- **Clean Code**: <20 lines per function, SOLID principles
- **Testing**: 95%+ coverage, TDD approach

## 🎨 Design System
- **Typography**: Caprasimo (headings) + DM Sans (body)
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: 320px-768px primary target

## 🔧 Development Standards
- **TypeScript**: No 'any' types, strict mode
- **Components**: Max 5 props, composition over inheritance
- **Error Handling**: Comprehensive boundaries and recovery
- **Bundle Size**: <200KB initial, <50KB per route

## 🚀 Core Features
1. **Unified Pipeline Board**: Drag-and-drop Kanban view
2. **Smart Reminders**: Prevent dropped candidates
3. **Performance Tracking**: Real-time metrics vs targets
4. **Workspace Management**: Multi-tenant isolation

## 💼 Business Model
- **Professional**: £149/month (individual consultants)
- **Agency**: £399/month (team collaboration)
- **ROI**: Prevents 1 lost placement = 30x monthly value

---

**Repository**: https://github.com/troy-samuels/recruitment-operations
**Database**: Production Supabase instance (schema in database-schema.sql)
**Business Context**: See business plan.md for detailed market analysis