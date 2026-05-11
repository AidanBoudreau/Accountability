'use client'

import { useMemo, useState } from 'react'
import type { WorkoutEntry } from '../types'

type Props = {
  entries: WorkoutEntry[]
}

export default function WeightChart({ entries }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const data = useMemo(() => {
    const byDate = new Map<string, { weight: number; reps: number }>()
    for (const e of entries) {
      const existing = byDate.get(e.date)
      if (
        !existing ||
        e.weight > existing.weight ||
        (e.weight === existing.weight && e.reps > existing.reps)
      ) {
        byDate.set(e.date, { weight: e.weight, reps: e.reps })
      }
    }
    return [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { weight, reps }]) => ({ date, weight, reps }))
  }, [entries])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-36 text-zinc-600 text-sm rounded-xl bg-zinc-800/40 border border-zinc-700/50">
        No data yet — log a workout to see your progress
      </div>
    )
  }

  if (data.length === 1) {
    return (
      <div className="flex items-center justify-center h-36 text-zinc-400 text-sm rounded-xl bg-zinc-800/40 border border-zinc-700/50 flex-col gap-1">
        <span className="text-orange-400 font-semibold">{data[0].weight} lbs × {data[0].reps} reps</span>
        <span className="text-zinc-500 text-xs">{data[0].date}</span>
      </div>
    )
  }

  const W = 600
  const H = 160
  const PL = 44
  const PR = 16
  const PT = 12
  const PB = 28

  const weights = data.map((d) => d.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const rangeW = maxW - minW || 10

  const toX = (i: number) => PL + (i / (data.length - 1)) * (W - PL - PR)
  const toY = (w: number) => PT + (1 - (w - minW) / rangeW) * (H - PT - PB)

  const points = data.map((d, i) => `${toX(i)},${toY(d.weight)}`).join(' ')

  const yTicks = [
    minW,
    Math.round(minW + rangeW / 2),
    maxW,
  ]

  const xLabelStep = data.length > 8 ? Math.ceil(data.length / 6) : 1

  return (
    <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/50 p-3">
      {hoveredIdx !== null && (
        <div className="mb-2 flex items-center gap-3 text-sm">
          <span className="font-semibold text-orange-400">
            {data[hoveredIdx].weight} lbs × {data[hoveredIdx].reps} reps
          </span>
          <span className="text-zinc-500 text-xs">{data[hoveredIdx].date}</span>
        </div>
      )}
      {hoveredIdx === null && (
        <div className="mb-2 h-5" />
      )}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 140 }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PL}
              y1={toY(tick)}
              x2={W - PR}
              y2={toY(tick)}
              stroke="#3f3f46"
              strokeWidth="1"
            />
            <text
              x={PL - 6}
              y={toY(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#71717a"
            >
              {tick}
            </text>
          </g>
        ))}

        <polyline
          points={points}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((d, i) => (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)}>
            <circle cx={toX(i)} cy={toY(d.weight)} r={12} fill="transparent" />
            <circle
              cx={toX(i)}
              cy={toY(d.weight)}
              r={hoveredIdx === i ? 5 : 3.5}
              fill={hoveredIdx === i ? '#f97316' : '#ea580c'}
              stroke={hoveredIdx === i ? '#fff' : 'none'}
              strokeWidth="1.5"
            />
          </g>
        ))}

        {data.map((d, i) => {
          if (i % xLabelStep !== 0 && i !== data.length - 1) return null
          const [, month, day] = d.date.split('-')
          return (
            <text
              key={i}
              x={toX(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize="10"
              fill="#71717a"
            >
              {month}/{day}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
