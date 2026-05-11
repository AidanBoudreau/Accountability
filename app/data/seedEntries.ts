import type { WorkoutEntry } from '../types'

// Personal bests from 2025-05-10, with leg extension progression noted on 2026-05-10
export const SEED_ENTRIES: WorkoutEntry[] = [
  // Shoulders
  { id: 'seed-1',  exerciseId: 'front-delt',                weight: 20,  reps: 8,  sets: 1, date: '2025-05-10' },
  { id: 'seed-2',  exerciseId: 'side-delt',                 weight: 20,  reps: 8,  sets: 1, date: '2025-05-10' },
  { id: 'seed-3',  exerciseId: 'rear-delt',                 weight: 95,  reps: 7,  sets: 1, date: '2025-05-10' },
  { id: 'seed-4',  exerciseId: 'dumbbell-raises',           weight: 35,  reps: 6,  sets: 1, date: '2025-05-10' },
  { id: 'seed-5',  exerciseId: 'dips',                      weight: 40,  reps: 8,  sets: 1, date: '2025-05-10' },
  // Chest
  { id: 'seed-6',  exerciseId: 'dumbbell-bench',            weight: 50,  reps: 8,  sets: 1, date: '2025-05-10' },
  { id: 'seed-7',  exerciseId: 'bench-press',               weight: 150, reps: 1,  sets: 1, date: '2025-05-10' },
  // Triceps
  { id: 'seed-8',  exerciseId: 'tricep-pushdown-angled',    weight: 100, reps: 8,  sets: 1, date: '2025-05-10' },
  { id: 'seed-9',  exerciseId: 'tricep-pushdown-individual',weight: 40,  reps: 8,  sets: 1, date: '2025-05-10' },
  // Biceps
  { id: 'seed-10', exerciseId: 'preacher-curl',             weight: 30,  reps: 2,  sets: 1, date: '2025-05-10' },
  { id: 'seed-11', exerciseId: 'preacher-hammer-curl',      weight: 25,  reps: 10, sets: 1, date: '2025-05-10' },
  { id: 'seed-12', exerciseId: 'cable-bicep-curl',          weight: 60,  reps: 15, sets: 1, date: '2025-05-10' },
  // Back
  { id: 'seed-13', exerciseId: 'cable-rows',                weight: 110, reps: 10, sets: 1, date: '2025-05-10' },
  { id: 'seed-14', exerciseId: 'cable-pulldown',            weight: 120, reps: 10, sets: 1, date: '2025-05-10' },
  // Legs
  { id: 'seed-15', exerciseId: 'leg-extension',             weight: 155, reps: 8,  sets: 1, date: '2025-05-10' },
  { id: 'seed-16', exerciseId: 'leg-curl',                  weight: 90,  reps: 10, sets: 1, date: '2025-05-10' },
  { id: 'seed-17', exerciseId: 'leg-press',                 weight: 210, reps: 8,  sets: 1, date: '2025-05-10' },
  { id: 'seed-18', exerciseId: 'single-leg-glute',          weight: 110, reps: 8,  sets: 1, date: '2025-05-10' },
  // Leg Extension progression: same weight, more reps → new PR on 2026-05-10
  { id: 'seed-19', exerciseId: 'leg-extension',             weight: 155, reps: 10, sets: 1, date: '2026-05-10' },
]
