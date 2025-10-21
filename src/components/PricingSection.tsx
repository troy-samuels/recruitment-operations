'use client'

import React from 'react'
import Script from 'next/script'
import { trackEvent } from '@/lib/metrics'
import { Check, Star, Zap, Users, Shield, ChevronRight, Minus, Plus } from 'lucide-react'

const formatGBP = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(p / 100)
const FIRST_SEAT_PENCE = 3900
const ADDL_SEAT_PENCE = 2900

const PricingSection: React.FC = () => {
  const [seats, setSeats] = React.useState<number>(1)
  const [loading, setLoading] = React.useState(false)
  const [promo, setPromo] = React.useState<string>('')
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

  // Business rule: first seat £39/mo, each additional seat £29/mo (UI)
  const total = React.useMemo(() => {
    if (seats <= 0) return 0
    if (seats === 1) return FIRST_SEAT_PENCE
    return FIRST_SEAT_PENCE + (seats - 1) * ADDL_SEAT_PENCE
  }, [seats])

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
      const payload: any = { seats, workspaceId }
      const code = (promo || '').trim()
      if (code) payload.promoCode = code
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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

  // Product Offers JSON-LD Schema
  const offersSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Jobwall Recruitment Operations Dashboard',
    description: 'Real-time pipeline dashboard preventing lost placements for UK recruitment consultants',
    brand: {
      '@type': 'Brand',
      name: 'Jobwall',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Professional Plan',
        description: 'Perfect for individual recruiters',
        price: '39',
        priceCurrency: 'GBP',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '39',
          priceCurrency: 'GBP',
          billingDuration: 'P1M',
          unitText: 'MONTH',
        },
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Jobwall',
        },
        url: 'https://jobwall.co.uk/start/account',
        category: 'SaaS - Recruitment Software',
      },
      {
        '@type': 'Offer',
        name: 'Agency Plan',
        description: 'Built for recruitment teams and agencies',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'GBP',
          price: 'Contact for pricing',
        },
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Jobwall',
        },
        url: 'https://jobwall.co.uk',
        category: 'SaaS - Recruitment Software',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <section id="pricing" className={`py-16 sm:py-24 ${brandPreview ? 'bg-gradient-to-br from-[#F7FBFF] via-white to-[#F8FAFF]' : 'bg-gradient-to-br from-cream-100 to-white'}`}>
      {/* Product Offers Schema for rich results */}
      <Script
        id="offers-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
        strategy="beforeInteractive"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="font-body text-lg text-primary-400 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your agency. All plans include the full pipeline dashboard.
          </p>

          {/* Trust Badge */}
          <div className={`inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-body`}>
            <Shield className="w-4 h-4 text-current" />
            Get 7 days free — cancel anytime
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 items-stretch">
          {/* Professional Plan */}
          <div className={`bg-white rounded-2xl border ${brandPreview ? 'border-blue-200' : 'border-gray-200'} p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full flex flex-col`}>
            <div className="text-center mb-8">
              <h3 className="font-body text-2xl font-bold text-primary-500 mb-2">Professional</h3>
              <p className="font-body text-primary-400 mb-6">Perfect for individual recruiters</p>

              <div className="mb-3 leading-tight">
                <div>
                  <span className="font-body text-5xl font-bold text-primary-500">{formatGBP(total)}</span>
                </div>
                <div className="font-body text-sm sm:text-base text-primary-400">Total / month</div>
              </div>
              <div className="text-sm text-primary-400">
                First seat {formatGBP(FIRST_SEAT_PENCE)} per month, additional seats {formatGBP(ADDL_SEAT_PENCE)} each.
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
                <div className="text-sm font-semibold">Total: {formatGBP(total)}/mo</div>
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

            {/* Promotion Code */}
            <div className="mb-6">
              <label className="block text-sm text-primary-400 mb-1">Promotion code</label>
              <div className="flex gap-2">
                <input value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Enter code (optional)" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <button onClick={()=> {
              if (typeof window !== 'undefined') {
                try { localStorage.setItem('seats_purchased', String(seats)) } catch {}
                const url = `/start/account?seats=${encodeURIComponent(String(seats))}`
                window.location.href = url
              }
            }} disabled={loading} className={`mt-auto w-full ${brandPreview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-accent-500 hover:bg-accent-600'} text-white px-6 py-4 rounded-lg font-body font-semibold transition-all duration-200 hover:translate-y-[-1px] flex items-center justify-center gap-2 group disabled:opacity-60`} aria-label="Start free trial">
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