"use client"
import React from 'react'

export default function ProfilePage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('admin')
  const [tier, setTier] = React.useState('individual')
  const [seats, setSeats] = React.useState({ purchased: 1, used: 1, left: 0 })

  const initials = React.useMemo(() => {
    const base = (name && name.trim().length>0) ? name : 'YN'
    try {
      const parts = base.trim().split(/\s+/).filter(Boolean)
      if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
      return (parts[0][0] + parts[1][0]).toUpperCase()
    } catch {
      return 'YN'
    }
  }, [name])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    setName(localStorage.getItem('user_name') || 'Your Name')
    setEmail(localStorage.getItem('user_email') || 'you@company.co.uk')
    const r = localStorage.getItem('user_role') || 'admin'
    const t = localStorage.getItem('subscription_tier') || 'individual'
    const purchased = Number(localStorage.getItem('seats_purchased') || (t === 'team' ? 3 : 1))
    let used = 1
    try { used = Math.max(1, 1 + (JSON.parse(localStorage.getItem('pending_invites') || '[]') as string[]).length) } catch {}
    setRole(r)
    setTier(t)
    setSeats({ purchased, used, left: Math.max(0, purchased - used) })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">{initials}</div>
            <div>
              <div className="text-gray-900 font-medium">{name}</div>
              <div className="text-gray-500 text-sm">{email}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Role</div>
              <div className="text-gray-900 font-medium capitalize">{role}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Workspace tier</div>
              <div className="text-gray-900 font-medium capitalize">{tier}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Seats</div>
              <div className="text-gray-900 font-medium">{seats.used}/{seats.purchased} <span className="text-gray-500">({seats.left} left)</span></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/update-password" className="text-sm text-blue-600 hover:text-blue-700">Update password</a>
            <span className="text-gray-300">•</span>
            <a href="/reset" className="text-sm text-blue-600 hover:text-blue-700">Send reset link</a>
          </div>
        </div>
      </div>
    </div>
  )
}


