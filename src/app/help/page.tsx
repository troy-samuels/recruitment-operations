"use client"
import React from 'react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Help</h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="text-sm text-gray-700">For support, email <a href="mailto:info@jobwall.co.uk" className="text-blue-600">info@jobwall.co.uk</a>.</div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Shortcuts</h2>
            <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
              <li>Press “/” to focus search (coming soon)</li>
              <li>“+” to open Add Role</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">FAQs</h2>
            <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
              <li>How do I invite teammates? Use the top-right Invite button (Team tier).</li>
              <li>How are urgent actions calculated? Based on SLAs set in Settings.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


