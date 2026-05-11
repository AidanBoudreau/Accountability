'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Exercise, WorkoutEntry, PersonalRecord } from '../types'
import { DEFAULT_EXERCISES } from '../data/exercises'
import { SEED_ENTRIES } from '../data/seedEntries'
import { SEED_WORKOUT_NOTES } from '../data/workoutNotes'
import ExerciseCard from './ExerciseCard'
import ExerciseDetail from './ExerciseDetail'
import LogWorkoutModal from './LogWorkoutModal'
import AddExerciseModal from './AddExerciseModal'

const ENTRIES_KEY = 'gym-tracker-v2'
const CUSTOM_EXERCISES_KEY = 'gym-custom-exercises-v1'
const WORKOUT_NOTES_KEY = 'gym-workout-notes-v1'
const DELETED_EXERCISES_KEY = 'gym-deleted-exercises-v1'

type View = { type: 'dashboard' } | { type: 'exercise'; exerciseId: string }

function getPR(entries: WorkoutEntry[]): PersonalRecord | null {
  if (entries.length === 0) return null
  return entries.reduce<PersonalRecord>(
    (best, e) => {
      if (e.weight > best.weight || (e.weight === best.weight && e.reps > best.reps)) {
        return { weight: e.weight, reps: e.reps, date: e.date }
      }
      return best
    },
    { weight: entries[0].weight, reps: entries[0].reps, date: entries[0].date }
  )
}

export default function GymTracker() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([])
  const [customExercises, setCustomExercises] = useState<Exercise[]>([])
  const [deletedExerciseIds, setDeletedExerciseIds] = useState<string[]>([])
  const [workoutNotes, setWorkoutNotes] = useState<Record<string, string>>({})
  const [view, setView] = useState<View>({ type: 'dashboard' })
  const [showModal, setShowModal] = useState(false)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [modalDefaultExercise, setModalDefaultExercise] = useState<string | undefined>(undefined)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(ENTRIES_KEY)
      setEntries(storedEntries ? JSON.parse(storedEntries) : SEED_ENTRIES)

      const storedCustom = localStorage.getItem(CUSTOM_EXERCISES_KEY)
      setCustomExercises(storedCustom ? JSON.parse(storedCustom) : [])

      const storedDeleted = localStorage.getItem(DELETED_EXERCISES_KEY)
      setDeletedExerciseIds(storedDeleted ? JSON.parse(storedDeleted) : [])

      const storedNotes = localStorage.getItem(WORKOUT_NOTES_KEY)
      setWorkoutNotes(storedNotes ? JSON.parse(storedNotes) : { ...SEED_WORKOUT_NOTES })
    } catch {
      setEntries(SEED_ENTRIES)
      setWorkoutNotes({ ...SEED_WORKOUT_NOTES })
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  }, [entries, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(customExercises))
  }, [customExercises, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(DELETED_EXERCISES_KEY, JSON.stringify(deletedExerciseIds))
  }, [deletedExerciseIds, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(WORKOUT_NOTES_KEY, JSON.stringify(workoutNotes))
  }, [workoutNotes, hydrated])

  const allExercises = useMemo(
    () => [...DEFAULT_EXERCISES, ...customExercises].filter((e) => !deletedExerciseIds.includes(e.id)),
    [customExercises, deletedExerciseIds]
  )

  const categories = useMemo(
    () => [...new Set(allExercises.map((e) => e.category))],
    [allExercises]
  )

  const activeExercise =
    view.type === 'exercise'
      ? allExercises.find((e) => e.id === view.exerciseId) ?? null
      : null

  function handleSave(exerciseId: string, weight: number, reps: number, date: string) {
    const entry: WorkoutEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      exerciseId,
      weight,
      reps,
      sets: 1,
      date,
    }
    setEntries((prev) => [...prev, entry])
    setShowModal(false)
  }

  function handleDeleteEntry(entryId: string) {
    setEntries((prev) => prev.filter((e) => e.id !== entryId))
  }

  function handleDeleteExercise(exerciseId: string) {
    setDeletedExerciseIds((prev) => [...prev, exerciseId])
    setEntries((prev) => prev.filter((e) => e.exerciseId !== exerciseId))
    setCustomExercises((prev) => prev.filter((e) => e.id !== exerciseId))
    setView({ type: 'dashboard' })
  }

  function handleAddExercise(exercise: Exercise) {
    setCustomExercises((prev) => [...prev, exercise])
    setShowAddExercise(false)
  }

  function openModal(exerciseId?: string) {
    setModalDefaultExercise(exerciseId)
    setShowModal(true)
  }

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
        Loading...
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/80 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {view.type === 'exercise' && (
              <button
                onClick={() => setView({ type: 'dashboard' })}
                className="text-zinc-400 hover:text-zinc-100 transition-colors mr-1 text-sm"
                aria-label="Back to dashboard"
              >
                ← Back
              </button>
            )}
            <h1 className="font-bold text-base text-zinc-100">
              {view.type === 'dashboard' ? 'GymTracker' : activeExercise?.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {view.type === 'dashboard' && (
              <button
                onClick={() => setShowAddExercise(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-colors border border-zinc-700"
              >
                + New Workout
              </button>
            )}
            <button
              onClick={() => openModal(view.type === 'exercise' ? view.exerciseId : undefined)}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
            >
              + Log Set
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-20 w-full flex-1">
        {view.type === 'dashboard' && (
          <div className="space-y-8">
            {categories.map((category) => {
              const exercises = allExercises.filter((e) => e.category === category)
              return (
                <section key={category}>
                  <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                    {category}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {exercises.map((exercise) => {
                      const exEntries = entries.filter((e) => e.exerciseId === exercise.id)
                      const pr = getPR(exEntries)
                      const lastEntry =
                        exEntries.length > 0
                          ? exEntries.reduce((latest, e) => (e.date > latest.date ? e : latest))
                          : null
                      return (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          pr={pr}
                          lastEntry={lastEntry}
                          workoutNote={workoutNotes[exercise.id] ?? ''}
                          onClick={() => { setView({ type: 'exercise', exerciseId: exercise.id }); window.scrollTo(0, 0) }}
                        />
                      )
                    })}
                  </div>
                </section>
              )
            })}

          </div>
        )}

        {view.type === 'exercise' && activeExercise && (
          <ExerciseDetail
            exercise={activeExercise}
            entries={entries.filter((e) => e.exerciseId === activeExercise.id)}
            pr={getPR(entries.filter((e) => e.exerciseId === activeExercise.id))}
            workoutNote={workoutNotes[activeExercise.id] ?? ''}
            onNoteChange={(note) =>
              setWorkoutNotes((prev) => ({ ...prev, [activeExercise.id]: note }))
            }
            onLog={() => openModal(activeExercise.id)}
            onDelete={handleDeleteEntry}
            onDeleteExercise={handleDeleteExercise}
          />
        )}
      </main>

      {showModal && (
        <LogWorkoutModal
          exercises={allExercises}
          defaultExerciseId={modalDefaultExercise}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showAddExercise && (
        <AddExerciseModal
          onAdd={handleAddExercise}
          onClose={() => setShowAddExercise(false)}
        />
      )}
    </>
  )
}
