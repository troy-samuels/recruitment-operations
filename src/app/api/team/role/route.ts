import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(()=>({}))
    const email: string = body?.email
    const role: string = body?.role
    if (!email || !role) return NextResponse.json({ error: 'email and role required' }, { status: 400 })
    if (!['admin','member'].includes(role)) return NextResponse.json({ error: 'invalid role' }, { status: 400 })
    const admin = getSupabaseAdmin()
    const { error } = await admin.from('profiles').update({ role }).eq('email', email)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

// Enforce RBAC on role create/delete via workspace settings
export async function PUT(req: NextRequest) {
  try {
    const admin = getSupabaseAdmin()
    const body = await req.json().catch(()=>({}))
    const actorEmail: string | undefined = body?.actorEmail
    const workspaceId: string | undefined = body?.workspaceId
    const action: 'create' | 'delete' | undefined = body?.action
    if (!actorEmail || !workspaceId || !action) return NextResponse.json({ error: 'actorEmail, workspaceId, action required' }, { status: 400 })
    // Load actor profile
    const { data: profile, error: pErr } = await admin.from('profiles').select('role').eq('email', actorEmail).maybeSingle()
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })
    const actorRole = (profile?.role as 'admin' | 'member' | undefined) || 'member'
    // Load workspace setting
    const { data: ws, error: wErr } = await admin.from('workspaces').select('settings').eq('id', workspaceId).maybeSingle()
    if (wErr) return NextResponse.json({ error: wErr.message }, { status: 500 })
    const who = (ws?.settings as any)?.permissions?.whoCanCreateRoles || 'admin_only'
    const allowed = who === 'any_member' ? (actorRole === 'admin' || actorRole === 'member') : (actorRole === 'admin')
    if (!allowed) return NextResponse.json({ ok: false, denied: true })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}



