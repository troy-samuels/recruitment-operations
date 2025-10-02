'use client'

import React from 'react'

export type SubscriptionTier = 'individual' | 'team'
export type UserRole = 'admin' | 'member'
export type CreatePolicy = 'admin_only' | 'any_member'

interface WorkspaceContextValue {
	workspaceTier: SubscriptionTier
	userRole: UserRole
	whoCanCreateRoles: CreatePolicy
	seatsPurchased: number
	seatsUsed: number
	seatsLeft: number
	view: 'individual' | 'team'
	setView: (v: 'individual' | 'team') => void
	setWorkspaceTier: (tier: SubscriptionTier) => void
	setWhoCanCreateRoles: (policy: CreatePolicy) => void
	canCreateRoles: () => boolean
	canDeleteRoles: () => boolean
	canInvite: () => boolean
}

export const WorkspaceContext = React.createContext<WorkspaceContextValue | undefined>(undefined)

export const useWorkspace = (): WorkspaceContextValue => {
	const ctx = React.useContext(WorkspaceContext)
	if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
	return ctx
}

const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [workspaceTier, setWorkspaceTier] = React.useState<SubscriptionTier>('individual')
	const [userRole, setUserRole] = React.useState<UserRole>('admin')
	const [whoCanCreateRoles, setWhoCanCreateRoles] = React.useState<CreatePolicy>('admin_only')
	const [seatsPurchased, setSeatsPurchased] = React.useState<number>(1)
	const [seatsUsed, setSeatsUsed] = React.useState<number>(1)
  const [view, setView] = React.useState<'individual' | 'team'>(()=> (typeof window!=='undefined' ? ((localStorage.getItem('dashboard_view') as any) || 'individual') : 'individual'))

	React.useEffect(() => {
		if (typeof window === 'undefined') return
		const tier = (localStorage.getItem('subscription_tier') as SubscriptionTier) || 'individual'
		const role = (localStorage.getItem('user_role') as UserRole) || 'admin'
		const seats = Number(localStorage.getItem('seats_purchased') || (tier === 'team' ? 3 : 1))
		const settingsRaw = localStorage.getItem('onboarding_settings')
		if (settingsRaw) {
			try {
				const s = JSON.parse(settingsRaw)
				if (s?.permissions?.whoCanCreateRoles) setWhoCanCreateRoles(s.permissions.whoCanCreateRoles)
			} catch {}
		}
		setWorkspaceTier(tier)
		setUserRole(role)
		setSeatsPurchased(Math.max(1, seats))
		// seatsUsed approximation: 1 admin + pending_invites length
		try {
			const pending = JSON.parse(localStorage.getItem('pending_invites') || '[]') as string[]
			setSeatsUsed(Math.max(1, 1 + (pending?.length || 0)))
		} catch {
			setSeatsUsed(1)
		}
	}, [])

  React.useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('dashboard_view', view)
  }, [view])

	const setTier = React.useCallback((tier: SubscriptionTier) => {
		setWorkspaceTier(tier)
		if (typeof window !== 'undefined') localStorage.setItem('subscription_tier', tier)
	}, [])

	const setCreatePolicy = React.useCallback((policy: CreatePolicy) => {
		setWhoCanCreateRoles(policy)
		if (typeof window !== 'undefined') {
			const raw = localStorage.getItem('onboarding_settings')
			const s = raw ? (()=>{ try { return JSON.parse(raw) } catch { return {} } })() : {}
			s.permissions = s.permissions || {}
			s.permissions.whoCanCreateRoles = policy
			localStorage.setItem('onboarding_settings', JSON.stringify(s))
		}
	}, [])

	const canCreateRoles = React.useCallback(() => {
		if (workspaceTier === 'individual') return true
		return whoCanCreateRoles === 'any_member' || userRole === 'admin'
	}, [workspaceTier, whoCanCreateRoles, userRole])

	const canDeleteRoles = React.useCallback(() => userRole === 'admin', [userRole])
	const canInvite = React.useCallback(() => workspaceTier === 'team' && userRole === 'admin', [workspaceTier, userRole])

	const value: WorkspaceContextValue = {
		workspaceTier,
		userRole,
		whoCanCreateRoles,
		seatsPurchased,
		seatsUsed,
		seatsLeft: Math.max(0, seatsPurchased - seatsUsed),
		view,
		setView,
		setWorkspaceTier: setTier,
		setWhoCanCreateRoles: setCreatePolicy,
		canCreateRoles,
		canDeleteRoles,
		canInvite,
	}

	return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export default WorkspaceProvider


