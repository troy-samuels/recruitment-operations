import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

function getEnv(name: string): string | undefined {
  try { return (process.env as any)[name] as string | undefined } catch { return undefined }
}

export async function GET(req: NextRequest) {
  try {
    const secretKey = getEnv('NEXT_STRIPE_SECRET_KEY') || getEnv('STRIPE_SECRET_KEY') || getEnv('STRIPE_LIVE_SECRET_KEY')
    if (!secretKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const priceId = searchParams.get('priceId') || getEnv('NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID') || getEnv('STRIPE_DEFAULT_PRICE_ID')
    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

    const url = `https://api.stripe.com/v1/prices/${encodeURIComponent(priceId)}?expand[]=tiers&expand[]=product`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: 'application/json',
      },
    })
    if (!res.ok) {
      const text = await res.text().catch(()=> '')
      return NextResponse.json({ error: `Stripe error (${res.status})`, details: text.slice(0, 800) }, { status: 500 })
    }
    const data = await res.json()
    const price: any = data
    const product: any = price.product && typeof price.product === 'object' ? price.product : null

    return NextResponse.json({
      price: {
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        unit_amount_decimal: price.unit_amount_decimal || null,
        recurring: price.recurring || null,
        type: price.type,
        nickname: price.nickname || null,
        billing_scheme: price.billing_scheme || null,
        tiers_mode: price.tiers_mode || null,
        transform_quantity: price.transform_quantity || null,
        tiers: Array.isArray(price.tiers) ? price.tiers.map((t: any) => ({
          up_to: t.up_to,
          unit_amount: t.unit_amount ?? null,
          unit_amount_decimal: t.unit_amount_decimal ?? null,
          flat_amount: t.flat_amount ?? null,
          flat_amount_decimal: t.flat_amount_decimal ?? null,
        })) : null,
      },
      product: product ? {
        id: product.id,
        name: product.name,
        active: product.active,
        description: product.description,
        metadata: product.metadata,
      } : null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


