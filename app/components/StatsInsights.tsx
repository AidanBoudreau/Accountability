'use client'

import { useState, useEffect } from 'react'
import type { WorkoutEntry, BodyWeightEntry, Exercise, MuscleGroup } from '../types'
import { DEFAULT_EXERCISES } from '../data/exercises'
import { MUSCLE_LABELS, MUSCLE_GROUP_SECTIONS } from '../data/muscleGroups'

const ALL_MUSCLE_GROUPS = MUSCLE_GROUP_SECTIONS.flatMap((s) => s.groups)

type Insight = { label: string; text: string }

// ── Build muscle profile from logged exercises ──────────────────────────────

function buildProfile(entries: WorkoutEntry[], allExercises: Exercise[]) {
  const trained = new Set<MuscleGroup>()
  const muscleMax: Partial<Record<MuscleGroup, number>> = {}

  for (const ex of allExercises) {
    const exEntries = entries.filter((e) => e.exerciseId === ex.id)
    if (exEntries.length === 0) continue
    const maxW = Math.max(...exEntries.map((e) => e.weight))
    for (const mg of ex.muscleGroups ?? []) {
      trained.add(mg)
      if (!muscleMax[mg] || maxW > muscleMax[mg]!) muscleMax[mg] = maxW
    }
  }

  return { trained, muscleMax }
}

// ── Performance insights ────────────────────────────────────────────────────

function generatePerformanceInsights(
  entries: WorkoutEntry[],
  bodyWeights: BodyWeightEntry[],
  muscleMax: Partial<Record<MuscleGroup, number>>
): Insight[] {
  if (entries.length === 0 && bodyWeights.length === 0) return []

  const insights: Insight[] = []

  const latestBW = bodyWeights.length > 0
    ? [...bodyWeights].sort((a, b) => b.date.localeCompare(a.date))[0].weight
    : null

  // Body weight trend
  if (bodyWeights.length >= 2) {
    const sorted = [...bodyWeights].sort((a, b) => a.date.localeCompare(b.date))
    const diff = sorted[sorted.length - 1].weight - sorted[0].weight
    if (Math.abs(diff) < 1) {
      insights.push({ label: 'Weight Stability', text: 'Your weight has been rock solid — that kind of consistency takes real discipline.' })
    } else if (diff < 0) {
      insights.push({ label: 'Weight Trend', text: `Down ${Math.abs(diff).toFixed(1)} lbs since you started tracking — the effort is paying off.` })
    } else {
      insights.push({ label: 'Weight Trend', text: `Up ${diff.toFixed(1)} lbs since tracking began. If you're building muscle that's exactly what should happen — let the strength numbers tell the full story.` })
    }
  }

  // Chest strength vs bodyweight (uses any chest exercise as proxy)
  const chestBest = Math.max(muscleMax['chest-mid'] ?? 0, muscleMax['chest-upper'] ?? 0, muscleMax['chest-lower'] ?? 0)
  if (chestBest > 0 && latestBW) {
    const pct = Math.round((chestBest / latestBW) * 100)
    if (pct >= 100) {
      insights.push({ label: 'Chest Strength', text: `Your top chest lift is ${pct}% of your bodyweight — that puts you well above the recreational average for upper body pressing power.` })
    } else {
      insights.push({ label: 'Chest Strength', text: `Your top chest lift is ${pct}% of bodyweight. Pushing toward 1× bodyweight on a compound press is a solid milestone to aim for.` })
    }
  }

  // Push vs pull balance
  const pushBest = Math.max(muscleMax['chest-mid'] ?? 0, muscleMax['chest-upper'] ?? 0, muscleMax['chest-lower'] ?? 0, muscleMax['shoulders-front'] ?? 0)
  const pullBest = Math.max(muscleMax['back-lats'] ?? 0, muscleMax['back-mid'] ?? 0)
  if (pushBest > 0 && pullBest > 0) {
    const ratio = pushBest / pullBest
    if (ratio > 1.3) {
      insights.push({ label: 'Push / Pull Balance', text: 'Your pushing strength leads your pulling. A balanced push/pull ratio protects your shoulder joints and builds more complete upper body development.' })
    } else if (ratio < 0.8) {
      insights.push({ label: 'Push / Pull Balance', text: 'Your back strength leads your chest pressing — excellent for posture and long-term shoulder health.' })
    } else {
      insights.push({ label: 'Push / Pull Balance', text: 'Your pushing and pulling strength are well matched — a great sign for balanced development and healthy joints.' })
    }
  }

  // Quad vs hamstring balance
  const quadBest = muscleMax['legs-quads'] ?? 0
  const hamBest = muscleMax['legs-hamstrings'] ?? 0
  if (quadBest > 0 && hamBest > 0) {
    const ratio = hamBest / quadBest
    if (ratio < 0.5) {
      insights.push({ label: 'Leg Balance', text: `Your hamstrings (${hamBest} lb) are significantly behind your quads (${quadBest} lb). A stronger hamstring-to-quad ratio reduces injury risk and improves knee stability.` })
    } else {
      insights.push({ label: 'Leg Balance', text: `Your quad-to-hamstring balance looks solid — that ratio is important for knee health and athletic performance.` })
    }
  }

  // Chest vs bicep imbalance (the "30lb bench, 30lb curl" flag)
  if (chestBest > 0) {
    const bicepBest = Math.max(muscleMax['biceps-short'] ?? 0, muscleMax['biceps-long'] ?? 0, muscleMax['biceps-brachialis'] ?? 0)
    if (bicepBest > 0 && chestBest < bicepBest * 2) {
      insights.push({
        label: 'Chest vs Bicep Ratio',
        text: `Your top chest lift (${chestBest} lb) is less than 2× your top curl (${bicepBest} lb). For most people, chest compound movements should be significantly heavier than isolation curls — this is a sign the chest may need more focused work or heavier loading.`,
      })
    }
  }

  if (bodyWeights.length === 0 && entries.length > 0) {
    insights.push({ label: 'Unlock More', text: 'Log your body weight in the Health tab to unlock strength-to-weight ratios and richer insights.' })
  }

  return insights.slice(0, 4)
}

// ── Coverage / gap insights ─────────────────────────────────────────────────

type CompoundCheck = {
  muscles: MuscleGroup[]   // fires when ALL of these are untrained
  label: string
  text: string
}

type SubgroupCheck = {
  gap: MuscleGroup
  context: MuscleGroup[]  // only fires if at least one of these IS trained
  label: string
  text: string
}

// Shown when an entire body area has zero training — recommend one compound
const COMPOUND_CHECKS: CompoundCheck[] = [
  {
    muscles: ['chest-mid', 'chest-lower'],
    label: 'No Chest Training',
    text: 'No chest work detected. Bench Press (flat or dumbbell) hits mid and lower chest while also loading the front delt and triceps in one movement — the most efficient starting compound for upper body pushing strength.',
  },
  {
    muscles: ['shoulders-front', 'shoulders-side'],
    label: 'No Shoulder Training',
    text: 'No shoulder pressing detected. Overhead Press recruits the front and side delts together and builds foundational pressing strength that transfers to every upper body lift.',
  },
  {
    muscles: ['triceps-lateral', 'triceps-medial'],
    label: 'No Tricep Training',
    text: 'No tricep work detected. Dips or Close-Grip Bench activate all three tricep heads while also loading the chest — a compound return that beats any pushdown as a starting point.',
  },
  {
    muscles: ['back-lats', 'back-mid'],
    label: 'No Back Training',
    text: 'No back work detected. A basic Row covers mid-back thickness and Lat Pulldown adds width — together they address both dimensions of back development. Starting with either one immediately fills the biggest gap.',
  },
  {
    muscles: ['legs-quads', 'legs-hamstrings', 'legs-glutes'],
    label: 'No Leg Training',
    text: 'No leg work detected. Squats or Leg Press recruit quads, hamstrings, and glutes simultaneously — the most time-efficient way to build lower body strength and the foundation every other leg movement is built on.',
  },
  {
    muscles: ['biceps-short', 'biceps-long'],
    label: 'No Bicep Training',
    text: 'No bicep work detected. A standard Barbell or Dumbbell Curl hits both the short and long head — the simplest compound starting point before adding hammer curls or preacher variations.',
  },
  {
    muscles: ['core-abs', 'core-lower'],
    label: 'No Core Training',
    text: 'No core work detected. A Plank alone trains both the abs and lower abs and takes under 3 minutes — the highest ROI core exercise to start with before adding cable crunches or leg raises.',
  },
]

// Shown when part of an area is already trained but a specific head/sub-group is missing
const SUBGROUP_CHECKS: SubgroupCheck[] = [
  {
    gap: 'chest-upper',
    context: ['chest-mid', 'chest-lower'],
    label: 'Upper Chest',
    text: 'Your chest work covers the mid and lower portions well. The upper pec fibers only activate with incline pressing angles — Incline Press (barbell or dumbbell) would build the shelf that fills out the top of your chest.',
  },
  {
    gap: 'triceps-long',
    context: ['triceps-lateral', 'triceps-medial'],
    label: 'Tricep Long Head',
    text: 'Your pushdowns target the lateral head well. The long head — the largest of the three and the one that adds thickness to the back of the arm — only fully contracts with overhead movements. Overhead Tricep Extensions or Skull Crushers would unlock that missing portion.',
  },
  {
    gap: 'shoulders-rear',
    context: ['shoulders-front', 'shoulders-side'],
    label: 'Rear Delts',
    text: 'You are hitting the front and side shoulder heads but not the rear delt. This is the most commonly undertrained head — the imbalance accumulates as rounded shoulders and shoulder impingement over time. Rear Delt Fly or Face Pull takes 2 sets to address it.',
  },
  {
    gap: 'back-lower',
    context: ['back-lats', 'back-mid'],
    label: 'Lower Back',
    text: 'Rows and pulldowns build your mid and upper back well but the spinal erectors are not loaded by those movements. Romanian Deadlifts or Hyperextensions complete the posterior chain and protect you as weights get heavier.',
  },
  {
    gap: 'biceps-brachialis',
    context: ['biceps-short', 'biceps-long'],
    label: 'Brachialis & Long Head',
    text: 'Standard curls emphasize the short head well. The brachialis (which pushes the bicep up and adds visible arm thickness) and the long head peak respond best to hammer grip. Adding Hammer Curls covers both in one exercise.',
  },
  {
    gap: 'legs-calves',
    context: ['legs-quads', 'legs-hamstrings'],
    label: 'Calves',
    text: 'Your leg program covers quads, hamstrings, and glutes — calves are the missing piece. Calf Raises take 5 minutes at the end of any leg session and pay off in lower leg symmetry.',
  },
  {
    gap: 'core-obliques',
    context: ['core-abs'],
    label: 'Obliques',
    text: 'You are training abs but not obliques. The obliques handle rotational stability and define the waist. Russian Twists or Side Planks are quick to add and round out a complete core program.',
  },
  {
    gap: 'legs-adductors',
    context: ['legs-quads'],
    label: 'Adductors',
    text: 'Inner thigh (adductor) work is rarely included in standard leg programs. Adductor Machine or sumo-stance movements improve hip stability and protect the groin — a common injury site when lower body strength outpaces hip mobility.',
  },
]

function generateCoverageInsights(trained: Set<MuscleGroup>): Insight[] {
  if (trained.size === 0) return []

  const insights: Insight[] = []
  const claimedByCompound = new Set<MuscleGroup>()

  // Pass 1: compound recommendations for entirely untrained areas
  for (const check of COMPOUND_CHECKS) {
    if (check.muscles.every((mg) => !trained.has(mg))) {
      insights.push({ label: check.label, text: check.text })
      check.muscles.forEach((mg) => claimedByCompound.add(mg))
    }
  }

  // Pass 2: subgroup gaps only for areas that are partially trained
  for (const check of SUBGROUP_CHECKS) {
    if (claimedByCompound.has(check.gap)) continue
    if (trained.has(check.gap)) continue
    if (!check.context.some((mg) => trained.has(mg))) continue
    insights.push({ label: check.label, text: check.text })
  }

  return insights.slice(0, 5)
}

// ── Component ───────────────────────────────────────────────────────────────

export default function StatsInsights() {
  const [perfInsights, setPerfInsights] = useState<Insight[]>([])
  const [coverageInsights, setCoverageInsights] = useState<Insight[]>([])
  const [trainedGroups, setTrainedGroups] = useState<MuscleGroup[]>([])

  useEffect(() => {
    try {
      const entries: WorkoutEntry[] = JSON.parse(localStorage.getItem('gym-tracker-v2') ?? '[]')
      const bodyWeights: BodyWeightEntry[] = JSON.parse(localStorage.getItem('gym-health-v1') ?? '[]')
      const customExercises: Exercise[] = JSON.parse(localStorage.getItem('gym-custom-exercises-v1') ?? '[]')
      const allExercises = [...DEFAULT_EXERCISES, ...customExercises]
      const { trained, muscleMax } = buildProfile(entries, allExercises)

      setPerfInsights(generatePerformanceInsights(entries, bodyWeights, muscleMax))
      setCoverageInsights(generateCoverageInsights(trained))
      setTrainedGroups(Array.from(trained))
    } catch {
      // ignore
    }
  }, [])

  if (perfInsights.length === 0 && coverageInsights.length === 0) return null

  return (
    <div className="mt-8 space-y-8">
      {/* Trained muscle groups visual */}
      {trainedGroups.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Muscles Being Trained</h3>
          <div className="flex flex-wrap gap-1.5">
            {trainedGroups.map((mg) => (
              <span key={mg} className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300">
                {MUSCLE_LABELS[mg]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Untrained muscle groups */}
      {(() => {
        const untrained = ALL_MUSCLE_GROUPS.filter((mg) => !trainedGroups.includes(mg))
        if (untrained.length === 0) return null
        return (
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Muscles Not Trained</h3>
            <div className="flex flex-wrap gap-1.5">
              {untrained.map((mg) => (
                <span key={mg} className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-600">
                  {MUSCLE_LABELS[mg]}
                </span>
              ))}
            </div>
          </div>
        )
      })()}

      {perfInsights.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Insights</h3>
          <div className="space-y-3">
            {perfInsights.map((insight) => (
              <div key={insight.label} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs font-semibold text-orange-400 mb-1">{insight.label}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {coverageInsights.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">What to Add</h3>
          <div className="space-y-3">
            {coverageInsights.map((insight) => (
              <div key={insight.label} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs font-semibold text-sky-400 mb-1">{insight.label}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
