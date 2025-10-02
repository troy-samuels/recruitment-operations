import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'

/**
 * Test endpoint for Resend email integration
 *
 * Usage: POST /api/email/test
 * Body: { to: 'email@example.com' }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { to } = body

    if (!to) {
      return NextResponse.json(
        { ok: false, error: 'Email address required in "to" field' },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to,
      subject: 'Test Email from Jobwall',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #152B3C;">🎉 Email Integration Working!</h1>
            <p>Congratulations! Your Resend email integration is properly configured and working.</p>
            <p><strong>Sent from:</strong> Jobwall Recruitment Operations</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This is a test email sent from your Jobwall application.
            </p>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      ok: true,
      message: 'Test email sent successfully!',
      result,
    })
  } catch (error: any) {
    console.error('[Email Test] Error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to send test email',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
