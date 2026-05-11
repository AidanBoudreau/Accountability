'use client'

import { useState } from 'react'
import type { Exercise, WorkoutEntry, PersonalRecord } from '../types'
import { MUSCLE_LABELS } from '../data/muscleGroups'

type Props = {
  exercise: Exercise
  entries: WorkoutEntry[]
  pr: PersonalRecord | null
  workoutNote: string
  onNoteChange: (note: string) => void
  onLog: () => void
  onDelete: (id: string) => void
  onDeleteExercise: (id: string) => void
}

export default function ExerciseDetail({ exercise, entries, pr, workoutNote, onNoteChange, onLog, onDelete, onDeleteExercise }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(false)
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.weight - a.weight)

  return (
    <div>
      {/* Name + category */}
      <div className="mb-3">
        <h2 className="text-xl font-bold text-zinc-100 leading-tight">{exercise.name}</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{exercise.category}</p>
      </div>

      {/* Muscle groups */}
      {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {exercise.muscleGroups.map((mg, i) => (
            <span
              key={mg}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                i === 0
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  : 'bg-zinc-800/60 text-zinc-500 border-zinc-700/60'
              }`}
            >
              {MUSCLE_LABELS[mg]}
            </span>
          ))}
        </div>
      )}

      {/* PR */}
      {pr && (
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm font-semibold">
            PR — {pr.weight} lb × {pr.reps} reps
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Current Workout
        </h3>
        <textarea
          value={workoutNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="e.g. 80, 90, 100 lb × 12, 10, 8 reps"
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">History</h3>
        {confirmDeleteExercise ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Delete exercise?</span>
            <button
              onClick={() => onDeleteExercise(exercise.id)}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDeleteExercise(false)}
              className="px-2.5 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDeleteExercise(true)}
            className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
          >
            Delete exercise
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="text-zinc-600 text-sm">No workouts logged yet.</p>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((entry) => {
            const isPR = pr && entry.weight === pr.weight && entry.reps === pr.reps
            if (confirmId === entry.id) {
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-red-800/60"
                >
                  <span className="text-sm text-zinc-400">Delete permanently?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onDelete(entry.id); setConfirmId(null) }}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      No
                    </button>
                  </div>
                </div>
              )
            }
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  {isPR && (
                    <span className="text-xs text-amber-400 font-semibold shrink-0">PR</span>
                  )}
                  <span className={`font-semibold text-sm tabular-nums ${isPR ? 'text-emerald-400' : 'text-zinc-100'}`}>
                    {entry.weight} lbs × {entry.reps} reps
                  </span>
                  <span className="text-xs text-zinc-600">{entry.date}</span>
                </div>
                <button
                  onClick={() => setConfirmId(entry.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors text-lg leading-none px-1"
                  aria-label="Delete entry"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
