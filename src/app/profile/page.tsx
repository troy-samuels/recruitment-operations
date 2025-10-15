"use client"
import React from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { trackEvent } from '@/lib/metrics'

export default function ProfilePage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('admin')
  const [tier, setTier] = React.useState('individual')
  const [seats, setSeats] = React.useState({ purchased: 1, used: 1, left: 0 })
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const supabase = React.useMemo(() => getSupabaseClient(), [])

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
    try {
      if (email) (window as any)?.datafast?.('identify', { user_id: email, name })
    } catch {}
    // Fetch avatar_url from profiles if available
    const fetchAvatar = async () => {
      try {
        const auth = await supabase.auth.getUser()
        const uid = auth.data.user?.id
        if (!uid) return
        const { data, error } = await supabase.from('profiles').select('avatar_url').eq('id', uid).maybeSingle()
        if (!error && data?.avatar_url) setAvatarUrl(data.avatar_url)
      } catch {}
    }
    fetchAvatar()
  }, [])

  const handlePickFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data: userRes } = await supabase.auth.getUser()
      const uid = userRes.user?.id
      if (!uid) return
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `avatars/${uid}/avatar-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = publicUrl.publicUrl
      const { error: updErr } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', uid)
      if (updErr) throw updErr
      setAvatarUrl(url)
      try { trackEvent('avatar_uploaded'); (window as any)?.datafast?.('avatar_uploaded') } catch {}
    } catch (err) {
      // no-op; could show a toast in future
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">{initials}</div>
            )}
            <div>
              <div className="text-gray-900 font-medium">{name}</div>
              <div className="text-gray-500 text-sm">{email}</div>
            </div>
            <div className="ml-auto">
              <button onClick={handlePickFile} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50" disabled={uploading}>{uploading ? 'Uploading…' : 'Change avatar'}</button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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


