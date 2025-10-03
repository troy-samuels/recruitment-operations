'use client'

import React, { useState, useEffect } from 'react'
import { Users, Activity, MapPin, Shield, CheckCircle, TrendingUp } from 'lucide-react'

const TrustIndicators: React.FC = () => {
  const [activeConsultants, setActiveConsultants] = useState(47)
  const [candidatesTracked, setCandidatesTracked] = useState(184)

  // Simulate modest real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Very modest increases - 1-2 consultants per update
      if (Math.random() > 0.7) {
        setActiveConsultants(prev => prev + (Math.random() > 0.8 ? 2 : 1))
      }

      // Candidates tracked fluctuates more naturally
      setCandidatesTracked(prev => {
        const change = Math.floor(Math.random() * 8) - 3 // -3 to +4 change
        return Math.max(150, prev + change) // Keep minimum at 150
      })
    }, 8000) // Update every 8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-sm text-gray-500 uppercase tracking-wide mb-4">
            Trusted by UK recruitment professionals
          </p>
          <h3 className="font-body text-lg text-gray-700 max-w-2xl mx-auto">
            Real consultants using Jobwall to prevent lost placements
          </h3>
        </div>

        {/* Live Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Active Consultants */}
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{activeConsultants}</div>
            <p className="font-body text-sm text-gray-600">Active consultants</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-success-500" />
              <span className="font-body text-xs text-success-500">Growing weekly</span>
            </div>
          </div>

          {/* Candidates Tracked */}
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-success-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{candidatesTracked}</div>
            <p className="font-body text-sm text-gray-600">Candidates tracked today</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="font-body text-xs text-gray-500">Live</span>
            </div>
          </div>

          {/* Geographic Coverage */}
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
            <p className="font-body text-sm text-gray-600">UK cities</p>
            <p className="font-body text-xs text-gray-500 mt-2">London • Manchester • Birmingham</p>
          </div>

          {/* Revenue Secured */}
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-accent-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">£89k</div>
            <p className="font-body text-sm text-gray-600">Placements secured this month</p>
            <p className="font-body text-xs text-gray-500 mt-2">Prevented from being lost</p>
          </div>

        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-primary-500 mb-3" />
              <h4 className="font-body font-semibold text-gray-900 mb-2">Built by Recruitment Professionals</h4>
              <p className="font-body text-sm text-gray-600">
                Created by former consultants who understand your daily challenges
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-body font-semibold text-gray-900 mb-2">GDPR Compliant</h4>
              <p className="font-body text-sm text-gray-600">
                UK data centers • Bank-grade security • Full data control
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold text-sm">14</span>
              </div>
              <h4 className="font-body font-semibold text-gray-900 mb-2">14-Day Free Trial</h4>
              <p className="font-body text-sm text-gray-600">
                No credit card required • Full access • Cancel anytime
              </p>
            </div>

          </div>
        </div>

        {/* Honest Growth Message */}
        <div className="text-center mt-8">
          <p className="font-body text-sm text-gray-500 max-w-2xl mx-auto">
            We’re a growing platform focused on solving real recruitment challenges.
            Join our community of consultants who are already preventing lost placements.
          </p>
        </div>

      </div>
    </section>
  )
}

export default TrustIndicators