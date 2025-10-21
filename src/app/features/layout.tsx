import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features | Jobwall Recruitment Pipeline Management',
  description: 'Comprehensive features of Jobwall: Drag-and-drop Kanban pipeline, smart reminders, stage duration tracking, team collaboration, analytics dashboard, and automated follow-ups for UK recruitment consultants.',
  keywords: [
    'recruitment pipeline features',
    'kanban recruitment board',
    'recruitment analytics',
    'smart reminders recruitment',
    'pipeline management features',
    'recruitment automation',
    'candidate tracking system',
    'recruitment CRM features',
  ],
  openGraph: {
    title: 'Jobwall Features | Recruitment Pipeline Management',
    description: 'Explore powerful features designed to prevent lost placements: visual pipeline, automated reminders, analytics, and team collaboration.',
    url: 'https://jobwall.co.uk/features',
    siteName: 'Jobwall',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobwall Features',
    description: 'Powerful recruitment pipeline features to prevent lost placements',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/features',
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

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
