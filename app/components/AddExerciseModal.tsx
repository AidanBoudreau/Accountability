'use client'

import { useState, useMemo } from 'react'
import type { Exercise, ExerciseTemplate, MuscleGroup } from '../types'
import { EXERCISE_TEMPLATES } from '../data/exerciseTemplates'
import { MUSCLE_LABELS, MUSCLE_GROUP_SECTIONS } from '../data/muscleGroups'

type Props = {
  onAdd: (exercise: Exercise) => void
  onClose: () => void
}

const STANDARD_CATEGORIES = ['Shoulders', 'Chest', 'Triceps', 'Biceps', 'Back', 'Legs', 'Core']

export default function AddExerciseModal({ onAdd, onClose }: Props) {
  const [mode, setMode] = useState<'template' | 'custom'>('template')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ExerciseTemplate | null>(null)
  const [customName, setCustomName] = useState('')

  // Custom mode state
  const [cName, setCName] = useState('')
  const [cCategory, setCCategory] = useState(STANDARD_CATEGORIES[0])
  const [cNewCategory, setCNewCategory] = useState('')
  const [cMuscles, setCMuscles] = useState<MuscleGroup[]>([])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return EXERCISE_TEMPLATES
    return EXERCISE_TEMPLATES.filter((t) =>
      t.defaultName.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.muscleGroups.some((mg) => MUSCLE_LABELS[mg].toLowerCase().includes(q))
    )
  }, [query])

  const grouped = useMemo(() => {
    const map = new Map<string, ExerciseTemplate[]>()
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category)!.push(t)
    }
    return map
  }, [filtered])

  function handleSelectTemplate(t: ExerciseTemplate) {
    setSelected(t)
    setCustomName(t.defaultName)
  }

  function handleAddFromTemplate() {
    if (!selected) return
    const name = customName.trim() || selected.defaultName
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    onAdd({
      id: `custom-${slug}-${Date.now()}`,
      name,
      category: selected.category,
      muscleGroups: selected.muscleGroups,
    })
  }

  function toggleMuscle(mg: MuscleGroup) {
    setCMuscles((prev) =>
      prev.includes(mg) ? prev.filter((m) => m !== mg) : [...prev, mg]
    )
  }

  function handleAddCustom(e: React.FormEvent) {
    e.preventDefault()
    const name = cName.trim()
    const cat = cCategory === '__new__' ? cNewCategory.trim() : cCategory
    if (!name || !cat || cMuscles.length === 0) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    onAdd({ id: `custom-${slug}-${Date.now()}`, name, category: cat, muscleGroups: cMuscles })
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <h2 className="text-lg font-bold text-zinc-100">Add Exercise</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 text-2xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" aria-label="Close">×</button>
        </div>

        {/* Mode tabs */}
        <div className="flex px-5 gap-2 mb-3 shrink-0">
          <button
            onClick={() => setMode('template')}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'template' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            Browse Library
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'custom' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            Custom
          </button>
        </div>

        {mode === 'template' ? (
          <>
            {/* Search */}
            <div className="px-5 mb-3 shrink-0">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
                placeholder="Search by name or muscle…"
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Template list */}
            <div className="overflow-y-auto flex-1 px-5 pb-2">
              {grouped.size === 0 ? (
                <p className="text-zinc-600 text-sm text-center py-8">No exercises match &ldquo;{query}&rdquo;</p>
              ) : (
                Array.from(grouped.entries()).map(([category, templates]) => (
                  <div key={category} className="mb-4">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{category}</p>
                    <div className="space-y-1">
                      {templates.map((t) => {
                        const isSelected = selected?.id === t.id
                        return (
                          <button
                            key={t.id}
                            onClick={() => handleSelectTemplate(t)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-orange-500/15 border-orange-500/50'
                                : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
                            }`}
                          >
                            <p className={`text-sm font-medium ${isSelected ? 'text-orange-300' : 'text-zinc-200'}`}>
                              {t.defaultName}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {t.muscleGroups.map((mg) => MUSCLE_LABELS[mg]).join(' · ')}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Confirm section */}
            {selected && (
              <div className="px-5 pt-3 pb-5 border-t border-zinc-800 shrink-0">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Your name for this exercise</label>
                <input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 mb-3"
                />
                <button
                  onClick={handleAddFromTemplate}
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
                >
                  Add Exercise
                </button>
              </div>
            )}
          </>
        ) : (
          /* Custom mode */
          <form onSubmit={handleAddCustom} className="overflow-y-auto flex-1 px-5 pb-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Exercise Name</label>
              <input
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="e.g. Cable Fly"
                required
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
              <select
                value={cCategory}
                onChange={(e) => setCCategory(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                {STANDARD_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                <option value="__new__">+ New category…</option>
              </select>
            </div>

            {cCategory === '__new__' && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category Name</label>
                <input
                  value={cNewCategory}
                  onChange={(e) => setCNewCategory(e.target.value)}
                  placeholder="e.g. Cardio"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Muscles Worked <span className="text-zinc-600">(pick at least one)</span>
              </label>
              <div className="space-y-3">
                {MUSCLE_GROUP_SECTIONS.map((section) => (
                  <div key={section.label}>
                    <p className="text-xs text-zinc-600 mb-1.5">{section.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {section.groups.map((mg) => {
                        const active = cMuscles.includes(mg)
                        return (
                          <button
                            key={mg}
                            type="button"
                            onClick={() => toggleMuscle(mg)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                              active
                                ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                            }`}
                          >
                            {MUSCLE_LABELS[mg]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={cMuscles.length === 0}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add Exercise
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
