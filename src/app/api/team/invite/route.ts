import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const emails: string[] = Array.isArray(body?.emails) ? body.emails : []
    const redirectUrl: string | undefined = body?.redirectUrl

    if (!emails || emails.length === 0) {
      return NextResponse.json({ ok: false, error: 'No emails provided' }, { status: 400 })
    }

    // Validate emails quickly
    const emailRegex = /.+@.+\..+/
    const cleaned = Array.from(new Set(emails.map((e) => String(e).trim()).filter(Boolean)))
    if (!cleaned.every((e) => emailRegex.test(e))) {
      return NextResponse.json({ ok: false, error: 'One or more emails are invalid' }, { status: 400 })
    }

    // Ensure admin is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        ok: false,
        error: 'Invites not configured (service key missing). Please set SUPABASE_SERVICE_ROLE_KEY',
      }, { status: 503 })
    }

    const admin = getSupabaseAdmin()
    const origin = redirectUrl || req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const results: Array<{ email: string; ok: boolean; error?: string }> = []
    for (const email of cleaned) {
      try {
        const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/auth/callback`,
        })
        if (error) {
          results.push({ email, ok: false, error: error.message })
        } else {
          results.push({ email, ok: true })
        }
      } catch (e: any) {
        results.push({ email, ok: false, error: e?.message || 'Unknown error' })
      }
    }

    const okCount = results.filter((r) => r.ok).length
    const failCount = results.length - okCount
    return NextResponse.json({ ok: true, okCount, failCount, results })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}




