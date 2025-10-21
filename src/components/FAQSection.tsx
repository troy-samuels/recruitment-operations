'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import { Plus, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'pricing' | 'features' | 'technical'
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How does Jobwall prevent lost placements?",
      answer: "Jobwall provides real-time visibility into your entire recruitment pipeline, automatically tracking candidate interactions and sending smart reminders when follow-ups are needed. Our system identifies at-risk placements before they're lost, giving you the opportunity to take corrective action. The drag-and-drop Kanban board ensures nothing falls through the cracks.",
      category: "general"
    },
    {
      question: "Can I try Jobwall before purchasing?",
      answer: "Absolutely! We offer a 7-day free trial with no credit card required. You'll have access to all features so you can see firsthand how Jobwall transforms your pipeline management. Many users see immediate improvements in their first week.",
      category: "pricing"
    },
    {
      question: "How quickly can I get set up?",
      answer: "Most users are up and running in under 10 minutes. Simply sign up with your email, import your existing candidate data (optional), and start using the intuitive drag-and-drop interface. We provide guided onboarding and video tutorials to help you maximize value from day one.",
      category: "general"
    },
    {
      question: "Does Jobwall integrate with my existing tools?",
      answer: "Yes! Jobwall integrates seamlessly with popular recruitment tools including LinkedIn Recruiter, Indeed, and major ATS systems. We also support CSV imports/exports and provide API access for custom integrations. Our team can help set up integrations during your trial period.",
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
      answer: "Yes! Jobwall supports unlimited job roles across any industry vertical. Whether you specialize in IT, finance, healthcare, or work across multiple sectors, our flexible pipeline management adapts to your specific recruitment process and terminology.",
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
    },
    {
      question: "What is a recruitment pipeline dashboard?",
      answer: "A recruitment pipeline dashboard is a visual management tool that displays all your active job roles and candidates in different stages of the hiring process. Jobwall uses a Kanban-style board where you can see roles moving through stages like 'New Submission', 'Client Review', 'Interview Scheduled', 'Offer Stage', and 'Placed'. This gives you instant visibility into your entire recruitment operation.",
      category: "general"
    },
    {
      question: "How does Jobwall track stage duration?",
      answer: "Jobwall automatically tracks how long each role spends in each pipeline stage using timestamp-based event tracking. When you move a candidate card between columns, the system records the transition with millisecond precision. Our analytics dashboard then calculates average, median, and maximum durations per stage, with period-over-period comparisons to show if your pipeline is speeding up or slowing down.",
      category: "features"
    },
    {
      question: "Can I import my existing candidate data?",
      answer: "Yes! Jobwall supports CSV import for bulk data migration. You can export your candidate list from Excel, your current ATS, or any system that produces CSV files, then import it into Jobwall. We map standard fields like name, email, phone, job title, company, salary, and stage. For large migrations (500+ candidates), our team provides free import assistance.",
      category: "technical"
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "You retain full access to your data throughout your notice period. Before cancellation, you can export all your data in CSV format including roles, candidates, tasks, notes, and activity logs. We provide a comprehensive data export tool that packages everything in a downloadable archive. After final cancellation, data is retained for 90 days in case you change your mind, then permanently deleted.",
      category: "technical"
    },
    {
      question: "How do smart reminders work?",
      answer: "Jobwall's smart reminders use configurable SLA rules to identify roles requiring attention. For example, if a role stays in 'Client Review' for more than 72 hours (configurable), it's automatically flagged as urgent. The system also tracks your client response patterns and predicts when follow-ups are needed. You receive email notifications and in-app alerts, with one-click actions to respond immediately.",
      category: "features"
    },
    {
      question: "Is Jobwall GDPR compliant?",
      answer: "Yes, Jobwall is fully GDPR compliant. All data is stored in UK/EU data centers, we use AES-256 encryption for data at rest and TLS 1.3 for data in transit, maintain comprehensive audit logs, support data portability (export), honor right-to-be-forgotten requests, and have appointed a Data Protection Officer. We undergo annual third-party security audits and maintain SOC 2 certification.",
      category: "technical"
    },
    {
      question: "Can I customize pipeline stages?",
      answer: "Yes! While Jobwall comes with standard recruitment stages out of the box, you can fully customize stage names, add new stages, remove unused ones, and set custom SLA limits per stage. Professional plan allows up to 8 custom stages; Agency plan supports unlimited stages. Changes apply workspace-wide and sync instantly across all team members.",
      category: "features"
    },
    {
      question: "How does team collaboration work?",
      answer: "On the Agency plan, multiple team members can work simultaneously on the same pipeline. You'll see real-time updates when colleagues move candidates, add notes, or complete tasks. Each team member has their own login, and you can assign roles to specific consultants. The dashboard shows who owns each role, tracks individual performance metrics, and provides agency-wide analytics.",
      category: "features"
    },
    {
      question: "What reporting and analytics are included?",
      answer: "Jobwall includes comprehensive analytics: stage duration metrics (average time per stage with period comparisons), placement velocity tracking, pipeline health scoring, conversion rate analysis, revenue forecasting based on weighted pipeline, individual and team performance leaderboards, client response time analysis, and custom date range filtering (week/month/quarter/year/all-time). All reports are exportable to CSV or PDF.",
      category: "features"
    },
    {
      question: "Does Jobwall work on mobile devices?",
      answer: "Yes! Jobwall is fully responsive and works on smartphones and tablets. The mobile interface adapts the Kanban board for touch interactions, with swipe gestures for navigation and tap-and-hold for drag-and-drop. Progressive Web App (PWA) support means you can install Jobwall on your home screen for offline access. All features work on mobile, though complex analytics are optimized for desktop viewing.",
      category: "technical"
    },
    {
      question: "How secure is my recruitment data?",
      answer: "Jobwall uses enterprise-grade security: AES-256 encryption at rest, TLS 1.3 encryption in transit, role-based access control (RBAC), two-factor authentication (2FA) available, regular automated backups with 30-day retention, SOC 2 Type II certified infrastructure, annual penetration testing, 99.9% uptime SLA, and 24/7 security monitoring. We never share data with third parties and comply with UK data protection requirements.",
      category: "technical"
    },
    {
      question: "Can I track commission and fees per role?",
      answer: "Absolutely! Each role card includes fields for fee percentage, fixed fee amount, salary range, and contract day rate. Jobwall automatically calculates potential commission based on these values and shows total pipeline value. Analytics dashboards display commission earned (placements) and forecasted commission (weighted pipeline). You can filter by fee type and track agency-wide revenue metrics.",
      category: "features"
    },
    {
      question: "What integrations are available?",
      answer: "Jobwall currently integrates with: LinkedIn Recruiter (candidate import), Google Calendar (interview scheduling), email (Gmail/Outlook for activity logging), CSV import/export for any system, and REST API for custom integrations. Planned integrations include Bullhorn, JobAdder, Indeed, Reed, and Slack. Enterprise customers can request priority integration development for their specific tools.",
      category: "technical"
    },
    {
      question: "How long does setup take?",
      answer: "Most users complete setup in under 10 minutes. The process: (1) Create account with email - 30 seconds, (2) Complete onboarding questionnaire (quarter targets, SLA rules) - 2 minutes, (3) Optional CSV import of existing candidates - 3 minutes, (4) Add your first role manually to test - 2 minutes, (5) Configure email notifications - 1 minute. We provide guided tours and video tutorials. For teams, we offer free onboarding calls.",
      category: "general"
    },
    {
      question: "Is there a mobile app?",
      answer: "Jobwall is a Progressive Web App (PWA), which means you can install it on your iPhone, iPad, or Android device directly from your browser. Tap 'Add to Home Screen' and it behaves like a native app with offline support, push notifications, and full-screen mode. No App Store download required. Native iOS/Android apps are on our roadmap for Q2 2026.",
      category: "technical"
    },
    {
      question: "Can I try the team features before upgrading?",
      answer: "Yes! Professional plan users can invite 1 guest user for free to test team collaboration. This gives you full access to multi-user features including shared pipeline, task assignments, and team analytics. If you upgrade to Agency plan, guest users automatically convert to full team members. You can also schedule a free demo with our team to see Agency features in action.",
      category: "pricing"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe secure payment processing. For Agency plans, we also accept bank transfer (invoice billing) with annual prepayment. All transactions are in GBP. We do not store card details on our servers - all payment data is handled by PCI-compliant Stripe infrastructure.",
      category: "pricing"
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer: "Yes! Annual prepayment gives you 2 months free (equivalent to 16.7% discount). Professional plan: £1,788/year instead of £2,148 (saves £360). Agency plan: Custom annual pricing with 15-20% discount depending on team size. Annual plans include priority support and free feature upgrades. You can switch from monthly to annual billing anytime through your billing settings.",
      category: "pricing"
    },
    {
      question: "What happens during the 7-day free trial?",
      answer: "Your free trial includes: Full access to all features (no limitations), unlimited roles and candidates, team features (on Agency trial), email support, guided onboarding tour, sample data to explore, no credit card required upfront. On day 5, we'll email asking if you need help. On day 6, you'll be prompted to add payment details to continue after trial. No automatic charges - you must explicitly choose to subscribe.",
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

  // Generate FAQPage JSON-LD Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="py-14 sm:py-24 bg-white">
      {/* FAQPage Schema for rich snippets */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />
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
            Everything you need to know about Jobwall. Can’t find what you’re looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Items - mobile-first clean list */}
        <div className="rounded-2xl ring-1 ring-gray-100 divide-y divide-gray-200 bg-white overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className={`${openIndex===index ? 'bg-accent-50/40 border-l-2 border-accent-500' : ''}`}>
              <button
                onClick={() => toggleItem(index)}
                className="w-full min-h-[44px] py-4 sm:py-5 px-3 sm:px-5 text-left flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                <div className={`${openIndex===index ? 'rotate-45' : 'rotate-0'} flex-shrink-0 ml-3 transition-transform duration-200`}>
                  <Plus className="w-5 h-5 text-primary-500" />
                </div>
              </button>

              {openIndex===index && (
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className="px-3 sm:px-5 pb-4 sm:pb-6"
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