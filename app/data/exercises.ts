import type { Exercise } from '../types'

export const DEFAULT_EXERCISES: Exercise[] = [
  // Shoulders
  { id: 'front-delt',                name: 'Front Delt Raise',            category: 'Shoulders', muscleGroups: ['shoulders-front'] },
  { id: 'side-delt',                 name: 'Side Delt Raise',             category: 'Shoulders', muscleGroups: ['shoulders-side'] },
  { id: 'rear-delt',                 name: 'Rear Delt',                   category: 'Shoulders', muscleGroups: ['shoulders-rear', 'back-upper'] },
  { id: 'dumbbell-raises',           name: 'Dumbbell Raises',             category: 'Shoulders', muscleGroups: ['shoulders-side'] },
  { id: 'dips',                      name: 'Dips',                        category: 'Shoulders', muscleGroups: ['chest-lower', 'triceps-long', 'triceps-lateral'] },
  // Chest
  { id: 'dumbbell-bench',            name: 'Dumbbell Bench',              category: 'Chest',     muscleGroups: ['chest-mid', 'chest-lower', 'triceps-lateral'] },
  { id: 'bench-press',               name: 'Bench Press',                 category: 'Chest',     muscleGroups: ['chest-mid', 'chest-lower', 'shoulders-front', 'triceps-lateral'] },
  // Triceps
  { id: 'tricep-pushdown-angled',    name: 'Tricep Pushdown (Angled)',    category: 'Triceps',   muscleGroups: ['triceps-lateral', 'triceps-medial'] },
  { id: 'tricep-pushdown-individual',name: 'Tricep Pushdown (Individual)',category: 'Triceps',   muscleGroups: ['triceps-lateral', 'triceps-medial'] },
  // Biceps
  { id: 'preacher-curl',             name: 'Preacher Curl',               category: 'Biceps',    muscleGroups: ['biceps-short'] },
  { id: 'preacher-hammer-curl',      name: 'Preacher Hammer Curl',        category: 'Biceps',    muscleGroups: ['biceps-brachialis', 'biceps-long'] },
  { id: 'cable-bicep-curl',          name: 'Cable Bicep Curl',            category: 'Biceps',    muscleGroups: ['biceps-short', 'biceps-long'] },
  // Back
  { id: 'cable-rows',                name: 'Cable Rows',                  category: 'Back',      muscleGroups: ['back-mid', 'back-lats', 'biceps-long'] },
  { id: 'cable-pulldown',            name: 'Cable Pulldown',              category: 'Back',      muscleGroups: ['back-lats', 'biceps-short'] },
  // Legs
  { id: 'leg-extension',             name: 'Leg Extension',               category: 'Legs',      muscleGroups: ['legs-quads'] },
  { id: 'leg-curl',                  name: 'Leg Curl',                    category: 'Legs',      muscleGroups: ['legs-hamstrings'] },
  { id: 'leg-press',                 name: 'Leg Press',                   category: 'Legs',      muscleGroups: ['legs-quads', 'legs-glutes'] },
  { id: 'single-leg-glute',          name: 'Single Leg Glute',            category: 'Legs',      muscleGroups: ['legs-glutes', 'legs-hamstrings'] },
]
