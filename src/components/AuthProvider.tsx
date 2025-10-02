'use client'

import React from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'

interface AuthContextValue {
	user: any
	session: any
	initialized: boolean
	signInWithEmail: (email: string, redirectTo?: string) => Promise<void>
	signInWithGoogle: (redirectTo?: string) => Promise<void>
	signInWithMicrosoft: (redirectTo?: string) => Promise<void>
	signOut: () => Promise<void>
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export const useAuth = (): AuthContextValue => {
	const ctx = React.useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const supabase = React.useMemo(() => getSupabaseClient(), [])
	const [session, setSession] = React.useState<any>(null)
	const [user, setUser] = React.useState<any>(null)
	const [initialized, setInitialized] = React.useState(false)

	const setCookie = React.useCallback((name: string, value: string, maxAgeSeconds?: number) => {
		try {
			const parts = [
				`${name}=${value}`,
				'Path=/',
				'SameSite=Lax',
				(typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'Secure' : ''),
			]
			if (maxAgeSeconds !== undefined) parts.push(`Max-Age=${maxAgeSeconds}`)
			document.cookie = parts.filter(Boolean).join('; ')
		} catch {}
	}, [])

	React.useEffect(() => {
		let mounted = true
		supabase.auth.getSession().then(({ data }) => {
			if (!mounted) return
			setSession(data.session ?? null)
			setUser(data.session?.user ?? null)
			setInitialized(true)
			// Persist minimal session hint for route guards after refreshes
			try { localStorage.setItem('auth_initialized', '1') } catch {}
			// Edge middleware cookie for protected routes
			if (data.session?.user) setCookie('ro_session', '1', 60 * 60 * 24 * 30)
			else setCookie('ro_session', '', 0)
			if (data.session?.user?.id) {
				fetch('/api/provision', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: data.session.user.id, email: data.session.user.email, name: data.session.user.user_metadata?.name })
				}).catch(()=>{})
			}
		})
		const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession)
			setUser(newSession?.user ?? null)
			setInitialized(true)
			try { localStorage.setItem('auth_initialized', '1') } catch {}
			// Update session cookie for middleware
			if (newSession?.user) setCookie('ro_session', '1', 60 * 60 * 24 * 30)
			else setCookie('ro_session', '', 0)
			if (newSession?.user?.id) {
				fetch('/api/provision', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: newSession.user.id, email: newSession.user.email, name: newSession.user.user_metadata?.name })
				}).catch(()=>{})
			}
		})
		return () => {
			mounted = false
			sub.subscription.unsubscribe()
		}
	}, [supabase])

	const signInWithEmail = React.useCallback(async (email: string, redirectTo?: string) => {
		await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined),
			},
		})
	}, [supabase])

	const signInWithGoogle = React.useCallback(async (redirectTo?: string) => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined),
			},
		})
	}, [supabase])

	const signInWithMicrosoft = React.useCallback(async (redirectTo?: string) => {
		await supabase.auth.signInWithOAuth({
			provider: 'azure' as any,
			options: {
				redirectTo: redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined),
			},
		})
	}, [supabase])

	const signOut = React.useCallback(async () => {
		await supabase.auth.signOut()
	}, [supabase])

	const value: AuthContextValue = {
		user,
		session,
		initialized,
		signInWithEmail,
		signInWithGoogle,
		signInWithMicrosoft,
		signOut,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider


