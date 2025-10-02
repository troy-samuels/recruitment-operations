import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

function namesForMetric(metric?: string): string[] | null {
  switch (metric) {
    case 'placements':
      return ['placement_created']
    case 'interviews':
      return ['interview_scheduled']
    case 'cv_sent':
      return ['cv_sent']
    case 'tasks_completed':
      return ['task_completed']
    default:
      return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')
    const date = searchParams.get('date') // YYYY-MM-DD (optional)
    const range = (searchParams.get('range') || '30d') as '7d'|'30d'|'90d'
    const metric = searchParams.get('metric') || undefined
    const userId = searchParams.get('userId') || undefined
    const company = searchParams.get('company') || undefined
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    let start: Date
    let end: Date
    if (date) {
      start = new Date(`${date}T00:00:00.000Z`)
      end = new Date(start)
      end.setUTCDate(start.getUTCDate() + 1)
    } else {
      end = new Date()
      start = new Date(end)
      const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
      start.setDate(end.getDate() - days + 1)
    }

    const admin = getSupabaseAdmin()
    let query = admin
      .from('events')
      .select('event_name, ts, company, stage, user_id')
      .eq('workspace_id', workspaceId)
      .gte('ts', start.toISOString())
      .lt('ts', end.toISOString())
      .order('ts', { ascending: false })
      .limit(200)

    const names = namesForMetric(metric || undefined)
    if (names) query = query.in('event_name', names)
    if (userId) query = query.eq('user_id', userId)
    if (company) query = query.eq('company', company)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const events = (data || []).map((r: any) => ({
      name: r.event_name as string,
      ts: r.ts as string,
      company: r.company as string | null,
      stage: r.stage as string | null,
      userId: r.user_id as string | null,
    }))
    return NextResponse.json({ events })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


