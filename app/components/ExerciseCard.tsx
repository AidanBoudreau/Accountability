'use client'

import type { Exercise, PersonalRecord, WorkoutEntry } from '../types'

type Props = {
  exercise: Exercise
  pr: PersonalRecord | null
  lastEntry: WorkoutEntry | null
  workoutNote: string
  onClick: () => void
}

export default function ExerciseCard({ exercise, pr, lastEntry, workoutNote, onClick }: Props) {
  const atPR = pr !== null && lastEntry !== null && lastEntry.weight === pr.weight

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <p className="text-sm text-zinc-400 font-medium leading-tight mb-2">{exercise.name}</p>
      {lastEntry ? (
        <p className={`text-sm font-bold tabular-nums ${atPR ? 'text-emerald-400' : 'text-zinc-100'}`}>
          {lastEntry.weight} lb × {lastEntry.reps}
        </p>
      ) : (
        <p className="text-sm text-zinc-600">—</p>
      )}
      {workoutNote && (
        <p className="text-xs text-zinc-100 mt-1.5 leading-snug line-clamp-2 opacity-70">{workoutNote}</p>
      )}
    </button>
  )
}
