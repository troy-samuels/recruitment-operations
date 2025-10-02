'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, initialized } = useAuth()
	const router = useRouter()

	React.useEffect(() => {
		if (!initialized) return
		const allowGuest = typeof window !== 'undefined' && localStorage.getItem('onboarding_complete') === '1'
		if (!user && !allowGuest) {
			// Redirect to home and open signup once mounted to avoid race conditions
			router.push('/onboarding')
			setTimeout(() => {
				// no modal for onboarding path
			}, 200)
		}
	}, [initialized, user, router])

	// Gracefully render nothing until auth initialized hint is set
	if (!initialized && typeof window !== 'undefined' && !localStorage.getItem('auth_initialized')) return null
	const allowGuest = typeof window !== 'undefined' && localStorage.getItem('onboarding_complete') === '1'
	if (!user && !allowGuest) return null

	return <>{children}</>
}

export default Protected


