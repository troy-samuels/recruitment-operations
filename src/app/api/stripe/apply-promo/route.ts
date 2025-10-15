import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.NEXT_STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 400 })
    const stripe = new Stripe(secretKey, { apiVersion: '2025-09-30.clover' })

    const body = await req.json().catch(() => ({}))
    const code: string | undefined = (body?.code || '').trim()
    const workspaceId: string | undefined = body?.workspaceId
    if (!code) return NextResponse.json({ ok: false, error: 'Missing code' }, { status: 400 })
    if (!workspaceId) return NextResponse.json({ ok: false, error: 'Missing workspaceId' }, { status: 400 })

    const admin = getSupabaseAdmin()
    const { data: ws, error } = await admin
      .from('workspace_subscriptions')
      .select('stripe_subscription_id')
      .eq('workspace_id', workspaceId)
      .maybeSingle()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    const subId = ws?.stripe_subscription_id
    if (!subId) return NextResponse.json({ ok: false, error: 'Subscription not found' }, { status: 404 })

    // Find promotion_code by the human-readable code
    const promoList = await stripe.promotionCodes.list({ code, active: true, limit: 1 })
    const promo = promoList.data[0]
    if (!promo) return NextResponse.json({ ok: false, error: 'Promotion code not found or inactive' }, { status: 404 })

    await stripe.subscriptions.update(subId, { discounts: [{ promotion_code: promo.id }] })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}



