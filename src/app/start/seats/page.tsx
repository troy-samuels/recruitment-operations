"use client"
import React from 'react'
import { Minus, Plus } from 'lucide-react'

const FIRST_SEAT_PENCE = 3900
const ADDL_SEAT_PENCE = 2900
const formatGBP = (p:number) => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:2}).format(p/100)

export default function StartSeatsPage() {
  const [seats, setSeats] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search)
      const s = Number(q.get('seats') || '1')
      return Math.max(1, s)
    }
    return 1
  })
  const total = seats===1 ? FIRST_SEAT_PENCE : FIRST_SEAT_PENCE + (seats-1)*ADDL_SEAT_PENCE
  const startCheckout = async () => {
    const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
    const res = await fetch('/api/stripe/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ seats, workspaceId }) })
    const j = await res.json()
    if (!res.ok) { alert(j?.error || 'Checkout failed'); return }
    if (j.url) { window.location.href = j.url; return }
  }
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-cream-200 rounded-2xl shadow-sm p-6">
        <h1 className="font-heading text-2xl text-primary-500 mb-4 text-center">Select seats</h1>
        <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 mb-4">
          <div className="text-center font-body text-primary-500 mb-2">How many seats do you need? (including yourself)</div>
          <div className="flex items-center justify-center gap-4">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={()=> setSeats(s=> Math.max(1, s-1))} aria-label="Decrease seats"><Minus className="w-4 h-4" /></button>
            <div className="w-24 text-center text-2xl font-bold text-primary-600 select-none">{seats}</div>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={()=> setSeats(s=> s+1)} aria-label="Increase seats"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="mt-3 text-center text-primary-500">
            <div className="text-sm font-semibold">Total: {formatGBP(total)}/mo</div>
            <div className="text-xs text-primary-400 mt-1">First seat {formatGBP(FIRST_SEAT_PENCE)}, each additional {formatGBP(ADDL_SEAT_PENCE)}</div>
          </div>
        </div>
        <button onClick={startCheckout} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded-lg px-4 py-2 font-body">Continue to checkout</button>
      </div>
    </div>
  )
}


