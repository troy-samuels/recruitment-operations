import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit, RateLimits } from '@/lib/rateLimit'

/**
 * Lead capture endpoint
 * Rate Limit: 100 requests per minute per IP
 */
export async function POST(req: NextRequest) {
	// Apply rate limiting
	const { limited, remaining, reset } = checkRateLimit(req, RateLimits.STANDARD)
	if (limited) {
		const retryAfter = Math.ceil((reset - Date.now()) / 1000)
		const response = NextResponse.json(
			{
				error: 'Too many requests',
				message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
			},
			{ status: 429 }
		)
		response.headers.set('Retry-After', retryAfter.toString())
		response.headers.set('X-RateLimit-Remaining', '0')
		response.headers.set('X-RateLimit-Reset', reset.toString())
		return response
	}
	try {
		const body = await req.json()
		const { firstName, lastName, email, orgName, createdAt } = body || {}
		const organisation = orgName || body?.organisation || body?.organization
		if (!firstName || !lastName || !email || !organisation) {
			return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
		}
		const supabase = getSupabaseAdmin()
		const { error } = await supabase.from('leads').insert({
			first_name: firstName,
			last_name: lastName,
			email,
			organisation,
			source: 'get-started',
			created_at: createdAt || new Date().toISOString(),
		})
		if (error) {
			const response = NextResponse.json({ error: error.message }, { status: 500 })
			response.headers.set('X-RateLimit-Remaining', remaining.toString())
			response.headers.set('X-RateLimit-Reset', reset.toString())
			return response
		}
		const response = NextResponse.json({ ok: true })
		response.headers.set('X-RateLimit-Remaining', remaining.toString())
		response.headers.set('X-RateLimit-Reset', reset.toString())
		return response
	} catch (e: any) {
		const response = NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
		response.headers.set('X-RateLimit-Remaining', remaining.toString())
		response.headers.set('X-RateLimit-Reset', reset.toString())
		return response
	}
}



