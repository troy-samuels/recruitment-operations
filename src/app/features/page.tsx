"use client"
import React from 'react'
import {
  Kanban, Bell, BarChart3, Users, Clock, Target,
  Zap, TrendingUp, Shield, Download, FileText, CheckCircle2,
  ArrowRight, Sparkles
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FeaturesPage() {
  const features = [
    {
      icon: Kanban,
      title: 'Visual Kanban Pipeline',
      description: 'Drag-and-drop interface showing all roles across 6 customizable stages',
      details: [
        'Move candidates between stages with simple drag-and-drop gestures',
        'Color-coded cards with priority indicators (high/medium/low)',
        'Real-time updates when team members make changes',
        'Customizable stage names and SLA limits per column',
        'Filter and search across your entire pipeline',
        'Mobile-responsive touch interface for on-the-go management',
      ],
      benefits: [
        'Instant visibility into every role\'s current status',
        'Identify bottlenecks at a glance',
        'Reduce time spent tracking candidates in spreadsheets',
      ],
    },
    {
      icon: Bell,
      title: 'Smart Reminders & Alerts',
      description: 'Automated notifications when roles need attention',
      details: [
        'Configurable SLA rules (default: 72 hours per stage)',
        'Automatic flagging of overdue roles and tasks',
        'Client response pattern learning for intelligent follow-up timing',
        'Email and in-app notifications with one-click actions',
        'Urgent actions dashboard showing all items requiring attention',
        'Customizable notification preferences per alert type',
      ],
      benefits: [
        'Never miss a critical follow-up again',
        'Prevent placements from going cold',
        'Proactive management instead of reactive firefighting',
      ],
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive performance metrics and insights',
      details: [
        'Stage duration analysis showing average time per column',
        'Period-over-period comparisons (week/month/quarter/year)',
        'Placement velocity tracking with trend indicators',
        'Revenue forecasting based on weighted pipeline value',
        'Conversion rate analysis per stage',
        'Individual and team performance leaderboards',
        'Exportable reports in CSV and PDF formats',
      ],
      benefits: [
        'Identify process inefficiencies and optimize workflow',
        'Track progress toward quarterly placement targets',
        'Data-driven decisions to improve conversion rates',
      ],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user workspaces with role-based permissions',
      details: [
        'Real-time collaboration with simultaneous editing',
        'Assign roles to specific team members with ownership tracking',
        'Role-based access control (admin vs member permissions)',
        'Agency-wide analytics showing team performance',
        'Activity feed showing who did what and when',
        'Shared pipeline view with individual focus modes',
        'Team invitation system with email verification',
      ],
      benefits: [
        'Eliminate duplicate effort and role conflicts',
        'Clear accountability with ownership tracking',
        'Scale your recruitment operation efficiently',
      ],
    },
    {
      icon: Clock,
      title: 'Stage Duration Tracking',
      description: 'Automatic timing of how long roles spend in each stage',
      details: [
        'Millisecond-precision timestamp tracking on every stage change',
        'Calculate average, median, and maximum duration per stage',
        'Historical trend analysis showing if pipeline is speeding up',
        'Benchmark against your own past performance',
        'Identify which stages cause the most delays',
        'Stage-specific SLA violations highlighted in urgent actions',
      ],
      benefits: [
        'Spot bottlenecks before they cost you placements',
        'Set realistic client expectations based on data',
        'Continuously improve your placement velocity',
      ],
    },
    {
      icon: Target,
      title: 'Quarterly Target Tracking',
      description: 'Set goals and monitor progress throughout the quarter',
      details: [
        'Configure placement targets during onboarding',
        'Real-time progress visualization showing placements vs target',
        'Days remaining in quarter countdown',
        'Commission tracking showing earned and forecasted revenue',
        'Historical quarterly performance comparisons',
        'Automatic rollover to next quarter with goal adjustment prompts',
      ],
      benefits: [
        'Stay focused on hitting your revenue targets',
        'Motivate yourself and team with visible progress',
        'Plan workload based on time remaining in quarter',
      ],
    },
    {
      icon: Zap,
      title: 'Automated Task Management',
      description: 'Auto-generated and manual tasks with due dates',
      details: [
        'System automatically creates tasks based on pipeline events',
        'Manual task creation for custom follow-ups',
        'Due date tracking with overdue indicators',
        'Task completion tracking with timestamps',
        'Tasks grouped by role for easy context',
        'Priority levels (high/medium/low) with visual indicators',
      ],
      benefits: [
        'Never forget to follow up on a critical action',
        'Reduce mental load with automated task generation',
        'Clear daily action list of what needs attention',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Client Response Learning',
      description: 'Track client patterns and predict optimal follow-up timing',
      details: [
        'Automatic tracking of client response times per company',
        'Calculate average response time for each client',
        'Intelligent suggestions for when to follow up',
        'Historical pattern recognition across all interactions',
        'Client-specific SLA recommendations',
      ],
      benefits: [
        'Optimize follow-up timing for each client',
        'Build stronger client relationships with timely communication',
        'Reduce wasted follow-ups on slow-responding clients',
      ],
    },
    {
      icon: FileText,
      title: 'Candidate & Role Notes',
      description: 'Rich text notes and activity logs per role',
      details: [
        'Add unlimited notes to any role card',
        'Timestamp all notes with author attribution',
        'Activity log showing full history of changes',
        'Search across all notes and role details',
        'Export role history for client reporting',
      ],
      benefits: [
        'Maintain complete context on every placement',
        'Onboard new team members quickly with full history',
        'Generate client reports from activity logs',
      ],
    },
    {
      icon: Download,
      title: 'CSV Import/Export',
      description: 'Bulk data migration and reporting',
      details: [
        'Import existing candidates from any system via CSV',
        'Field mapping for standard recruitment data formats',
        'Export entire pipeline for backup or reporting',
        'Export analytics data for further analysis',
        'Free migration assistance for large datasets (500+ candidates)',
      ],
      benefits: [
        'Migrate from spreadsheets or legacy systems in minutes',
        'Integrate with external reporting tools',
        'Maintain data ownership with full export capability',
      ],
    },
    {
      icon: Shield,
      title: 'Enterprise Security & Compliance',
      description: 'Bank-grade security and GDPR compliance',
      details: [
        'AES-256 encryption for data at rest',
        'TLS 1.3 encryption for data in transit',
        'SOC 2 Type II certified infrastructure',
        'Regular third-party penetration testing',
        'Automated daily backups with 30-day retention',
        'UK/EU data centers for GDPR compliance',
        'Right-to-be-forgotten and data portability support',
        'Two-factor authentication (2FA) available',
      ],
      benefits: [
        'Protect sensitive candidate and client data',
        'Meet regulatory compliance requirements',
        'Build trust with clients through security certifications',
      ],
    },
    {
      icon: Sparkles,
      title: 'Progressive Web App (PWA)',
      description: 'Install on any device like a native app',
      details: [
        'Add to home screen on iOS/Android/Desktop',
        'Offline access to recently viewed data',
        'Push notifications for urgent actions',
        'Full-screen mode without browser chrome',
        'Automatic updates without app store submissions',
        'Works on all modern browsers',
      ],
      benefits: [
        'Access your pipeline from anywhere, even offline',
        'Faster load times with caching',
        'Native app experience without downloads',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Everything You Need to Prevent Lost Placements
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Jobwall combines visual pipeline management, smart automation, and powerful analytics to help UK recruitment consultants never lose another placement.
          </p>
          <a
            href="/start/account"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Feature Set
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              12 powerful features designed specifically for recruitment consultants who are serious about hitting their targets
            </p>
          </div>

          <div className="space-y-12">
            {features.map((feature, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 ml-16">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Key Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-primary-500 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent-500" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-accent-500 mt-0.5">→</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Recruitment Pipeline?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 47 UK recruitment consultants already using Jobwall to prevent lost placements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/start/account"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/help"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              View Documentation
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
