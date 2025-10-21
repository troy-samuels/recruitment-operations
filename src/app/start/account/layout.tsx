import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account | Jobwall - Free Recruitment Software Trial',
  description: 'Create your Jobwall account and start managing your recruitment pipeline. Free trial for UK recruitment consultants. No credit card required.',
  keywords: ['create account', 'signup', 'free trial', 'recruitment software account', 'UK recruitment tools'],
  openGraph: {
    title: 'Create Your Jobwall Account',
    description: 'Start your free trial and prevent lost placements',
    url: 'https://jobwall.co.uk/start/account',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: 'Create Your Jobwall Account',
    description: 'Start your free trial today',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/start/account',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
