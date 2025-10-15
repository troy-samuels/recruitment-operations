'use client'

import React from 'react'

interface TeamInviteModalProps {
	open: boolean
	onClose: () => void
}

const emailRegex = /.+@.+\..+/

const TeamInviteModal: React.FC<TeamInviteModalProps> = ({ open, onClose }) => {
	const [emails, setEmails] = React.useState<string[]>([''])
	const [submitting, setSubmitting] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)
	const [success, setSuccess] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (!open) {
			setEmails([''])
			setSubmitting(false)
			setError(null)
			setSuccess(null)
		}
	}, [open])

	if (!open) return null

	const addRow = () => setEmails(prev => [...prev, ''])
	const removeRow = (idx: number) => setEmails(prev => prev.filter((_, i) => i !== idx))
	const updateRow = (idx: number, val: string) => setEmails(prev => prev.map((v, i) => (i === idx ? val : v)))

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)
		const cleaned = emails.map(e => e.trim()).filter(Boolean)
		if (cleaned.length === 0) { setError('Please enter at least one email'); return }
		if (!cleaned.every(e => emailRegex.test(e))) { setError('One or more emails are invalid'); return }
		setSubmitting(true)
		try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: cleaned }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to send invites')
      }
      setSuccess(`Sent: ${data.okCount}, Failed: ${data.failCount}`)
      try { (window as any)?.datafast?.('invite_sent', { count: data.okCount }) } catch {}
      setTimeout(onClose, 1200)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
				<div className="flex items-center justify-between mb-3">
					<div className="font-heading text-lg font-semibold">Invite teammates</div>
					<button className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50" onClick={onClose}>Close</button>
				</div>
				<p className="text-sm text-primary-400 mb-4">Add email addresses to invite your team. They’ll get access once your Team plan is active.</p>
				<form onSubmit={handleSubmit} className="space-y-3">
					{emails.map((val, idx) => (
						<div key={idx} className="flex items-center gap-2">
							<input type="email" value={val} onChange={(e)=> updateRow(idx, e.target.value)} placeholder="teammate@company.co.uk" className="flex-1 border border-cream-300 rounded-md px-3 py-2 text-sm" />
							{emails.length > 1 && (
								<button type="button" onClick={()=> removeRow(idx)} className="text-sm px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50">Remove</button>
							)}
						</div>
					))}
					<button type="button" onClick={addRow} className="text-sm text-blue-600 hover:text-blue-700">+ Add another</button>
					{error && <p className="text-sm text-red-600">{error}</p>}
					{success && <p className="text-sm text-green-700">{success}</p>}
					<div className="flex items-center justify-end gap-2 pt-3 border-t">
						<button type="button" onClick={onClose} className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50">Cancel</button>
						<button disabled={submitting} type="submit" className="px-3 py-1.5 rounded-md bg-accent-500 text-white text-sm hover:bg-accent-600 disabled:opacity-60">{submitting? 'Sending…' : 'Send invites'}</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default TeamInviteModal


