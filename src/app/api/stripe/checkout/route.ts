import { NextRequest, NextResponse } from 'next/server'

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
    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

    // Derive origin from request URL to ensure a valid https production URL
    let origin = process.env.NEXT_PUBLIC_SITE_URL || ''
    try { origin = new URL(req.url).origin } catch {}
    if (!origin) origin = 'https://jobwall.co.uk'

    // Build form-encoded payload for Stripe REST API
    const params = new URLSearchParams()
    params.append('mode', 'subscription')
    params.append('success_url', `${origin}/billing?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url', `${origin}/billing?canceled=1`)
    params.append('allow_promotion_codes', 'true')
    params.append('payment_method_collection', 'always')
    params.append('line_items[0][price]', String(priceId))
    params.append('line_items[0][quantity]', String(seats))
    params.append('subscription_data[trial_period_days]', '7')
    params.append('metadata[seats]', String(seats))
    params.append('subscription_data[metadata][seats]', String(seats))
    if (workspaceId) {
      params.append('metadata[workspace_id]', String(workspaceId))
      params.append('subscription_data[metadata][workspace_id]', String(workspaceId))
      params.append('client_reference_id', String(workspaceId))
    }

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params,
      signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(25000) : undefined,
    })

    const json = await resp.json()
    if (!resp.ok) {
      const message = json?.error?.message || `Stripe error (${resp.status})`
      return NextResponse.json({ error: message }, { status: 500 })
    }

    return NextResponse.json({ id: json.id, url: json.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


