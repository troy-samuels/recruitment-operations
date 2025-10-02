import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const events: Array<{ name: string; props?: any; ts?: number; context?: any }> = Array.isArray(body?.events) ? body.events : []
    if (!events || events.length === 0) {
      return NextResponse.json({ ok: false, error: 'No events' }, { status: 400 })
    }

    // Basic rate limiting: cap batch size to prevent abuse
    if (events.length > 200) {
      return NextResponse.json({ ok: false, error: 'Too many events in one request' }, { status: 413 })
    }

    const hasAdmin = !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!hasAdmin) return NextResponse.json({ ok: true, stored: 0, mode: 'local' })

    const admin = getSupabaseAdmin()
    // Map legacy payload to v2 events schema columns
    const rows = events.map(e => {
      const props = e.props || {}
      return {
        event_name: e.name,
        ts: new Date(e.ts || Date.now()).toISOString(),
        workspace_id: props.workspace_id || props.workspaceId || null,
        user_id: props.user_id || props.userId || null,
        role_id: props.role_id || props.roleId || null,
        candidate_id: props.candidate_id || props.candidateId || null,
        company: props.company || null,
        stage: props.stage || null,
        value_numeric: typeof props.value === 'number' ? props.value : null,
        meta: props,
      }
    })
    const { error } = await admin.from('events').insert(rows)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, stored: rows.length })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}



