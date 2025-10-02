'use client'

import React from 'react'
import { X, Mail, LogIn } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

interface SignupModalProps {
  open: boolean
  onClose: () => void
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = React.useState('')
  const { signInWithGoogle, signInWithMicrosoft, signInWithEmail } = useAuth()
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="font-heading text-lg font-semibold">Start your 14‑day free trial</div>
          <button className="p-1.5 text-gray-500 hover:text-gray-700" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <p className="text-sm text-gray-600 mb-4">No card required now. Sign in with your work email to get started in under 2 minutes.</p>

        <div className="space-y-3">
          <button disabled={submitting} onClick={async () => {
            try {
              setError(null); setSubmitting(true)
              await signInWithGoogle()
            } catch (e:any) {
              setError(e?.message || 'Sign in failed')
            } finally { setSubmitting(false) }
          }} className="w-full inline-flex items-center justify-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 hover:opacity-90 disabled:opacity-60">
            <LogIn className="w-4 h-4" /> Continue with Google
          </button>
          <button disabled={submitting} onClick={async () => {
            try {
              setError(null); setSubmitting(true)
              await signInWithMicrosoft()
            } catch (e:any) {
              setError(e?.message || 'Sign in failed')
            } finally { setSubmitting(false) }
          }} className="w-full inline-flex items-center justify-center gap-2 bg-[#2F2F2F] text-white rounded-lg px-4 py-2.5 hover:opacity-90 disabled:opacity-60">
            <LogIn className="w-4 h-4" /> Continue with Microsoft
          </button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={async (e)=>{ e.preventDefault(); try {
            setError(null); setSubmitting(true)
            await signInWithEmail(email)
          } catch (e:any) { setError(e?.message || 'Check your email link failed') } finally { setSubmitting(false) }
          }} className="space-y-2">
            <label className="text-xs text-gray-600">Work email</label>
            <input
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              type="email"
              placeholder="you@company.co.uk"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button disabled={submitting} type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 disabled:opacity-60">
              <Mail className="w-4 h-4" /> Continue with email
            </button>
          </form>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {submitting && <p className="text-xs text-gray-500">Processing…</p>}
        </div>

        <p className="text-xs text-gray-500 mt-4">By continuing you agree to our Terms and Privacy Policy.</p>
      </div>
    </div>
  )
}

export default SignupModal



