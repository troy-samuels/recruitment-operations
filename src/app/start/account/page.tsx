"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseClient'

export default function StartAccountPage() {
  const supabase = getSupabaseClient()
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [agree, setAgree] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const q = typeof window !== 'undefined' ? window.location.search : ''
        router.replace(`/start/seats${q || ''}`)
      }
    })
  }, [router, supabase])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agree) return
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (error) throw error
      // If email confirmation is off, session exists; if on, we still continue and let them verify
      if (data.user?.id) {
        try {
          await fetch('/api/provision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id, email, name })
          })
        } catch {}
      }
      const q = typeof window !== 'undefined' ? window.location.search : ''
      router.replace(`/start/seats${q || ''}`)
    } catch (e: any) {
      alert(e?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-cream-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h1 className="font-heading text-2xl text-primary-500">Create your account</h1>
        <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Full name" className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
        <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="Work email" className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
        <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm" />
        <label className="flex items-start gap-2 text-sm text-primary-500">
          <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="mt-1" />
          <span>I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.</span>
        </label>
        <button disabled={!agree || loading} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded-lg px-4 py-2 font-body disabled:opacity-60">{loading?'Creating…':'Continue'}</button>
      </form>
    </div>
  )
}


