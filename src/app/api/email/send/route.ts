import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendWelcomeEmail, sendActivityReminderEmail } from '@/lib/resend'

/**
 * API endpoint to send custom emails using Resend
 *
 * Usage:
 * POST /api/email/send
 * Body: { type: 'welcome' | 'reminder' | 'custom', ... }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { type, to, subject, html, data } = body

    if (!type) {
      return NextResponse.json(
        { ok: false, error: 'Email type is required' },
        { status: 400 }
      )
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (type !== 'welcome' && type !== 'reminder') {
      if (!to || !emailRegex.test(to)) {
        return NextResponse.json(
          { ok: false, error: 'Valid email address required' },
          { status: 400 }
        )
      }
    }

    let result

    switch (type) {
      case 'welcome':
        if (!data?.email) {
          return NextResponse.json(
            { ok: false, error: 'Email address required for welcome email' },
            { status: 400 }
          )
        }
        result = await sendWelcomeEmail(data.email, data.name)
        break

      case 'reminder':
        if (!data?.email || !data?.urgentRoles) {
          return NextResponse.json(
            { ok: false, error: 'Email and urgent roles required for reminder' },
            { status: 400 }
          )
        }
        result = await sendActivityReminderEmail(data.email, data.urgentRoles)
        break

      case 'custom':
        if (!to || !subject || !html) {
          return NextResponse.json(
            { ok: false, error: 'to, subject, and html fields required for custom email' },
            { status: 400 }
          )
        }
        result = await sendEmail({ to, subject, html })
        break

      default:
        return NextResponse.json(
          { ok: false, error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({ ok: true, result })
  } catch (error: any) {
    console.error('[Email API] Error:', error)
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
