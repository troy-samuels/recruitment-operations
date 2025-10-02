"use client"
import React from 'react'
import { trackEvent } from '@/lib/metrics'
import { getSupabaseClient } from '@/lib/supabaseClient'

export default function TeamPage() {
  const supabase = getSupabaseClient()
  const [members, setMembers] = React.useState<Array<{ id: string; email: string; full_name: string | null; role: string | null }>>([])
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState<string | null>(null)
  const [removing, setRemoving] = React.useState<string | null>(null)
  const [changing, setChanging] = React.useState<string | null>(null)
  const [inviteInput, setInviteInput] = React.useState('')
  const [seatsLeft, setSeatsLeft] = React.useState<number>(0)

  const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      setErr(null)
      try {
        const { data, error } = await supabase.from('profiles').select('id, email, full_name, role').eq('workspace_id', workspaceId)
        if (error) throw error
        setMembers(data || [])
        // Prefer server billing status; fallback to local settings
        try {
          const res = await fetch(`/api/billing/status?workspaceId=${workspaceId}`)
          if (res.ok) {
            const j = await res.json()
            const purchased = Math.max(0, Number(j?.seats || 0))
            const used = (data || []).length
            setSeatsLeft(Math.max(0, purchased - used))
          } else {
            const purchased = Math.max(1, Number(localStorage.getItem('seats_purchased') || '1'))
            const used = (data || []).length
            setSeatsLeft(Math.max(0, purchased - used))
          }
        } catch {
          const purchased = Math.max(1, Number(localStorage.getItem('seats_purchased') || '1'))
          const used = (data || []).length
          setSeatsLeft(Math.max(0, purchased - used))
        }
      } catch (e: any) {
        setErr(e?.message || 'Failed to load team')
      } finally {
        setLoading(false)
      }
    }
    if (workspaceId) load()
  }, [workspaceId])

  const removeMember = async (email: string) => {
    if (!confirm(`Remove ${email} from this workspace?`)) return
    setRemoving(email)
    try {
      const res = await fetch('/api/team/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, workspaceId }) })
      const j = await res.json()
      if (!res.ok || j?.error) throw new Error(j?.error || 'Failed')
      setMembers(prev => prev.filter(m => m.email !== email))
      try { trackEvent('team_member_removed', { email }) } catch {}
    } catch (e: any) {
      alert(e?.message || 'Failed to remove')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Team</h1>
        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : (
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{m.full_name || m.email}</div>
                    <div className="text-xs text-gray-500">{m.email} • {m.role || 'member'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={m.role || 'member'} onChange={async (e)=>{
                      const newRole = e.target.value
                      setChanging(m.email)
                      try {
                        const res = await fetch('/api/team/role', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: m.email, role: newRole }) })
                        const j = await res.json()
                        if (!res.ok || j?.error) throw new Error(j?.error || 'Failed to update role')
                        setMembers(prev => prev.map(x => x.id===m.id ? { ...x, role: newRole } : x))
                        try { trackEvent('team_role_changed', { email: m.email, role: newRole }) } catch {}
                      } catch (e: any) {
                        alert(e?.message || 'Failed to update role')
                      } finally {
                        setChanging(null)
                      }
                    }} className="text-sm border border-gray-200 rounded-md px-2 py-1">
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                    <button
                      className="px-3 py-1.5 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      disabled={removing === m.email}
                      onClick={()=> removeMember(m.email)}
                    >
                      {removing === m.email ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
              {members.length === 0 && <div className="text-sm text-gray-500">No team members yet.</div>}
              <div className="pt-3 border-t mt-4 flex items-center gap-2">
                <input value={inviteInput} onChange={(e)=> setInviteInput(e.target.value)} placeholder="invite@company.co.uk" className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
                <button disabled={seatsLeft<=0} className="px-3 py-1.5 rounded-md bg-accent-500 text-white text-sm hover:bg-accent-600 disabled:opacity-60" onClick={async ()=>{
                  const cleaned = inviteInput.trim()
                  if (!cleaned) return
                  try {
                    const res = await fetch('/api/team/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emails: [cleaned] }) })
                    const j = await res.json()
                    if (!res.ok || !j?.ok) throw new Error(j?.error || 'Failed to send invite')
                    alert('Invite sent')
                    setInviteInput('')
                    try { trackEvent('team_invite_sent', { email: cleaned }) } catch {}
                    setSeatsLeft(x => Math.max(0, x - 1))
                  } catch (e: any) {
                    alert(e?.message || 'Failed to send invite')
                  }
                }}>Invite</button>
                {seatsLeft<=0 && (
                  <button className="px-3 py-1.5 rounded-md border border-gray-200 text-sm hover:bg-gray-50" onClick={()=> window.location.href='/billing'}>Purchase seats</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


