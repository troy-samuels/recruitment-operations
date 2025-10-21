"use client"
import React from 'react'
import { BookOpen, Keyboard, HelpCircle, Mail, Video, FileText } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-3">Help & Documentation</h1>
          <p className="text-lg text-gray-600">Everything you need to get the most out of Jobwall recruitment operations dashboard</p>
        </header>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a href="#getting-started" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Getting Started</h3>
            <p className="text-sm text-gray-600">Quick start guide for new users</p>
          </a>
          <a href="#keyboard-shortcuts" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <Keyboard className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Keyboard Shortcuts</h3>
            <p className="text-sm text-gray-600">Work faster with hotkeys</p>
          </a>
          <a href="#common-questions" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <HelpCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Common Questions</h3>
            <p className="text-sm text-gray-600">Quick answers to FAQs</p>
          </a>
        </div>

        {/* Getting Started Section */}
        <section id="getting-started" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Getting Started with Jobwall
          </h2>

          <div className="space-y-6">
            <article>
              <h3 className="font-semibold text-gray-900 mb-2">1. Set Up Your Account</h3>
              <p className="text-sm text-gray-700 mb-2">After signing up, complete the onboarding questionnaire to configure:</p>
              <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
                <li><strong>Quarterly targets:</strong> Set your placement goals for the current quarter</li>
                <li><strong>SLA rules:</strong> Define maximum time allowed per pipeline stage (default: 72 hours)</li>
                <li><strong>Notification preferences:</strong> Choose how you want to receive urgent action alerts</li>
              </ul>
            </article>

            <article>
              <h3 className="font-semibold text-gray-900 mb-2">2. Add Your First Role</h3>
              <p className="text-sm text-gray-700 mb-2">Click the "+" button in the top navigation or press the "+" key to create a new role card:</p>
              <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
                <li><strong>Job Title:</strong> E.g., "Senior Software Engineer"</li>
                <li><strong>Candidate Name:</strong> The candidate you're placing</li>
                <li><strong>Company:</strong> Client company name</li>
                <li><strong>Salary Range:</strong> Expected salary (used for commission calculations)</li>
                <li><strong>Fee Details:</strong> Percentage or fixed fee amount</li>
              </ul>
            </article>

            <article>
              <h3 className="font-semibold text-gray-900 mb-2">3. Navigate the Pipeline</h3>
              <p className="text-sm text-gray-700 mb-2">The Kanban board has 6 standard stages:</p>
              <ol className="list-decimal ml-6 text-sm text-gray-600 space-y-1">
                <li><strong>New Submission:</strong> Fresh candidates just added to the pipeline</li>
                <li><strong>Client Review:</strong> Candidate CV sent to client, awaiting feedback</li>
                <li><strong>Interview Scheduled:</strong> Client interested, interview confirmed</li>
                <li><strong>Interview Complete:</strong> Interview done, awaiting decision</li>
                <li><strong>Offer Stage:</strong> Client making offer, negotiating terms</li>
                <li><strong>Placed:</strong> Candidate accepted offer, placement successful</li>
              </ol>
            </article>

            <article>
              <h3 className="font-semibold text-gray-900 mb-2">4. Track Urgent Actions</h3>
              <p className="text-sm text-gray-700 mb-2">The "Urgent Actions" panel (accessible from the right sidebar) automatically flags:</p>
              <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
                <li>Roles exceeding your configured SLA time limits</li>
                <li>Overdue tasks with past due dates</li>
                <li>Roles requiring candidate sourcing</li>
                <li>Client follow-ups based on response pattern learning</li>
              </ul>
            </article>

            <article>
              <h3 className="font-semibold text-gray-900 mb-2">5. Use Analytics</h3>
              <p className="text-sm text-gray-700">Navigate to <strong>/analytics</strong> to view comprehensive performance metrics including stage duration analysis, placement velocity, and revenue tracking.</p>
            </article>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section id="keyboard-shortcuts" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Keyboard className="w-6 h-6 text-purple-600" />
            Keyboard Shortcuts
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Navigation</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Go to Dashboard</dt>
                  <dd className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">g d</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Go to Analytics</dt>
                  <dd className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">g a</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Actions</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Add New Role</dt>
                  <dd className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">+</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Search (coming soon)</dt>
                  <dd className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">/</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Open Help</dt>
                  <dd className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">?</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section id="common-questions" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-green-600" />
            Common Questions
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold text-gray-900 mb-1">How do I invite team members?</dt>
              <dd className="text-sm text-gray-700">Click the "Invite" button in the top-right navigation (available on Agency/Team tier). Enter their email address and they'll receive an invitation link. You can assign roles and permissions after they accept.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 mb-1">How are urgent actions calculated?</dt>
              <dd className="text-sm text-gray-700">Urgent actions are based on SLA rules you configure in Settings. By default, any role spending more than 72 hours in a single stage is flagged. You can customize these limits per stage.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 mb-1">Can I import my existing candidate data?</dt>
              <dd className="text-sm text-gray-700">Yes! Go to Settings → Import/Export and upload a CSV file with your candidate data. We support standard fields like name, email, phone, job title, company, salary, and current stage.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 mb-1">How do I track commission per role?</dt>
              <dd className="text-sm text-gray-700">Each role card includes fee fields. Enter either a percentage (e.g., 20%) or a fixed amount (e.g., £5000). Jobwall automatically calculates potential commission based on salary data and shows total pipeline value in analytics.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 mb-1">What happens to roles marked as "Placed"?</dt>
              <dd className="text-sm text-gray-700">Placed roles remain visible in the Placed column and count toward your quarterly targets. They're included in analytics for historical performance tracking. You can archive old placements from Settings to keep your pipeline clean.</dd>
            </div>
          </dl>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm p-6">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">Need More Help?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Support
              </h3>
              <p className="text-sm text-gray-700 mb-2">Get help from our support team</p>
              <a href="mailto:info@jobwall.co.uk" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                info@jobwall.co.uk →
              </a>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                <Video className="w-5 h-5 text-purple-600" />
                Video Tutorials
              </h3>
              <p className="text-sm text-gray-700 mb-2">Watch step-by-step guides</p>
              <a href="https://jobwall.co.uk" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                Coming soon →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}


