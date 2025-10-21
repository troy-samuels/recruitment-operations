import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Jobwall - Data Protection & GDPR Compliance',
  description: 'Jobwall privacy policy for recruitment consultants. Learn how we protect your data, comply with GDPR, and handle personal information in our recruitment operations dashboard.',
  keywords: ['privacy policy', 'GDPR compliance', 'data protection', 'recruitment data privacy', 'UK data protection'],
  openGraph: {
    title: 'Privacy Policy | Jobwall',
    description: 'Learn how Jobwall protects your recruitment data and complies with UK GDPR',
    url: 'https://jobwall.co.uk/privacy',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Jobwall',
    description: 'Learn how Jobwall protects your recruitment data',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/privacy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
