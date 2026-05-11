import type { DayLog } from '../types'

const GOAL_IDS = ['calories', 'weigh', 'steps']

// Past 5 days (2026-05-05 through 2026-05-09) all goals completed
export const SEED_CONSISTENCY: DayLog[] = [
  { date: '2026-05-05', completedGoalIds: [...GOAL_IDS] },
  { date: '2026-05-06', completedGoalIds: [...GOAL_IDS] },
  { date: '2026-05-07', completedGoalIds: [...GOAL_IDS] },
  { date: '2026-05-08', completedGoalIds: [...GOAL_IDS] },
  { date: '2026-05-09', completedGoalIds: [...GOAL_IDS] },
]
