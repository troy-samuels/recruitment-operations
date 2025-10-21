"use client"
import React from 'react'
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  publishedDate: string
  readTime: string
  category: string
  featured: boolean
}

export default function BlogPage() {
  const blogPosts: BlogPost[] = [
    {
      slug: 'how-to-prevent-lost-placements',
      title: 'How to Prevent Lost Placements in Recruitment: A Complete Guide',
      excerpt: 'UK recruitment consultants lose 2-3 placements monthly (£24k-36k annual revenue) due to poor pipeline visibility. Learn the 7 proven strategies to prevent lost placements and protect your revenue.',
      author: 'Jobwall Team',
      publishedDate: '2025-10-21',
      readTime: '12 min read',
      category: 'Best Practices',
      featured: true,
    },
    // Future blog posts will be added here
  ]

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Recruitment Operations Insights
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Practical guides, best practices, and expert insights to help UK recruitment consultants prevent lost placements and optimize their pipeline
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <div className="text-sm font-semibold text-primary-600 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              FEATURED POST
            </div>
            <article className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700 border border-accent-200">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishedDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">By {featuredPost.author}</span>
                  <a
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Read Full Guide
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-8">All Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">By {post.author}</span>
                      <a
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Section */}
        <section className="mt-16 bg-primary-50 border border-primary-200 rounded-xl p-8 text-center">
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">
            More Insights Coming Soon
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We're publishing new guides on recruitment operations, pipeline optimization, and team collaboration. Subscribe to get notified when new articles are published.
          </p>
          <a
            href="/start/account"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </div>

      <Footer />
    </div>
  )
}
