"use client"
import React from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Protected from '@/components/Protected'
import WorkspaceProvider from '@/components/WorkspaceProvider'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
	return (
		<Protected>
			<WorkspaceProvider>
				<DashboardLayout>
					{children}
				</DashboardLayout>
			</WorkspaceProvider>
		</Protected>
	)
}


