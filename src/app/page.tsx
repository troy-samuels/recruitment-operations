"use client"
import React from 'react'
import Script from 'next/script'
import Header from '@/components/Header'
import PreviewDashboard from '@/components/PreviewDashboard'
import TrustIndicators from '@/components/TrustIndicators'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import { ArrowRight } from 'lucide-react'
import SignupModal from '@/components/SignupModal'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

// HowTo JSON-LD Schema for "How it works" section
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Prevent Lost Placements with Jobwall',
  description: 'Step-by-step guide to using Jobwall recruitment pipeline dashboard to track candidates and prevent lost placements',
  image: 'https://jobwall.co.uk/og-image.png',
  totalTime: 'PT10M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'GBP',
    value: '39',
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Email address for account creation',
    },
    {
      '@type': 'HowToSupply',
      name: 'Existing candidate list (optional CSV file)',
    },
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Web browser (Chrome, Firefox, Safari, Edge)',
    },
    {
      '@type': 'HowToTool',
      name: 'Internet connection',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Create your free account',
      text: 'Sign up with your email address at jobwall.co.uk/start/account. No credit card required for the 7-day free trial.',
      url: 'https://jobwall.co.uk/start/account',
      image: 'https://jobwall.co.uk/og-image.png',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Set your quarterly targets and SLA rules',
      text: 'Complete the onboarding questionnaire to configure your placement goals, stage duration limits (default 72 hours), and notification preferences.',
      image: 'https://jobwall.co.uk/og-image.png',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Add roles to your pipeline',
      text: 'Create job role cards by clicking the "+" button. Enter job title, company, candidate name, salary, and fee details. Alternatively, bulk import from CSV.',
      image: 'https://jobwall.co.uk/og-image.png',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Drag and drop candidates through stages',
      text: 'Move role cards between pipeline columns (New Submission → Client Review → Interview → Offer → Placed) by dragging. Jobwall automatically tracks stage duration.',
      image: 'https://jobwall.co.uk/og-image.png',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Respond to smart reminders',
      text: 'Jobwall flags roles requiring attention when they exceed SLA limits or when client follow-ups are due. Click on urgent actions to see what needs attention and take immediate action.',
      image: 'https://jobwall.co.uk/og-image.png',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Track performance with analytics',
      text: 'View your analytics dashboard to see stage duration metrics, placement velocity, and pipeline health. Filter by week, month, quarter, or all-time to identify trends.',
      url: 'https://jobwall.co.uk/analytics',
      image: 'https://jobwall.co.uk/og-image.png',
    },
  ],
}

// SoftwareApplication JSON-LD Schema
const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Jobwall',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Recruitment Management Software',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '149',
    priceCurrency: 'GBP',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '149',
      priceCurrency: 'GBP',
      billingDuration: 'P1M',
      unitText: 'MONTH',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
  description: 'Real-time recruitment pipeline dashboard preventing lost placements for UK recruitment consultants. Track roles, candidates, and actions in one unified dashboard.',
  featureList: [
    'Drag-and-drop Kanban pipeline',
    'Automated follow-up reminders',
    'Stage duration tracking',
    'Team collaboration',
    'Analytics dashboard',
    'Client response learning',
  ],
  screenshot: 'https://jobwall.co.uk/og-image.png',
  author: {
    '@type': 'Organization',
    name: 'Jobwall',
  },
  provider: {
    '@type': 'Organization',
    name: 'Jobwall',
    url: 'https://jobwall.co.uk',
  },
  inLanguage: 'en-GB',
  audience: {
    '@type': 'Audience',
    audienceType: 'UK Recruitment Consultants',
    geographicArea: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  },
}

export default function Home() {
  const [signupOpen, setSignupOpen] = React.useState(false)
  const { user, initialized } = useAuth()
  const router = useRouter()
  React.useEffect(() => {
    const handler = () => setSignupOpen(true)
    window.addEventListener('open-signup', handler)
    return () => window.removeEventListener('open-signup', handler)
  }, [])

  React.useEffect(() => {
    if (initialized && user) {
      setSignupOpen(false)
      router.replace('/dashboard')
    }
  }, [initialized, user, router])

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-0">
      {/* SoftwareApplication Schema for SEO & LLM understanding */}
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        strategy="beforeInteractive"
      />

      {/* HowTo Schema for step-by-step guidance */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        strategy="beforeInteractive"
      />

      {/* Header */}
      <Header />

      {/* Main Content - Semantic HTML for LLM understanding */}
      <main role="main" aria-label="Main content">
        {/* Hero Section - Above the fold */}
        <section aria-labelledby="hero-heading" className="relative pt-16 sm:pt-24 pb-12 sm:pb-20 bg-gradient-to-br from-cream-100 via-cream-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="text-center">
              <h1 id="hero-heading" className="mb-6">
                Pipeline visibility that
                <span className="text-accent-500 block">prevents lost placements</span>
              </h1>
              <p className="font-body text-lg text-primary-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Track roles, candidates and actions in one dashboard. Stay ahead of follow‑ups, protect revenue, and move every deal forward.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 sm:mb-16">
                <a href="/start/account" aria-label="Start free trial - no credit card required" className="font-body bg-accent-500 text-white px-8 py-4 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 text-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Dashboard Preview Section (How it works) */}
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2 id="how-it-works-heading" className="mb-3">How it works</h2>
              <p className="font-body text-lg text-primary-400 max-w-3xl mx-auto">
                Drag and drop candidates through your pipeline, set nudges for follow‑ups, and track progress with live metrics.
              </p>
            </header>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden pb-4 sm:pb-6">
            <PreviewDashboard compact />
          </div>

          {/* CTA Below Preview */}
          <div className="text-center mt-8 sm:mt-12 space-y-2">
            <a href="/start/account" className="inline-flex items-center justify-center font-body bg-accent-500 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg font-semibold">
              Get Started
            </a>
            <p className="font-body text-xs sm:text-sm text-primary-400">
              No credit card required • Full access • Cancel anytime
            </p>
          </div>
        </div>
      </section>

        {/* Trust Indicators Section */}
        <TrustIndicators />

        {/* Explore More Section */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
                Explore Jobwall
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Learn more about how Jobwall helps recruitment consultants prevent lost placements
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <a
                href="/features"
                className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  Features
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore 12 comprehensive features designed to prevent lost placements
                </p>
                <span className="text-primary-600 font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                  View All Features
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              <a
                href="/use-cases"
                className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  Use Cases
                </h3>
                <p className="text-gray-600 mb-4">
                  See how agencies, in-house teams, and freelancers use Jobwall
                </p>
                <span className="text-primary-600 font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                  Explore Use Cases
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              <a
                href="/blog"
                className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  Blog
                </h3>
                <p className="text-gray-600 mb-4">
                  Expert insights on recruitment operations and preventing lost placements
                </p>
                <span className="text-primary-600 font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                  Read Articles
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer - Separate from main content */}
      <Footer />

      {/* Sticky mobile CTA */}
      <aside aria-label="Mobile call to action" className="fixed inset-x-0 bottom-0 z-40 sm:hidden bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          <a href="/onboarding" aria-label="Get started with Jobwall" className="w-full inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-body font-semibold py-3 rounded-lg shadow">
            Get Started
          </a>
        </div>
      </aside>

      <SignupModal open={signupOpen} onClose={()=> setSignupOpen(false)} />

    </div>
  )
}