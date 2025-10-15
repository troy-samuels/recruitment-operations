"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/metrics'

const OnboardingPage: React.FC = () => {
	const router = useRouter()
	// Remove timeframe selection; capture quarter info instead
	const [currentQuarter, setCurrentQuarter] = React.useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>(() => {
		const now = new Date()
		const q = Math.floor(now.getMonth() / 3)
		return (['Q1','Q2','Q3','Q4'] as const)[q]
	})
	const [quarterEndDate, setQuarterEndDate] = React.useState<string>(() => {
		const now = new Date()
		const q = Math.floor(now.getMonth() / 3)
		const endMonth = q * 3 + 2
		const end = new Date(now.getFullYear(), endMonth + 1, 0)
		const yyyy = end.getFullYear()
		const mm = String(end.getMonth() + 1).padStart(2, '0')
		const dd = String(end.getDate()).padStart(2, '0')
		return `${yyyy}-${mm}-${dd}`
	})
	const [maxStageHours, setMaxStageHours] = React.useState<number>(72)
  // Removed global 'max hours since created' per request
  const [individualTarget, setIndividualTarget] = React.useState<number>(10)
  const [revenueTarget, setRevenueTarget] = React.useState<number | ''>('')
  const [whoCanCreateRoles, setWhoCanCreateRoles] = React.useState<'admin_only' | 'any_member'>(() => {
    if (typeof window === 'undefined') return 'admin_only'
    try {
      const raw = localStorage.getItem('onboarding_settings')
      if (raw) {
        const s = JSON.parse(raw)
        const v = s?.permissions?.whoCanCreateRoles
        if (v === 'admin_only' || v === 'any_member') return v
      }
      const loose = localStorage.getItem('who_can_create_roles')
      if (loose === 'any_member' || loose === 'admin_only') return loose
    } catch {}
    return 'admin_only'
  })

  // Persist quick toggle so styling reflects immediately across re-renders
  React.useEffect(() => {
    try { localStorage.setItem('who_can_create_roles', whoCanCreateRoles) } catch {}
  }, [whoCanCreateRoles])
  const [sourceWithinDays, setSourceWithinDays] = React.useState<number>(3)
	const [loading, setLoading] = React.useState(false)

	// Simple inline calendar date picker (no deps)
	const DatePicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
		const [open, setOpen] = React.useState(false)
		const wrapperRef = React.useRef<HTMLDivElement | null>(null)
		const selected = value ? new Date(value + 'T00:00:00') : new Date()
		const [viewDate, setViewDate] = React.useState<Date>(new Date(selected.getFullYear(), selected.getMonth(), 1))

		const formatYMD = (d: Date) => {
			const y = d.getFullYear()
			const m = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			return `${y}-${m}-${day}`
		}

		React.useEffect(() => {
			const onDown = (e: MouseEvent) => {
				if (!wrapperRef.current) return
				if (!wrapperRef.current.contains(e.target as Node)) setOpen(false)
			}
			document.addEventListener('mousedown', onDown)
			return () => document.removeEventListener('mousedown', onDown)
		}, [])

		const monthLabel = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
		const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
		const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
		const firstWeekday = start.getDay() // 0 Sun .. 6 Sat
		const daysInMonth = end.getDate()

		const cells: Array<{ key: string; label: string; date?: Date; muted?: boolean; isSelected?: boolean | undefined }> = []
		// pad before
		const padBefore = (firstWeekday + 6) % 7 // make Monday first
		for (let i = 0; i < padBefore; i++) cells.push({ key: `p${i}`, label: '' , muted: true })
		for (let d = 1; d <= daysInMonth; d++) {
			const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d)
			const isSelected: boolean | undefined = value ? (formatYMD(date) === value) : undefined
			cells.push({ key: `d${d}`, label: String(d), date, isSelected })
		}

		return (
			<div ref={wrapperRef} className="relative">
				<button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between border border-cream-300 rounded-md px-3 py-2 text-sm hover:bg-cream-50">
					<span className="text-primary-500">{value ? new Date(value + 'T00:00:00').toLocaleDateString() : 'Select date'}</span>
					<span className="text-primary-300">▼</span>
				</button>
				{open && (
					<div className="absolute z-50 mt-2 w-72 bg-white border border-cream-200 rounded-lg shadow-md p-3">
						<div className="flex items-center justify-between mb-2">
							<button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="px-2 py-1 rounded hover:bg-cream-50">‹</button>
							<div className="font-medium text-primary-500">{monthLabel}</div>
							<button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="px-2 py-1 rounded hover:bg-cream-50">›</button>
						</div>
						<div className="grid grid-cols-7 gap-1 text-[11px] text-primary-400 mb-1">
							{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((w) => (<div key={w} className="text-center">{w}</div>))}
						</div>
						<div className="grid grid-cols-7 gap-1">
							{cells.map((c) => c.date ? (
								<button key={c.key} type="button" onClick={() => { onChange(formatYMD(c.date!)); setOpen(false) }} className={`h-8 rounded text-sm ${c.isSelected ? 'bg-accent-500 text-white' : 'hover:bg-cream-50 text-primary-500'}`}>
									{c.label}
								</button>
							) : (
								<div key={c.key} className="h-8" />
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
      const settings: any = {
				currentQuarter,
				quarterEndDate,
				urgentRules: { maxStageHours },
				sourcing: { sourceWithinHours: Math.max(1, sourceWithinDays) * 24 },
        targets: { individualPlacements: Math.max(1, Math.round(individualTarget)) },
				defaultView: 'individual'
			}
      if (revenueTarget && Number(revenueTarget) > 0) {
        settings.targets.revenueGBP = Math.round(Number(revenueTarget))
      }
      settings.permissions = settings.permissions || {}
      settings.permissions.whoCanCreateRoles = whoCanCreateRoles
			localStorage.setItem('onboarding_settings', JSON.stringify(settings))
      trackEvent('onboarding_completed', { currentQuarter, quarterEndDate })
      try { (window as any)?.datafast?.('onboarding_completed') } catch {}
			localStorage.setItem('onboarding_complete', '1')
			// Edge middleware guest cookie
			try { document.cookie = 'ro_guest=1; Path=/; SameSite=Lax' + (window.location.protocol==='https:' ? '; Secure' : '') } catch {}
			localStorage.setItem('just_onboarded', '1')
			router.push('/dashboard')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full max-w-2xl">
				<h1 className="font-heading text-3xl font-bold text-primary-500 mb-6 text-center">Quick setup</h1>
				<p className="font-body text-primary-400 mb-8 text-center">Answer a few questions so your dashboard reflects how you work. You can change these later in Settings.</p>
				<form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 space-y-6">
					<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Who can create roles?</label>
                <div className="flex gap-2">
                  <label className={`px-3 py-1.5 rounded-md text-sm border cursor-pointer ${whoCanCreateRoles==='admin_only' ? 'bg-accent-500 text-white border-accent-500' : 'bg-white text-primary-500 border-cream-300 hover:bg-cream-50'}`}>
                    <input
                      type="radio"
                      name="whoCreateRoles"
                      value="admin_only"
                      checked={whoCanCreateRoles==='admin_only'}
                      onChange={(e)=> setWhoCanCreateRoles(e.target.value as any)}
                      className="sr-only"
                    />
                    Admins only
                  </label>
                  <label className={`px-3 py-1.5 rounded-md text-sm border cursor-pointer ${whoCanCreateRoles==='any_member' ? 'bg-accent-500 text-white border-accent-500' : 'bg-white text-primary-500 border-cream-300 hover:bg-cream-50'}`}>
                    <input
                      type="radio"
                      name="whoCreateRoles"
                      value="any_member"
                      checked={whoCanCreateRoles==='any_member'}
                      onChange={(e)=> setWhoCanCreateRoles(e.target.value as any)}
                      className="sr-only"
                    />
                    Anyone on my team
                  </label>
                </div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Which quarter are we currently in?</label>
						<div className="flex gap-2">
							{(['Q1','Q2','Q3','Q4'] as const).map(q => (
								<button
									key={q}
									type="button"
									onClick={() => setCurrentQuarter(q)}
									className={`px-3 py-1.5 rounded-md text-sm border ${currentQuarter===q?'bg-accent-500 text-white border-accent-500':'bg-white text-primary-500 border-cream-300 hover:bg-cream-50'}`}
								>
									{q}
								</button>
							))}
						</div>
					</div>

					<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Quarter end date</label>
					<DatePicker value={quarterEndDate} onChange={setQuarterEndDate} />
						<p className="text-xs text-primary-400 mt-1">We’ll use this to show days left in quarter on your dashboard.</p>
					</div>
					{/* Removed timeframe selection per new onboarding flow */}

					{/* Default view is always 'individual' at onboarding; team view is enabled post-purchase */}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Urgent action rules</label>
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs text-gray-500 mb-1">Max hours in a single stage</label>
								<input type="number" min={12} max={336} value={maxStageHours} onChange={(e)=> setMaxStageHours(Number(e.target.value))} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
							</div>
						{/* Removed global max total hours setting */}
							<div>
								<label className="block text-xs text-gray-500 mb-1">Source candidates within (days)</label>
								<input type="number" min={1} max={14} value={sourceWithinDays} onChange={(e)=> setSourceWithinDays(Number(e.target.value))} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Quarterly placement target (you)</label>
						<input type="number" min={1} max={100} value={individualTarget} onChange={(e)=> setIndividualTarget(Number(e.target.value))} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
					</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Optional revenue target (GBP, quarter)</label>
            <input type="number" min={0} placeholder="e.g. 20000" value={revenueTarget} onChange={(e)=> setRevenueTarget(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
            <p className="text-xs text-primary-400 mt-1">If set, we’ll show this alongside placements in the top bar.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
						<button type="button" onClick={()=> router.push('/')} className="px-4 py-2 rounded-lg text-sm bg-cream-100 text-primary-500 hover:bg-cream-200">Cancel</button>
						<button disabled={loading} type="submit" className="px-4 py-2 rounded-lg text-sm bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-60">{loading? 'Saving…' : 'Continue to dashboard'}</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default OnboardingPage


