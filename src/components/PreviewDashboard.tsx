'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardTopBar from './DashboardTopBar'
import WorkspaceProvider from '@/components/WorkspaceProvider'
import LeftNavigation from './LeftNavigation'
import RightPanel from './RightPanel'
import AnimatedKanban from './AnimatedKanban'

interface PreviewDashboardProps {
  compact?: boolean
}

const PreviewDashboard: React.FC<PreviewDashboardProps> = ({ compact = false }) => {
  const [leftCollapsed, setLeftCollapsed] = useState(true)
  const [rightCollapsed, setRightCollapsed] = useState(true)

  if (compact) {
    // Compact embed mode for homepage demo
    return (
      <WorkspaceProvider>
        <div className="demo-embed bg-gray-100 h-[420px] sm:h-[520px] overflow-hidden">
          <div className="h-full p-2 sm:p-3">
            <AnimatedKanban leftCollapsed rightCollapsed />
          </div>
        </div>
      </WorkspaceProvider>
    )
  }

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Top Bar - Always Visible */}
        <DashboardTopBar />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Navigation - Minimal on Mobile, Full on Desktop */}
          <div className={`flex bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
            leftCollapsed ? 'w-12 lg:w-16' : 'w-48 lg:w-64'
          } flex-col`}>
            <LeftNavigation collapsed={leftCollapsed} />

            {/* Integrated Collapse Button */}
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => setLeftCollapsed(!leftCollapsed)}
                className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {leftCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Center Content - Minimal Padding on Mobile */}
          <main className={`flex-1 overflow-y-auto bg-gray-100 transition-all duration-300 px-1 py-1 sm:px-4 sm:py-4 lg:${
            leftCollapsed && rightCollapsed
              ? 'p-8'
              : (!leftCollapsed && !rightCollapsed)
              ? 'p-3'
              : 'p-6'
          }`}>
            <AnimatedKanban leftCollapsed={leftCollapsed} rightCollapsed={rightCollapsed} />
          </main>

          {/* Right Panel - Professional Sidebar (Hidden on Mobile) */}
          <div className={`hidden lg:flex bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${
            rightCollapsed ? 'w-16' : 'w-80'
          } flex-col`}>
            <RightPanel collapsed={rightCollapsed} />

            {/* Integrated Collapse Button */}
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => setRightCollapsed(!rightCollapsed)}
                className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {rightCollapsed ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  )
}

export default PreviewDashboard