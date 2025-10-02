# Documentation Index

**Project**: Recruitment Operations Dashboard (Jobwall)
**Last Updated**: October 2, 2025

---

## 📖 Quick Navigation

### Getting Started
- [CLAUDE.md](../CLAUDE.md) - AI development guide & architecture overview
- [TECHNICAL_BUILD.md](../TECHNICAL_BUILD.md) - Comprehensive technical documentation
- [business plan.md](../business%20plan.md) - Business strategy & market analysis

### Deployment & Infrastructure
- [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md) - Production deployment walkthrough
- [Stripe Setup](infrastructure/STRIPE_SETUP.md) - Stripe integration & testing
- [Supabase Config](infrastructure/SUPABASE_PRODUCTION_CONFIG.md) - Database configuration
- [RLS Security](infrastructure/RLS_DEPLOYMENT_GUIDE.md) - Row Level Security setup

### Operations & Maintenance
- [Monitoring](operations/MONITORING.md) - Error tracking & analytics
- [Backup & Recovery](operations/BACKUP_RECOVERY.md) - Disaster recovery procedures
- [Rate Limiting](operations/RATE_LIMITING.md) - API rate limiting configuration
- [Analytics](operations/ANALYTICS.md) - Analytics tracking setup

### Standards & Best Practices
- [Accessibility](standards/ACCESSIBILITY.md) - WCAG 2.1 AA compliance guide

---

## 📁 Directory Structure

```
docs/
├── README.md (this file)
│
├── deployment/
│   └── DEPLOYMENT_GUIDE.md          # Production deployment guide
│
├── infrastructure/
│   ├── STRIPE_SETUP.md              # Stripe integration & testing
│   ├── SUPABASE_PRODUCTION_CONFIG.md # Supabase configuration
│   ├── RLS_DEPLOYMENT_GUIDE.md      # Row Level Security setup
│   └── RLS_VERIFICATION.md          # RLS testing checklist
│
├── operations/
│   ├── MONITORING.md                # Error tracking & analytics
│   ├── BACKUP_RECOVERY.md           # Disaster recovery
│   ├── RATE_LIMITING.md             # API rate limiting
│   └── ANALYTICS.md                 # Analytics configuration
│
├── standards/
│   └── ACCESSIBILITY.md             # WCAG compliance guide
│
└── archive/                         # Historical documentation
    ├── DEPLOYMENT_*.md              # Old deployment guides
    ├── STRIPE_*.md                  # Old Stripe docs
    ├── SUPABASE_*.md                # Old Supabase docs
    └── ...                          # Other archived files
```

---

## 🚀 Common Tasks

### Deploy to Production
1. Read: [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)
2. Verify: Environment variables configured
3. Run: `npx vercel --prod`
4. Monitor: Vercel logs

### Setup Stripe Testing
1. Read: [Stripe Setup](infrastructure/STRIPE_SETUP.md) → Section 1-4
2. Install: Stripe CLI
3. Get: TEST keys from Dashboard
4. Run: `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`

### Configure Monitoring
1. Read: [Monitoring](operations/MONITORING.md)
2. Verify: Vercel Analytics enabled
3. Optional: Configure Plausible Analytics
4. Setup: Error boundaries

### Test Accessibility
1. Read: [Accessibility](standards/ACCESSIBILITY.md)
2. Install: ESLint jsx-a11y plugin (already configured)
3. Run: `npm run lint`
4. Test: Keyboard navigation

---

## 📊 Documentation Statistics

| Category | Files | Size |
|----------|-------|------|
| Deployment | 1 | 7.8KB |
| Infrastructure | 4 | 43.5KB |
| Operations | 4 | 38.4KB |
| Standards | 1 | 14KB |
| Archive | 21 | 196KB |
| **Total** | **31** | **299.7KB** |

**Root Documentation**:
- CLAUDE.md (28KB) - Primary AI development guide
- TECHNICAL_BUILD.md (39KB) - Technical reference
- business plan.md (15KB) - Business strategy
- test-drag-drop.md (717B) - Testing notes

---

## 🔍 Finding Information

### By Topic

**Authentication & Security**:
- CLAUDE.md → Section "Authentication & Authorization"
- infrastructure/RLS_DEPLOYMENT_GUIDE.md
- infrastructure/RLS_VERIFICATION.md

**Billing & Payments**:
- infrastructure/STRIPE_SETUP.md (comprehensive)
- archive/STRIPE_TESTING_SETUP.md (detailed testing)
- archive/STRIPE_DIAGNOSTIC_REPORT.md (troubleshooting history)

**Database**:
- infrastructure/SUPABASE_PRODUCTION_CONFIG.md
- infrastructure/RLS_DEPLOYMENT_GUIDE.md
- TECHNICAL_BUILD.md → Database section

**API Routes**:
- CLAUDE.md → API Routes section
- operations/RATE_LIMITING.md
- TECHNICAL_BUILD.md

**Frontend Components**:
- CLAUDE.md → Components section
- TECHNICAL_BUILD.md
- test-drag-drop.md

**Deployment**:
- deployment/DEPLOYMENT_GUIDE.md (current)
- archive/PRODUCTION_DEPLOYMENT.md (historical)
- archive/DEPLOYMENT_SUCCESS.md (initial deployment)

### By Task

**I want to...**

- **Deploy to production** → `deployment/DEPLOYMENT_GUIDE.md`
- **Test Stripe locally** → `infrastructure/STRIPE_SETUP.md` Section 1-4
- **Fix Stripe issues** → `infrastructure/STRIPE_SETUP.md` Section 7
- **Configure database** → `infrastructure/SUPABASE_PRODUCTION_CONFIG.md`
- **Setup monitoring** → `operations/MONITORING.md`
- **Create backups** → `operations/BACKUP_RECOVERY.md`
- **Test accessibility** → `standards/ACCESSIBILITY.md`
- **Understand architecture** → `CLAUDE.md`
- **Review technical specs** → `TECHNICAL_BUILD.md`

---

## 📝 Contributing to Documentation

### Adding New Documentation

1. **Determine Category**:
   - Deployment → `docs/deployment/`
   - Infrastructure → `docs/infrastructure/`
   - Operations → `docs/operations/`
   - Standards → `docs/standards/`

2. **Create File**:
   - Use descriptive filename (UPPER_CASE.md)
   - Start with clear title and status
   - Include table of contents for long docs

3. **Update Index**:
   - Add entry to this README.md
   - Update relevant sections in CLAUDE.md if major change

### Updating Existing Documentation

1. Update "Last Updated" date at top of file
2. If major change, add note to changelog section
3. If structure changes, update this README.md

### Archiving Old Documentation

- Move to `docs/archive/`
- Keep for historical reference
- Don't delete (useful for troubleshooting)

---

## 🔗 External Resources

**Project Links**:
- **Live Site**: https://jobwall.co.uk
- **Repository**: https://github.com/troy-samuels/recruitment-operations
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com

**Documentation**:
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Vercel**: https://vercel.com/docs
- **WCAG**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 📞 Support & Contact

**For Developers**:
- Review CLAUDE.md for architecture patterns
- Check TECHNICAL_BUILD.md for implementation details
- See specific docs for configuration issues

**For Issues**:
- Deployment: `deployment/DEPLOYMENT_GUIDE.md` → Troubleshooting
- Stripe: `infrastructure/STRIPE_SETUP.md` → Section 7
- Database: `infrastructure/SUPABASE_PRODUCTION_CONFIG.md`

**Historical Context**:
- See `archive/` for previous troubleshooting steps
- Stripe connectivity issues: `archive/STRIPE_DIAGNOSTIC_REPORT.md`
- Initial deployment: `archive/DEPLOYMENT_SUCCESS.md`

---

## 📅 Documentation Timeline

- **September 30, 2025**: Initial technical documentation (TECHNICAL_BUILD.md)
- **October 1, 2025**: Production deployment documentation created
- **October 2, 2025**:
  - Stripe testing setup documented
  - RLS security documentation added
  - CRON setup documented
  - **Documentation cleanup & consolidation** (this index created)

---

**Maintained By**: Claude Code (AI Assistant)
**Organization**: Troy Samuels / Jobwall
**Status**: ✅ Active & Up-to-Date
