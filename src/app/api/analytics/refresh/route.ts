import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Dev-only helper endpoint to refresh analytics materialized views
export async function POST(_req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ ok: false, error: 'Not allowed in production' }, { status: 403 })
    }
    const admin = getSupabaseAdmin()
    const { error } = await admin.rpc('refresh_analytics_views')
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}



