import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const preferredRegion = 'iad1'

async function ping(url: string, opts?: RequestInit) {
  const startedAt = Date.now()
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(url, { method: 'GET', signal: controller.signal, ...opts })
    clearTimeout(t)
    const text = await res.text().catch(()=>'')
    return { ok: res.ok, status: res.status, elapsedMs: Date.now() - startedAt, sample: text.slice(0, 200) }
  } catch (e: any) {
    return { ok: false, status: 0, elapsedMs: Date.now() - startedAt, error: String(e?.message || e) }
  }
}

export async function GET(_req: NextRequest) {
  const region = (process as any).env?.VERCEL_REGION || 'unknown'
  const checks = await Promise.all([
    ping('https://api.stripe.com/v1'), // expect 401 if reachable
    ping('https://api.stripe.com/robots.txt'), // expect 200 if reachable
    ping('https://status.stripe.com/current'), // control
    ping('https://google.com'), // general egress control
  ])
  return NextResponse.json({ region, checks: {
    stripe_api_root: checks[0],
    stripe_robots: checks[1],
    stripe_status: checks[2],
    google: checks[3],
  }})
}




