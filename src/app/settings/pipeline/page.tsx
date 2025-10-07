'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Plus, Trash2, GripVertical, Save, RotateCcw,
  User, Users, Phone, Mail, Calendar, Briefcase, Search, Code,
  FileText, CheckCircle, Shield, Database, Award, Trophy, Target
} from 'lucide-react'
import {
  PipelineStage,
  loadPipelineStages,
  savePipelineStages,
  resetToDefaultStages,
  loadTemplate,
  STAGE_TEMPLATES,
  AVAILABLE_ICONS,
  AVAILABLE_COLORS,
  validateStages,
} from '@/lib/pipelineStages'

// Icon component mapping
const ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  User, Users, Phone, Mail, Calendar, Briefcase, Search, Code,
  FileText, CheckCircle, Shield, Database, Award, Trophy, Target,
}

export default function PipelineSettingsPage() {
  const router = useRouter()
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general')
  const [errors, setErrors] = useState<string[]>([])

  // Load stages on mount
  useEffect(() => {
    const loaded = loadPipelineStages()
    setStages(loaded)
  }, [])

  // Track changes
  useEffect(() => {
    const original = loadPipelineStages()
    const changed = JSON.stringify(stages) !== JSON.stringify(original)
    setHasChanges(changed)
  }, [stages])

  const addStage = () => {
    const newStage: PipelineStage = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      icon: 'User',
      color: 'bg-gray-100 border-gray-200',
      order: stages.length,
    }
    setStages([...stages, newStage])
  }

  const removeStage = (index: number) => {
    if (stages.length <= 2) {
      alert('Pipeline must have at least 2 stages')
      return
    }
    setStages(stages.filter((_, i) => i !== index))
  }

  const updateStage = (index: number, updates: Partial<PipelineStage>) => {
    setStages(stages.map((stage, i) =>
      i === index ? { ...stage, ...updates } : stage
    ))
  }

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= stages.length) return

    const newStages = [...stages]
    ;[newStages[index], newStages[newIndex]] = [newStages[newIndex], newStages[index]]
    setStages(newStages)
  }

  const handleSave = () => {
    const validation = validateStages(stages)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    const success = savePipelineStages(stages)
    if (success) {
      setErrors([])
      setHasChanges(false)
      alert('Pipeline stages saved successfully!')
    } else {
      alert('Failed to save pipeline stages')
    }
  }

  const handleReset = () => {
    if (!confirm('Reset to default 4-stage pipeline? This will discard your custom stages.')) return
    resetToDefaultStages()
    setStages(loadPipelineStages())
    setHasChanges(false)
  }

  const handleLoadTemplate = (templateKey: string) => {
    if (hasChanges && !confirm('Loading a template will discard your unsaved changes. Continue?')) return
    setSelectedTemplate(templateKey)
    const template = STAGE_TEMPLATES[templateKey as keyof typeof STAGE_TEMPLATES]
    if (template) {
      setStages([...template.stages])
    }
  }

  const IconComponent = (iconName: string) => {
    const Icon = ICON_COMPONENTS[iconName] || User
    return <Icon className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">Pipeline Stages</h1>
              <p className="text-sm text-gray-600 mt-1">Customize your recruitment pipeline stages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasChanges
                  ? 'bg-accent-500 text-white hover:bg-accent-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Validation Errors:</h3>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Templates */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(STAGE_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleLoadTemplate(key)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedTemplate === key
                    ? 'border-accent-500 bg-accent-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.stages.length} stages</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stage Editor */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Custom Stages</h2>
            <button
              onClick={addStage}
              disabled={stages.length >= 10}
              className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Stage
            </button>
          </div>

          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Order controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStage(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <button
                    onClick={() => moveStage(index, 'down')}
                    disabled={index === stages.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                {/* Stage number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                {/* Name input */}
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStage(index, { name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Stage name"
                />

                {/* Icon selector */}
                <select
                  value={stage.icon}
                  onChange={(e) => updateStage(index, { icon: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>

                {/* Color selector */}
                <select
                  value={stage.color}
                  onChange={(e) => updateStage(index, { color: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                >
                  {AVAILABLE_COLORS.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>

                {/* Preview */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${stage.color}`}>
                  {IconComponent(stage.icon)}
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeStage(index)}
                  disabled={stages.length <= 2}
                  className="flex-shrink-0 text-red-600 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Limits info */}
          <p className="text-sm text-gray-600 mt-4">
            {stages.length}/10 stages • Minimum 2 stages required
          </p>
        </div>
      </div>
    </div>
  )
}
