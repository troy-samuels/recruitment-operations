import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(()=>({}))
    const email: string = body?.email
    const workspaceId: string = body?.workspaceId
    if (!email || !workspaceId) return NextResponse.json({ error: 'email and workspaceId required' }, { status: 400 })
    const admin = getSupabaseAdmin()
    const { data: prof } = await admin.from('profiles').select('id').eq('email', email).maybeSingle()
    if (!prof?.id) return NextResponse.json({ ok: true, removed: 0 })
    // Remove role assignments and set profile workspace null (soft remove)
    await admin.from('role_assignments').delete().eq('user_id', prof.id)
    await admin.from('profiles').update({ workspace_id: null, role: 'member' }).eq('id', prof.id)
    return NextResponse.json({ ok: true, removed: 1 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}




