'use client'

import React from 'react'
import { trackEvent } from '@/lib/metrics'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const TrialBanner: React.FC = () => {
  const [daysLeft, setDaysLeft] = React.useState<number | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const until = Number(localStorage.getItem('trial_banner_dismiss_until') || '0')
      if (until > Date.now()) setHidden(true)
    } catch {}
  }, [])

  React.useEffect(() => {
    const load = async () => {
      try {
        const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
        if (!workspaceId) { setLoading(false); return }
        const res = await fetch(`/api/billing/status?workspaceId=${encodeURIComponent(workspaceId)}`)
        const j = await res.json()
        if (res.ok && j) {
          setStatus(j.status || null)
          if (j.status === 'trialing') {
            const end = j.currentPeriodEnd ? new Date(j.currentPeriodEnd).getTime() : (Date.now() + 7 * ONE_DAY_MS)
            const d = Math.max(0, Math.ceil((end - Date.now()) / ONE_DAY_MS))
            setDaysLeft(d)
            // Day-1/3/7 nudges (relative from start). Fire once.
            const trialTotal = 7
            const daysElapsed = Math.max(0, trialTotal - d)
            const marks: Array<{ key: string; day: number }> = [
              { key: 'trial_nudge_day_1', day: 1 },
              { key: 'trial_nudge_day_3', day: 3 },
              { key: 'trial_nudge_day_7', day: 7 },
            ]
            marks.forEach(m => {
              try {
                if (daysElapsed >= m.day && localStorage.getItem(m.key) !== '1') {
                  trackEvent('trial_nudge', { day: m.day })
                  localStorage.setItem(m.key, '1')
                }
              } catch {}
            })
          } else {
            setDaysLeft(null)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const startCheckout = async () => {
    try {
      const seats = Number(localStorage.getItem('seats_purchased') || '1')
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seats }) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to start checkout')
      if (j.url) { window.location.href = j.url; return }
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripe = await loadStripe(String(process.env.NEXT_STRIPE_PUBLISHABLE_KEY))
      const anyStripe = stripe as any
      if (anyStripe && typeof anyStripe.redirectToCheckout === 'function') {
        await anyStripe.redirectToCheckout({ sessionId: j.id })
      }
    } catch (e: any) {
      alert(e?.message || 'Upgrade failed')
    }
  }

  if (loading || hidden || status !== 'trialing' || daysLeft === null) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-semibold">{daysLeft}</span>
          <span className="text-amber-800">days left in your trial. Unlock team features and keep your pipeline moving.</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={startCheckout} className="px-3 py-1.5 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-700">Upgrade</button>
          <button onClick={() => { try { localStorage.setItem('trial_banner_dismiss_until', String(Date.now() + ONE_DAY_MS)) } catch {}; setHidden(true) }} className="px-2 py-1.5 rounded-md border border-amber-200 text-amber-700 text-sm hover:bg-amber-100">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

export default TrialBanner


