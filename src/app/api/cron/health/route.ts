import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail } from '@/lib/resend'

type CheckResult = { ok: boolean; status?: number; error?: string; sample?: string }

async function authorize(req: NextRequest): Promise<boolean> {
  if (req.headers.get('x-vercel-cron')) return true
  const auth = req.headers.get('authorization') || ''
  const secret = process.env.CRON_SECRET
  if (secret && auth === `Bearer ${secret}`) return true
  try {
    const u = new URL(req.url)
    const key = u.searchParams.get('key')
    if (secret && key === secret) return true
  } catch {}
  return false
}

async function checkSupabase(): Promise<CheckResult> {
  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from('workspaces').select('id', { count: 'exact', head: true }).limit(1)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'supabase error' }
  }
}

async function checkStripe(siteUrl: string): Promise<CheckResult> {
  try {
    const res = await fetch(`${siteUrl.replace(/\/$/, '')}/api/stripe/diagnose`, { signal: AbortSignal.timeout(7000) })
    const sample = await res.text().then(t => t.slice(0, 200)).catch(() => '')
    return { ok: res.ok, status: res.status, sample }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'fetch error' }
  }
}

async function checkAnalytics(siteUrl: string): Promise<CheckResult> {
  try {
    const res = await fetch(`${siteUrl.replace(/\/$/, '')}/api/analytics/summary?workspaceId=00000000-0000-0000-0000-000000000000`, { signal: AbortSignal.timeout(7000) })
    const sample = await res.text().then(t => t.slice(0, 120)).catch(() => '')
    return { ok: res.ok, status: res.status, sample }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'fetch error' }
  }
}

async function maybeAlert(subject: string, html: string) {
  try {
    const to = process.env.ALERT_EMAIL_TO || 'info@jobwall.co.uk'
    await sendEmail({ to, subject, html })
  } catch {}
}

export async function GET(req: NextRequest) {
  try {
    const ok = await authorize(req)
    if (!ok) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwall.co.uk'

    const [db, stripe, analytics] = await Promise.all([
      checkSupabase(),
      checkStripe(siteUrl),
      checkAnalytics(siteUrl),
    ])

    const allOk = db.ok && stripe.ok && analytics.ok

    if (!allOk) {
      const details = { db, stripe, analytics, timestamp: new Date().toISOString() }
      await maybeAlert(
        'Jobwall Health Check FAILED',
        `<pre style="font-family:monospace;white-space:pre-wrap">${JSON.stringify(details, null, 2)}</pre>`
      )
    }

    return NextResponse.json({ ok: allOk, checks: { db, stripe, analytics }, timestamp: new Date().toISOString() })
  } catch (e: any) {
    await maybeAlert('Jobwall Health Check EXCEPTION', String(e?.message || e))
    return NextResponse.json({ ok: false, error: e?.message || 'server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}


