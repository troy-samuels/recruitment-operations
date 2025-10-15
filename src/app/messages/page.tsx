"use client"
import React from 'react'
import Protected from '@/components/Protected'
import WorkspaceProvider from '@/components/WorkspaceProvider'
import DashboardLayout from '@/components/DashboardLayout'

type Thread = {
  id: string
  name: string
  unread: number
}

type ChatMessage = {
  id: string
  threadId: string
  author: string
  body: string
  createdAt: string
}

const demoThreads: Thread[] = [
  { id: 't1', name: 'General', unread: 2 },
  { id: 't2', name: 'Client: TechFlow', unread: 0 },
  { id: 't3', name: 'DM • Sarah', unread: 1 },
]

const demoMessages: ChatMessage[] = [
  { id: 'm1', threadId: 't1', author: 'You', body: 'Welcome to Jobwall messages 👋', createdAt: new Date().toISOString() },
  { id: 'm2', threadId: 't1', author: 'Alex', body: 'Let’s keep client updates in this thread.', createdAt: new Date().toISOString() },
  { id: 'm3', threadId: 't3', author: 'Sarah', body: 'Can you share CV status for Emma?', createdAt: new Date().toISOString() },
]

export default function MessagesPage() {
  const [threads, setThreads] = React.useState<Thread[]>(demoThreads)
  const [activeId, setActiveId] = React.useState<string>('t1')
  const [messages, setMessages] = React.useState<ChatMessage[]>(demoMessages)
  const [input, setInput] = React.useState('')

  const activeMessages = messages.filter(m => m.threadId === activeId)

  const send = () => {
    const body = input.trim()
    if (!body) return
    const msg: ChatMessage = { id: `m${Date.now()}`, threadId: activeId, author: 'You', body, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, msg])
    setInput('')
  }

  return (
    <Protected>
      <WorkspaceProvider>
        <DashboardLayout>
          <div className="h-full flex rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Threads list */}
            <aside className="w-64 hidden md:flex flex-col border-r border-gray-200 bg-gray-50">
              <div className="px-4 py-3 border-b border-gray-200 font-body text-sm text-gray-600">Threads</div>
              <div className="flex-1 overflow-auto">
                {threads.map(t => (
                  <button key={t.id} onClick={()=> setActiveId(t.id)} className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-white ${activeId===t.id?'bg-white':''}`}>
                    <span className="font-body text-sm text-gray-900 truncate">{t.name}</span>
                    {t.unread>0 && <span className="ml-auto text-xs bg-accent-500 text-white rounded-full px-2 py-0.5">{t.unread}</span>}
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-white">New thread</button>
              </div>
            </aside>

            {/* Messages pane */}
            <section className="flex-1 flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="font-heading text-base text-gray-900">{threads.find(t=>t.id===activeId)?.name || 'Messages'}</div>
              </div>
              {/* List */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {activeMessages.map(m => (
                  <div key={m.id} className="max-w-xl">
                    <div className="text-xs text-gray-500 mb-1">{m.author} • {new Date(m.createdAt).toLocaleTimeString()}</div>
                    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900">{m.body}</div>
                  </div>
                ))}
              </div>
              {/* Composer */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Write a message…" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <button onClick={send} className="px-4 py-2 rounded-md bg-accent-500 text-white text-sm hover:bg-accent-600">Send</button>
                </div>
              </div>
            </section>
          </div>
        </DashboardLayout>
      </WorkspaceProvider>
    </Protected>
  )
}



