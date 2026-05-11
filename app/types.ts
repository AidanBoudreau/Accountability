export type MuscleGroup =
  | 'chest-upper' | 'chest-mid' | 'chest-lower'
  | 'shoulders-front' | 'shoulders-side' | 'shoulders-rear'
  | 'triceps-long' | 'triceps-lateral' | 'triceps-medial'
  | 'biceps-long' | 'biceps-short' | 'biceps-brachialis'
  | 'back-lats' | 'back-mid' | 'back-lower' | 'back-upper'
  | 'legs-quads' | 'legs-hamstrings' | 'legs-glutes' | 'legs-calves' | 'legs-adductors'
  | 'core-abs' | 'core-obliques' | 'core-lower'
  | 'forearms'

export type Exercise = {
  id: string
  name: string
  category: string
  muscleGroups: MuscleGroup[]  // first = primary
}

export type ExerciseTemplate = {
  id: string
  defaultName: string
  category: string
  muscleGroups: MuscleGroup[]
}

export type WorkoutEntry = {
  id: string
  exerciseId: string
  weight: number
  reps: number
  sets: number
  date: string
}

export type PersonalRecord = {
  weight: number
  reps: number
  date: string
}

export type BodyWeightEntry = {
  id: string
  weight: number
  date: string
}

export type DayLog = {
  date: string
  completedGoalIds: string[]
}

export type Goal = {
  id: string
  name: string
}

export type BodyFatEntry = {
  id: string
  percentage: number
  date: string
}
