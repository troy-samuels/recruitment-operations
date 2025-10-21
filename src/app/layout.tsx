import type { Metadata, Viewport } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#152B3C', // Primary color
}

export const metadata: Metadata = {
  title: 'Recruitment Operations | Pipeline Management for UK Consultants',
  description: 'Real-time pipeline dashboard preventing lost placements through superior operational visibility for UK recruitment consultants.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  keywords: [
    'recruitment pipeline management',
    'recruitment CRM',
    'UK recruitment software',
    'placement tracking',
    'candidate pipeline',
    'recruitment operations',
    'prevent lost placements',
    'recruitment consultant tools',
    'hiring pipeline dashboard',
    'recruitment analytics',
  ],
  authors: [{ name: 'Jobwall' }],
  creator: 'Jobwall',
  publisher: 'Jobwall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
        alt: 'Jobwall Recruitment Operations Dashboard - Kanban pipeline view showing recruitment stages',
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
    creator: '@jobwall',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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