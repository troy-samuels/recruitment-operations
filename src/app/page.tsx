"use client"
import React from 'react'
import Header from '@/components/Header'
import PreviewDashboard from '@/components/PreviewDashboard'
import TrustIndicators from '@/components/TrustIndicators'
import RealTimeCounter from '@/components/RealTimeCounter'
import CaseStudySpotlight from '@/components/CaseStudySpotlight'
import ResourceHub from '@/components/ResourceHub'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import { ArrowRight } from 'lucide-react'
import FeaturesSection from '@/components/FeaturesSection'
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
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <Header />

      {/* Hero Section - Above the fold */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-cream-100 via-cream-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-8">
              Stop Losing
              <span className="text-accent-500 block">Placements</span>
            </h1>
            <p className="font-body text-lg text-primary-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              UK recruitment consultants lose 2-3 placements monthly (£24k-36k lost revenue/year) due to poor pipeline visibility.
              <span className="text-primary-500 font-semibold"> RecruitOps prevents this.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a href="/get-started" className="font-body bg-accent-500 text-white px-8 py-4 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#how-it-works" className="font-body border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-lg hover:border-primary-600 hover:bg-white transition-all duration-200 text-lg">
                Watch Demo (2 min)
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* Features Section */}
      <FeaturesSection />

      {/* Dashboard Preview Section (How it works) */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-6">
              See What You'll Be Using
            </h2>
            <p className="font-body text-lg text-primary-400 max-w-3xl mx-auto">
              This is exactly what your dashboard will look like when you log in. Try dragging the candidate cards between stages.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <PreviewDashboard />
          </div>

          {/* CTA Below Preview */}
          <div className="text-center mt-12">
            <a href="/get-started" className="font-body bg-accent-500 text-white px-10 py-4 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold">
              Get Started
            </a>
            <p className="font-body text-sm text-primary-400 mt-4">
              No credit card required • Full access • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <TrustIndicators />

      {/* Real-Time Counter with Problem-Solution Framework */}
      <RealTimeCounter />

      {/* Case Study Spotlight */}
      <CaseStudySpotlight />

      {/* Resource Hub Section */}
      <ResourceHub />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      <SignupModal open={signupOpen} onClose={()=> setSignupOpen(false)} />

    </div>
  )
}