import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Jobwall - Recruitment Software Terms',
  description: 'Jobwall terms of service for UK recruitment consultants. Read our terms and conditions for using our recruitment pipeline management and operations dashboard.',
  keywords: ['terms of service', 'terms and conditions', 'recruitment software terms', 'SaaS terms', 'UK software terms'],
  openGraph: {
    title: 'Terms of Service | Jobwall',
    description: 'Terms and conditions for using Jobwall recruitment operations dashboard',
    url: 'https://jobwall.co.uk/terms',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | Jobwall',
    description: 'Terms and conditions for using Jobwall',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
