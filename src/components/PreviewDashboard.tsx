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

// Demo data for homepage preview
const demoRoles = [
  // Stage 0: New Submission (3 roles)
  {
    id: 'demo-1',
    jobTitle: 'Senior Software Engineer',
    candidateName: 'James Mitchell',
    stage: 0,
    salary: '£75,000 - £85,000',
    company: 'TechFlow Ltd',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    stageUpdatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-2',
    jobTitle: 'Marketing Manager',
    candidateName: 'Sophie Reynolds',
    stage: 0,
    salary: '£55,000 - £62,000',
    company: 'Apex Solutions',
    controlLevel: 'medium' as const,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    stageUpdatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-3',
    jobTitle: 'DevOps Engineer',
    candidateName: 'Alex Chen',
    stage: 0,
    salary: '£65,000 - £75,000',
    company: 'CloudScale Systems',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    stageUpdatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },

  // Stage 1: Client Review (3 roles)
  {
    id: 'demo-4',
    jobTitle: 'Finance Director',
    candidateName: 'Emma Thompson',
    stage: 1,
    salary: '£95,000 - £110,000',
    company: 'Sterling Finance',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-5',
    jobTitle: 'Product Designer',
    candidateName: 'Oliver Wright',
    stage: 1,
    salary: '£48,000 - £58,000',
    company: 'DesignHub UK',
    controlLevel: 'medium' as const,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-6',
    jobTitle: 'Sales Director',
    candidateName: 'Rachel Morgan',
    stage: 1,
    salary: '£70,000 - £85,000',
    company: 'ProSales Partners',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },

  // Stage 2: Interview Scheduled (2 roles)
  {
    id: 'demo-7',
    jobTitle: 'Data Analyst',
    candidateName: 'Michael Singh',
    stage: 2,
    salary: '£42,000 - £50,000',
    company: 'DataCorp Analytics',
    controlLevel: 'medium' as const,
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-8',
    jobTitle: 'HR Manager',
    candidateName: 'Laura Davies',
    stage: 2,
    salary: '£52,000 - £60,000',
    company: 'PeopleFirst Consulting',
    controlLevel: 'low' as const,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },

  // Stage 3: Interview Complete (2 roles)
  {
    id: 'demo-9',
    jobTitle: 'Project Manager',
    candidateName: 'David Wilson',
    stage: 3,
    salary: '£58,000 - £68,000',
    company: 'BuildRight Construction',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-10',
    jobTitle: 'Senior Accountant',
    candidateName: 'Sarah Collins',
    stage: 3,
    salary: '£45,000 - £52,000',
    company: 'NumberWorks Ltd',
    controlLevel: 'medium' as const,
    createdAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },

  // Stage 4: Offer Stage (2 roles)
  {
    id: 'demo-11',
    jobTitle: 'Legal Counsel',
    candidateName: 'Thomas Anderson',
    stage: 4,
    salary: '£85,000 - £95,000',
    company: 'LawCorp Partners',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-12',
    jobTitle: 'Operations Manager',
    candidateName: 'Katie Brooks',
    stage: 4,
    salary: '£50,000 - £58,000',
    company: 'LogiFlow Solutions',
    controlLevel: 'medium' as const,
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },

  // Stage 5: Placed (2 roles)
  {
    id: 'demo-13',
    jobTitle: 'Tech Lead',
    candidateName: 'Mark Stevens',
    stage: 5,
    salary: '£90,000 - £105,000',
    company: 'InnovateTech',
    controlLevel: 'high' as const,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-14',
    jobTitle: 'Customer Success Manager',
    candidateName: 'Hannah Price',
    stage: 5,
    salary: '£40,000 - £48,000',
    company: 'ClientFirst Services',
    controlLevel: 'low' as const,
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    stageUpdatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
]

const PreviewDashboard: React.FC<PreviewDashboardProps> = ({ compact = false }) => {
  const [leftCollapsed, setLeftCollapsed] = useState(true)
  const [rightCollapsed, setRightCollapsed] = useState(true)

  if (compact) {
    // Compact embed mode for homepage demo (now interactive!)
    return (
      <WorkspaceProvider>
        <div className="demo-embed bg-gray-100 h-[420px] sm:h-[520px] overflow-hidden relative">
          {/* Demo badge */}
          <div className="absolute top-3 right-3 z-10 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Interactive Demo
          </div>
          <div className="h-full p-2 sm:p-3">
            <AnimatedKanban
              leftCollapsed
              rightCollapsed
              initialCards={demoRoles}
              disabled
            />
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