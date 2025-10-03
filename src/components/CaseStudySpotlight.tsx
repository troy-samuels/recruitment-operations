'use client'

import React from 'react'
import { ArrowRight, Star, ExternalLink } from 'lucide-react'

const CaseStudySpotlight: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real Results from Real Consultants
          </h2>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading recruitment professionals transformed their pipeline performance with Jobwall
          </p>
        </div>

        {/* Case Study Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left: Testimonial */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Profile */}
              <div className="flex items-center gap-4 mb-8">
                {/* Avatar placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SJ</span>
                </div>

                <div>
                  <h3 className="font-body text-xl font-bold text-gray-900">Sarah Johnson</h3>
                  <p className="font-body text-gray-600">Senior Director</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">TR</span>
                    </div>
                    <span className="font-body text-sm text-gray-500">Thames Recruitment</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-body text-lg text-gray-700 leading-relaxed mb-8">
                &quot;Jobwall completely transformed our pipeline management. We went from losing multiple placements each month to having complete visibility over every candidate. The difference has been remarkable – both for our revenue and our team’s confidence.&quot;
              </blockquote>

              {/* Key Quote */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
                <p className="font-body text-blue-900 font-semibold">
                  "We prevented 8 lost placements in Q1 alone, saving us over £96,000 in potential revenue."
                </p>
              </div>

              {/* CTA */}
              <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-body font-semibold transition-colors group">
                Read Full Case Study
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right: Metrics */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 lg:p-12 flex flex-col justify-center">
              <h4 className="font-body text-lg font-semibold text-gray-900 mb-8 text-center">
                Results in First 3 Months
              </h4>

              <div className="space-y-8">
                {/* Metric 1 */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="text-right">
                      <span className="font-body text-2xl font-bold text-red-500">12</span>
                      <p className="font-body text-sm text-gray-600">Before</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <span className="font-body text-2xl font-bold text-green-500">2</span>
                      <p className="font-body text-sm text-gray-600">After</p>
                    </div>
                  </div>
                  <p className="font-body text-sm font-medium text-gray-700">Lost Placements per Month</p>
                </div>

                {/* Metric 2 */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="text-right">
                      <span className="font-body text-2xl font-bold text-red-500">30%</span>
                      <p className="font-body text-sm text-gray-600">Before</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <span className="font-body text-2xl font-bold text-green-500">95%</span>
                      <p className="font-body text-sm text-gray-600">After</p>
                    </div>
                  </div>
                  <p className="font-body text-sm font-medium text-gray-700">Pipeline Visibility</p>
                </div>

                {/* Metric 3 */}
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600 mb-1">£96,000</div>
                    <p className="font-body text-sm font-medium text-green-700">Annual Revenue Saved</p>
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="font-body text-sm text-gray-600 mb-3 font-medium">Additional Benefits:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Team productivity up 40%
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Client satisfaction improved
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Stress levels reduced
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="font-body text-gray-600 mb-6">
            Ready to see similar results for your recruitment agency?
          </p>
          <button className="font-body bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold">
            Start Your Success Story
          </button>
        </div>
      </div>
    </section>
  )
}

export default CaseStudySpotlight