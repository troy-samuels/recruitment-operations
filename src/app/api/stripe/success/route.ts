import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.NEXT_STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 400 })
    const stripe = new Stripe(secretKey, { apiVersion: '2025-09-30.clover' })

    const body = await req.json().catch(() => ({}))
    const sessionId: string | undefined = body?.session_id
    if (!sessionId) return NextResponse.json({ ok: false, error: 'Missing session_id' }, { status: 400 })

    // Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription', 'customer'] })
    if (!session || session.status !== 'complete') {
      return NextResponse.json({ ok: false, error: 'Session not complete' }, { status: 400 })
    }

    // Optional: ensure we have recorded the subscription in DB
    const wsId = (session.metadata as any)?.workspace_id || (session.subscription as any)?.metadata?.workspace_id || null
    if (wsId) {
      try {
        const admin = getSupabaseAdmin()
        await admin.from('events').insert({
          workspace_id: wsId as any,
          event_name: 'payment_verified',
          meta: { session_id: session.id }
        } as any)
      } catch {}
    }

    // Set httpOnly, Secure cookie
    const res = NextResponse.json({ ok: true })
    const oneMonth = 60 * 60 * 24 * 30
    res.headers.append('Set-Cookie', `ro_paid=1; Path=/; Max-Age=${oneMonth}; SameSite=Lax; HttpOnly; Secure`)
    return res
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}


