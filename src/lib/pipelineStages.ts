/**
 * Pipeline Stages Management Utility
 * Handles custom pipeline stage configuration with templates and persistence
 */

export interface PipelineStage {
  id: string
  name: string
  icon: string  // Lucide icon name
  color: string  // Tailwind classes
  order: number
}

export interface PipelineConfig {
  stages: PipelineStage[]
  updatedAt: number
}

// Default 4-stage pipeline
export const DEFAULT_STAGES: PipelineStage[] = [
  { id: 'new-leads', name: 'New Leads', icon: 'User', color: 'bg-gray-100 border-gray-200', order: 0 },
  { id: 'contacted', name: 'Contacted', icon: 'Phone', color: 'bg-blue-50 border-blue-200', order: 1 },
  { id: 'interview', name: 'Interview', icon: 'Calendar', color: 'bg-orange-50 border-orange-200', order: 2 },
  { id: 'placed', name: 'Placed', icon: 'Briefcase', color: 'bg-green-50 border-green-200', order: 3 },
]

// Template presets for different sectors
export const STAGE_TEMPLATES: Record<string, { name: string; stages: PipelineStage[] }> = {
  general: {
    name: 'General Recruitment',
    stages: DEFAULT_STAGES,
  },

  it: {
    name: 'IT Recruitment',
    stages: [
      { id: 'sourced', name: 'Sourced', icon: 'Search', color: 'bg-gray-100 border-gray-200', order: 0 },
      { id: 'first-contact', name: 'First Contact', icon: 'Phone', color: 'bg-blue-50 border-blue-200', order: 1 },
      { id: 'tech-screen', name: 'Technical Screen', icon: 'Code', color: 'bg-purple-50 border-purple-200', order: 2 },
      { id: 'client-interview', name: 'Client Interview', icon: 'Calendar', color: 'bg-orange-50 border-orange-200', order: 3 },
      { id: 'offer', name: 'Offer', icon: 'FileText', color: 'bg-yellow-50 border-yellow-200', order: 4 },
      { id: 'placed', name: 'Placed', icon: 'CheckCircle', color: 'bg-green-50 border-green-200', order: 5 },
    ],
  },

  finance: {
    name: 'Finance Recruitment',
    stages: [
      { id: 'pipeline', name: 'Pipeline', icon: 'Database', color: 'bg-gray-100 border-gray-200', order: 0 },
      { id: 'initial-call', name: 'Initial Call', icon: 'Phone', color: 'bg-blue-50 border-blue-200', order: 1 },
      { id: 'first-interview', name: 'First Interview', icon: 'Users', color: 'bg-purple-50 border-purple-200', order: 2 },
      { id: 'final-interview', name: 'Final Interview', icon: 'UserCheck', color: 'bg-orange-50 border-orange-200', order: 3 },
      { id: 'references', name: 'Reference Check', icon: 'Shield', color: 'bg-yellow-50 border-yellow-200', order: 4 },
      { id: 'offer', name: 'Offer', icon: 'FileSignature', color: 'bg-indigo-50 border-indigo-200', order: 5 },
      { id: 'placed', name: 'Placed', icon: 'Award', color: 'bg-green-50 border-green-200', order: 6 },
    ],
  },

  healthcare: {
    name: 'Healthcare Recruitment',
    stages: [
      { id: 'lead', name: 'Lead', icon: 'User', color: 'bg-gray-100 border-gray-200', order: 0 },
      { id: 'screening', name: 'Screening', icon: 'ClipboardCheck', color: 'bg-blue-50 border-blue-200', order: 1 },
      { id: 'compliance', name: 'Compliance Check', icon: 'ShieldCheck', color: 'bg-purple-50 border-purple-200', order: 2 },
      { id: 'interview', name: 'Interview', icon: 'Calendar', color: 'bg-orange-50 border-orange-200', order: 3 },
      { id: 'offer', name: 'Offer', icon: 'FileText', color: 'bg-yellow-50 border-yellow-200', order: 4 },
      { id: 'onboarding', name: 'Onboarding', icon: 'Briefcase', color: 'bg-green-50 border-green-200', order: 5 },
    ],
  },

  sales: {
    name: 'Sales Recruitment',
    stages: [
      { id: 'prospecting', name: 'Prospecting', icon: 'Target', color: 'bg-gray-100 border-gray-200', order: 0 },
      { id: 'qualified', name: 'Qualified', icon: 'CheckSquare', color: 'bg-blue-50 border-blue-200', order: 1 },
      { id: 'assessment', name: 'Assessment', icon: 'BarChart', color: 'bg-purple-50 border-purple-200', order: 2 },
      { id: 'client-meeting', name: 'Client Meeting', icon: 'Handshake', color: 'bg-orange-50 border-orange-200', order: 3 },
      { id: 'offer', name: 'Offer', icon: 'TrendingUp', color: 'bg-yellow-50 border-yellow-200', order: 4 },
      { id: 'placed', name: 'Placed', icon: 'Trophy', color: 'bg-green-50 border-green-200', order: 5 },
    ],
  },

  executive: {
    name: 'Executive Search',
    stages: [
      { id: 'research', name: 'Research', icon: 'Search', color: 'bg-gray-100 border-gray-200', order: 0 },
      { id: 'approach', name: 'Approach', icon: 'Mail', color: 'bg-blue-50 border-blue-200', order: 1 },
      { id: 'initial-meeting', name: 'Initial Meeting', icon: 'Coffee', color: 'bg-purple-50 border-purple-200', order: 2 },
      { id: 'client-presentation', name: 'Client Presentation', icon: 'Presentation', color: 'bg-orange-50 border-orange-200', order: 3 },
      { id: 'finalist', name: 'Finalist', icon: 'Star', color: 'bg-yellow-50 border-yellow-200', order: 4 },
      { id: 'offer-negotiation', name: 'Offer Negotiation', icon: 'DollarSign', color: 'bg-indigo-50 border-indigo-200', order: 5 },
      { id: 'placed', name: 'Placed', icon: 'Crown', color: 'bg-green-50 border-green-200', order: 6 },
    ],
  },
}

// Available icons for stage configuration
export const AVAILABLE_ICONS = [
  'User', 'Users', 'Phone', 'Mail', 'Calendar', 'Briefcase', 'Search',
  'Code', 'FileText', 'FileSignature', 'CheckCircle', 'CheckSquare',
  'Shield', 'ShieldCheck', 'Database', 'Award', 'Trophy', 'Target',
  'TrendingUp', 'BarChart', 'ClipboardCheck', 'UserCheck', 'Handshake',
  'Coffee', 'Presentation', 'Star', 'Crown', 'DollarSign',
]

// Available color schemes
export const AVAILABLE_COLORS = [
  { name: 'Gray', value: 'bg-gray-100 border-gray-200' },
  { name: 'Blue', value: 'bg-blue-50 border-blue-200' },
  { name: 'Purple', value: 'bg-purple-50 border-purple-200' },
  { name: 'Orange', value: 'bg-orange-50 border-orange-200' },
  { name: 'Yellow', value: 'bg-yellow-50 border-yellow-200' },
  { name: 'Green', value: 'bg-green-50 border-green-200' },
  { name: 'Red', value: 'bg-red-50 border-red-200' },
  { name: 'Indigo', value: 'bg-indigo-50 border-indigo-200' },
  { name: 'Pink', value: 'bg-pink-50 border-pink-200' },
  { name: 'Teal', value: 'bg-teal-50 border-teal-200' },
]

const STORAGE_KEY = 'pipeline_stages_config'

/**
 * Load pipeline stages from localStorage
 * Falls back to default stages if not configured
 */
export function loadPipelineStages(): PipelineStage[] {
  if (typeof window === 'undefined') return DEFAULT_STAGES

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_STAGES

    const config: PipelineConfig = JSON.parse(stored)
    if (!config.stages || !Array.isArray(config.stages) || config.stages.length < 2) {
      return DEFAULT_STAGES
    }

    // Validate and sort by order
    return config.stages.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Failed to load pipeline stages:', error)
    return DEFAULT_STAGES
  }
}

/**
 * Save pipeline stages to localStorage
 */
export function savePipelineStages(stages: PipelineStage[]): boolean {
  if (typeof window === 'undefined') return false

  // Validation
  if (!stages || stages.length < 2) {
    throw new Error('Pipeline must have at least 2 stages')
  }

  if (stages.length > 10) {
    throw new Error('Pipeline cannot have more than 10 stages')
  }

  try {
    const config: PipelineConfig = {
      stages: stages.map((stage, index) => ({
        ...stage,
        order: index, // Ensure order is sequential
      })),
      updatedAt: Date.now(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))

    // Dispatch event to notify AnimatedKanban of stage changes
    window.dispatchEvent(new CustomEvent('pipeline-stages-updated', { detail: { stages: config.stages } }))

    return true
  } catch (error) {
    console.error('Failed to save pipeline stages:', error)
    return false
  }
}

/**
 * Reset to default stages
 */
export function resetToDefaultStages(): boolean {
  return savePipelineStages(DEFAULT_STAGES)
}

/**
 * Load a template preset
 */
export function loadTemplate(templateKey: keyof typeof STAGE_TEMPLATES): boolean {
  const template = STAGE_TEMPLATES[templateKey]
  if (!template) return false

  return savePipelineStages(template.stages)
}

/**
 * Validate stage configuration
 */
export function validateStages(stages: PipelineStage[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!stages || !Array.isArray(stages)) {
    errors.push('Stages must be an array')
    return { valid: false, errors }
  }

  if (stages.length < 2) {
    errors.push('Must have at least 2 stages')
  }

  if (stages.length > 10) {
    errors.push('Cannot have more than 10 stages')
  }

  const ids = new Set<string>()
  stages.forEach((stage, index) => {
    if (!stage.id) {
      errors.push(`Stage ${index + 1} missing ID`)
    } else if (ids.has(stage.id)) {
      errors.push(`Duplicate stage ID: ${stage.id}`)
    } else {
      ids.add(stage.id)
    }

    if (!stage.name || stage.name.trim().length === 0) {
      errors.push(`Stage ${index + 1} missing name`)
    }

    if (!stage.icon) {
      errors.push(`Stage ${index + 1} missing icon`)
    }

    if (!stage.color) {
      errors.push(`Stage ${index + 1} missing color`)
    }
  })

  return { valid: errors.length === 0, errors }
}
