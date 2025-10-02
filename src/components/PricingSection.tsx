'use client'

import React from 'react'
import { trackEvent } from '@/lib/metrics'
import { Check, Star, Zap, Users, Shield, ChevronRight, Minus, Plus } from 'lucide-react'

const formatGBP = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(p / 100)

const PricingSection: React.FC = () => {
  const [seats, setSeats] = React.useState<number>(1)
  const [loading, setLoading] = React.useState(false)
  const [price, setPrice] = React.useState<{ currency: string; billing_scheme: string | null; tiers_mode: string | null; unit_amount: number | null; tiers: Array<{ up_to: number | null; unit_amount: number | null; flat_amount: number | null }> | null } | null>(null)
  const brandPreview = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const q = new URLSearchParams(window.location.search)
        if (q.get('brand') === '1') return true
        const stored = localStorage.getItem('brand_preview')
        if (stored === '1') return true
      } catch {}
    }
    return process.env.NEXT_PUBLIC_BRAND_PREVIEW === '1'
  }, [])

  React.useEffect(() => {
    fetch('/api/stripe/pricing').then(r=>r.json()).then(j=>{
      if (j?.price) setPrice(j.price)
    }).catch(()=>{})
  }, [])

  const calcPerSeat = React.useCallback((q: number): number => {
    if (!price) return 0
    // Tiered volume: the tier whose up_to >= q applies
    const tiers = price.tiers || []
    if (price.billing_scheme === 'tiered' && price.tiers_mode === 'volume' && tiers.length > 0) {
      const sorted = [...tiers].sort((a,b)=> (a.up_to ?? Number.POSITIVE_INFINITY) - (b.up_to ?? Number.POSITIVE_INFINITY))
      const tier = sorted.find(t => (t.up_to ?? Number.POSITIVE_INFINITY) >= q) || sorted[sorted.length-1]
      return tier.unit_amount || 0
    }
    // Flat pricing
    return price.unit_amount || 0
  }, [price])

  const perSeat = calcPerSeat(seats)
  const total = perSeat * seats

  const adjust = (d: number) => {
    setSeats(s => {
      const next = Math.max(1, s + d)
      try { localStorage.setItem('seats_purchased', String(next)); trackEvent('pricing_seats_changed', { seats: next }) } catch {}
      return next
    })
  }

  const startCheckout = async () => {
    try {
      setLoading(true)
      const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
      try { trackEvent('checkout_started', { seats, source: 'pricing' }) } catch {}
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seats, workspaceId }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to start checkout')
      if (json.url) { window.location.href = json.url; return }
      // Fallback to sessionId redirect if URL not returned
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripe = await loadStripe(String(process.env.NEXT_STRIPE_PUBLISHABLE_KEY))
      const anyStripe = stripe as any
      if (!anyStripe || typeof anyStripe.redirectToCheckout !== 'function') throw new Error('Stripe unavailable')
      await anyStripe.redirectToCheckout({ sessionId: json.id })
    } catch (e: any) {
      alert(e?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing" className={`py-24 ${brandPreview ? 'bg-gradient-to-br from-[#F7FBFF] via-white to-[#F8FAFF]' : 'bg-gradient-to-br from-cream-100 to-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="font-body text-lg text-primary-400 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your agency. All plans include the full pipeline dashboard.
          </p>

          {/* Trust Badge */}
          <div className={`inline-flex items-center gap-2 ${brandPreview ? 'bg-blue-50 text-blue-700' : 'bg-success-50 text-success-600'} px-4 py-2 rounded-full text-sm font-body`}>
            <Shield className="w-4 h-4" />
            Get 7 days free — cancel anytime
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 items-stretch">
          {/* Professional Plan */}
          <div className={`bg-white rounded-2xl border ${brandPreview ? 'border-blue-200' : 'border-gray-200'} p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full flex flex-col`}>
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-body font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <div className={`w-16 h-16 ${brandPreview ? 'bg-blue-100' : 'bg-accent-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Zap className={`w-8 h-8 ${brandPreview ? 'text-blue-600' : 'text-accent-500'}`} />
              </div>
              <h3 className="font-body text-2xl font-bold text-primary-500 mb-2">Professional</h3>
              <p className="font-body text-primary-400 mb-6">Perfect for individual recruiters</p>

              <div className="mb-3">
                <span className="font-body text-5xl font-bold text-primary-500">{perSeat ? formatGBP(perSeat) : '—'}</span>
                <span className="font-body text-lg text-primary-400">/seat/month</span>
              </div>
              <div className="text-sm text-primary-400">
                {price?.tiers_mode === 'volume' && price?.billing_scheme === 'tiered' ? (
                  <>
                    <span>Tiered pricing: price reduces as you add seats.</span>
                  </>
                ) : (
                  <span>Flat pricing per seat.</span>
                )}
              </div>
            </div>

            {/* Seat selector */}
            <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 mb-6">
              <div className="text-center font-body text-primary-500 mb-2">How many seats do you need? (including yourself)</div>
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={()=>adjust(-1)} aria-label="Decrease seats"><Minus className="w-4 h-4" /></button>
                <div className="w-24 text-center text-2xl font-bold text-primary-600 select-none">{seats}</div>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={()=>adjust(1)} aria-label="Increase seats"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="mt-3 text-center text-primary-500">
                <div className="text-sm">Per seat: <span className="font-semibold">{perSeat ? formatGBP(perSeat) : '—'}</span></div>
                <div className="text-sm">{seats} × {perSeat ? formatGBP(perSeat) : '—'} = <span className="font-semibold">{total ? formatGBP(total) : '—'}</span>/mo</div>
                <div className="text-xs text-primary-400 mt-1">Card saved today, billed after 7 days. Cancel anytime.</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">Complete pipeline visibility</span></div>
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">Smart reminders & escalations</span></div>
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">Analytics & performance tracking</span></div>
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">Unlimited candidates & roles</span></div>
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">Email support</span></div>
            </div>

            <button onClick={startCheckout} disabled={loading} className={`mt-auto w-full ${brandPreview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-accent-500 hover:bg-accent-600'} text-white px-6 py-4 rounded-lg font-body font-semibold transition-all duration-200 hover:translate-y-[-1px] flex items-center justify-center gap-2 group disabled:opacity-60`} aria-label="Start free trial and checkout">
              {loading ? 'Starting…' : 'Get 7 Days Free'}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Agency Plan (static copy retained) */}
          <div className={`bg-white rounded-2xl border ${brandPreview ? 'border-purple-200' : 'border-gray-200'} p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-body text-2xl font-bold text-gray-900 mb-2">Agency</h3>
              <p className="font-body text-primary-400 mb-6">Built for recruitment teams and agencies</p>
              <div className="mb-6"><span className="font-body text-5xl font-bold text-gray-900">Custom</span></div>
              <div className="text-sm text-primary-400 mb-6">Need more than 20 seats? Talk to us.</div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500"><strong>Everything in Professional</strong></span></div>
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">SLA & role permissions</span></div>
              <div className="flex items-start gap-3"><Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" /><span className="font-body text-primary-500">Advanced reporting & insights</span></div>
            </div>
            <a href="mailto:info@jobwall.co.uk" className="mt-auto w-full bg-purple-600 text-white px-6 py-4 rounded-lg font-body font-semibold hover:bg-purple-700 transition-colors text-center">Contact sales</a>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="text-center">
          <p className="font-body text-primary-400 mb-4">Questions about pricing or features?</p>
          <a className="font-body text-blue-600 hover:text-blue-700 font-semibold transition-colors" href="mailto:info@jobwall.co.uk">Contact support →</a>
        </div>
      </div>
    </section>
  )
}

export default PricingSection