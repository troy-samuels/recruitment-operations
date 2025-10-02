"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseClient'

const UpdatePasswordPage: React.FC = () => {
	const router = useRouter()
	const supabase = getSupabaseClient()
	const [password, setPassword] = React.useState('')
	const [confirm, setConfirm] = React.useState('')
	const [saving, setSaving] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		if (password.length < 8) { setError('Password must be at least 8 characters'); return }
		if (password !== confirm) { setError('Passwords do not match'); return }
		setSaving(true)
		try {
			const { error } = await supabase.auth.updateUser({ password })
			if (error) throw error
			router.replace('/dashboard')
		} catch (e:any) {
			setError(e?.message || 'Failed to update password')
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full max-w-md">
				<h1 className="font-heading text-3xl font-bold text-primary-500 mb-6 text-center">Set a new password</h1>
				<form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 space-y-4">
					<label className="block text-sm text-gray-700 mb-1">New password</label>
					<input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
					<label className="block text-sm text-gray-700 mb-1">Confirm password</label>
					<input type="password" value={confirm} onChange={(e)=> setConfirm(e.target.value)} className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" required />
					{error && <p className="text-sm text-red-600">{error}</p>}
					<button disabled={saving} type="submit" className="w-full px-4 py-2 rounded-lg text-sm bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-60">{saving? 'Saving…' : 'Save password'}</button>
				</form>
			</div>
		</div>
	)
}

export default UpdatePasswordPage


