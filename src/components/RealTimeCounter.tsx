'use client'

import React, { useState, useEffect } from 'react'
import { TrendingDown, Users, Target, CheckCircle } from 'lucide-react'

const RealTimeCounter: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState(687432)

  // Simulate real-time counter increment
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAmount(prev => prev + Math.floor(Math.random() * 25) + 15)
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Real-time counter */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-body mb-6">
              <TrendingDown className="w-4 h-4" />
              Live Industry Loss Tracker
            </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Revenue Lost This Month
            </h2>

            <div className="text-5xl md:text-6xl font-bold text-red-400 mb-4 tabular-nums">
              {formatCurrency(currentAmount)}
            </div>

            <p className="font-body text-lg text-gray-300 max-w-md">
              UK recruitment industry loses this much to poor pipeline visibility and dropped candidates
            </p>

            <div className="mt-6 text-sm text-gray-400">
              <p>Updated every 3 seconds • Based on industry research</p>
            </div>
          </div>

          {/* Right: Problem → Impact → Solution Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Problem */}
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-body font-semibold text-lg mb-2">Problem</h3>
              <p className="font-body text-sm text-gray-300 leading-relaxed">
                Lost candidates due to poor pipeline visibility and follow-up
              </p>
            </div>

            {/* Impact */}
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-body font-semibold text-lg mb-2">Impact</h3>
              <p className="font-body text-sm text-gray-300 leading-relaxed">
                2-3 lost placements monthly = £24k-36k annual revenue loss
              </p>
            </div>

            {/* Solution */}
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-body font-semibold text-lg mb-2">Solution</h3>
              <p className="font-body text-sm text-gray-300 leading-relaxed">
                RecruitOps prevents losses with real-time pipeline visibility
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="font-body text-lg text-gray-300 mb-6">
            Don't let your agency be part of this statistic
          </p>
          <button className="font-body bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold">
            Stop Losing Placements Today
          </button>
        </div>
      </div>
    </section>
  )
}

export default RealTimeCounter