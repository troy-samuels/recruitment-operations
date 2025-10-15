'use client'

import { getSupabaseClient } from '@/lib/supabaseClient'

export type RoleRecordInput = {
  id?: string
  jobTitle: string
  company: string
  stage?: number
  salary?: string
  controlLevel?: 'high' | 'medium' | 'low'
  controlScore?: number
  flags?: {
    hasHmContact?: boolean
    interviewsScheduled?: boolean
    exclusive?: boolean
  }
  assignees?: string[]
  employmentType?: string
  owner?: string
}

export type CandidateRecordInput = {
  id: string
  name: string
  callBooked?: boolean
  refsCount?: number
}

const FALLBACK_ID_PREFIX = 'temp-'

function getWorkspaceId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('workspace_id')
}

function ensureUuid(id?: string): string {
  if (id && !id.startsWith(FALLBACK_ID_PREFIX)) return id
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `role-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function serializeMetadata(input: RoleRecordInput) {
  const metadata = {
    salary: input.salary || null,
    controlLevel: input.controlLevel || null,
    controlScore: input.controlScore ?? null,
    flags: input.flags || {},
    assignees: input.assignees || [],
    employmentType: input.employmentType || null,
    owner: input.owner || null,
  }
  try {
    return JSON.stringify(metadata)
  } catch {
    return JSON.stringify({})
  }
}

export async function createRoleRecord(input: RoleRecordInput) {
  const supabase = getSupabaseClient()
  const workspaceId = getWorkspaceId()
  if (!workspaceId) throw new Error('Missing workspace identifier')

  const id = ensureUuid(input.id)
  const nowIso = new Date().toISOString()
  const payload: Record<string, any> = {
    id,
    workspace_id: workspaceId,
    title: input.jobTitle,
    job_title: input.jobTitle,
    company: input.company,
    company_name: input.company,
    stage: input.stage ?? 0,
    notes: serializeMetadata(input),
    created_at: nowIso,
    updated_at: nowIso,
  }

  const { error } = await supabase.from('roles').insert(payload)
  if (error) throw error
  return id
}

export async function updateRoleRecord(id: string, input: Partial<RoleRecordInput>) {
  const supabase = getSupabaseClient()
  const updates: Record<string, any> = {}
  if (input.jobTitle !== undefined) {
    updates.title = input.jobTitle
    updates.job_title = input.jobTitle
  }
  if (input.company !== undefined) {
    updates.company = input.company
    updates.company_name = input.company
  }
  if (input.stage !== undefined) {
    updates.stage = input.stage
  }
  if (
    input.salary !== undefined ||
    input.controlLevel !== undefined ||
    input.controlScore !== undefined ||
    input.flags !== undefined ||
    input.assignees !== undefined ||
    input.employmentType !== undefined ||
    input.owner !== undefined
  ) {
    updates.notes = serializeMetadata({
      jobTitle: input.jobTitle || '',
      company: input.company || '',
      salary: input.salary,
      controlLevel: input.controlLevel,
      controlScore: input.controlScore,
      flags: input.flags,
      assignees: input.assignees,
      employmentType: input.employmentType,
      owner: input.owner,
    })
  }
  if (Object.keys(updates).length === 0) return
  updates.updated_at = new Date().toISOString()
  const { error } = await supabase.from('roles').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteRoleRecord(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('roles').delete().eq('id', id)
  if (error) throw error
}

export async function fetchRoleCandidates(roleIds: string[]) {
  const supabase = getSupabaseClient()
  if (roleIds.length === 0) return {}
  const { data, error } = await supabase
    .from('role_candidates')
    .select('id, role_id, full_name, call_booked, refs_count')
    .in('role_id', roleIds)
  if (error) throw error

  const byRole: Record<string, CandidateRecordInput[]> = {}
  for (const row of data || []) {
    const roleId = row.role_id as string
    if (!byRole[roleId]) byRole[roleId] = []
    byRole[roleId].push({
      id: row.id,
      name: row.full_name,
      callBooked: Boolean(row.call_booked),
      refsCount: typeof row.refs_count === 'number' ? row.refs_count : 0,
    })
  }
  return byRole
}

export function normaliseCandidateInput(candidate: CandidateRecordInput): CandidateRecordInput {
  return {
    id: candidate.id.startsWith(FALLBACK_ID_PREFIX) ? ensureUuid() : candidate.id,
    name: candidate.name.trim(),
    callBooked: Boolean(candidate.callBooked),
    refsCount: Number.isFinite(candidate.refsCount) ? Number(candidate.refsCount) : 0,
  }
}

export async function syncRoleCandidates(
  roleId: string,
  nextCandidates: CandidateRecordInput[],
  previousCandidates: CandidateRecordInput[]
) {
  const supabase = getSupabaseClient()
  const workspaceId = getWorkspaceId()
  if (!workspaceId) throw new Error('Missing workspace identifier')

  const previousById = new Map(previousCandidates.map(candidate => [candidate.id, candidate]))
  const nextById = new Map(nextCandidates.map(candidate => [candidate.id, candidate]))

  const toDelete = previousCandidates
    .filter(candidate => !nextById.has(candidate.id))
    .map(candidate => candidate.id)

  const toUpsert: Array<{
    id: string
    role_id: string
    workspace_id: string
    full_name: string
    call_booked: boolean
    refs_count: number
    updated_at: string
  }> = []

  const nowIso = new Date().toISOString()
  nextCandidates.forEach(candidate => {
    const normalised = normaliseCandidateInput(candidate)
    const previous = previousById.get(normalised.id)
    const hasChanged =
      !previous ||
      previous.name !== normalised.name ||
      Boolean(previous.callBooked) !== Boolean(normalised.callBooked) ||
      Number(previous.refsCount || 0) !== Number(normalised.refsCount || 0)

    if (hasChanged) {
      toUpsert.push({
        id: normalised.id,
        role_id: roleId,
        workspace_id: workspaceId,
        full_name: normalised.name,
        call_booked: Boolean(normalised.callBooked),
        refs_count: Number(normalised.refsCount || 0),
        updated_at: nowIso,
      })
    }
  })

  if (toUpsert.length > 0) {
    const { error } = await supabase.from('role_candidates').upsert(toUpsert, { onConflict: 'id' })
    if (error) throw error
  }

  if (toDelete.length > 0) {
    const { error } = await supabase.from('role_candidates').delete().in('id', toDelete)
    if (error) throw error
  }

  return nextCandidates.map(candidate => normaliseCandidateInput(candidate))
}

export function parseRoleMetadata(notes?: string | null) {
  if (!notes) return {}
  try {
    const parsed = JSON.parse(notes)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}
