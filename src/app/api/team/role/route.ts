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



