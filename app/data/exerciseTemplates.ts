import type { ExerciseTemplate } from '../types'

export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  // ── Shoulders ───────────────────────────────────────────────────────────
  { id: 'tpl-ohp',            defaultName: 'Overhead Press',            category: 'Shoulders', muscleGroups: ['shoulders-front', 'shoulders-side', 'triceps-lateral'] },
  { id: 'tpl-lateral-raise',  defaultName: 'Lateral Raise',             category: 'Shoulders', muscleGroups: ['shoulders-side'] },
  { id: 'tpl-front-raise',    defaultName: 'Front Delt Raise',          category: 'Shoulders', muscleGroups: ['shoulders-front'] },
  { id: 'tpl-rear-delt',      defaultName: 'Rear Delt Fly / Face Pull', category: 'Shoulders', muscleGroups: ['shoulders-rear', 'back-upper'] },
  { id: 'tpl-upright-row',    defaultName: 'Upright Row',               category: 'Shoulders', muscleGroups: ['shoulders-side', 'back-upper'] },

  // ── Chest ────────────────────────────────────────────────────────────────
  { id: 'tpl-bench',          defaultName: 'Bench Press',               category: 'Chest', muscleGroups: ['chest-mid', 'chest-lower', 'shoulders-front', 'triceps-lateral'] },
  { id: 'tpl-incline',        defaultName: 'Incline Press',             category: 'Chest', muscleGroups: ['chest-upper', 'shoulders-front', 'triceps-lateral'] },
  { id: 'tpl-dips',           defaultName: 'Dips',                      category: 'Chest', muscleGroups: ['chest-lower', 'triceps-long', 'triceps-lateral'] },
  { id: 'tpl-chest-fly',      defaultName: 'Chest Fly / Pec Deck',      category: 'Chest', muscleGroups: ['chest-mid'] },

  // ── Triceps ──────────────────────────────────────────────────────────────
  { id: 'tpl-pushdown',       defaultName: 'Tricep Pushdown',           category: 'Triceps', muscleGroups: ['triceps-lateral', 'triceps-medial'] },
  { id: 'tpl-overhead-ext',   defaultName: 'Overhead Tricep Extension', category: 'Triceps', muscleGroups: ['triceps-long', 'triceps-lateral'] },
  { id: 'tpl-close-grip',     defaultName: 'Close-Grip Bench Press',    category: 'Triceps', muscleGroups: ['triceps-lateral', 'triceps-medial', 'chest-mid'] },

  // ── Biceps ───────────────────────────────────────────────────────────────
  { id: 'tpl-curl',           defaultName: 'Bicep Curl',                category: 'Biceps', muscleGroups: ['biceps-short', 'biceps-long'] },
  { id: 'tpl-hammer-curl',    defaultName: 'Hammer Curl',               category: 'Biceps', muscleGroups: ['biceps-brachialis', 'biceps-long'] },
  { id: 'tpl-preacher-curl',  defaultName: 'Preacher Curl',             category: 'Biceps', muscleGroups: ['biceps-short'] },
  { id: 'tpl-reverse-curl',   defaultName: 'Reverse Curl',              category: 'Biceps', muscleGroups: ['biceps-brachialis', 'forearms'] },

  // ── Back ─────────────────────────────────────────────────────────────────
  { id: 'tpl-pulldown',       defaultName: 'Lat Pulldown',              category: 'Back', muscleGroups: ['back-lats', 'biceps-short'] },
  { id: 'tpl-pullup',         defaultName: 'Pull-Up / Chin-Up',         category: 'Back', muscleGroups: ['back-lats', 'back-mid', 'biceps-short'] },
  { id: 'tpl-row',            defaultName: 'Row',                       category: 'Back', muscleGroups: ['back-mid', 'back-lats', 'biceps-long'] },
  { id: 'tpl-deadlift',       defaultName: 'Deadlift',                  category: 'Back', muscleGroups: ['back-lower', 'legs-glutes', 'legs-hamstrings'] },
  { id: 'tpl-rdl',            defaultName: 'Romanian Deadlift',         category: 'Back', muscleGroups: ['back-lower', 'legs-hamstrings', 'legs-glutes'] },
  { id: 'tpl-hyperextension', defaultName: 'Hyperextension',            category: 'Back', muscleGroups: ['back-lower'] },

  // ── Legs ─────────────────────────────────────────────────────────────────
  { id: 'tpl-squat',          defaultName: 'Squat',                     category: 'Legs', muscleGroups: ['legs-quads', 'legs-glutes', 'legs-hamstrings'] },
  { id: 'tpl-leg-press',      defaultName: 'Leg Press',                 category: 'Legs', muscleGroups: ['legs-quads', 'legs-glutes'] },
  { id: 'tpl-leg-extension',  defaultName: 'Leg Extension',             category: 'Legs', muscleGroups: ['legs-quads'] },
  { id: 'tpl-leg-curl',       defaultName: 'Leg Curl',                  category: 'Legs', muscleGroups: ['legs-hamstrings'] },
  { id: 'tpl-lunge',          defaultName: 'Lunge / Split Squat',       category: 'Legs', muscleGroups: ['legs-quads', 'legs-glutes', 'legs-hamstrings'] },
  { id: 'tpl-hip-thrust',     defaultName: 'Hip Thrust / Glute Bridge', category: 'Legs', muscleGroups: ['legs-glutes', 'legs-hamstrings'] },
  { id: 'tpl-calf-raise',     defaultName: 'Calf Raise',                category: 'Legs', muscleGroups: ['legs-calves'] },
  { id: 'tpl-adductor',       defaultName: 'Adductor Machine',          category: 'Legs', muscleGroups: ['legs-adductors'] },

  // ── Core ─────────────────────────────────────────────────────────────────
  { id: 'tpl-plank',          defaultName: 'Plank',                     category: 'Core', muscleGroups: ['core-abs', 'core-lower'] },
  { id: 'tpl-crunch',         defaultName: 'Crunch',                    category: 'Core', muscleGroups: ['core-abs'] },
  { id: 'tpl-cable-crunch',   defaultName: 'Cable Crunch',              category: 'Core', muscleGroups: ['core-abs'] },
  { id: 'tpl-leg-raise',      defaultName: 'Hanging Leg Raise',         category: 'Core', muscleGroups: ['core-lower', 'core-abs'] },
  { id: 'tpl-russian-twist',  defaultName: 'Russian Twist',             category: 'Core', muscleGroups: ['core-obliques'] },
  { id: 'tpl-ab-rollout',     defaultName: 'Ab Rollout',                category: 'Core', muscleGroups: ['core-abs', 'core-lower'] },
  { id: 'tpl-side-plank',     defaultName: 'Side Plank',                category: 'Core', muscleGroups: ['core-obliques'] },
]
