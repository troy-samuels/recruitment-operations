'use client'

import React from 'react'
import { LayoutGrid, BellRing, Target, BarChart3, Rocket, Link2 } from 'lucide-react'

const features = [
  {
    icon: LayoutGrid,
    title: 'Unified Pipeline View',
    desc: 'See every role and candidate in one drag-and-drop board to prevent dropped balls.'
  },
  {
    icon: BellRing,
    title: 'Proactive Prompts',
    desc: 'Smart, time-based nudges highlight stalled candidates and overdue client follow‑ups.'
  },
  {
    icon: Target,
    title: 'Daily Performance',
    desc: 'Track calls, CVs, interviews and placements against clear targets for momentum.'
  },
  {
    icon: Rocket,
    title: 'Reference → BD',
    desc: 'Turn candidate references into new client leads with one-click conversions.'
  },
  {
    icon: Link2,
    title: 'Canvassing Hub',
    desc: 'Keep a searchable pool of pre‑qualified talent for faster future placements.'
  },
  {
    icon: BarChart3,
    title: 'Operational Analytics',
    desc: 'Real-time metrics and forecasting to spot risks early and protect revenue.'
  }
]

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">Purpose‑built to prevent lost placements</h2>
          <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto">A simple operational layer above your ATS/CRM that turns scattered data into clear, prioritised actions.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="font-body text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/onboarding" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm">Get Started</a>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection


