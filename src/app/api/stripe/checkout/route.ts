import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const publishableKey = process.env.NEXT_STRIPE_PUBLISHABLE_KEY
const secretKey = process.env.NEXT_STRIPE_SECRET_KEY

export async function POST(req: NextRequest) {
  try {
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    }
    const body = await req.json().catch(()=>({}))
    const seats = Math.max(1, Number(body?.seats || 1))
    const priceId = body?.priceId || process.env.STRIPE_DEFAULT_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID
    const workspaceId = body?.workspaceId || null
    // Let customers enter promo codes directly in Stripe Checkout UI
    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
      timeout: 25000,
      maxNetworkRetries: 2
    })
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: seats }],
      success_url: `${origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing?canceled=1`,
      allow_promotion_codes: true,
      payment_method_collection: 'always',
      metadata: { seats: String(seats), ...(workspaceId ? { workspace_id: workspaceId } : {}) },
      subscription_data: {
        trial_period_days: 7,
        metadata: { seats: String(seats), ...(workspaceId ? { workspace_id: workspaceId } : {}) },
      },
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


