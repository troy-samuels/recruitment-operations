import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Recruitment Operations | Pipeline Management for UK Consultants',
  description: 'Real-time pipeline dashboard preventing lost placements through superior operational visibility for UK recruitment consultants.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Recruitment Operations Dashboard',
    description: 'Prevent dropped placements with a real-time operations dashboard.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Jobwall',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Recruitment Operations Dashboard',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruitment Operations Dashboard',
    description: 'Prevent dropped placements with a real-time operations dashboard.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Organization JSON-LD Schema for SEO & LLM understanding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Jobwall',
              legalName: 'Jobwall Ltd',
              url: 'https://jobwall.co.uk',
              logo: 'https://jobwall.co.uk/logo.png',
              description: 'Recruitment operations dashboard preventing lost placements for UK recruitment consultants',
              foundingDate: '2024',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'GB',
                addressRegion: 'England',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'info@jobwall.co.uk',
                contactType: 'Customer Support',
                areaServed: 'GB',
                availableLanguage: 'English',
              },
              sameAs: [
                // Add social media URLs when available
                // 'https://www.linkedin.com/company/jobwall',
                // 'https://twitter.com/jobwall'
              ],
            }),
          }}
        />

        <script
          id="datafast-queue"
          dangerouslySetInnerHTML={{ __html: "window.datafast=window.datafast||function(){(window.datafast.q=window.datafast.q||[]).push(arguments);};" }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
        <script
          defer
          data-website-id="dfid_nmPgfD5ZodXEqNJXLL8Nu"
          data-domain="jobwall.co.uk"
          src="https://datafa.st/js/script.js"
        />
        <script
          dangerouslySetInnerHTML={{ __html: "if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}" }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}