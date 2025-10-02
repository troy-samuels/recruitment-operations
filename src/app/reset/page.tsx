"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseClient'

const ResetPage: React.FC = () => {
	const router = useRouter()
	const supabase = getSupabaseClient()
	const [email, setEmail] = React.useState('')
	const [sending, setSending] = React.useState(false)
	const [message, setMessage] = React.useState<string | null>(null)
	const [error, setError] = React.useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setMessage(null)
		setSending(true)
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: typeof window !== 'undefined' ? window.location.origin + '/update-password' : undefined,
			})
			if (error) throw error
			setMessage('Check your email for a password reset link')
		} catch (e:any) {
			setError(e?.message || 'Failed to send reset email')
		} finally {
			setSending(false)
		}
	}

	return (
		<div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full max-w-md">
				<h1 className="font-heading text-3xl font-bold text-primary-500 mb-6 text-center">Reset or set password</h1>
				<form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 space-y-4">
					<label className="block text-sm text-gray-700 mb-1">Email address</label>
					<input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
					{error && <p className="text-sm text-red-600">{error}</p>}
					{message && <p className="text-sm text-green-700">{message}</p>}
					<button disabled={sending} type="submit" className="w-full px-4 py-2 rounded-lg text-sm bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-60">{sending? 'Sending…' : 'Send reset link'}</button>
				</form>
			</div>
		</div>
	)
}

export default ResetPage


