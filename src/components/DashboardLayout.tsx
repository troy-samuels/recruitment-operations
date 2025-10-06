'use client'

import React from 'react'
import DashboardTopBar from '@/components/DashboardTopBar'
import LeftNavigation from '@/components/LeftNavigation'
import TrialBanner from '@/components/TrialBanner'

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [leftCollapsed, setLeftCollapsed] = React.useState(true)

	React.useEffect(() => {
		const expandOnInvite = () => setLeftCollapsed(false)
		const expandOnAddRole = () => {
			if (leftCollapsed) setLeftCollapsed(false)
		}
		window.addEventListener('expand-sidebar', expandOnInvite)
		window.addEventListener('open-add-role', expandOnAddRole as EventListener)
		return () => {
			window.removeEventListener('expand-sidebar', expandOnInvite)
			window.removeEventListener('open-add-role', expandOnAddRole as EventListener)
		}
	}, [leftCollapsed])

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<TrialBanner />
			<DashboardTopBar />
			<div className="flex flex-1 overflow-hidden">
				{/* Left nav */}
				<div className={`bg-white border-r border-gray-200 transition-all duration-300 ${leftCollapsed ? 'w-16' : 'w-64'} flex-none flex flex-col`}>
					<LeftNavigation collapsed={leftCollapsed} />
					<div className="p-3 border-t border-gray-200">
						<button
							onClick={()=> setLeftCollapsed(!leftCollapsed)}
							className="w-full flex items-center justify-center gap-2 text-sm text-primary-400 hover:text-primary-500 px-2 py-1 rounded hover:bg-cream-50"
							aria-label={leftCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						>
							<span className={`transition-transform ${leftCollapsed ? 'rotate-0' : 'rotate-180'}`}>▶</span>
							<span className="sr-only">{leftCollapsed ? 'Expand' : 'Collapse'}</span>
						</button>
					</div>
				</div>
				<main className="flex-1 overflow-hidden bg-gray-100">
					{children}
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout