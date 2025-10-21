import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Jobwall - How We Use Cookies',
  description: 'Jobwall cookie policy. Learn how we use cookies and similar technologies in our recruitment operations dashboard for UK recruitment consultants.',
  keywords: ['cookie policy', 'cookies', 'tracking', 'analytics cookies', 'UK cookie policy'],
  openGraph: {
    title: 'Cookie Policy | Jobwall',
    description: 'Learn how Jobwall uses cookies and tracking technologies',
    url: 'https://jobwall.co.uk/cookies',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | Jobwall',
    description: 'Learn how Jobwall uses cookies',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/cookies',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
