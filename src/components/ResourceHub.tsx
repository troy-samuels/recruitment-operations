'use client'

import React from 'react'
import { Download, TrendingUp, Calculator, ArrowRight } from 'lucide-react'

const ResourceHub: React.FC = () => {
  const resources = [
    {
      title: 'Ultimate Pipeline Management Guide',
      description: 'Complete 24-page guide covering best practices for recruitment pipeline optimization and candidate tracking.',
      type: 'PDF Guide',
      icon: Download,
      color: 'bg-blue-500',
      cta: 'Download Free Guide',
      popular: true
    },
    {
      title: 'Weekly UK Recruitment Insights',
      description: 'Stay ahead with weekly market insights, salary trends, and industry benchmarks delivered to your inbox.',
      type: 'Newsletter',
      icon: TrendingUp,
      color: 'bg-green-500',
      cta: 'Subscribe Now',
      popular: false
    },
    {
      title: 'Salary Benchmarking Tool',
      description: 'Interactive calculator to benchmark salaries across UK markets and make competitive offers.',
      type: 'Interactive Tool',
      icon: Calculator,
      color: 'bg-purple-500',
      cta: 'Use Calculator',
      popular: false
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Master Your Recruitment Pipeline
          </h2>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            Access expert resources, industry insights, and practical tools to improve your recruitment performance
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="relative group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Popular Badge */}
              {resource.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-body font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mb-6`}>
                <resource.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-body text-xl font-bold text-gray-900">{resource.title}</h3>
                </div>
                <p className="font-body text-sm text-blue-600 mb-3">{resource.type}</p>
                <p className="font-body text-gray-600 leading-relaxed">{resource.description}</p>
              </div>

              {/* CTA Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-body font-semibold transition-all duration-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                {resource.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <p className="font-body text-gray-600">Resources Downloaded</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
              <p className="font-body text-gray-600">Average Resource Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <p className="font-body text-gray-600">Newsletter Subscribers</p>
            </div>
          </div>
        </div>

        {/* Featured Content Preview */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h3 className="font-body text-2xl font-bold text-gray-900 mb-4">
              From Our Latest Guide: "5 Warning Signs You're About to Lose a Placement"
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-gray-900 mb-1">Communication Gaps</h4>
                    <p className="font-body text-sm text-gray-600">More than 3 days without candidate contact</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-gray-900 mb-1">Competing Offers</h4>
                    <p className="font-body text-sm text-gray-600">Candidate mentions other opportunities</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-gray-900 mb-1">Client Delays</h4>
                    <p className="font-body text-sm text-gray-600">Interview scheduling takes longer than expected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <p className="font-body text-sm text-gray-600 mb-4">
                  Get the complete guide with all 5 warning signs plus prevention strategies
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-body font-semibold hover:bg-blue-700 transition-colors">
                  Download Complete Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResourceHub