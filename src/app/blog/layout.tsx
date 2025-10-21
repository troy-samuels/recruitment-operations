import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Jobwall - Recruitment Operations Insights',
  description: 'Expert insights on recruitment operations, pipeline management, and preventing lost placements. Practical guides for UK recruitment consultants and agencies.',
  keywords: [
    'recruitment blog',
    'recruitment operations guide',
    'pipeline management tips',
    'prevent lost placements',
    'recruitment best practices',
    'UK recruitment insights',
    'placement velocity',
    'recruitment consultant tips',
    'agency operations blog',
    'recruitment workflow optimization',
  ],
  openGraph: {
    title: 'Blog | Jobwall Recruitment Insights',
    description: 'Expert insights on recruitment operations and preventing lost placements',
    url: 'https://jobwall.co.uk/blog',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruitment Operations Blog | Jobwall',
    description: 'Practical guides for UK recruitment consultants',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/blog',
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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
