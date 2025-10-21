import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & Support | Jobwall - Recruitment Operations Dashboard',
  description: 'Get help with Jobwall recruitment pipeline management. Find answers to common questions, keyboard shortcuts, and contact support for UK recruitment consultants.',
  keywords: ['recruitment help', 'pipeline management support', 'jobwall support', 'recruitment software help', 'UK recruitment tools'],
  openGraph: {
    title: 'Help & Support | Jobwall',
    description: 'Get help with Jobwall recruitment pipeline management software',
    url: 'https://jobwall.co.uk/help',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: 'Help & Support | Jobwall',
    description: 'Get help with Jobwall recruitment pipeline management software',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/help',
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

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
