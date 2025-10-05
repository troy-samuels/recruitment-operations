import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Ensure Node.js runtime for Stripe SDK (Edge runtime is not supported by stripe-node)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secretEnv = process.env.STRIPE_WEBHOOK_SECRET || ''
  const secretKey = process.env.NEXT_STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 400 })
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
    timeout: 25000,
    maxNetworkRetries: 2
  })

  // Read raw body once for signature verification
  const rawBuffer = Buffer.from(await req.arrayBuffer())
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  // Support rotation and copy-paste artifacts (commas, newlines, quotes, spaces)
  const secrets = secretEnv
    .split(/[\n,]+/)
    .map(s => s.trim().replace(/^['"]|['"]$/g, '').replace(/\s+/g, ''))
    .filter(Boolean)

  if (secrets.length > 0 && sig) {
    // Try all provided secrets (helps during secret rotation or multiple endpoints)
    let verified: Stripe.Event | null = null
    let lastError: any
    for (const s of secrets) {
      try {
        verified = stripe.webhooks.constructEvent(rawBuffer, sig, s)
        break
      } catch (e) {
        lastError = e
      }
    }
    if (!verified) {
      const msg = `Webhook signature verification failed${lastError?.message ? `: ${lastError.message}` : ''}`
      return NextResponse.json({ ok: false, error: msg }, { status: 400 })
    }
    event = verified
  } else {
    // Local/dev fallback when no secret or signature is present
    if (process.env.NODE_ENV !== 'production') {
      try {
        const text = rawBuffer.toString('utf8') || '{}'
        event = JSON.parse(text) as any
      } catch {
        event = { type: 'ping' } as any
      }
    } else {
      return NextResponse.json({ ok: false, error: 'Missing Stripe signature' }, { status: 400 })
    }
  }

  // Handle events minimal set
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      try {
        const admin = getSupabaseAdmin()
        if (event.type === 'checkout.session.completed') {
          const s = event.data.object as Stripe.Checkout.Session
          const customerId = typeof s.customer === 'string' ? s.customer : s.customer?.id
          const subId = typeof s.subscription === 'string' ? s.subscription : (s.subscription as any)?.id
          const seats = Number((s.metadata as any)?.seats || (s.subscription && (s.subscription as any)?.metadata?.seats) || 1)
          const price = (s.line_items as any)?.data?.[0]?.price?.id || (s.metadata as any)?.price_id || null
          const wsId = (s.metadata as any)?.workspace_id || null
          if (wsId) {
            await admin.from('workspace_subscriptions').upsert({
              workspace_id: wsId,
              stripe_customer_id: customerId || null,
              stripe_subscription_id: subId || null,
              seats,
              price_id: price,
              status: 'trialing',
            }, { onConflict: 'stripe_subscription_id' })
            // Update workspace tier based on seats
            await admin.from('workspaces').update({ subscription_tier: seats > 1 ? 'agency' : 'professional' }).eq('id', wsId)
            // Signal paid access via cookie on next request
            try {
              // we cannot set cookies directly from the webhook; mark via events for client to read
              await admin.from('events').insert({
                workspace_id: wsId as any,
                event_name: 'payment_method_collected',
                meta: { source: 'webhook', seats, price }
              } as any)
            } catch {}
          }
        }

        if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
          const sub = event.data.object as Stripe.Subscription
          const seats = Number(sub?.metadata?.seats || sub.items?.data?.[0]?.quantity || 1)
          const priceId = (sub.items?.data?.[0]?.price?.id) || null
          const admin2 = getSupabaseAdmin()
          const currentPeriodEndIso = (sub as any)?.current_period_end
            ? new Date(((sub as any).current_period_end as number) * 1000).toISOString()
            : null
          await admin2.from('workspace_subscriptions').upsert({
            stripe_subscription_id: sub.id,
            stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : (sub.customer as any)?.id,
            status: sub.status as any,
            current_period_end: currentPeriodEndIso,
            price_id: priceId,
            seats,
          }, { onConflict: 'stripe_subscription_id' })
          // Find workspace and update tier
          const { data: wsSub } = await admin2.from('workspace_subscriptions').select('workspace_id').eq('stripe_subscription_id', sub.id).maybeSingle()
          const wsId = wsSub?.workspace_id
          if (wsId) await admin2.from('workspaces').update({ subscription_tier: seats > 1 ? 'agency' : 'professional' }).eq('id', wsId)
        }

        if (event.type === 'customer.subscription.deleted') {
          const sub = event.data.object as Stripe.Subscription
          const admin3 = getSupabaseAdmin()
          await admin3.from('workspace_subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id)
          const { data: wsSub } = await admin3.from('workspace_subscriptions').select('workspace_id').eq('stripe_subscription_id', sub.id).maybeSingle()
          const wsId = wsSub?.workspace_id
          if (wsId) await admin3.from('workspaces').update({ subscription_tier: 'professional' }).eq('id', wsId)
        }
      } catch (err: any) {
        try {
          const admin = getSupabaseAdmin()
          await admin.from('events').insert({
            workspace_id: null as any,
            event_name: 'stripe_webhook_error',
            value_numeric: null,
            meta: { type: event.type, error: String(err?.message || err) }
          } as any)
        } catch {}
        // always 200 to Stripe
      }
      break
    default:
      break
  }
  return NextResponse.json({ ok: true })
}


