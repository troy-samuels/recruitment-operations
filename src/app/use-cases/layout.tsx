import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Use Cases | Jobwall - Solutions for Every Recruitment Team',
  description: 'Discover how recruitment agencies, in-house teams, and freelance consultants use Jobwall to prevent lost placements. Real-world scenarios and solutions for UK recruitment professionals.',
  keywords: [
    'recruitment agency software',
    'in-house recruitment tools',
    'freelance recruiter dashboard',
    'recruitment use cases',
    'agency recruitment solutions',
    'corporate recruitment software',
    'independent recruiter tools',
    'recruitment consultant software',
    'placement tracking solutions',
    'recruitment workflow automation',
  ],
  openGraph: {
    title: 'Use Cases | Jobwall Recruitment Solutions',
    description: 'Real-world recruitment scenarios and how Jobwall solves them for agencies, in-house teams, and freelance consultants.',
    url: 'https://jobwall.co.uk/use-cases',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruitment Use Cases | Jobwall',
    description: 'See how different recruitment teams use Jobwall to prevent lost placements',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/use-cases',
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

export default function UseCasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
