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