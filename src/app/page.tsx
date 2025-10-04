"use client"
import React from 'react'
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
      {/* Header */}
      <Header />

      {/* Hero Section - Above the fold */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-20 bg-gradient-to-br from-cream-100 via-cream-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6">
              Pipeline visibility that
              <span className="text-accent-500 block">prevents lost placements</span>
            </h1>
            <p className="font-body text-lg text-primary-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Track roles, candidates and actions in one dashboard. Stay ahead of follow‑ups, protect revenue, and move every deal forward.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 sm:mb-16">
              <a href="/start/account" className="font-body bg-accent-500 text-white px-8 py-4 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
              {/* Demo link removed until dedicated page is ready */}
            </div>

          </div>
        </div>
      </section>


      {/* Anchor for Features (maps to demo preview) */}
      <div id="features" />

      {/* Dashboard Preview Section (How it works) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-3">How it works</h2>
            <p className="font-body text-lg text-primary-400 max-w-3xl mx-auto">
              Drag and drop candidates through your pipeline, set nudges for follow‑ups, and track progress with live metrics.
            </p>
          </div>

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

      {/* Footer */}
      <Footer />

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          <a href="/onboarding" className="w-full inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-body font-semibold py-3 rounded-lg shadow">
            Get Started
          </a>
        </div>
      </div>

      <SignupModal open={signupOpen} onClose={()=> setSignupOpen(false)} />

    </div>
  )
}