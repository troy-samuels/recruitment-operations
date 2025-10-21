import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started | Jobwall - Start Your Free Trial',
  description: 'Start your free trial of Jobwall recruitment operations dashboard. No credit card required. Join UK recruitment consultants preventing lost placements.',
  keywords: ['recruitment software signup', 'free trial', 'recruitment CRM', 'pipeline management signup', 'UK recruitment software'],
  openGraph: {
    title: 'Get Started with Jobwall | Free Trial',
    description: 'Start your free trial of Jobwall recruitment operations dashboard today',
    url: 'https://jobwall.co.uk/get-started',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Started with Jobwall',
    description: 'Start your free trial today - no credit card required',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/get-started',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
}

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
