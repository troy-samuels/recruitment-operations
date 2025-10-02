import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

function getEnv(name: string): string | undefined {
	try { return (process.env as any)[name] as string | undefined } catch { return undefined }
}

export async function GET(req: NextRequest) {
	try {
		const secretKey = getEnv('NEXT_STRIPE_SECRET_KEY') || getEnv('STRIPE_SECRET_KEY') || getEnv('STRIPE_LIVE_SECRET_KEY')
		if (!secretKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
		const priceId = getEnv('NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID') || getEnv('STRIPE_DEFAULT_PRICE_ID')
		if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

		const safeId = priceId.trim().replace(/\s+/g,'')
		const priceRes = await fetch(`https://api.stripe.com/v1/prices/${encodeURIComponent(safeId)}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${secretKey}`,
				'Accept': 'application/json',
			},
			// Edge default timeout is generous; rely on Stripe retries server-side
		})
		if (!priceRes.ok) {
			const text = await priceRes.text().catch(()=> '')
			return NextResponse.json({ error: `Stripe error (${priceRes.status})`, details: text.slice(0, 500) }, { status: 500 })
		}
		const price = await priceRes.json() as any
		let product: any = null
		if (price.product && typeof price.product === 'string') {
			const prodRes = await fetch(`https://api.stripe.com/v1/products/${encodeURIComponent(price.product)}`, {
				headers: { Authorization: `Bearer ${secretKey}`, Accept: 'application/json' },
			})
			if (prodRes.ok) product = await prodRes.json()
		}

		return NextResponse.json({
			price: {
				id: price.id,
				currency: price.currency,
				unit_amount: price.unit_amount,
				recurring: price.recurring || null,
				billing_scheme: price.billing_scheme || null,
				tiers_mode: price.tiers_mode || null,
				tiers: Array.isArray(price.tiers) ? price.tiers.map((t: any) => ({
					up_to: t.up_to,
					unit_amount: t.unit_amount ?? null,
					flat_amount: t.flat_amount ?? null,
				})) : null,
			},
			product: product ? { id: product.id, name: product.name } : null,
		})
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
	}
}


