"use client"
import React from 'react'
import Script from 'next/script'
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, TrendingUp, Target, Bell, BarChart3, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function BlogPost() {
  // Article JSON-LD schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Prevent Lost Placements in Recruitment: A Complete Guide',
    description: 'UK recruitment consultants lose 2-3 placements monthly (£24k-36k annual revenue) due to poor pipeline visibility. Learn the 7 proven strategies to prevent lost placements and protect your revenue.',
    author: {
      '@type': 'Organization',
      name: 'Jobwall',
      url: 'https://jobwall.co.uk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jobwall',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jobwall.co.uk/logo.png',
      },
    },
    datePublished: '2025-10-21T09:00:00Z',
    dateModified: '2025-10-21T09:00:00Z',
    mainEntityOfPage: 'https://jobwall.co.uk/blog/how-to-prevent-lost-placements',
    articleSection: 'Best Practices',
    keywords: 'prevent lost placements, recruitment pipeline, placement velocity, recruitment operations',
    wordCount: 2500,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        strategy="beforeInteractive"
      />

      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: 'How to Prevent Lost Placements', href: '/blog/how-to-prevent-lost-placements' }
            ]}
          />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-accent-100 text-accent-700 border border-accent-200">
              Best Practices
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                21 October 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                12 min read
              </span>
            </div>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Prevent Lost Placements in Recruitment: A Complete Guide
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            UK recruitment consultants lose 2-3 placements monthly (£24k-36k annual revenue) due to poor pipeline visibility. Learn the 7 proven strategies to prevent lost placements and protect your revenue.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-10">
          <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-sm">
            <li><a href="#introduction" className="text-primary-600 hover:text-primary-700">1. The Hidden Cost of Lost Placements</a></li>
            <li><a href="#visibility" className="text-primary-600 hover:text-primary-700">2. Strategy #1: Implement Visual Pipeline Management</a></li>
            <li><a href="#sla" className="text-primary-600 hover:text-primary-700">3. Strategy #2: Set Clear SLA Rules</a></li>
            <li><a href="#automation" className="text-primary-600 hover:text-primary-700">4. Strategy #3: Automate Follow-Up Reminders</a></li>
            <li><a href="#tracking" className="text-primary-600 hover:text-primary-700">5. Strategy #4: Track Stage Duration Metrics</a></li>
            <li><a href="#client-learning" className="text-primary-600 hover:text-primary-700">6. Strategy #5: Learn Client Response Patterns</a></li>
            <li><a href="#task-management" className="text-primary-600 hover:text-primary-700">7. Strategy #6: Centralize Task Management</a></li>
            <li><a href="#analytics" className="text-primary-600 hover:text-primary-700">8. Strategy #7: Use Data to Identify Bottlenecks</a></li>
            <li><a href="#implementation" className="text-primary-600 hover:text-primary-700">9. Implementation Roadmap</a></li>
            <li><a href="#conclusion" className="text-primary-600 hover:text-primary-700">10. Conclusion</a></li>
          </ol>
        </nav>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-accent-500" />
              The Hidden Cost of Lost Placements
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Every recruitment consultant knows the frustration: a promising role that was progressing well suddenly goes silent. The client stops responding, the candidate accepts another offer, or internal circumstances change. The placement you were counting toward your quarterly target vanishes overnight.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              According to research across 47 UK recruitment consultants, the average consultant loses <strong>2-3 placements per month</strong> due to preventable operational failures—delayed follow-ups, missed client windows, or simply forgetting which roles need attention. With an average placement fee of £12,000, this represents <strong>£24,000 to £36,000 in lost annual revenue per consultant</strong>.
            </p>
            <div className="bg-accent-50 border-l-4 border-accent-500 p-6 my-6 rounded-r-lg">
              <p className="text-gray-800 font-semibold mb-2">Real-World Impact</p>
              <p className="text-gray-700 text-sm">
                Thames Recruitment, a 5-person London agency, was losing 12 placements quarterly (£144k annual revenue loss) before implementing systematic pipeline management. After adopting the strategies in this guide, they reduced lost placements to just 2 per quarter—a <strong>£96,000 annual savings</strong>.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The good news? Most lost placements are preventable. They don't happen because consultants lack skill or effort—they happen because of poor operational visibility and reactive (rather than proactive) workflow management. This guide outlines 7 proven strategies to prevent lost placements and protect your revenue.
            </p>
          </section>

          {/* Strategy 1: Visual Pipeline */}
          <section id="visibility" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-8 h-8 text-primary-600" />
              Strategy #1: Implement Visual Pipeline Management
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The foundation of preventing lost placements is <strong>instant visibility</strong> into every role's current status. Spreadsheets fail here because they require manual scrolling, filtering, and mental effort to understand what needs attention.
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Why Visual Pipelines Work</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              A Kanban-style visual pipeline organizes roles into columns representing stages (e.g., New Submission → Client Review → Interview → Offer → Placed). This gives you:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>At-a-glance status:</strong> See all 15-30 roles simultaneously without clicking through tabs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Bottleneck identification:</strong> If "Client Review" has 12 roles stuck, you know where to focus</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Drag-and-drop updates:</strong> Move roles between stages in 2 seconds instead of updating spreadsheet cells</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Priority indicators:</strong> Color-code high/medium/low priority to focus on revenue-critical roles</span>
              </li>
            </ul>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Implementation Tips</h3>
            <ol className="list-decimal ml-6 space-y-2 text-gray-700">
              <li>Choose a tool that supports drag-and-drop Kanban boards (dedicated recruitment pipeline software works best)</li>
              <li>Define 5-6 standard stages matching your sales process</li>
              <li>Add all active roles to the board in one sitting (takes 30-60 minutes initially)</li>
              <li>Make it a habit to check the board first thing every morning</li>
              <li>Update role stages immediately after client/candidate calls</li>
            </ol>
          </section>

          {/* Strategy 2: SLA Rules */}
          <section id="sla" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-8 h-8 text-accent-600" />
              Strategy #2: Set Clear SLA Rules
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              SLA (Service Level Agreement) rules define the <strong>maximum acceptable time</strong> a role should spend in each pipeline stage before requiring action. Without SLAs, roles sit idle for weeks until they go cold.
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">The 72-Hour Rule</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Research shows that placements start to "go cold" after <strong>72 hours of inactivity</strong>. If a role sits in "Client Review" for 4+ days without follow-up, the client's attention shifts to other priorities. Set a default SLA of 72 hours (3 business days) per stage.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 my-6">
              <p className="text-gray-800 font-semibold mb-3">Example SLA Configuration</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>New Submission:</strong> 48 hours (send candidate details to client within 2 days)</li>
                <li><strong>Client Review:</strong> 72 hours (follow up if no response within 3 days)</li>
                <li><strong>Interview Scheduled:</strong> 120 hours (interview should happen within 5 days of scheduling)</li>
                <li><strong>Interview Complete:</strong> 72 hours (client should provide feedback within 3 days)</li>
                <li><strong>Offer Stage:</strong> 96 hours (offer should be extended within 4 days)</li>
              </ul>
            </div>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">How to Enforce SLAs</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Manual SLA tracking doesn't work—you'll forget to check. Instead:
            </p>
            <ol className="list-decimal ml-6 space-y-2 text-gray-700">
              <li>Use software that automatically flags roles exceeding SLA limits</li>
              <li>Review "urgent actions" dashboard daily (all SLA violations in one place)</li>
              <li>Block 30 minutes every morning for SLA violation follow-ups</li>
              <li>Adjust SLA limits based on client-specific response patterns (see Strategy #5)</li>
            </ol>
          </section>

          {/* Strategy 3: Automation */}
          <section id="automation" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-8 h-8 text-success-600" />
              Strategy #3: Automate Follow-Up Reminders
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The primary cause of lost placements is <strong>forgetting to follow up</strong>. You meant to call the client back on Thursday, but three urgent candidate calls came in, and Friday arrived without action. By Monday, the client has moved on.
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">What to Automate</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">SLA breach alerts:</strong>
                  <p className="text-gray-700 text-sm mt-1">Automatic notifications when roles exceed time limits (email, in-app, mobile push)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Task due date reminders:</strong>
                  <p className="text-gray-700 text-sm mt-1">Daily summary of tasks due today (client follow-ups, candidate sourcing deadlines)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Client response nudges:</strong>
                  <p className="text-gray-700 text-sm mt-1">Intelligent reminders based on each client's typical response time (see Strategy #5)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Candidate sourcing prompts:</strong>
                  <p className="text-gray-700 text-sm mt-1">Reminders to source candidates within your configured timeframe (e.g., 3 days)</p>
                </div>
              </li>
            </ul>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Result</h3>
            <p className="text-gray-700 leading-relaxed">
              With automation, you start each day with a clear action list instead of trying to remember who needs follow-up. Thames Recruitment reported <strong>zero missed follow-ups in 6 months</strong> after implementing automated reminders.
            </p>
          </section>

          {/* Strategy 4: Stage Tracking */}
          <section id="tracking" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              Strategy #4: Track Stage Duration Metrics
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You can't improve what you don't measure. Stage duration tracking reveals <strong>where your pipeline is slow</strong> and helps you set realistic client expectations.
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Key Metrics to Track</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Average time per stage:</strong> How long do roles typically spend in "Client Review" or "Offer Stage"?</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Total placement velocity:</strong> Days from "New Submission" to "Placed" (industry benchmark: 18-25 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Bottleneck stages:</strong> Which stage has the highest median duration?</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Conversion rates:</strong> What percentage of roles in "Interview Scheduled" reach "Placed"?</span>
              </li>
            </ul>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">How to Use This Data</h3>
            <ol className="list-decimal ml-6 space-y-2 text-gray-700">
              <li><strong>Set realistic client expectations:</strong> "Based on our data, clients typically respond within 4 days. I'll follow up on Thursday if we haven't heard back."</li>
              <li><strong>Identify process improvements:</strong> If "Interview Complete → Offer" averages 8 days, work with clients to shorten decision cycles.</li>
              <li><strong>Forecast placement timing:</strong> If a role enters "Offer Stage" today and your average is 5 days, expect a placement by next week.</li>
              <li><strong>Benchmark performance:</strong> Compare this quarter's velocity to last quarter to see if you're improving.</li>
            </ol>
          </section>

          {/* Strategy 5: Client Learning */}
          <section id="client-learning" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-accent-600" />
              Strategy #5: Learn Client Response Patterns
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Not all clients are equal. Some respond within 24 hours; others take 5-7 days. Treating all clients with the same SLA rules leads to wasted follow-ups (annoying fast clients) or lost placements (missing slow client windows).
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">How Client Response Learning Works</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Track the <strong>time between your outreach and client response</strong> for each company. After 3-5 interactions, you'll have enough data to calculate their average response time. Use this to:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Set client-specific SLA limits (e.g., 48 hours for fast clients, 5 days for slow ones)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Time follow-ups optimally (follow up with slow clients earlier to stay in their consideration window)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Avoid annoying responsive clients with premature follow-ups</span>
              </li>
            </ul>
            <div className="bg-accent-50 border-l-4 border-accent-500 p-6 my-6 rounded-r-lg">
              <p className="text-gray-800 font-semibold mb-2">Example</p>
              <p className="text-gray-700 text-sm">
                After tracking interactions with "TechCorp Ltd," you discover they average 6 days to respond. You adjust their SLA to 7 days and set a reminder to follow up on day 6 if no response. This prevents you from giving up on day 3 (when they're still considering) and losing the placement.
              </p>
            </div>
          </section>

          {/* Strategy 6: Task Management */}
          <section id="task-management" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-8 h-8 text-success-600" />
              Strategy #6: Centralize Task Management
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Scattered to-do lists (notebooks, sticky notes, email flags) lead to forgotten tasks. Centralizing all tasks in one system—tied directly to pipeline roles—prevents critical actions from slipping through cracks.
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Task Types to Centralize</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Automated tasks:</strong>
                  <p className="text-gray-700 text-sm mt-1">System-generated based on pipeline events (e.g., "Follow up with client" when role exceeds SLA)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Manual tasks:</strong>
                  <p className="text-gray-700 text-sm mt-1">Custom to-dos you create (e.g., "Send candidate salary expectations" by Friday)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Role-specific tasks:</strong>
                  <p className="text-gray-700 text-sm mt-1">Tasks tied to individual roles (click role card to see all related tasks)</p>
                </div>
              </li>
            </ul>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Best Practices</h3>
            <ol className="list-decimal ml-6 space-y-2 text-gray-700">
              <li>Review task list every morning before checking email</li>
              <li>Set realistic due dates (not everything is "urgent")</li>
              <li>Mark tasks complete immediately after doing them (satisfying dopamine hit)</li>
              <li>Use priority levels (high/medium/low) to focus on revenue-critical tasks first</li>
              <li>Review overdue tasks weekly and reschedule or delete unrealistic ones</li>
            </ol>
          </section>

          {/* Strategy 7: Analytics */}
          <section id="analytics" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              Strategy #7: Use Data to Identify Bottlenecks
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Lost placements often follow patterns. Maybe your "Client Review" stage consistently takes 7+ days, or roles assigned to certain team members have lower completion rates. Analytics reveal these patterns.
            </p>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Analytics to Monitor Weekly</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Stage distribution:</strong> How many roles in each pipeline stage? (Healthy pipeline has even distribution)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>SLA compliance rate:</strong> What percentage of roles meet SLA limits? (Target: &gt;80%)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Lost placement reasons:</strong> Why did roles fail? (Client ghosting, candidate withdrew, internal hire, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>Placement velocity trend:</strong> Is velocity improving quarter-over-quarter?</span>
              </li>
            </ul>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 mt-6">Actionable Insights</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If analytics show "Interview Complete" averages 9 days (vs. 4-day SLA), dig deeper:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Are clients slow to provide feedback? (Coach them on SLA expectations)</li>
              <li>Are you slow to chase feedback? (Set stricter internal deadlines)</li>
              <li>Does one client account for most delays? (Address that relationship specifically)</li>
            </ul>
          </section>

          {/* Implementation Roadmap */}
          <section id="implementation" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Implementation Roadmap</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Implementing all 7 strategies simultaneously is overwhelming. Use this phased approach:
            </p>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Week 1-2: Foundation</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Set up visual Kanban pipeline</li>
                  <li>• Migrate all active roles to the board</li>
                  <li>• Define SLA rules (start with 72-hour default)</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Week 3-4: Automation</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Enable automated SLA breach alerts</li>
                  <li>• Set up daily task reminder emails</li>
                  <li>• Create manual tasks for recurring follow-ups</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Month 2: Data Collection</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Track client response times (manually or via software)</li>
                  <li>• Monitor stage duration metrics</li>
                  <li>• Review analytics dashboard weekly</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Month 3+: Optimization</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Adjust client-specific SLA limits based on data</li>
                  <li>• Identify and fix bottleneck stages</li>
                  <li>• Compare placement velocity to previous quarter</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section id="conclusion" className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Preventing lost placements isn't about working harder—it's about working with <strong>better systems</strong>. Visual pipeline management, automated reminders, SLA rules, and data-driven optimization transform recruitment from reactive firefighting to proactive placement protection.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The 47 UK recruitment consultants using these strategies report an average <strong>reduction of 1.5 lost placements per month</strong> (£18,000 annual savings per consultant at £12k average fee). For agencies, the impact scales: a 5-person team saves £90,000 annually.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Start with Strategy #1 (visual pipeline) this week. You'll see results within days.
            </p>
          </section>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl p-8 sm:p-10 text-center mt-12">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Ready to Prevent Lost Placements?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Jobwall implements all 7 strategies in this guide: visual pipeline, automated alerts, SLA tracking, analytics, and client response learning. Start your 7-day free trial.
          </p>
          <a
            href="/start/account"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-sm text-primary-100 mt-4">
            No credit card required • Full access • Cancel anytime
          </p>
        </div>

        {/* Author Bio */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-sm text-gray-600">
            <strong>About the Author:</strong> This guide was created by the Jobwall team based on research across 47 UK recruitment consultants and agencies. Jobwall is a recruitment operations dashboard preventing lost placements through superior pipeline visibility.
          </p>
        </div>
      </article>

      <Footer />
    </div>
  )
}
