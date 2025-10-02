"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const GetStartedPage: React.FC = () => {
	const router = useRouter()
	const [firstName, setFirstName] = React.useState('')
	const [lastName, setLastName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [orgName, setOrgName] = React.useState('')
	const [submitting, setSubmitting] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		if (!firstName || !lastName || !email || !orgName) {
			setError('Please fill in all fields')
			return
		}
		const emailOk = /.+@.+\..+/.test(email)
		if (!emailOk) {
			setError('Enter a valid email address')
			return
		}
		setSubmitting(true)
		try {
			const payload = { firstName, lastName, email, orgName, createdAt: new Date().toISOString() }
			localStorage.setItem('pre_onboarding_info', JSON.stringify(payload))
			// Post to server (best-effort)
			fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			}).catch(()=>{})
			router.push('/onboarding')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full max-w-lg">
				<h1 className="font-heading text-3xl font-bold text-primary-500 mb-2 text-center">Get started</h1>
				<p className="font-body text-primary-400 mb-8 text-center">Tell us a few basics so we can tailor your onboarding.</p>

				<form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 space-y-4">
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm text-gray-700 mb-1">First name</label>
							<input value={firstName} onChange={(e)=> setFirstName(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
						</div>
						<div>
							<label className="block text-sm text-gray-700 mb-1">Last name</label>
							<input value={lastName} onChange={(e)=> setLastName(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
						</div>
					</div>
					<div>
						<label className="block text-sm text-gray-700 mb-1">Email address</label>
						<input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
					</div>
					<div>
						<label className="block text-sm text-gray-700 mb-1">Organisation name</label>
						<input value={orgName} onChange={(e)=> setOrgName(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
					</div>

					{error && <p className="text-sm text-red-600">{error}</p>}

					<div className="flex justify-end gap-3 pt-4 border-t">
						<a href="/" className="px-4 py-2 rounded-lg text-sm bg-cream-100 text-primary-500 hover:bg-cream-200">Cancel</a>
						<button disabled={submitting} type="submit" className="px-4 py-2 rounded-lg text-sm bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-60">{submitting? 'Saving…' : 'Continue'}</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default GetStartedPage


