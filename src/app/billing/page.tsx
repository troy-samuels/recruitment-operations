"use client"
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Minus, Plus } from 'lucide-react'

export default function BillingPage() {
  const [tier, setTier] = React.useState('individual')
  const [seatsPurchased, setSeatsPurchased] = React.useState(1)
  const [seatsUsed, setSeatsUsed] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [price, setPrice] = React.useState<{ billing_scheme: string | null; tiers_mode: string | null; unit_amount: number | null; tiers: Array<{ up_to: number | null; unit_amount: number | null; flat_amount: number | null }> | null } | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const t = localStorage.getItem('subscription_tier') || 'individual'
    const purchased = Number(localStorage.getItem('seats_purchased') || (t === 'team' ? 3 : 1))
    let used = 1
    try { used = Math.max(1, 1 + (JSON.parse(localStorage.getItem('pending_invites') || '[]') as string[]).length) } catch {}
    setTier(t)
    setSeatsPurchased(purchased)
    setSeatsUsed(used)
  }, [])

  React.useEffect(() => {
    fetch('/api/stripe/pricing').then(r=>r.json()).then(j=>{ if (j?.price) setPrice(j.price) }).catch(()=>{})
  }, [])

  const calcPerSeat = React.useCallback((q: number): number => {
    if (!price) return 0
    const tiers = price.tiers || []
    if (price.billing_scheme === 'tiered' && price.tiers_mode === 'volume' && tiers.length > 0) {
      const sorted = [...tiers].sort((a,b)=> (a.up_to ?? Number.POSITIVE_INFINITY) - (b.up_to ?? Number.POSITIVE_INFINITY))
      const tier = sorted.find(t => (t.up_to ?? Number.POSITIVE_INFINITY) >= q) || sorted[sorted.length-1]
      return tier.unit_amount || 0
    }
    return price.unit_amount || 0
  }, [price])

  const perSeat = calcPerSeat(seatsPurchased)
  const total = perSeat * seatsPurchased
  const formatGBP = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(p / 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Billing</h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="text-sm text-gray-600">Manage seats and start your subscription.
            {process.env.NEXT_STRIPE_PUBLISHABLE_KEY ? '' : ' (Stripe keys not detected in client; ensure publishable key is set)'}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Tier</div>
              <div className="text-gray-900 font-medium capitalize">{tier}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-2">Seats</div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>{ const v = Math.max(1, seatsPurchased-1); setSeatsPurchased(v); if (typeof window!=='undefined') localStorage.setItem('seats_purchased', String(v)) }}><Minus className="w-4 h-4" /></button>
                <div className="w-16 text-center text-lg font-semibold">{seatsPurchased}</div>
                <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>{ const v = seatsPurchased+1; setSeatsPurchased(v); if (typeof window!=='undefined') localStorage.setItem('seats_purchased', String(v)) }}><Plus className="w-4 h-4" /></button>
              </div>
              <div className="mt-2 text-sm text-gray-600">Per seat: {perSeat ? formatGBP(perSeat) : '—'}</div>
              <div className="text-sm font-semibold text-gray-900">Total: {total ? formatGBP(total) : '—'}/mo</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Seats used</div>
              <div className="text-gray-900 font-medium">{seatsUsed}</div>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <button
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
              onClick={async ()=>{
                try {
                  setLoading(true)
                  const priceId = process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID || ''
                  const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
                  const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seats: seatsPurchased, priceId, workspaceId }) })
                  const json = await res.json()
                  if (!res.ok) throw new Error(json?.error || 'Failed to create session')
                  if (json.url) {
                    window.location.href = json.url
                    return
                  }
                  const stripe = await loadStripe(String(process.env.NEXT_STRIPE_PUBLISHABLE_KEY))
                  // On some type setups, redirectToCheckout may not be on the returned instance type
                  const anyStripe = stripe as any
                  if (!anyStripe || typeof anyStripe.redirectToCheckout !== 'function') throw new Error('Stripe unavailable')
                  await anyStripe.redirectToCheckout({ sessionId: json.id })
                } catch (e) {
                  alert((e as any)?.message || 'Failed to start checkout')
                } finally {
                  setLoading(false)
                }
              }}
            >
              {loading ? 'Starting...' : 'Start Subscription'}
            </button>
            <div className="text-xs text-gray-500">7-day free trial. You can cancel anytime.</div>
          </div>
        </div>
      </div>
    </div>
  )
}



