'use client'

import { useState } from 'react'
import type { Exercise } from '../types'

type Props = {
  exercises: Exercise[]
  defaultExerciseId?: string
  onSave: (exerciseId: string, weight: number, reps: number, date: string) => void
  onClose: () => void
}

const inputClass =
  'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 text-zinc-100 placeholder-zinc-600'

export default function LogWorkoutModal({ exercises, defaultExerciseId, onSave, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [exerciseId, setExerciseId] = useState(defaultExerciseId ?? exercises[0]?.id ?? '')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState(today)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const w = parseFloat(weight)
    const r = parseInt(reps)
    if (!exerciseId || isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return
    onSave(exerciseId, w, r, date)
  }

  const categories = [...new Set(exercises.map((e) => e.category))]

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-100">Log Workout</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 text-2xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Exercise</label>
            <select
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
              className={inputClass}
            >
              {categories.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {exercises
                    .filter((ex) => ex.category === cat)
                    .map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Weight (lbs)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="30"
                min="0"
                step="0.5"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="8"
                min="1"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors mt-2"
          >
            Save Workout
          </button>
        </form>
      </div>
    </div>
  )
}
