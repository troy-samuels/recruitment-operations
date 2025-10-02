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




