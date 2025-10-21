import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Prevent Lost Placements in Recruitment: Complete Guide | Jobwall',
  description: 'UK recruitment consultants lose £24k-36k annually from 2-3 lost placements per month. Learn 7 proven strategies to prevent lost placements through better pipeline visibility and systematic follow-ups.',
  keywords: [
    'prevent lost placements',
    'recruitment pipeline management',
    'lost placement prevention',
    'recruitment follow-up strategy',
    'candidate pipeline optimization',
    'recruitment operations best practices',
    'placement velocity',
    'recruitment consultant tips',
    'pipeline visibility',
    'recruitment SLA management',
  ],
  openGraph: {
    title: 'How to Prevent Lost Placements: Complete Guide',
    description: 'Learn 7 proven strategies to prevent lost placements and protect £24k-36k annual revenue',
    url: 'https://jobwall.co.uk/blog/how-to-prevent-lost-placements',
    siteName: 'Jobwall',
    type: 'article',
    locale: 'en_GB',
    publishedTime: '2025-10-21T09:00:00Z',
    authors: ['Jobwall Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Prevent Lost Placements in Recruitment',
    description: '7 proven strategies to prevent £24k-36k annual revenue loss',
  },
  alternates: {
    canonical: 'https://jobwall.co.uk/blog/how-to-prevent-lost-placements',
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

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
