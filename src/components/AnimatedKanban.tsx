'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { User, Briefcase, Phone, Calendar, Pencil, X, Plus, MoreHorizontal } from 'lucide-react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  closestCorners,
  getFirstCollision,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { useWorkspace } from '@/components/WorkspaceProvider'
import { trackEvent } from '@/lib/metrics'

interface JobCard {
  id: string
  jobTitle: string
  candidateName: string
  stage: number
  salary: string
  company: string
  owner?: string
  assignees?: string[]
  controlLevel?: 'high' | 'medium' | 'low'
  createdAt?: number
  stageUpdatedAt?: number
}

interface CandidateRow {
  id: string
  name: string
  callBooked: boolean
  refsCount: number
}

interface TaskItem {
  id: string
  title: string
  done: boolean
  dueAt?: number
  status?: 'open' | 'in_progress' | 'blocked' | 'done'
}

// Utility: derive initials from a name/email and a stable color
function getInitials(label: string | undefined): string {
  if (!label) return ''
  const parts = label.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function colorFromLabel(label: string | undefined): string {
  if (!label) return '#6B7280' // gray-500
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 70% 45%)`
}

function accentColorFromLevel(level: 'high' | 'medium' | 'low' | undefined): string {
  if (level === 'high') return '#16a34a'
  if (level === 'medium') return '#f59e0b'
  return '#9ca3af'
}

// Lightweight client-response learning stored locally per company
interface ClientResponseStat {
  count: number
  avgMs: number
  lastMs?: number
  updatedAt: number
}

function loadClientResponseStats(): Record<string, ClientResponseStat> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('client_response_stats_v1')
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveClientResponseStats(stats: Record<string, ClientResponseStat>) {
  try { localStorage.setItem('client_response_stats_v1', JSON.stringify(stats)) } catch {}
}

function recordClientResponse(company: string | undefined, durationMs: number) {
  if (!company || !isFinite(durationMs) || durationMs <= 0) return
  const stats = loadClientResponseStats()
  const prev = stats[company]
  const now = Date.now()
  let next: ClientResponseStat
  if (prev && isFinite(prev.avgMs) && prev.count >= 1) {
    const alpha = 0.3 // EMA weight
    const ema = alpha * durationMs + (1 - alpha) * prev.avgMs
    next = { count: Math.min(prev.count + 1, 1000), avgMs: ema, lastMs: durationMs, updatedAt: now }
  } else {
    next = { count: 1, avgMs: durationMs, lastMs: durationMs, updatedAt: now }
  }
  stats[company] = next
  saveClientResponseStats(stats)
}

function getRecommendedChaseMs(company: string | undefined): number {
  const baseMs = 48 * 3600 * 1000
  if (!company) return baseMs
  const stats = loadClientResponseStats()
  const s = stats[company]
  if (!s || !isFinite(s.avgMs) || s.avgMs <= 0) return baseMs
  // Aim to follow up before typical response; clamp to sensible bounds
  const minMs = 24 * 3600 * 1000
  const maxMs = 72 * 3600 * 1000
  const target = Math.round(0.75 * s.avgMs)
  return Math.max(minMs, Math.min(maxMs, target))
}

interface DraggableCardProps {
  card: JobCard
  isOverlay?: boolean
  onOpenEditor?: (id: string) => void
  density?: 'comfortable' | 'compact'
  tasksCount?: number
}

interface DroppableColumnProps {
  stage: number
  title: string
  icon: React.ComponentType<any>
  color: string
  cards: JobCard[]
  isOver?: boolean
  onOpenEditor?: (id: string) => void
  density?: 'comfortable' | 'compact'
  taskCountByCard?: Record<string, number>
}

// Pure presentational component for DragOverlay - NO positioning logic
const OverlayCard: React.FC<{ card: JobCard }> = ({ card }) => {
  return (
    <div
      className="bg-blue-50 rounded-lg p-3 border-2 border-blue-500 shadow-2xl cursor-grabbing"
      data-testid="overlay-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-body text-sm font-bold text-gray-900 truncate mb-1">
            {card.jobTitle}
          </h4>
          <p className="font-body text-xs text-gray-600 truncate">
            {card.company}
          </p>
          <p className="font-body text-xs text-gray-500 truncate mt-1">
            {card.candidateName}
          </p>
          <p className="font-body text-xs font-medium text-green-600 mt-2">
            {card.salary}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, isOverlay = false, onOpenEditor, density = 'comfortable', tasksCount = 0 }) => {
  // If this is an overlay, use the pure presentational component
  if (isOverlay) {
    return <OverlayCard card={card} />
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
    data: {
      type: 'card',
      card: card,
    },
  })

  // Debug logging for draggable card registration
  useEffect(() => {
    console.log('🎯 DraggableCard registered:', {
      id: card.id,
      title: card.jobTitle,
      stage: card.stage,
      isDragging,
      hasListeners: !!listeners,
      timestamp: new Date().toLocaleTimeString()
    })
  }, [card.id, card.jobTitle, card.stage, isDragging, listeners])

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  }

  // Clean CSS classes without transform conflicts
  // CRITICAL: Never use pointer-events-none on dragging elements as it breaks drag functionality
  const paddingClass = density === 'compact' ? 'p-2' : 'p-2 sm:p-3'
  const cardClasses = `
    bg-white relative ${paddingClass} pl-2 sm:pl-3 rounded-xl ring-1 ring-gray-200 shadow-sm cursor-grab active:cursor-grabbing
    hover:shadow-md transition-shadow duration-200 w-full
    ${isDragging ? 'opacity-0' : 'hover:ring-gray-300'}
  `.trim()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cardClasses}
      data-draggable-card="true"
      data-testid="draggable-card"
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accentColorFromLevel(card.controlLevel) }}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-1 sm:gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-body text-xs sm:text-sm font-bold text-gray-900 truncate mb-0.5 sm:mb-1">
            {card.jobTitle}
          </h4>
          <p className="font-body text-[10px] sm:text-xs text-gray-600 truncate">
            {card.company}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
            {card.owner && (
              <span className="inline-flex items-center gap-1" title={`Owner`}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                  style={{ backgroundColor: colorFromLabel(card.owner) }}
                >
                  {getInitials(card.owner)}
                </span>
              </span>
            )}
            {card.assignees && card.assignees.length>0 && (
              <span className="inline-flex -space-x-2" title={card.assignees.join(', ')}>
                {card.assignees.slice(0,3).map((a,i)=>(
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[10px] text-white"
                    style={{ backgroundColor: colorFromLabel(a) }}
                  >
                    {getInitials(a)}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Task count badge */}
          {tasksCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-[10px] text-gray-700" title={`${tasksCount} tasks`}>
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M9 11l3 3L22 4l-2-2-8 8-3-3-9 9 2 2z"/></svg>
              {tasksCount}
            </span>
          )}
          <button
            onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); onOpenEditor && onOpenEditor(card.id) }}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            aria-label="Edit card"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Inline content removed; editor opens as popup elsewhere */}
    </div>
  )
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  stage,
  title,
  icon: Icon,
  color,
  cards,
  isOver = false,
  onOpenEditor,
  density = 'comfortable',
  taskCountByCard = {}
}) => {
  const droppableId = `column-${stage}`
  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: {
      type: 'column',
      stage: stage,
      title: title,
    },
  })

  // Debug logging for column registration
  useEffect(() => {
    console.log('🏗️ DroppableColumn registered:', {
      id: droppableId,
      stage,
      title,
      cardCount: cards.length,
      isOver,
      timestamp: new Date().toLocaleTimeString()
    })
  }, [droppableId, stage, title, cards.length, isOver])


  return (
    <div className="flex flex-col h-full">
      {/* Stage Header */}
      <div className={`${density === 'compact' ? 'px-2 py-2' : 'px-3 py-2'} sticky top-0 z-10 bg-white/90 backdrop-blur rounded-t-xl ring-1 ring-gray-200 flex items-center gap-2 flex-shrink-0`}>
        <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <span className="font-body text-sm font-medium text-gray-800 truncate">{title}</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{cards.length}</span>
          <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="Add">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stage Content - Magnetic Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-96 ${density === 'compact' ? 'p-3 space-y-2' : 'p-4 space-y-3'} bg-white rounded-b-xl ring-1 ring-gray-200
          ${isOver ? 'ring-2 ring-blue-200' : ''}
          transition-all duration-200 ease-in-out
          relative
          group
        `.trim()}
        data-column-id={`column-${stage}`}
        data-stage={stage}
      >
        {cards.map((card) => {
          const tasksCount = taskCountByCard[card.id] || 0
          return (
            <DraggableCard key={card.id} card={card} onOpenEditor={onOpenEditor} density={density} tasksCount={tasksCount} />
          )
        })}

        {/* Invisible drop area expander for magnetic targeting */}
        <div
          className={`
            absolute inset-0 pointer-events-none transition-all duration-200
            ${isOver ? '-inset-4' : 'inset-0'}
          `}
          aria-hidden="true"
        />

        
      </div>
    </div>
  )
}

interface AnimatedKanbanProps {
  leftCollapsed?: boolean
  rightCollapsed?: boolean
  onOpenEditor?: (payload: { card: JobCard; candidates: CandidateRow[]; tasks?: TaskItem[] }) => void
  initialCards?: JobCard[]
  disabled?: boolean
}

const AnimatedKanban: React.FC<AnimatedKanbanProps> = ({ leftCollapsed = false, rightCollapsed = false, onOpenEditor, initialCards, disabled }) => {
  const { canCreateRoles, view } = useWorkspace()
  const DEMO_CARDS: JobCard[] = [
    { id: '1', jobTitle: 'Senior React Developer', candidateName: 'Sarah Chen', stage: 0, salary: '£65k', company: 'TechFlow Ltd', createdAt: Date.now()- 48*3600*1000, stageUpdatedAt: Date.now()- 48*3600*1000 },
    { id: '2', jobTitle: 'Data Analyst', candidateName: 'Mike Johnson', stage: 1, salary: '£45k', company: 'DataCorp', createdAt: Date.now()- 96*3600*1000, stageUpdatedAt: Date.now()- 72*3600*1000 },
    { id: '3', jobTitle: 'Product Manager', candidateName: 'Emma Wilson', stage: 2, salary: '£75k', company: 'InnovateCo', createdAt: Date.now()- 7*24*3600*1000, stageUpdatedAt: Date.now()- 3*24*3600*1000 },
    { id: '4', jobTitle: 'UX Designer', candidateName: 'David Brown', stage: 1, salary: '£55k', company: 'DesignHub', createdAt: Date.now()- 48*3600*1000, stageUpdatedAt: Date.now()- 36*3600*1000 },
  ]

  const [jobCards, setJobCards] = useState<JobCard[]>(initialCards ?? DEMO_CARDS)

  const [activeCard, setActiveCard] = useState<JobCard | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isPanning, setIsPanning] = useState(false)
  const panStartXRef = useRef<number>(0)
  const panStartScrollLeftRef = useRef<number>(0)
  const [showLeftIndicator, setShowLeftIndicator] = useState(false)
  const [showRightIndicator, setShowRightIndicator] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [candidatesByCard, setCandidatesByCard] = useState<Record<string, CandidateRow[]>>({})
  const [tasksByCard, setTasksByCard] = useState<Record<string, TaskItem[]>>({})
  // Single clean layout that fits viewport where possible
  const [density] = useState<'comfortable' | 'compact'>('comfortable')
  const [columnWidth, setColumnWidth] = useState<number>(160)
  const measureRef = useRef<HTMLDivElement>(null)
  const [urgentCount, setUrgentCount] = useState<number>(0)

  // Listen for external role additions and insert a new card at start of stage 0
  useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as any
      const payload = anyEvent.detail as {
        id: string; jobTitle: string; company: string; stage: number; controlLevel?: 'high'|'medium'|'low'; tasks?: TaskItem[]
      }
      if (!payload || !payload.id) return
      if (!canCreateRoles()) {
        console.warn('Blocked add role due to permissions', payload)
        alert('Your workspace settings restrict who can create roles.')
        return
      }
      console.log('🆕 Received add role event:', payload)
      const newCard: JobCard = {
        id: payload.id,
        jobTitle: payload.jobTitle,
        company: payload.company,
        candidateName: '—',
        salary: '',
        stage: 0,
        owner: (payload as any).owner || 'You',
        assignees: (payload as any).assignees || [],
        controlLevel: payload.controlLevel,
        createdAt: Date.now(),
        stageUpdatedAt: Date.now(),
      }
      setJobCards(prev => [newCard, ...prev])
      setStageOrder(prev => ({
        ...prev,
        0: [payload.id, ...((prev[0] || []))],
      }))
      try {
        window.dispatchEvent(new CustomEvent('kanban-stage-changed', {
          detail: {
            cardId: newCard.id,
            jobTitle: newCard.jobTitle,
            company: newCard.company,
            fromStage: null,
            toStage: 0,
            toStageName: stages[0]?.name,
            movedAt: Date.now(),
          }
        }))
      } catch {}
      try { localStorage.setItem('first_role_added','1') } catch {}
      console.log('📌 Card inserted. Total cards:', jobCards.length + 1)
      if (payload.tasks && payload.tasks.length > 0) {
        setTasksByCard(prev => ({ ...prev, [payload.id]: payload.tasks! }))
      }
    }
    window.addEventListener('kanban-add-role', handler as EventListener)
    return () => window.removeEventListener('kanban-add-role', handler as EventListener)
  }, [])

  // Toggle card expand
  useEffect(() => {
    const toggle = (e: Event) => {
      const id = (e as any).detail as string
      if (!id) return
      setExpandedIds(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id); else next.add(id)
        return next
      })
    }
    window.addEventListener('kanban-toggle-card', toggle as EventListener)
    return () => window.removeEventListener('kanban-toggle-card', toggle as EventListener)
  }, [])

  // Handle updates coming from RoleEditorPopup
  useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as any
      const detail = anyEvent.detail as { card: JobCard; candidates: CandidateRow[]; tasks?: TaskItem[] }
      if (!detail || !detail.card || !detail.card.id) return

      setJobCards(prev => prev.map(c => (c.id === detail.card.id ? { ...c, ...detail.card } : c)))
      setCandidatesByCard(prev => ({ ...prev, [detail.card.id]: detail.candidates || [] }))
      if (detail.tasks) setTasksByCard(prev => ({ ...prev, [detail.card.id]: detail.tasks! }))
    }
    window.addEventListener('kanban-update-card', handler as EventListener)
    return () => window.removeEventListener('kanban-update-card', handler as EventListener)
  }, [])

  // Rule engine: Stage-triggered tasks (e.g., CV Sent → 48h chase feedback)
  useEffect(() => {
    const onStageChanged = (e: Event) => {
      const any = e as any
      const detail = any?.detail || {}
      const cardId: string | undefined = detail.cardId
      const toStageName: string = (detail.toStageName || '').toString().toLowerCase()
      const fromStageName: string = (detail.fromStageName || '').toString().toLowerCase()
      const company: string | undefined = (detail.company || undefined)
      if (!cardId) return
      // Treat "Contacted" as "CV Sent" in this simplified board
      const isCvSent = toStageName === 'cv sent' || toStageName === 'contacted'
      if ((((urgencyRules as any).autoTasks?.stageTriggerChaseEnabled) ?? true) && isCvSent) {
        const title = 'Chase client feedback'
        const dueAt = Date.now() + getRecommendedChaseMs(company)
        try { trackEvent('telemetry.rule_stage_trigger', { rule: 'cv_sent_chase_feedback', cardId, toStageName, dueAt, company }) } catch {}
        setTasksByCard(prev => {
          const current = prev[cardId] || []
          // Dedup: do not add if an open task with same title exists
          const exists = current.some(t => t.title === title && !t.done)
          if (exists) return prev
          const newTask: TaskItem = { id: `auto-${Date.now()}`, title, done: false, dueAt }
          return { ...prev, [cardId]: [ ...current, newTask ] }
        })
      }

      // Learn client response time when leaving Contacted/CV Sent
      const leftContacted = fromStageName === 'contacted' || fromStageName === 'cv sent'
      const timeInFromStageMs: number | undefined = typeof detail.timeInFromStageMs === 'number' ? detail.timeInFromStageMs : undefined
      if (leftContacted && timeInFromStageMs && timeInFromStageMs > 0) {
        recordClientResponse(company, timeInFromStageMs)
        try { trackEvent('telemetry.response_sample', { company, timeInFromStageMs }) } catch {}
      }
    }
    window.addEventListener('kanban-stage-changed', onStageChanged as EventListener)
    return () => window.removeEventListener('kanban-stage-changed', onStageChanged as EventListener)
  }, [])

  // Handle deletions coming from RoleEditorPopup (admin only UI)
  useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as any
      const id = anyEvent.detail?.id as string
      if (!id) return
      setJobCards(prev => prev.filter(c => c.id !== id))
      setCandidatesByCard(prev => { const cp = { ...prev }; delete cp[id]; return cp })
      setTasksByCard(prev => { const cp = { ...prev }; delete cp[id]; return cp })
      setStageOrder(prev => {
        const next: Record<number, string[]> = {}
        Object.keys(prev).forEach(k => {
          const num = Number(k)
          next[num] = (prev[num] || []).filter(x => x !== id)
        })
        return next
      })
    }
    window.addEventListener('kanban-delete-card', handler as EventListener)
    return () => window.removeEventListener('kanban-delete-card', handler as EventListener)
  }, [])

  // Maintain simple per-stage ordering (array of ids per stage)
  const [stageOrder, setStageOrder] = useState<Record<number, string[]>>({
    0: jobCards.filter(c => c.stage === 0).map(c => c.id),
    1: jobCards.filter(c => c.stage === 1).map(c => c.id),
    2: jobCards.filter(c => c.stage === 2).map(c => c.id),
    3: jobCards.filter(c => c.stage === 3).map(c => c.id),
  })

  // Map for quick lookup
  const idToCard = useMemo(() => {
    const map: Record<string, JobCard> = {}
    jobCards.forEach(c => { map[c.id] = c })
    return map
  }, [jobCards])

  useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 1024)
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  // Fit-to-width calculation for desktop; falls back to scroll on smaller screens
  const recomputeColumnWidth = () => {
    const container = measureRef.current
    if (!container) return

    // Mobile (<768px): Fit 2 columns for better readability
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const sidebarWidth = leftCollapsed ? 48 : 192 // w-12 collapsed, w-48 expanded
      const totalGapPx = 8 // Gap between 2 columns (single gap)
      const paddingPx = 8 // Account for container padding (4px × 2)
      const availableWidth = window.innerWidth - sidebarWidth - totalGapPx - paddingPx
      const columnWidth = Math.floor(availableWidth / 2) // Fit 2 columns
      setColumnWidth(Math.max(140, columnWidth)) // Min 140px per column for readability
      return
    }

    // Desktop: existing responsive logic
    const available = container.clientWidth
    const numCols = stages.length
    const gapPx = 16
    const minW = 260
    const maxW = 320
    const target = Math.floor((available - gapPx * (numCols - 1)) / numCols)
    const clamped = Math.max(minW, Math.min(maxW, target))
    setColumnWidth(clamped)
  }

  useEffect(() => {
    recomputeColumnWidth()
  }, [leftCollapsed, rightCollapsed])

  useEffect(() => {
    const onResize = () => recomputeColumnWidth()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const sensors = useSensors(
    // Mouse sensor for desktop - immediate activation with small distance threshold
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Small distance for precise mouse control
      },
    }),

    // Touch sensor for mobile - delay to distinguish from scrolling
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay to distinguish from scroll gestures
        tolerance: 8, // 8px tolerance for touch jitter
      },
    }),

    // Pointer sensor as fallback for other pointer devices (stylus, etc.)
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Balanced for unknown pointer types
      },
    })
  )

  // Add useEffect to monitor sensor activation
  useEffect(() => {
    console.log('🔧 Kanban sensors initialized:', {
      sensorCount: sensors.length,
      timestamp: new Date().toLocaleTimeString()
    })
  }, [sensors])

  const stages = [
    { name: 'New Leads', icon: User, color: 'bg-gray-100 border-gray-200', stage: 0 },
    { name: 'Contacted', icon: Phone, color: 'bg-blue-50 border-blue-200', stage: 1 },
    { name: 'Interview', icon: Calendar, color: 'bg-orange-50 border-orange-200', stage: 2 },
    { name: 'Placed', icon: Briefcase, color: 'bg-green-50 border-green-200', stage: 3 },
  ]

  // Urgency rules configurable at onboarding; read overrides from onboarding_settings
  const urgencyRules = (() => {
    let rules = { maxStageHours: [24, 48, 72, Infinity] as Array<number>, maxTotalHours: Infinity }
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('onboarding_settings')
      if (s) try {
        const j = JSON.parse(s)
        // Prefer per-stage hours if present; otherwise fall back to single-number setting
        if (Array.isArray(j?.urgentRules?.perStageHours)) {
          const arr = j.urgentRules.perStageHours
          rules.maxStageHours = [arr[0] ?? 24, arr[1] ?? 48, arr[2] ?? 72, Infinity]
        } else if (typeof j?.urgentRules?.maxStageHours === 'number') {
          rules.maxStageHours = [j.urgentRules.maxStageHours, j.urgentRules.maxStageHours, j.urgentRules.maxStageHours, Infinity]
        }
        // Auto-task toggles
        ;(rules as any).autoTasks = {
          stageTriggerChaseEnabled: j?.autoTasks?.stageTriggerChaseEnabled ?? true,
          escalationsEnabled: j?.autoTasks?.escalationsEnabled ?? true,
        }
      } catch {}
    }
    return rules
  })()

  const computeUrgentCount = React.useCallback(() => {
    const now = Date.now()
    let count = 0
    const items: Array<{ id: string; jobTitle: string; company?: string; stage: string; hoursOver: number }> = []
    const taskUrgent: Array<{ id: string; taskId: string; title: string; jobTitle: string; company?: string; dueAt: number; dueInHours: number; overdue: boolean; roleId: string }>
      = []
    jobCards.forEach(c => {
      const stageUpdated = c.stageUpdatedAt || c.createdAt || now
      const ageHours = (now - stageUpdated) / 36e5
      const totalAgeHours = (now - (c.createdAt || now)) / 36e5
      const stageLimit = urgencyRules.maxStageHours[c.stage] ?? 48
      if ((((urgencyRules as any).autoTasks?.escalationsEnabled) ?? true) && (ageHours > stageLimit || totalAgeHours > urgencyRules.maxTotalHours)) {
        count += 1
        items.push({ id: c.id, jobTitle: c.jobTitle, company: c.company, stage: stages[c.stage]?.name || '', hoursOver: Math.max(0, Math.round(ageHours - stageLimit)) })
        // Escalation task: if card is over limit and no open escalation task exists, create one
        const stageName = stages[c.stage]?.name || 'Stage'
        const title = `Check in: ${stageName}`
        try { trackEvent('telemetry.escalation', { roleId: c.id, stage: stageName, ageHours, stageLimit }) } catch {}
        setTasksByCard(prev => {
          const current = prev[c.id] || []
          const exists = current.some(t => !t.done && t.title === title)
          if (exists) return prev
          const newTask: TaskItem = { id: `auto-esc-${c.id}-${Date.now()}`, title, done: false, dueAt: now }
          return { ...prev, [c.id]: [ ...current, newTask ] }
        })
      }
      // Add task urgency capture (due within 24h or overdue)
      const ts = tasksByCard[c.id] || []
      ts.forEach(t => {
        if (t.done) return
        if (!t.dueAt) return
        const deltaMs = t.dueAt - now
        const threshold = 24 * 3600 * 1000
        if (deltaMs <= threshold) {
          taskUrgent.push({
            id: `task-${c.id}-${t.id}`,
            taskId: t.id,
            title: t.title,
            jobTitle: c.jobTitle,
            company: c.company,
            dueAt: t.dueAt,
            dueInHours: Math.round(deltaMs / 36e5),
            overdue: deltaMs < 0,
            roleId: c.id,
          })
        }
      })
    })
    // Include task urgency in count for badges
    setUrgentCount(count + taskUrgent.length)
    const evt = new CustomEvent('urgent-count-update', { detail: { count } })
    window.dispatchEvent(evt)
    window.addEventListener('request-urgent-actions', () => {
      // Sort tasks by due soonest, overdue first
      const sortedTasks = taskUrgent.slice().sort((a,b)=> (a.overdue===b.overdue ? (a.dueAt - b.dueAt) : (a.overdue ? -1 : 1)))
      window.dispatchEvent(new CustomEvent('respond-urgent-actions', { detail: { items, tasks: sortedTasks } }))
    }, { once: true })
  }, [jobCards, tasksByCard])

  // Expose all tasks for Task Center requests
  useEffect(() => {
    const onRequestAll = () => {
      const items: Array<{ id: string; title: string; dueAt?: number; status?: string; roleId?: string; jobTitle?: string; source?: string }>
        = []
      jobCards.forEach(c => {
        const ts = tasksByCard[c.id] || []
        ts.forEach(t => items.push({ id: t.id, title: t.title, dueAt: t.dueAt, status: t.done ? 'done' : 'open', roleId: c.id, jobTitle: c.jobTitle, source: t.id.startsWith('auto-') ? 'auto' : 'manual' }))
      })
      window.dispatchEvent(new CustomEvent('respond-all-tasks', { detail: { items } }))
    }
    window.addEventListener('request-all-tasks', onRequestAll)
    return () => window.removeEventListener('request-all-tasks', onRequestAll)
  }, [jobCards, tasksByCard])

  // Handle external request to mark a task as done
  useEffect(() => {
    const onMarkDone = (e: Event) => {
      const any = e as any
      const roleId: string | undefined = any?.detail?.roleId
      const taskId: string | undefined = any?.detail?.taskId
      if (!roleId || !taskId) return
      setTasksByCard((prev): Record<string, TaskItem[]> => {
        const current: TaskItem[] = prev[roleId] || []
        const next: TaskItem[] = current.map(t => t.id === taskId ? { ...t, done: true, status: 'done' as const } : t)
        return { ...prev, [roleId]: next }
      })
      // Recompute urgent counters quickly
      setTimeout(() => computeUrgentCount(), 0)
    }
    window.addEventListener('kanban-mark-task-done', onMarkDone as EventListener)
    return () => window.removeEventListener('kanban-mark-task-done', onMarkDone as EventListener)
  }, [computeUrgentCount])

  useEffect(() => { computeUrgentCount() }, [computeUrgentCount])
  // Recompute periodically to catch time-based escalations
  useEffect(() => {
    const id = setInterval(() => computeUrgentCount(), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [computeUrgentCount])

  // Daily scheduler placeholder: run near local midnight to refresh escalations
  useEffect(() => {
    const now = new Date()
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 5, 0, 0) // 00:05 local
    const delay = Math.max(1000, next.getTime() - now.getTime())
    const t = setTimeout(() => {
      computeUrgentCount()
      const iv = setInterval(() => computeUrgentCount(), 24 * 60 * 60 * 1000)
      ;(window as any).__dailySchedulerIv = iv
    }, delay)
    return () => {
      clearTimeout(t)
      const iv = (window as any).__dailySchedulerIv
      if (iv) clearInterval(iv)
    }
  }, [computeUrgentCount])

  // Robust multi-stage collision detection for kanban boards
  const collisionDetectionAlgorithm = (args: any) => {
    const { droppableContainers, draggableContainers, pointerCoordinates, collisionRect } = args

    // Stage 1: Pointer-based detection for precise targeting
    const pointerCollisions = pointerWithin(args)

    if (pointerCollisions.length > 0) {
      // Prioritize column containers over card containers
      const columnCollisions = pointerCollisions.filter(collision =>
        collision.id.toString().startsWith('column-')
      )

      if (columnCollisions.length > 0) {
        return columnCollisions
      }

      return pointerCollisions
    }

    // Stage 2: Rectangle intersection for overlap detection
    const intersectionCollisions = rectIntersection(args)

    if (intersectionCollisions.length > 0) {
      // Again prioritize columns
      const columnCollisions = intersectionCollisions.filter(collision =>
        collision.id.toString().startsWith('column-')
      )

      if (columnCollisions.length > 0) {
        return columnCollisions
      }

      return intersectionCollisions
    }

    // Stage 3: Proximity-based fallback for edge cases
    if (pointerCoordinates) {
      const proximityCollisions = []

      for (const container of droppableContainers) {
        if (!container.id.toString().startsWith('column-')) continue

        const rect = container.rect.current
        if (!rect) continue

        // Expand hit area by 20px in all directions for magnetic effect
        const expandedRect = {
          top: rect.top - 20,
          bottom: rect.bottom + 20,
          left: rect.left - 20,
          right: rect.right + 20
        }

        // Check if pointer is within expanded bounds
        if (
          pointerCoordinates.x >= expandedRect.left &&
          pointerCoordinates.x <= expandedRect.right &&
          pointerCoordinates.y >= expandedRect.top &&
          pointerCoordinates.y <= expandedRect.bottom
        ) {
          // Calculate distance for sorting
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const distance = Math.sqrt(
            Math.pow(pointerCoordinates.x - centerX, 2) +
            Math.pow(pointerCoordinates.y - centerY, 2)
          )

          proximityCollisions.push({
            id: container.id,
            data: { droppableContainer: container },
            distance
          })
        }
      }

      // Sort by distance and return closest
      if (proximityCollisions.length > 0) {
        proximityCollisions.sort((a, b) => a.distance - b.distance)
        return [proximityCollisions[0]]
      }
    }

    // Stage 4: Last resort - closest corners for any remaining cases
    return closestCorners(args)
  }

  const getJobCardsInStage = (stageIndex: number) => {
    const ids = stageOrder[stageIndex] || []
    return ids.map(id => idToCard[id]).filter(Boolean)
  }

  // Scroll prevention during drag operations
  const preventScroll = (prevent: boolean) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      if (prevent) {
        // Store current scroll position
        setScrollPosition(container.scrollLeft)
        // Prevent scrolling
        container.style.overflow = 'hidden'
        container.style.touchAction = 'none'
      } else {
        // Restore scrolling
        container.style.overflow = 'auto'
        container.style.touchAction = 'auto'
        // Restore scroll position to prevent jump
        container.scrollLeft = scrollPosition
      }
    }
  }

  // Slide navigation functions
  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current && !isDragging) {
      const container = scrollContainerRef.current
      const slideWidth = columnWidth
      container.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      })
      setCurrentSlideIndex(index)
    }
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    if (!isDragging) {
      const slideWidth = columnWidth
      const scrollLeft = container.scrollLeft
      const currentIndex = Math.round(scrollLeft / slideWidth)
      setCurrentSlideIndex(currentIndex)
    }
    const maxScroll = container.scrollWidth - container.clientWidth
    setShowLeftIndicator(container.scrollLeft > 0)
    setShowRightIndicator(container.scrollLeft < maxScroll - 1)
  }

  // Mouse drag-to-pan handlers for empty canvas area
  const onPanMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return
    if (isDragging) return
    if (!scrollContainerRef.current) return
    // Avoid starting pan on cards
    const target = e.target as HTMLElement
    if (target.closest('[data-draggable-card="true"]')) return
    if (e.button !== 0) return
    setIsPanning(true)
    panStartXRef.current = e.clientX
    panStartScrollLeftRef.current = scrollContainerRef.current.scrollLeft
    // Add global listeners to allow panning outside container
    window.addEventListener('mousemove', onPanMouseMove)
    window.addEventListener('mouseup', onPanMouseUp, { once: true })
  }

  const onPanMouseMove = (e: MouseEvent) => {
    if (!isPanning || !scrollContainerRef.current) return
    const delta = e.clientX - panStartXRef.current
    scrollContainerRef.current.scrollLeft = panStartScrollLeftRef.current - delta
  }

  const onPanMouseUp = () => {
    setIsPanning(false)
    window.removeEventListener('mousemove', onPanMouseMove)
  }

  // Nudge buttons
  const nudgeLeft = () => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollTo({ left: Math.max(0, container.scrollLeft - columnWidth), behavior: 'smooth' })
  }

  const nudgeRight = () => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollTo({ left: container.scrollLeft + columnWidth, behavior: 'smooth' })
  }


  const handleDragStart = (event: DragStartEvent) => {
    if (disabled) return
    console.log('🚀 DRAG START triggered', {
      activeId: event.active.id,
      activeData: event.active.data,
      timestamp: new Date().toLocaleTimeString(),
      sensors: 'Enhanced multi-sensor active'
    })

    const { active } = event
    const card = jobCards.find(c => c.id === active.id)

    if (!card) {
      console.error('❌ Drag started but card not found:', {
        cardId: active.id,
        availableCards: jobCards.map(c => c.id),
        activeType: typeof active.id
      })
      return
    }

    // Enable drag mode and prevent scrolling
    setIsDragging(true)
    setActiveCard(card)
    preventScroll(true)

    console.log('✅ Drag initialization successful:', {
      cardId: active.id,
      cardTitle: card.jobTitle,
      currentStage: stages[card.stage]?.name,
      stageIndex: card.stage,
      scrollPrevented: true,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (disabled) return
    const { over, active } = event
    const newOverId = over?.id ? String(over.id) : null
    setOverId(newOverId)

    // Enhanced debugging for drop zone detection
    console.log('🔍 DragOver Debug:', {
      activeId: active.id,
      overId: newOverId,
      overData: over?.data?.current,
      overRect: over?.rect,
      timestamp: new Date().toLocaleTimeString()
    })

    if (newOverId && newOverId.startsWith('column-')) {
      const stageIndex = parseInt(newOverId.split('-')[1])
      console.log('🎯 Dragging over stage:', {
        stage: stages[stageIndex]?.name,
        stageIndex,
        targetColumn: newOverId,
        validDrop: !isNaN(stageIndex) && stageIndex >= 0 && stageIndex < stages.length
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return
    const { active, over } = event

    // Always restore scroll and reset drag state
    setIsDragging(false)
    setOverId(null)
    preventScroll(false)

    console.log('🏁 DragEnd Debug:', {
      hasOver: !!over,
      hasActiveCard: !!activeCard,
      activeId: active.id,
      overId: over?.id,
      overData: over?.data?.current,
      scrollRestored: true,
      timestamp: new Date().toLocaleTimeString()
    })

    if (!activeCard) {
      console.error('❌ No active card - invalid drag state')
      setActiveCard(null)
      return
    }

    // Bulletproof drop logic - handle null 'over' with coordinate-based fallback
    let targetStage: number | null = null
    let dropMethod = 'unknown'

    if (over) {
      // Standard drop detection
      if (over.id.toString().startsWith('column-')) {
        targetStage = parseInt(over.id.toString().split('-')[1])
        dropMethod = 'column-direct'
      } else {
        // Dropped on card - find which column the card is in
        const targetCard = jobCards.find(card => card.id === over.id)
        if (targetCard) {
          targetStage = targetCard.stage
          dropMethod = 'card-indirect'
        }
      }
    }

    // Coordinate-based fallback when over is null
    if (targetStage === null && active.rect?.current && scrollContainerRef.current) {
      console.log('🎯 Attempting coordinate-based fallback detection')

      const activeRect = active.rect.current
      const containerRect = scrollContainerRef.current.getBoundingClientRect()
      const scrollLeft = scrollContainerRef.current.scrollLeft

      // Calculate global pointer position accounting for scroll
      const rect = activeRect.translated || activeRect.initial
      if (!rect) return

      const globalX = rect.left + rect.width / 2 + scrollLeft
      const globalY = rect.top + rect.height / 2

      // Find closest column by position
      let closestDistance = Infinity
      let closestStage = null

      stages.forEach((stage, index) => {
        // Estimate column position (desktop: distributed evenly, mobile: 320px width each)
        const isDesktop = window.innerWidth >= 1024
        let columnCenterX: number

        if (isDesktop) {
          const columnWidth = containerRect.width / stages.length
          columnCenterX = containerRect.left + (index + 0.5) * columnWidth
        } else {
          columnCenterX = containerRect.left + index * columnWidth + (columnWidth / 2) - scrollLeft
        }

        const distance = Math.abs(globalX - columnCenterX)

        if (distance < closestDistance) {
          closestDistance = distance
          closestStage = index
        }
      })

      if (closestStage !== null && closestDistance < 200) { // Within 200px threshold
        targetStage = closestStage
        dropMethod = 'coordinate-fallback'
        console.log('✅ Coordinate fallback successful:', {
          targetStage,
          distance: closestDistance,
          globalX,
          globalY
        })
      }
    }

    // Final validation and error recovery
    if (targetStage === null || isNaN(targetStage) || targetStage < 0 || targetStage >= stages.length) {
      console.warn('⚠️ Drop target resolution failed - applying error recovery:', {
        targetStage,
        dropMethod,
        availableStages: stages.length,
        fallbackStage: activeCard.stage
      })

      // Error recovery: keep card in original position with visual feedback
      setActiveCard(null)

      // Optional: Show user feedback for failed drop
      // This could trigger a toast notification in a real app
      console.log('💡 Card returned to original position due to invalid drop')
      return
    }

    // Success: We have a valid target stage
    const cardId = active.id as string
    const newStage = targetStage

    console.log('🔍 Processing successful drop:', {
      cardId,
      targetStage: newStage,
      dropMethod,
      overId: over?.id || 'null',
      allAvailableStages: stages.map(s => `${s.name} (${s.stage})`)
    })

    // Validate current card exists
    const currentCard = jobCards.find(card => card.id === cardId)
    if (!currentCard) {
      console.error('❌ Card not found for move operation:', {
        cardId,
        availableCards: jobCards.map(c => ({ id: c.id, title: c.jobTitle }))
      })
      setActiveCard(null)
      return
    }

    // Prepare ordering updates
    const sourceStage = currentCard.stage
    const nextStageOrder = { ...stageOrder }
    // Remove from source stage list
    nextStageOrder[sourceStage] = (nextStageOrder[sourceStage] || []).filter(id => id !== cardId)

    // Compute insertion index for target stage
    let insertIndex = (nextStageOrder[newStage] || []).length
    if (over) {
      // If dropped over a column body, leave as append
      // If dropped over a card, insert before that card's index
      const overKey = over.id.toString()
      const overCard = idToCard[overKey]
      if (overCard && overCard.stage === newStage) {
        const idx = (nextStageOrder[newStage] || []).indexOf(overCard.id)
        if (idx >= 0) insertIndex = idx
      }
    }

    // Insert into target stage list
    const targetList = [...(nextStageOrder[newStage] || [])]
    targetList.splice(insertIndex, 0, cardId)
    nextStageOrder[newStage] = targetList

    // Execute the move with comprehensive logging
    console.log('✅ Moving card successfully:', {
      cardId,
      card: currentCard.jobTitle,
      from: `${stages[currentCard.stage]?.name} (${currentCard.stage})`,
      to: `${stages[newStage]?.name} (${newStage})`,
      method: dropMethod,
      timestamp: new Date().toLocaleTimeString()
    })

    const fromStageUpdatedAt = currentCard.stageUpdatedAt || currentCard.createdAt || Date.now()
    const movedAt = Date.now()
    const timeInFromStageMs = movedAt - fromStageUpdatedAt
    // Update card stage and ordering state
  setJobCards(prev => prev.map(card =>
    card.id === cardId
      ? { ...card, stage: newStage, stageUpdatedAt: Date.now() }
      : card
  ))
    setStageOrder(nextStageOrder)

    // Emit stage change event for rule engine consumers
    try {
      window.dispatchEvent(new CustomEvent('kanban-stage-changed', {
        detail: {
          cardId,
          jobTitle: currentCard.jobTitle,
          company: currentCard.company,
          fromStage: currentCard.stage,
          fromStageName: stages[currentCard.stage]?.name,
          toStage: newStage,
          toStageName: stages[newStage]?.name,
          movedAt,
          timeInFromStageMs,
          method: dropMethod,
        }
      }))
    } catch {}

    // Clean up drag state
    setActiveCard(null)
  }


  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">My Pipeline</h2>
          <p className="font-body text-sm text-gray-600 mt-1">Drag and drop candidates through your recruitment process</p>
        </div>
        {/* Density toggle removed for a single clean layout */}
      </div>

      <div className="p-6 bg-gray-50" ref={measureRef}>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionAlgorithm}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Single horizontal scroll container for all breakpoints */}
          <div
            className="relative"
            style={{
              paddingLeft: leftCollapsed ? 8 : 16,
              paddingRight: rightCollapsed ? 8 : 16,
            }}
          >
            <div
              ref={scrollContainerRef}
              className={`
                flex gap-3 sm:gap-4 pb-2 snap-x snap-mandatory kanban-scroll
                transition-all duration-200 ease-in-out cursor-${isPanning ? 'grabbing' : 'default'}
                ${disabled ? 'pointer-events-none select-none' : ''}
                ${isDragging ? 'overflow-hidden touch-none select-none' : 'overflow-x-auto touch-auto'}
              `}
              onScroll={handleScroll}
              onMouseDown={onPanMouseDown}
              style={{
                WebkitOverflowScrolling: isDragging ? 'auto' : 'touch',
                scrollBehavior: isDragging ? 'auto' : 'smooth',
                pointerEvents: disabled ? 'none' : undefined,
                userSelect: disabled ? 'none' as any : undefined
              }}
            >
          {stages.map((stage) => {
            let stageCards = getJobCardsInStage(stage.stage)
            if (view === 'individual') {
              const currentUser = (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null)
              if (currentUser) {
                stageCards = stageCards.filter(c => !c.owner || c.owner === currentUser)
              }
            }
            const handleOpen = (id: string) => {
              const c = idToCard[id]
              if (!c) return
              const payload = { card: c, candidates: candidatesByCard[id] || [], tasks: tasksByCard[id] || [] }
              onOpenEditor && onOpenEditor(payload)
            }
            return (
              <div key={stage.stage} className="flex-none snap-start kanban-column" style={{ width: `${columnWidth}px` }}>
                <DroppableColumn
                  stage={stage.stage}
                  title={stage.name}
                  icon={stage.icon}
                  color={stage.color}
                  cards={stageCards}
                  isOver={overId === `column-${stage.stage}`}
                  onOpenEditor={handleOpen}
                  density={'comfortable'}
                  taskCountByCard={Object.fromEntries(stageCards.map(c => [c.id, (tasksByCard[c.id] || []).length]))}
                />
              </div>
            )
          })}
          {/* Empty-state button removed; we use a pulsing indicator on sidebar Add Role */}
            </div>

            {/* Scroll indicators (non-interactive overlays) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-10 transition-opacity duration-200" style={{ opacity: showLeftIndicator ? 1 : 0 }}>
              <div className="h-full bg-gradient-to-r from-gray-200/50 to-transparent" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-10 transition-opacity duration-200" style={{ opacity: showRightIndicator ? 1 : 0 }}>
              <div className="h-full bg-gradient-to-l from-gray-200/50 to-transparent" />
            </div>
          </div>

          <DragOverlay
            modifiers={[snapCenterToCursor]}
            dropAnimation={{
              duration: 250,
              easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            style={{
              cursor: 'grabbing',
            }}
          >
            {activeCard ? (
              <OverlayCard card={activeCard} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default AnimatedKanban