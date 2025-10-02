import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('workspace_subscriptions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .maybeSingle()
    if (error) {
      // Local dev fallback when table not present
      return NextResponse.json({
        tier: 'individual',
        seats: 1,
        status: 'trialing',
        priceId: null,
        currentPeriodEnd: null,
      })
    }
    const seats = data?.seats ?? 1
    const tier = seats > 1 ? 'team' : 'individual'
    return NextResponse.json({
      tier,
      seats,
      status: data?.status || 'trialing',
      priceId: data?.price_id || null,
      currentPeriodEnd: data?.current_period_end || null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


