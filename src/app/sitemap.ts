import { MetadataRoute } from 'next'

/**
 * Dynamic sitemap generation for Jobwall
 * Optimized for both traditional search engines and LLM crawlers
 *
 * Priority levels:
 * 1.0 - Homepage
 * 0.9 - Core landing pages (features, pricing)
 * 0.8 - High-value content (blog posts, use cases)
 * 0.7 - Support pages (help, contact)
 * 0.6 - Legal pages (privacy, terms)
 * 0.5 - Auth pages (signup, login)
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwall.co.uk'
  const now = new Date()

  return [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // Core signup/onboarding pages
    {
      url: `${baseUrl}/start/account`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/start/seats`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-started`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Support & documentation pages
    {
      url: `${baseUrl}/help`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Content marketing pages
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // Blog posts
    {
      url: `${baseUrl}/blog/how-to-prevent-lost-placements`,
      lastModified: new Date('2025-10-21'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Future pages (uncomment as created)
    /*
    {
      url: `${baseUrl}/demo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    */

    // Note: Additional blog posts would be added here as they're created
  ]
}
