import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Cron job endpoint to refresh analytics materialized views
 * Scheduled to run every 6 hours via Vercel Cron
 * Protected by CRON_SECRET environment variable
 */
export async function GET(req: NextRequest) {
  try {
    const ok = await authorize(req)
    if (!ok) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Refresh analytics materialized views
    const admin = getSupabaseAdmin()
    const { error } = await admin.rpc('refresh_analytics_views')

    if (error) {
      console.error('[CRON] Analytics refresh failed:', error)
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('[CRON] Analytics views refreshed successfully')
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: 'Analytics views refreshed successfully'
    })
  } catch (e: any) {
    console.error('[CRON] Unexpected error:', e)
    return NextResponse.json(
      { ok: false, error: e?.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}

async function authorize(req: NextRequest): Promise<boolean> {
  // Allow Vercel Cron (adds x-vercel-cron header automatically)
  if (req.headers.get('x-vercel-cron')) return true

  // Allow via shared secret (Authorization: Bearer <CRON_SECRET>)
  const auth = req.headers.get('authorization') || ''
  const secret = process.env.CRON_SECRET

  if (!secret) {
    console.warn('[CRON] CRON_SECRET not configured')
    return false
  }

  if (auth === `Bearer ${secret}`) return true

  // Allow via query string ?key=<CRON_SECRET>
  try {
    const u = new URL(req.url)
    const key = u.searchParams.get('key')
    if (key === secret) return true
  } catch {}

  return false
}
