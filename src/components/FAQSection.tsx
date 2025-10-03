'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'pricing' | 'features' | 'technical'
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How does RecruitOps prevent lost placements?",
      answer: "RecruitOps provides real-time visibility into your entire recruitment pipeline, automatically tracking candidate interactions and sending smart reminders when follow-ups are needed. Our system identifies at-risk placements before they're lost, giving you the opportunity to take corrective action. The drag-and-drop Kanban board ensures nothing falls through the cracks.",
      category: "general"
    },
    {
      question: "Can I try RecruitOps before purchasing?",
      answer: "Absolutely! We offer a 7-day free trial with no credit card required. You'll have access to all features so you can see firsthand how RecruitOps transforms your pipeline management. Many users see immediate improvements in their first week.",
      category: "pricing"
    },
    {
      question: "How quickly can I get set up?",
      answer: "Most users are up and running in under 10 minutes. Simply sign up with your email, import your existing candidate data (optional), and start using the intuitive drag-and-drop interface. We provide guided onboarding and video tutorials to help you maximize value from day one.",
      category: "general"
    },
    {
      question: "Does RecruitOps integrate with my existing tools?",
      answer: "Yes! RecruitOps integrates seamlessly with popular recruitment tools including LinkedIn Recruiter, Indeed, and major ATS systems. We also support CSV imports/exports and provide API access for custom integrations. Our team can help set up integrations during your trial period.",
      category: "technical"
    },
    {
      question: "What's the difference between Professional and Agency plans?",
      answer: "Professional is perfect for individual consultants with unlimited candidates and roles, smart reminders, and performance tracking. Agency adds team collaboration, agency-wide analytics, advanced reporting, up to 10 team members, and priority support. Both include all core pipeline features.",
      category: "pricing"
    },
    {
      question: "Is my data secure and compliant?",
      answer: "Absolutely. We use enterprise-grade security with AES-256 encryption, SOC 2 compliance, and GDPR compliance for UK data protection requirements. All data is stored securely in UK/EU data centers. We never share your data with third parties and provide full data export capabilities.",
      category: "technical"
    },
    {
      question: "Can I track multiple recruitment verticals?",
      answer: "Yes! RecruitOps supports unlimited job roles across any industry vertical. Whether you specialize in IT, finance, healthcare, or work across multiple sectors, our flexible pipeline management adapts to your specific recruitment process and terminology.",
      category: "features"
    },
    {
      question: "What kind of support do you provide?",
      answer: "Professional plan includes email support with responses within 24 hours. Agency plan includes priority phone support with same-day responses. All users get access to our comprehensive knowledge base, video tutorials, and onboarding assistance. We're committed to your success.",
      category: "general"
    },
    {
      question: "How do you calculate ROI?",
      answer: "ROI is calculated based on prevented placement losses. If you typically lose 2-3 placements monthly (industry average) worth £12k each, preventing just one lost placement monthly saves £12k. At £149/month (£1,788 annually), that's a 7x return on investment for the Professional plan.",
      category: "pricing"
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, there are no long-term contracts. You can cancel anytime with one month's notice. We're confident in our value proposition - most customers upgrade rather than cancel because the ROI is so compelling. Your data remains accessible during your notice period.",
      category: "pricing"
    }
  ]

  const toggleItem = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  const categories = {
    general: 'General',
    pricing: 'Pricing & Plans',
    features: 'Features',
    technical: 'Technical'
  }

  return (
    <section className="py-12 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about RecruitOps. Can’t find what you’re looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Items - mobile-first clean list */}
        <div className="rounded-xl ring-1 ring-gray-100 divide-y divide-gray-200 bg-white overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className={`${openIndex===index ? 'bg-accent-50/40 border-l-2 border-accent-500' : ''}`}>
              <button
                onClick={() => toggleItem(index)}
                className="w-full min-h-[44px] py-3 sm:py-4 px-2 sm:px-4 text-left flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-expanded={openIndex===index}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
              >
                <div className="flex-1 pr-3">
                  <h3 className="font-body text-[16px] sm:text-lg font-medium text-gray-900 leading-snug">
                    {faq.question}
                  </h3>
                  <div className="mt-1 hidden sm:block">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {categories[faq.category]}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3 transition-transform duration-200 ${openIndex===index ? 'rotate-180' : ''}">
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </button>

              {openIndex===index && (
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className="px-2 sm:px-4 pb-3 sm:pb-5"
                >
                  <p className="font-body text-[14px] sm:text-base text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support CTA */}
        <div className="text-center mt-10 sm:mt-12 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h3 className="font-body text-xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="font-body text-gray-600 mb-5 sm:mb-6 max-w-md mx-auto">
            Our support team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-body font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-body font-semibold hover:bg-gray-50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-2">&lt; 10 min</div>
            <p className="font-body text-sm text-gray-600">Average setup time</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
            <p className="font-body text-sm text-gray-600">Uptime guarantee</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-2">24h</div>
            <p className="font-body text-sm text-gray-600">Support response time</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection