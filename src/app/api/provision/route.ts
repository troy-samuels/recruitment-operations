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
    try {
      await admin.rpc('ensure_workspace', { p_workspace_id: workspaceId, p_owner_user_id: userId, p_owner_email: email, p_owner_name: name || email.split('@')[0] })
    } catch {
      // Fallback: insert directly if RPC not present
      await admin.from('workspaces').upsert({ id: workspaceId, name: name || 'My Workspace', owner_user_id: userId }, { onConflict: 'id' })
    }

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




