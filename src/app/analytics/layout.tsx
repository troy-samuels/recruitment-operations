'use client'

import React from 'react'
import WorkspaceProvider from '@/components/WorkspaceProvider'

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      {children}
    </WorkspaceProvider>
  )
}



