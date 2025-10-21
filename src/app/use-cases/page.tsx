"use client"
import React from 'react'
import {
  Building2, Users, User, Briefcase, TrendingUp,
  Target, CheckCircle2, ArrowRight, Sparkles, Clock
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function UseCasesPage() {
  const useCases = [
    {
      icon: Building2,
      persona: 'Recruitment Agency',
      title: 'Multi-Consultant Agency Operations',
      scenario: 'Thames Recruitment is a 5-person London-based agency specializing in tech placements. They manage 40-60 active roles across multiple clients, with each consultant handling 8-12 roles simultaneously.',
      challenges: [
        'Lost placements due to delayed follow-ups (2-3 per month averaging £12k each)',
        'No visibility into which consultant owns which role',
        'Clients slipping through cracks when consultants take holidays',
        'Manual tracking in spreadsheets leading to data inconsistencies',
        'No way to measure pipeline velocity or identify bottlenecks',
        'Difficulty forecasting monthly revenue with scattered role data',
      ],
      solution: {
        approach: 'Thames Recruitment implemented Jobwall\'s Agency tier with team collaboration features, giving all 5 consultants access to a unified pipeline dashboard.',
        implementation: [
          'All consultants add roles to shared Kanban board with ownership tags',
          'SLA rules set to 72 hours per stage with automated urgent action alerts',
          'Team analytics dashboard shows individual and agency-wide metrics',
          'Role assignment feature ensures clear ownership and accountability',
          'Mobile access allows consultants to update pipeline on client visits',
        ],
        results: [
          '£96,000 annual savings (from 12 lost placements reduced to 2)',
          '95% pipeline visibility (up from 30%)',
          '40% productivity increase with automated task management',
          'Team revenue forecasting accuracy improved to 85%',
          'Client satisfaction scores increased by 35% due to faster response times',
        ],
      },
      features: [
        'Team Collaboration with role assignment',
        'Unified Agency Dashboard',
        'Real-time pipeline updates',
        'Team performance analytics',
        'Mobile access for remote work',
        'Role-based permissions (admin vs member)',
      ],
      cta: 'Perfect for agencies with 2-10 consultants managing 20+ roles monthly',
    },
    {
      icon: Users,
      persona: 'In-House Recruitment Team',
      title: 'Corporate Talent Acquisition',
      scenario: 'A fast-growing SaaS company has an internal recruitment team of 3 people hiring across engineering, sales, and operations. They manage 15-25 open roles at any time with an annual hiring target of 50 employees.',
      challenges: [
        'Lack of structured process leading to inconsistent candidate experience',
        'Hiring managers asking "where are we with role X?" daily',
        'No centralized view of hiring pipeline health',
        'Difficulty tracking time-to-hire and stage durations',
        'Interview scheduling chaos with no task management',
        'Executive team requesting hiring reports requiring manual compilation',
      ],
      solution: {
        approach: 'The company adopted Jobwall\'s Professional tier for each recruiter, then upgraded to Agency tier for unified team visibility when they saw the value.',
        implementation: [
          'Customized pipeline stages to match their hiring process (Applied → Phone Screen → Tech Interview → Culture Fit → Offer → Hired)',
          'Set SLA limits per stage aligned with their 30-day time-to-hire goal',
          'Created automated tasks for interview scheduling and follow-ups',
          'Weekly exports to Google Sheets for executive reporting',
          'Integrated analytics dashboard into Monday hiring review meetings',
        ],
        results: [
          'Time-to-hire reduced from 45 days to 28 days average',
          'Hiring manager satisfaction increased (NPS +42 points)',
          '100% visibility into pipeline for all stakeholders',
          'Reduced recruiter stress with automated reminders',
          'Hit 52 hires (104% of annual target)',
          'Executive reporting time reduced from 4 hours to 15 minutes weekly',
        ],
      },
      features: [
        'Customizable pipeline stages',
        'SLA tracking aligned to hiring goals',
        'Automated task management',
        'CSV export for reporting',
        'Analytics dashboard for stakeholder updates',
        'Stage duration analysis',
      ],
      cta: 'Ideal for in-house teams hiring 20+ people annually across multiple departments',
    },
    {
      icon: User,
      persona: 'Freelance Recruitment Consultant',
      title: 'Independent Consultant Workflow',
      scenario: 'Sarah is a freelance recruitment consultant specializing in finance placements. She works from home, managing 8-15 active roles for various clients on retained and contingent contracts.',
      challenges: [
        'Juggling multiple clients with different communication preferences',
        'Missing follow-up windows due to lack of structured reminders',
        'Difficulty remembering which client responds quickly vs slowly',
        'No clear view of which roles are most likely to close this month',
        'Manual tracking in notebooks leading to missed opportunities',
        'Client asking for progress updates requiring time to compile information',
      ],
      solution: {
        approach: 'Sarah started with Jobwall\'s Professional tier (£149/month), treating it as her virtual assistant for pipeline management.',
        implementation: [
          'Added all roles to Kanban board with priority levels (high/medium/low)',
          'Set custom SLA limits per client based on their typical response times',
          'Used client response learning feature to optimize follow-up timing',
          'Created manual tasks for client check-ins and candidate sourcing deadlines',
          'Set quarterly target of 10 placements to track progress toward income goals',
        ],
        results: [
          'Increased placements from 8 to 12 per quarter (+50%)',
          '£48,000 additional annual revenue (4 extra placements × £12k average)',
          'Zero missed follow-ups in 6 months of use',
          'Client reporting time reduced from 30 minutes to 5 minutes per client',
          'Work-life balance improved with clear daily action list',
          'Professional image boost when sharing pipeline screenshots with clients',
        ],
      },
      features: [
        'Individual Professional tier',
        'Priority indicators for role urgency',
        'Client response learning',
        'Quarterly target tracking',
        'Manual task creation',
        'Mobile access for flexible working',
      ],
      cta: 'Perfect for solo consultants managing 5-20 roles with quarterly placement targets',
    },
    {
      icon: Briefcase,
      persona: 'Boutique Specialist Agency',
      title: 'Niche Market Recruitment',
      scenario: 'A 2-person agency specializing exclusively in healthcare recruitment for private clinics. They manage 20-30 roles with long sales cycles (60-90 days average) and high-value placements (£15k-25k fees).',
      challenges: [
        'Long sales cycles making it hard to remember role history',
        'High-value placements requiring meticulous follow-up',
        'Client relationships dependent on responsive communication',
        'Difficulty tracking which roles are in danger of going cold',
        'No systematic approach to maintaining momentum across 60-90 day cycles',
        'Partner absences creating coverage gaps',
      ],
      solution: {
        approach: 'Implemented Jobwall Agency tier with extended SLA limits (5 days per stage instead of 3) to match their longer sales cycles.',
        implementation: [
          'Customized stage names to match healthcare recruitment process',
          'Added detailed notes feature to capture all client conversations',
          'Set up activity log to maintain complete role history',
          'Created recurring tasks for monthly client touchpoints',
          'Used analytics to identify which stage causes most delays',
        ],
        results: [
          'Zero lost placements in 9 months (previously 1-2 per quarter)',
          '£60,000 annual revenue protection (3 placements × £20k average)',
          'Client retention rate improved to 95%',
          'Average placement cycle reduced from 85 days to 72 days',
          'Seamless coverage when partners take leave',
          'Professionalism boost with comprehensive role documentation',
        ],
      },
      features: [
        'Customizable SLA limits',
        'Notes and activity logs',
        'Team collaboration for coverage',
        'Stage duration analytics',
        'Recurring task creation',
        'Client response tracking',
      ],
      cta: 'Ideal for specialist agencies with complex, high-value placements requiring detailed tracking',
    },
    {
      icon: TrendingUp,
      persona: 'High-Volume Agency',
      title: 'Volume Recruitment Operations',
      scenario: 'A 10-consultant agency managing 150+ active roles across retail, hospitality, and logistics. They focus on speed and volume with an average placement fee of £3k-5k.',
      challenges: [
        'Overwhelming volume making it impossible to track all roles manually',
        'Fast-moving market requiring rapid response to client needs',
        'Difficulty identifying which consultants are most productive',
        'No clear view of pipeline health across 150+ roles',
        'Bottlenecks forming in specific stages without visibility',
        'Competition from other agencies requiring faster placement velocity',
      ],
      solution: {
        approach: 'Deployed Jobwall Agency tier with focus on analytics and urgent actions to maintain velocity across high volume.',
        implementation: [
          'All 10 consultants trained on unified pipeline system',
          'Aggressive SLA limits (48 hours per stage) to maintain speed',
          'Weekly team meetings reviewing analytics dashboard',
          'Leaderboard feature creating friendly competition between consultants',
          'Bulk import of existing candidates via CSV on day one',
        ],
        results: [
          'Placement velocity increased 25% (from 40 to 50 placements per month)',
          '£600,000 additional annual revenue (120 extra placements × £5k average)',
          'Time-to-placement reduced from 18 days to 14 days',
          'Top consultant identified and promoted to team lead role',
          'Bottleneck identified in "Client Review" stage, addressed with process change',
          'Client NPS increased by 28 points due to faster service',
        ],
      },
      features: [
        'High-capacity Kanban board (150+ roles)',
        'Team performance leaderboards',
        'Analytics dashboard with bottleneck identification',
        'CSV bulk import',
        'Aggressive SLA alerts',
        'Real-time collaboration',
      ],
      cta: 'Built for high-volume agencies managing 100+ roles with speed-focused operations',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Real Recruitment Teams, Real Results
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            See how agencies, in-house teams, and freelance consultants use Jobwall to prevent lost placements and scale their operations.
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

      {/* Use Cases Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Solutions for Every Recruitment Scenario
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From solo consultants to 10-person agencies, see how Jobwall adapts to your specific workflow
            </p>
          </div>

          <div className="space-y-16">
            {useCases.map((useCase, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                    <useCase.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-primary-600 mb-1">{useCase.persona}</div>
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {useCase.scenario}
                    </p>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Left Column: Challenges & Solution */}
                  <div className="space-y-6">
                    {/* Challenges */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-600" />
                        Challenges
                      </h4>
                      <ul className="space-y-2">
                        {useCase.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-500 mt-1">×</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solution Approach */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent-500" />
                        Solution
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">{useCase.solution.approach}</p>
                      <ul className="space-y-2">
                        {useCase.solution.implementation.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-accent-500 mt-0.5">→</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Results & Features */}
                  <div className="space-y-6">
                    {/* Results */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-success-500" />
                        Results Achieved
                      </h4>
                      <ul className="space-y-2">
                        {useCase.solution.results.map((result, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                            <span className="font-medium">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Features Used */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                        Key Features Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {useCase.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 italic">{useCase.cta}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Statistics Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">
            Industry Context: Why Pipeline Visibility Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">2-3</div>
              <div className="text-sm text-gray-600">Lost placements per month per consultant (industry average)</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
              <div className="text-4xl font-bold text-accent-500 mb-2">£24k-36k</div>
              <div className="text-sm text-gray-600">Annual revenue loss per consultant from poor pipeline visibility</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
              <div className="text-4xl font-bold text-success-600 mb-2">72 hours</div>
              <div className="text-sm text-gray-600">Optimal follow-up window before placements go cold (research-backed)</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-8 max-w-2xl mx-auto">
            Based on industry research and feedback from 47 UK recruitment consultants using Jobwall across 8 cities. Your results may vary based on market conditions, role complexity, and operational maturity.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Which Use Case Matches Your Situation?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start your 7-day free trial and see how Jobwall prevents lost placements for your specific workflow
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
              href="/features"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Explore All Features
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
