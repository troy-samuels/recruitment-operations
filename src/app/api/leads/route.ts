import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
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
			return NextResponse.json({ error: error.message }, { status: 500 })
		}
		return NextResponse.json({ ok: true })
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
	}
}



