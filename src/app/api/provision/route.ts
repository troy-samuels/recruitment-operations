import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const admin = getSupabaseAdmin()
    const body = await req.json().catch(()=> ({}))
    const { userId, email, name } = body || {}
    if (!userId || !email) {
      return NextResponse.json({ ok: false, error: 'Missing userId or email' }, { status: 400 })
    }

    // Ensure workspace exists (one-per-user default). If you support teams, this can vary.
    const workspaceId = `ws_${userId.slice(0,8)}`
    await admin.rpc('ensure_workspace', { p_workspace_id: workspaceId, p_owner_user_id: userId, p_owner_email: email, p_owner_name: name || email.split('@')[0] }).catch(async () => {
      // Fallback: insert directly if RPC not present
      await admin.from('workspaces').upsert({ id: workspaceId, name: name || 'My Workspace', owner_user_id: userId }, { onConflict: 'id' })
    })

    // Ensure profile row
    await admin.from('profiles').upsert({ id: userId, email, full_name: name || null }, { onConflict: 'id' })

    // Seed example roles if none exist
    const { data: roles } = await admin.from('roles').select('id').eq('workspace_id', workspaceId).limit(1)
    if (!roles || roles.length === 0) {
      const now = new Date().toISOString()
      await admin.from('roles').insert([
        { id: `r_${userId.slice(0,6)}a`, workspace_id: workspaceId, title: 'Senior React Developer', company: 'TechFlow Ltd', stage: 0, created_at: now, updated_at: now },
        { id: `r_${userId.slice(0,6)}b`, workspace_id: workspaceId, title: 'Data Analyst', company: 'DataCorp', stage: 1, created_at: now, updated_at: now },
        { id: `r_${userId.slice(0,6)}c`, workspace_id: workspaceId, title: 'Product Manager', company: 'InnovateCo', stage: 2, created_at: now, updated_at: now },
      ] as any)
    }

    return NextResponse.json({ ok: true, workspaceId })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const userId: string | undefined = body?.userId
    const email: string | undefined = body?.email
    const name: string | undefined = body?.name
    const workspaceName: string | undefined = body?.workspaceName

    if (!userId || !email) {
      return NextResponse.json({ ok: false, error: 'Missing userId or email' }, { status: 400 })
    }

    const hasAdmin = !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!hasAdmin) {
      // Graceful no-op if not configured in dev
      return NextResponse.json({ ok: true, mode: 'local' })
    }

    const admin = getSupabaseAdmin()
    const safeName = name || email.split('@')[0]
    const inferredWorkspace = workspaceName || `${(email.split('@')[1] || 'Personal').split('.')[0]} Workspace`

    // Upsert profile
    try { await admin.from('profiles').upsert({ id: userId, email, name: safeName }) } catch {}

    // Ensure a workspace exists for this user (owner)
    let workspaceId: string | null = null
    try {
      const existing = await admin.from('workspaces').select('id').eq('owner_id', userId).limit(1)
      const rows = (existing.data as any[]) || []
      if (rows.length > 0) {
        workspaceId = rows[0].id
      } else {
        const ins = await admin.from('workspaces').insert({ name: inferredWorkspace, owner_id: userId }).select('id').limit(1)
        if (ins.data && (ins.data as any[]).length > 0) workspaceId = (ins.data as any[])[0].id
      }
    } catch {}

    // Add membership if a mapping table exists
    try {
      if (workspaceId) {
        await admin.from('role_assignments').upsert({ workspace_id: workspaceId, user_id: userId, role: 'owner' })
      }
    } catch {}

    return NextResponse.json({ ok: true, workspaceId })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}




