import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    // Simple rate limiter: 60 req/min per IP
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const key = `leaderboard:${ip}`
      // @ts-expect-error global store
      const store = (globalThis.__rate || (globalThis.__rate = new Map<string, { c: number; t: number }>()));
      const nowTs = Date.now()
      const cur = store.get(key)
      if (!cur || nowTs - cur.t > 60_000) {
        store.set(key, { c: 1, t: nowTs })
      } else {
        if (cur.c >= 60) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
        cur.c += 1
      }
    } catch {}

    const { searchParams } = new URL(req.url)
    const type = (searchParams.get('type') || 'teammates') as 'teammates'|'companies'
    const range = (searchParams.get('range') || '30d') as '7d'|'30d'|'90d'
    const workspaceId = searchParams.get('workspaceId')
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 10)))
    const offset = Math.max(0, Number(searchParams.get('offset') || 0))
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    const admin = getSupabaseAdmin()
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - (range === '7d' ? 7 : range === '30d' ? 30 : 90) + 1)

    if (type === 'teammates') {
      // Placements per user in range
      const { data, error } = await admin
        .from('events')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('event_name', 'placement_created')
        .gte('ts', start.toISOString())
        .lte('ts', now.toISOString())
      if (error) return NextResponse.json({ rows: [], total: 0 })
      const agg: Record<string, number> = {}
      for (const row of data || []) {
        const uid = row.user_id as string | null
        if (!uid) continue
        agg[uid] = (agg[uid] || 0) + 1
      }
      let rows = Object.entries(agg).map(([userId, placements]) => ({ userId, placements }))
      rows.sort((a,b) => (b.placements - a.placements))
      const total = rows.length
      rows = rows.slice(offset, offset + limit)
      return NextResponse.json({ rows, total })
    }

    // Companies: conversion = placements / cv_sent
    const { data: cv, error: ecv } = await admin
      .from('events')
      .select('company')
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'cv_sent')
      .gte('ts', start.toISOString())
      .lte('ts', now.toISOString())
    if (ecv) return NextResponse.json({ rows: [], total: 0 })

    const { data: pl, error: epl } = await admin
      .from('events')
      .select('company')
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'placement_created')
      .gte('ts', start.toISOString())
      .lte('ts', now.toISOString())
    if (epl) return NextResponse.json({ rows: [], total: 0 })

    const cvCount: Record<string, number> = {}
    for (const row of cv || []) {
      if (!row.company) continue
      cvCount[row.company] = (cvCount[row.company] || 0) + 1
    }
    const placementsCount: Record<string, number> = {}
    for (const row of pl || []) {
      if (!row.company) continue
      placementsCount[row.company] = (placementsCount[row.company] || 0) + 1
    }
    const companies = new Set([...Object.keys(cvCount), ...Object.keys(placementsCount)])
    let rows = Array.from(companies).map(company => {
      const cvs = cvCount[company] || 0
      const plc = placementsCount[company] || 0
      const conversionPct = cvs === 0 ? 0 : Math.round((plc / cvs) * 100)
      return { company, conversionPct, placements: plc }
    })
    rows.sort((a,b)=> (b.conversionPct - a.conversionPct) || (b.placements - a.placements))
    const total = rows.length
    rows = rows.slice(offset, offset + limit)
    return NextResponse.json({ rows, total })
  } catch (e: any) {
    return NextResponse.json({ rows: [], total: 0 })
  }
}


