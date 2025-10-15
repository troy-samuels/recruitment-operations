import { Resend } from 'resend'

// Initialize Resend client
let resendClient: Resend | null = null

export function getResendClient(): Resend {
  if (resendClient) return resendClient

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  resendClient = new Resend(apiKey)
  return resendClient
}

// Email sending utility with error handling
export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'onboarding@send.jobwall.co.uk',
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) {
  try {
    const resend = getResendClient()

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('[Resend] Email sending failed:', error)
      throw new Error(error.message || 'Failed to send email')
    }

    console.log('[Resend] Email sent successfully:', data?.id)
    return { success: true, data }
  } catch (error: any) {
    console.error('[Resend] Unexpected error:', error)
    throw error
  }
}

// Specific email templates
export async function sendWelcomeEmail(
  email: string,
  name?: string
) {
  const firstName = name?.split(' ')[0] || 'there'
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL

  return sendEmail({
    to: email,
    subject: 'Welcome to Jobwall - Your Recruitment Operations Dashboard',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #152B3C 0%, #2a4a5c 100%); padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
            <div style="display:inline-flex; align-items:center; gap:10px;">
              ${logoUrl ? `<img src="${logoUrl}" alt="Jobwall" style="height:36px;width:auto;border-radius:8px;display:inline-block;" />` : `<div style=\"width:36px;height:36px;border-radius:8px;background:#D46240;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;\">JW</div>`}
              <div style="text-align:left;">
                <div style="color:#ffffff; font-size:18px; font-weight:700; margin:0;">Jobwall</div>
                <div style="color:#ffffff; opacity:0.9; font-size:12px; margin:0;">Recruitment Operations Dashboard</div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h1 style="color: #152B3C; margin: 0 0 8px; font-size: 22px;">Welcome to Jobwall</h1>
            <p style="margin: 0 0 16px; color:#4A6B7A;">Hi ${firstName}! 👋</p>

            <p>Welcome to <strong>Jobwall</strong> - your new recruitment operations dashboard designed to help UK recruitment consultants never lose another placement.</p>

            <p>Here's what you can do next:</p>

            <ul style="line-height: 2;">
              <li><strong>Add your first role</strong> to the pipeline</li>
              <li><strong>Set up reminders</strong> to stay on top of opportunities</li>
              <li><strong>Track your progress</strong> with built-in analytics</li>
              <li><strong>Invite your team</strong> to collaborate (Agency plan)</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
                 style="display: inline-block; background: #D46240; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/help" style="color: #D46240;">Help Center</a> or reply to this email.
            </p>
          </div>

          <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
            <div style="margin-bottom: 6px; color:#152B3C; font-weight:600;">Jobwall</div>
            <div style="margin-bottom: 10px;">Helping UK recruitment consultants prevent lost placements</div>
            <div>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/privacy" style="color:#4A6B7A; text-decoration:none; margin:0 8px;">Privacy</a>
              <span style="color:#ccc;">|</span>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/terms" style="color:#4A6B7A; text-decoration:none; margin:0 8px;">Terms</a>
              <span style="color:#ccc;">|</span>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/help" style="color:#4A6B7A; text-decoration:none; margin:0 8px;">Help</a>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendActivityReminderEmail(
  email: string,
  urgentRoles: Array<{ jobTitle: string; company: string; daysInStage: number }>
) {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || ''
  const rolesList = urgentRoles
    .map(
      (role) =>
        `<li><strong>${role.jobTitle}</strong> at ${role.company} (${role.daysInStage} days in current stage)</li>`
    )
    .join('')

  return sendEmail({
    to: email,
    subject: `⚠️ ${urgentRoles.length} role${urgentRoles.length > 1 ? 's' : ''} need your attention`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #152B3C 0%, #2a4a5c 100%); padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
            <div style="display:inline-flex; align-items:center; gap:10px;">
              ${logoUrl ? `<img src="${logoUrl}" alt="Jobwall" style="height:36px;width:auto;border-radius:8px;display:inline-block;" />` : `<div style=\"width:36px;height:36px;border-radius:8px;background:#D46240;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;\">JW</div>`}
              <div style="text-align:left;">
                <div style="color:#ffffff; font-size:18px; font-weight:700; margin:0;">Jobwall</div>
                <div style="color:#ffffff; opacity:0.9; font-size:12px; margin:0;">Recruitment Operations Dashboard</div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h1 style="color:#152B3C; font-size:20px; margin:0 0 10px;">⚠️ Urgent Roles Alert</h1>
            <p>The following roles have been in their current stage longer than expected and need your attention:</p>

            <ul style="line-height: 2; background: #FBF2DA; padding: 20px; border-radius: 8px;">
              ${rolesList}
            </ul>

            <p style="margin-top: 20px;">Taking action now can prevent these placements from being lost.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
                 style="display: inline-block; background: #152B3C; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View Dashboard
              </a>
            </div>
          </div>
          <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
            <div style="margin-bottom: 6px; color:#152B3C; font-weight:600;">Jobwall</div>
            <div style="margin-bottom: 10px;">Helping UK recruitment consultants prevent lost placements</div>
            <div>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/privacy" style="color:#4A6B7A; text-decoration:none; margin:0 8px;">Privacy</a>
              <span style="color:#ccc;">|</span>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/terms" style="color:#4A6B7A; text-decoration:none; margin:0 8px;">Terms</a>
              <span style="color:#ccc;">|</span>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/help" style="color:#4A6B7A; text-decoration:none; margin:0 8px;">Help</a>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}
