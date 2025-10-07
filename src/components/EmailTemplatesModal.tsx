'use client'

import React, { useState } from 'react'
import { X, Copy, Check, Search, Mail, User, Calendar, FileText, ThumbsDown } from 'lucide-react'

interface EmailTemplate {
  id: string
  category: string
  title: string
  subject: string
  body: string
}

const templates: EmailTemplate[] = [
  {
    id: '1',
    category: 'Candidate Outreach',
    title: 'Initial Candidate Contact',
    subject: 'Exciting {role_title} opportunity at {company_name}',
    body: `Hi {candidate_name},

I hope this message finds you well. I came across your profile and was impressed by your experience in {relevant_skill}.

I'm currently working with {company_name}, a {company_description}, and they're looking for a {role_title}. The role offers {key_benefit} and a competitive salary of {salary_range}.

Would you be interested in a brief call to discuss this opportunity? I'd love to share more details.

Best regards,
{your_name}
{your_company}
{your_phone}`
  },
  {
    id: '2',
    category: 'Candidate Outreach',
    title: 'Follow-up After No Response',
    subject: 'Quick follow-up: {role_title} at {company_name}',
    body: `Hi {candidate_name},

I wanted to follow up on my previous message regarding the {role_title} opportunity at {company_name}.

I understand you're likely busy, but this role offers excellent growth potential and the team is moving quickly with interviews. If you're interested or would like more information, I'd be happy to arrange a quick 10-minute call.

Let me know if this week works for you.

Best,
{your_name}`
  },
  {
    id: '3',
    category: 'Client Updates',
    title: 'Candidate Submission',
    subject: '{candidate_name} - {role_title} Submission',
    body: `Hi {client_name},

I'm pleased to submit {candidate_name} for your {role_title} position.

Key highlights:
• {highlight_1}
• {highlight_2}
• {highlight_3}

{candidate_name} is currently {availability_status} and very interested in this opportunity. Their CV is attached for your review.

I'd recommend moving quickly as they're also speaking with other companies. When would be a good time for an initial interview?

Best regards,
{your_name}`
  },
  {
    id: '4',
    category: 'Client Updates',
    title: 'Client Follow-up for Feedback',
    subject: 'Following up: {candidate_name} for {role_title}',
    body: `Hi {client_name},

I hope you had a chance to review {candidate_name}'s CV for the {role_title} position. I submitted it on {submission_date} and wanted to check if you have any initial thoughts.

{candidate_name} has expressed strong interest in the role and I believe they'd be an excellent fit based on {reason}.

Could we schedule a brief call to discuss next steps?

Looking forward to your feedback.

Best,
{your_name}`
  },
  {
    id: '5',
    category: 'Interview',
    title: 'Interview Confirmation (Candidate)',
    subject: 'Interview Confirmed: {role_title} at {company_name}',
    body: `Hi {candidate_name},

Great news! I've scheduled your interview for the {role_title} position at {company_name}.

Interview Details:
• Date: {interview_date}
• Time: {interview_time}
• Duration: {interview_duration}
• Format: {interview_format}
• Interviewer(s): {interviewer_names}
• Location/Link: {interview_location}

Preparation tips:
• Review the job description carefully
• Research {company_name}'s recent news and projects
• Prepare questions about {topic}
• {additional_tip}

Please confirm your attendance, and let me know if you have any questions. Good luck!

Best,
{your_name}`
  },
  {
    id: '6',
    category: 'Interview',
    title: 'Interview Confirmation (Client)',
    subject: '{candidate_name} Interview - {interview_date} at {interview_time}',
    body: `Hi {client_name},

This confirms that {candidate_name} is scheduled for an interview on {interview_date} at {interview_time}.

Quick reminder of why {candidate_name} is a strong fit:
• {strength_1}
• {strength_2}
• {strength_3}

Key areas to explore during the interview:
• {area_1}
• {area_2}

I'll follow up with both parties after the interview. Please let me know if you need to reschedule or have any questions.

Best regards,
{your_name}`
  },
  {
    id: '7',
    category: 'Reference Requests',
    title: 'Reference Request',
    subject: 'Reference request for {candidate_name}',
    body: `Hi {referee_name},

I hope this email finds you well. I'm reaching out regarding {candidate_name}, who has listed you as a professional reference for a {role_title} position.

Would you be available for a brief 10-minute reference call this week? I'd like to discuss:
• {candidate_name}'s role and responsibilities while working with you
• Key strengths and areas of expertise
• Overall performance and work ethic

Please let me know a few times that work for you, and I'll send a calendar invitation.

Thank you for your time.

Best regards,
{your_name}
{your_company}
{your_phone}`
  },
  {
    id: '8',
    category: 'Rejection',
    title: 'Candidate Rejection (Respectful)',
    subject: 'Update on your application for {role_title}',
    body: `Hi {candidate_name},

Thank you for your interest in the {role_title} position at {company_name} and for taking the time to speak with me.

After careful consideration, the client has decided to move forward with other candidates whose experience more closely aligns with their specific requirements at this time.

However, I was impressed by {positive_attribute} and would love to keep in touch for future opportunities. Would you be open to me reaching out when a more suitable role becomes available?

Thank you again for your time, and I wish you the very best in your job search.

Best regards,
{your_name}`
  },
  {
    id: '9',
    category: 'Rejection',
    title: 'Client Rejection Notification',
    subject: 'Update: {candidate_name} not selected for {role_title}',
    body: `Hi {client_name},

Thank you for reviewing {candidate_name} for the {role_title} position.

I've informed {candidate_name} of your decision and provided professional feedback. I've also asked if they'd be open to considering other opportunities with {company_name} in the future.

I'm continuing to source additional candidates and will send over {number} more CVs by {date}.

Looking forward to finding the perfect fit for this role.

Best,
{your_name}`
  },
  {
    id: '10',
    category: 'Candidate Outreach',
    title: 'LinkedIn Connection Request',
    subject: '',
    body: `Hi {candidate_name},

I'm a recruitment consultant specializing in {sector} roles across {location}. I came across your profile and was impressed by your experience at {company_name}.

I work with some fantastic {industry} companies and regularly come across opportunities that might align with your background. I'd love to connect and keep you in mind for relevant roles.

Looking forward to connecting!

{your_name}`
  }
]

const categories = ['All', 'Candidate Outreach', 'Client Updates', 'Interview', 'Reference Requests', 'Rejection']

interface EmailTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailTemplatesModal({ isOpen, onClose }: EmailTemplatesModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!isOpen) return null

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.body.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Candidate Outreach': return <User className="w-4 h-4" />
      case 'Client Updates': return <Mail className="w-4 h-4" />
      case 'Interview': return <Calendar className="w-4 h-4" />
      case 'Reference Requests': return <FileText className="w-4 h-4" />
      case 'Rejection': return <ThumbsDown className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const copyToClipboard = (template: EmailTemplate) => {
    const fullEmail = template.subject
      ? `Subject: ${template.subject}\n\n${template.body}`
      : template.body

    navigator.clipboard.writeText(fullEmail)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary-500">Email Templates</h2>
            <p className="text-sm text-gray-500 mt-1">Pre-built templates to save you time</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No templates found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-accent-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      <div>
                        <h3 className="font-heading font-semibold text-primary-500">{template.title}</h3>
                        <p className="text-xs text-gray-500">{template.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors text-sm"
                    >
                      {copiedId === template.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  {template.subject && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-gray-600">Subject:</span>
                      <p className="text-sm text-gray-700 font-medium">{template.subject}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {template.body}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <span className="font-semibold">Merge fields:</span> Use {'{'}candidate_name{'}'}, {'{'}company_name{'}'}, {'{'}role_title{'}'}, etc.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-600 text-center">
            💡 Tip: Replace merge fields like {'{'}candidate_name{'}'} with actual values before sending
          </p>
        </div>
      </div>
    </div>
  )
}
