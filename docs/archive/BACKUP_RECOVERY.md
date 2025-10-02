# Backup & Disaster Recovery Plan

This document outlines the backup strategy and disaster recovery procedures for the Jobwall recruitment operations dashboard.

## Overview

The application uses a multi-layered backup approach:
1. **Supabase Automatic Backups** - Daily database backups (managed)
2. **Git Version Control** - Code repository backups
3. **Manual Database Exports** - On-demand full backups
4. **Environment Configuration Backups** - Environment variables and secrets
5. **User Data Exports** - Workspace-specific data exports

---

## 1. Supabase Automatic Backups

**Status**: ✅ Enabled by default

### Configuration

**Backup Frequency**:
- **Free Tier**: Daily backups, 7-day retention
- **Pro Tier**: Daily backups, 30-day retention
- **Enterprise**: Custom retention periods

**What's Backed Up**:
- All database tables and data
- Schema (tables, functions, triggers)
- Row Level Security (RLS) policies
- Auth configurations
- Storage buckets (if used)

**Not Backed Up**:
- Environment variables (stored in Vercel)
- Application code (stored in Git)
- External integrations (Stripe, Resend)

### Accessing Backups

**Dashboard**: https://supabase.com/dashboard/project/votpasanvrutqwyzxzmk/settings/backups

**Steps**:
1. Navigate to Project Settings → Backups
2. View list of available backups (daily snapshots)
3. Download backup or restore to new project

**Backup Schedule**:
- Time: Daily at approximately 02:00 UTC
- Format: PostgreSQL dump (`.sql`)
- Compression: gzip compressed

### Restoration from Automatic Backup

**Option 1: Restore to New Project** (Recommended)
```bash
# 1. Download backup from Supabase dashboard
# 2. Create new Supabase project
# 3. Restore using psql

psql -h db.new-project.supabase.co \
     -U postgres \
     -d postgres \
     -f backup-2025-10-02.sql
```

**Option 2: In-Place Restoration** (Destructive)
```bash
# ⚠️ WARNING: This will overwrite existing data

# 1. Download backup
# 2. Drop existing tables (careful!)
# 3. Restore backup

psql -h db.votpasanvrutqwyzxzmk.supabase.co \
     -U postgres \
     -d postgres \
     -f backup-2025-10-02.sql
```

### Point-in-Time Recovery (Pro Plan)

**Status**: Available with Pro plan upgrade

**Features**:
- Restore to any point in the last 7 days
- Granular recovery (specific tables/rows)
- No data loss between backups

**Usage**:
1. Navigate to Settings → Backups → Point-in-Time
2. Select timestamp
3. Choose restore scope (full or partial)
4. Confirm restoration

---

## 2. Manual Database Backups

**Purpose**: Create on-demand backups before major changes or deployments

### Full Database Backup

**Using Supabase CLI**:
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref votpasanvrutqwyzxzmk

# Export database
supabase db dump -f backup-manual-$(date +%Y%m%d-%H%M%S).sql
```

**Using pg_dump**:
```bash
# Set connection details
export PGHOST=db.votpasanvrutqwyzxzmk.supabase.co
export PGUSER=postgres
export PGDATABASE=postgres
export PGPASSWORD=<your-database-password>

# Full backup (schema + data)
pg_dump > backup-full-$(date +%Y%m%d-%H%M%S).sql

# Schema only
pg_dump --schema-only > backup-schema-$(date +%Y%m%d-%H%M%S).sql

# Data only
pg_dump --data-only > backup-data-$(date +%Y%m%d-%H%M%S).sql

# Compressed backup
pg_dump | gzip > backup-full-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Table-Specific Backup

```bash
# Backup specific tables
pg_dump -t workspaces -t profiles -t roles \
  > backup-core-tables-$(date +%Y%m%d-%H%M%S).sql

# Backup with INSERT statements (more portable)
pg_dump --column-inserts -t workspaces \
  > backup-workspaces-$(date +%Y%m%d-%H%M%S).sql
```

### Backup Script (Automated)

**Create**: `scripts/backup.sh`
```bash
#!/bin/bash

# Automated backup script for Jobwall database

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$HOME/jobwall-backups"
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Database connection details
export PGHOST=db.votpasanvrutqwyzxzmk.supabase.co
export PGUSER=postgres
export PGDATABASE=postgres
# Store password in ~/.pgpass for security

echo "Starting backup at $(date)"

# Create compressed backup
pg_dump | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"

  # Get backup size
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup size: $SIZE"

  # Delete backups older than 30 days
  find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +30 -delete
  echo "Cleaned up old backups (older than 30 days)"
else
  echo "Backup failed!"
  exit 1
fi

echo "Backup completed at $(date)"
```

**Setup**:
```bash
chmod +x scripts/backup.sh

# Add to crontab (run daily at 3 AM)
crontab -e
# Add line:
# 0 3 * * * /path/to/jobwall/scripts/backup.sh >> /var/log/jobwall-backup.log 2>&1
```

---

## 3. Code Repository Backups

**Status**: ✅ Enabled via Git

**Primary Repository**:
- **Platform**: GitHub
- **Repository**: `troy-samuels/recruitment-operations`
- **Branch**: `main`
- **Visibility**: Private

**Backup Strategy**:
1. All code changes committed to Git
2. Pushed to GitHub remote
3. GitHub provides redundant storage
4. Deployment history in Vercel

**Additional Backup Locations** (Recommended):
```bash
# Add GitLab as additional remote
git remote add gitlab git@gitlab.com:troy-samuels/recruitment-operations.git
git push gitlab main

# Add Bitbucket as additional remote
git remote add bitbucket git@bitbucket.org:troy-samuels/recruitment-operations.git
git push bitbucket main
```

**Local Backup**:
```bash
# Create local backup of repository
git clone --mirror https://github.com/troy-samuels/recruitment-operations.git \
  ~/backups/recruitment-operations-mirror-$(date +%Y%m%d).git
```

---

## 4. Environment Variables Backup

**Status**: ⚠️ Manual backup recommended

**Why Backup**:
- Vercel stores environment variables, but not version controlled
- Critical for application functionality
- Needed for disaster recovery

**Backup Procedure**:

### Download from Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Download environment variables
vercel env pull .env.backup.$(date +%Y%m%d)
```

### Manual Documentation
Create: `environment-backup.encrypted.txt`
```
# Jobwall Environment Variables Backup
# Date: 2025-10-02
# ENCRYPT THIS FILE BEFORE STORING

NEXT_PUBLIC_SUPABASE_URL=https://votpasanvrutqwyzxzmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
# ... (add all variables)
```

**Encryption**:
```bash
# Encrypt backup
gpg --symmetric --cipher-algo AES256 environment-backup.txt

# Decrypt when needed
gpg --decrypt environment-backup.txt.gpg > environment-backup.txt
```

**Storage**:
- Encrypted local backup
- Password manager (1Password, LastPass, Bitwarden)
- Secure cloud storage (encrypted S3 bucket)

---

## 5. Workspace Data Exports

**Purpose**: Allow users to export their data for backup or migration

### Create Export API Endpoint

**File**: `src/app/api/workspace/export/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  // Get workspace ID from query params
  const workspaceId = req.nextUrl.searchParams.get('workspace_id')

  if (!workspaceId) {
    return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Export all workspace data
  const [
    { data: workspace },
    { data: profiles },
    { data: roles },
    { data: candidates },
    { data: tasks },
    { data: activities },
  ] = await Promise.all([
    supabase.from('workspaces').select('*').eq('id', workspaceId).single(),
    supabase.from('profiles').select('*').eq('workspace_id', workspaceId),
    supabase.from('roles').select('*').eq('workspace_id', workspaceId),
    supabase.from('candidates').select('*').eq('workspace_id', workspaceId),
    supabase.from('tasks').select('*').eq('workspace_id', workspaceId),
    supabase.from('activities').select('*').eq('workspace_id', workspaceId),
  ])

  const exportData = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    workspace,
    profiles,
    roles,
    candidates,
    tasks,
    activities,
  }

  return NextResponse.json(exportData, {
    headers: {
      'Content-Disposition': `attachment; filename="jobwall-export-${workspaceId}-${Date.now()}.json"`,
      'Content-Type': 'application/json',
    },
  })
}
```

---

## 6. Disaster Recovery Procedures

### Scenario 1: Database Corruption/Data Loss

**Impact**: Critical - All user data affected
**RTO (Recovery Time Objective)**: 2 hours
**RPO (Recovery Point Objective)**: 24 hours (last daily backup)

**Recovery Steps**:
1. Assess extent of data loss (check Supabase dashboard)
2. Download latest automatic backup from Supabase
3. Create new Supabase project (or restore to staging first)
4. Restore backup using `psql` or Supabase dashboard
5. Update environment variables in Vercel to point to new database
6. Test critical functionality (auth, data access, billing)
7. Deploy and monitor for issues

**Estimated Time**: 1-2 hours

### Scenario 2: Accidental Data Deletion

**Impact**: Medium - Specific workspace or table affected
**RTO**: 30 minutes
**RPO**: Real-time (if Point-in-Time Recovery enabled)

**Recovery Steps**:
1. Identify affected data (workspace ID, table, time range)
2. If Pro plan: Use Point-in-Time Recovery to restore specific data
3. If Free plan: Restore from most recent daily backup
4. Export only affected data from backup
5. Import into production database
6. Verify data integrity

**Estimated Time**: 30 minutes - 1 hour

### Scenario 3: Complete Application Failure

**Impact**: Critical - Application unavailable
**RTO**: 15 minutes
**RPO**: None (no data loss)

**Recovery Steps**:
1. Check Vercel deployment status
2. If deployment failed: Rollback to previous deployment
3. If infrastructure issue: Wait for Vercel/Supabase status update
4. If code issue: Fix and redeploy from git
5. Verify application is operational

**Vercel Rollback**:
```bash
# Via Vercel dashboard:
# 1. Go to Deployments
# 2. Find last working deployment
# 3. Click "..." → "Promote to Production"

# Via CLI:
vercel rollback <deployment-url>
```

**Estimated Time**: 5-15 minutes

### Scenario 4: Security Breach

**Impact**: Critical - Potential data breach
**RTO**: Immediate
**RPO**: N/A

**Immediate Actions**:
1. Rotate all API keys and secrets
2. Invalidate all user sessions
3. Enable maintenance mode (temporarily disable site)
4. Assess scope of breach (check Supabase logs, Vercel logs)
5. Restore from clean backup if compromised
6. Implement additional security measures
7. Notify affected users (if personal data exposed)

**Key Rotation**:
```bash
# Rotate Supabase keys (in Supabase dashboard)
# Rotate Stripe keys (in Stripe dashboard)
# Rotate Resend key (in Resend dashboard)
# Update all keys in Vercel environment variables
```

### Scenario 5: Third-Party Service Outage

**Impact**: Medium - Specific functionality unavailable
**RTO**: Dependent on third-party
**RPO**: None

**Affected Services**:
- **Supabase**: Database and auth unavailable → Display maintenance page
- **Vercel**: Application unavailable → Wait for resolution
- **Stripe**: Payments unavailable → Display notice, queue failed payments
- **Resend**: Emails unavailable → Queue emails, retry later

**Monitoring Third-Party Status**:
- Supabase: https://status.supabase.com
- Vercel: https://www.vercel-status.com
- Stripe: https://status.stripe.com
- Resend: https://resend.com/status

---

## 7. Testing Backup & Recovery

### Monthly Backup Test (Recommended)

**Test Plan**:
1. Download latest automatic backup from Supabase
2. Create test Supabase project
3. Restore backup to test project
4. Verify all tables and data present
5. Test application functionality with test database
6. Document any issues
7. Destroy test project

**Checklist**:
- [ ] Backup downloaded successfully
- [ ] Backup file size reasonable (not corrupted)
- [ ] Restore completed without errors
- [ ] All 11 tables present
- [ ] RLS policies restored
- [ ] Sample queries return expected results
- [ ] Auth users present and accessible
- [ ] Foreign key relationships intact

### Quarterly Disaster Recovery Drill

**Full DR Test**:
1. Simulate complete application failure
2. Follow disaster recovery procedures
3. Measure RTO and RPO
4. Document recovery process
5. Identify improvements
6. Update DR plan as needed

---

## 8. Backup Storage Requirements

### Storage Estimates

**Database Size**:
- Current: ~10MB (initial deployment)
- Expected growth: ~50MB per 1,000 users
- Annual growth estimate: ~500MB-1GB

**Backup Storage**:
- Daily backups: 30 days × ~10MB = 300MB
- Manual backups: ~100MB per quarter
- Total: ~500MB first year

**Backup Location**:
- Supabase managed backups: Included in plan
- Manual backups: Local storage + cloud backup
- Recommended: AWS S3, Google Cloud Storage, or similar

---

## 9. Backup Security

### Best Practices

1. **Encryption**:
   - Encrypt backups at rest
   - Use strong encryption (AES-256)
   - Store encryption keys separately

2. **Access Control**:
   - Limit access to backups (only admins)
   - Use IAM roles for cloud storage
   - Audit backup access logs

3. **Retention Policy**:
   - Keep daily backups for 30 days
   - Keep monthly backups for 1 year
   - Archive annual backups indefinitely

4. **Testing**:
   - Test restores monthly
   - Verify backup integrity
   - Document recovery procedures

---

## 10. Compliance & Legal

### GDPR Considerations

**Right to Erasure**:
- Backups contain personal data
- Must be deleted upon user request
- Document data retention in privacy policy

**Data Processing Agreement**:
- Supabase is sub-processor
- Ensure DPA covers backup data
- Verify compliance with GDPR

### Industry Standards

**ISO 27001**:
- Regular backup testing
- Documented recovery procedures
- Access controls

**SOC 2**:
- Backup availability
- Disaster recovery plan
- Incident response

---

## Quick Reference

### Supabase Database Connection

```bash
Host: db.votpasanvrutqwyzxzmk.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [stored in password manager]
```

### Emergency Contacts

- **Supabase Support**: support@supabase.com
- **Vercel Support**: support@vercel.com
- **GitHub Support**: support@github.com

### Backup Commands

```bash
# Quick backup
pg_dump > backup-$(date +%Y%m%d).sql

# Compressed backup
pg_dump | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore from backup
psql < backup-20251002.sql

# Restore from compressed
gunzip < backup-20251002.sql.gz | psql
```

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
**Next Review**: 2026-01-02 (Quarterly)
**Status**: Production Ready ✅
