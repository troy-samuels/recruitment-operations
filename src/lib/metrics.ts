'use client'

type MetricsEvent = {
  name: string
  props?: Record<string, any>
  ts?: number
}

function isDNT(): boolean {
  try {
    return (navigator as any).doNotTrack === '1' || (window as any).doNotTrack === '1'
  } catch { return false }
}

function analyticsEnabled(): boolean {
  try {
    const raw = localStorage.getItem('onboarding_settings')
    if (!raw) return true
    const s = JSON.parse(raw)
    const enabled = s?.analytics?.enabled
    return enabled === undefined ? true : Boolean(enabled)
  } catch { return true }
}

function buildPayload(evt: MetricsEvent): any {
  const now = Date.now()
  const url = typeof window !== 'undefined' ? window.location.href : undefined
  const ref = typeof document !== 'undefined' ? (document.referrer || undefined) : undefined
  return {
    name: evt.name,
    props: evt.props || {},
    ts: evt.ts || now,
    context: { url, referrer: ref },
  }
}

export function trackEvent(name: string, props?: Record<string, any>): void {
  try {
    if (typeof window === 'undefined') return
    if (isDNT() || !analyticsEnabled()) return
    const payload = buildPayload({ name, props })
    const body = JSON.stringify({ events: [payload] })
    if ('sendBeacon' in navigator) {
      const blob = new Blob([body], { type: 'application/json' })
      const ok = (navigator as any).sendBeacon('/api/metrics', blob)
      if (ok) return
    }
    // Fallback
    fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() => {})
  } catch {}
}




