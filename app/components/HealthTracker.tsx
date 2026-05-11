'use client'

import { useState, useEffect, useMemo } from 'react'
import type { BodyWeightEntry, BodyFatEntry } from '../types'
import StatsInsights from './StatsInsights'

const WEIGHT_KEY = 'gym-health-v1'
const BODYFAT_KEY = 'gym-bodyfat-v1'
const HEIGHT_KEY = 'gym-height-v1'

const inputClass =
  'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 text-zinc-100 placeholder-zinc-600'

function BodyWeightChart({ entries }: { entries: BodyWeightEntry[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const data = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)).map((e) => ({ date: e.date, weight: e.weight })),
    [entries]
  )

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-36 text-zinc-600 text-sm rounded-xl bg-zinc-800/40 border border-zinc-700/50">
        Log your first weight to see the trend
      </div>
    )
  }

  if (data.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-36 gap-1 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
        <span className="text-orange-400 font-semibold">{data[0].weight} lbs</span>
        <span className="text-zinc-500 text-xs">{data[0].date}</span>
      </div>
    )
  }

  const W = 600, H = 160, PL = 48, PR = 16, PT = 12, PB = 28
  const weights = data.map((d) => d.weight)
  const minW = Math.min(...weights), maxW = Math.max(...weights)
  const rangeW = maxW - minW || 5
  const toX = (i: number) => PL + (i / (data.length - 1)) * (W - PL - PR)
  const toY = (w: number) => PT + (1 - (w - minW) / rangeW) * (H - PT - PB)
  const points = data.map((d, i) => `${toX(i)},${toY(d.weight)}`).join(' ')
  const yTicks = [minW, Math.round(minW + rangeW / 2), maxW]
  const xStep = data.length > 8 ? Math.ceil(data.length / 6) : 1

  return (
    <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/50 p-3">
      <div className="mb-2 h-5 flex items-center">
        {hoveredIdx !== null && (
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-orange-400">{data[hoveredIdx].weight} lbs</span>
            <span className="text-zinc-500 text-xs">{data[hoveredIdx].date}</span>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }} onMouseLeave={() => setHoveredIdx(null)}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PL} y1={toY(tick)} x2={W - PR} y2={toY(tick)} stroke="#3f3f46" strokeWidth="1" />
            <text x={PL - 6} y={toY(tick)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#71717a">{tick}</text>
          </g>
        ))}
        <polyline points={points} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)}>
            <circle cx={toX(i)} cy={toY(d.weight)} r={12} fill="transparent" />
            <circle cx={toX(i)} cy={toY(d.weight)} r={hoveredIdx === i ? 5 : 3.5} fill={hoveredIdx === i ? '#f97316' : '#ea580c'} stroke={hoveredIdx === i ? '#fff' : 'none'} strokeWidth="1.5" />
          </g>
        ))}
        {data.map((d, i) => {
          if (i % xStep !== 0 && i !== data.length - 1) return null
          const [, month, day] = d.date.split('-')
          return <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#71717a">{month}/{day}</text>
        })}
      </svg>
    </div>
  )
}

function BodyFatChart({ entries }: { entries: BodyFatEntry[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const data = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)).map((e) => ({ date: e.date, pct: e.percentage })),
    [entries]
  )

  if (data.length < 2) return null

  const W = 600, H = 140, PL = 44, PR = 16, PT = 12, PB = 28
  const vals = data.map((d) => d.pct)
  const minV = Math.min(...vals), maxV = Math.max(...vals)
  const rangeV = maxV - minV || 2
  const toX = (i: number) => PL + (i / (data.length - 1)) * (W - PL - PR)
  const toY = (v: number) => PT + (1 - (v - minV) / rangeV) * (H - PT - PB)
  const points = data.map((d, i) => `${toX(i)},${toY(d.pct)}`).join(' ')
  const yTicks = [minV, Math.round((minV + maxV) / 2), maxV]
  const xStep = data.length > 8 ? Math.ceil(data.length / 6) : 1

  return (
    <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/50 p-3 mt-3">
      <div className="mb-2 h-5 flex items-center">
        {hoveredIdx !== null && (
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-sky-400">{data[hoveredIdx].pct}%</span>
            <span className="text-zinc-500 text-xs">{data[hoveredIdx].date}</span>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} onMouseLeave={() => setHoveredIdx(null)}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PL} y1={toY(tick)} x2={W - PR} y2={toY(tick)} stroke="#3f3f46" strokeWidth="1" />
            <text x={PL - 6} y={toY(tick)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#71717a">{tick}%</text>
          </g>
        ))}
        <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)}>
            <circle cx={toX(i)} cy={toY(d.pct)} r={12} fill="transparent" />
            <circle cx={toX(i)} cy={toY(d.pct)} r={hoveredIdx === i ? 5 : 3.5} fill={hoveredIdx === i ? '#38bdf8' : '#0ea5e9'} stroke={hoveredIdx === i ? '#fff' : 'none'} strokeWidth="1.5" />
          </g>
        ))}
        {data.map((d, i) => {
          if (i % xStep !== 0 && i !== data.length - 1) return null
          const [, month, day] = d.date.split('-')
          return <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#71717a">{month}/{day}</text>
        })}
      </svg>
    </div>
  )
}

export default function HealthTracker() {
  const [weightEntries, setWeightEntries] = useState<BodyWeightEntry[]>([])
  const [bfEntries, setBfEntries] = useState<BodyFatEntry[]>([])
  const [heightIn, setHeightIn] = useState<number | null>(null)
  const [heightFt, setHeightFt] = useState('')
  const [heightInPart, setHeightInPart] = useState('')
  const [hydrated, setHydrated] = useState(false)

  // Weight modal
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [weightDate, setWeightDate] = useState('')

  // Body fat modal
  const [showBfModal, setShowBfModal] = useState(false)
  const [bfInput, setBfInput] = useState('')
  const [bfDate, setBfDate] = useState('')

  // History visibility
  const [weightHistoryOpen, setWeightHistoryOpen] = useState(false)
  const [bfHistoryOpen, setBfHistoryOpen] = useState(false)
  const [weightConfirmId, setWeightConfirmId] = useState<string | null>(null)
  const [bfConfirmId, setBfConfirmId] = useState<string | null>(null)

  // Height edit
  const [editingHeight, setEditingHeight] = useState(false)

  useEffect(() => {
    try {
      const w = localStorage.getItem(WEIGHT_KEY)
      if (w) setWeightEntries(JSON.parse(w))
      const bf = localStorage.getItem(BODYFAT_KEY)
      if (bf) setBfEntries(JSON.parse(bf))
      const h = localStorage.getItem(HEIGHT_KEY)
      if (h) {
        const val = parseFloat(h)
        if (!isNaN(val)) {
          setHeightIn(val)
          setHeightFt(String(Math.floor(val / 12)))
          setHeightInPart(String(val % 12))
        }
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) localStorage.setItem(WEIGHT_KEY, JSON.stringify(weightEntries)) }, [weightEntries, hydrated])
  useEffect(() => { if (hydrated) localStorage.setItem(BODYFAT_KEY, JSON.stringify(bfEntries)) }, [bfEntries, hydrated])
  useEffect(() => {
    if (hydrated && heightIn !== null) localStorage.setItem(HEIGHT_KEY, String(heightIn))
  }, [heightIn, hydrated])

  function todayStr() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function openWeightModal() { setWeightDate(todayStr()); setWeightInput(''); setShowWeightModal(true) }

  function saveWeight(e: React.FormEvent) {
    e.preventDefault()
    const w = parseFloat(weightInput)
    if (isNaN(w) || w <= 0) return
    setWeightEntries((prev) => [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, weight: w, date: weightDate }])
    setShowWeightModal(false)
  }

  function openBfModal() { setBfDate(todayStr()); setBfInput(''); setShowBfModal(true) }

  function saveBf(e: React.FormEvent) {
    e.preventDefault()
    const pct = parseFloat(bfInput)
    if (isNaN(pct) || pct <= 0 || pct >= 100) return
    setBfEntries((prev) => [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, percentage: pct, date: bfDate }])
    setShowBfModal(false)
  }

  function saveHeight() {
    const ft = parseInt(heightFt) || 0
    const inches = parseFloat(heightInPart) || 0
    const total = ft * 12 + inches
    if (total > 0) setHeightIn(total)
    setEditingHeight(false)
  }

  const weightSorted = [...weightEntries].sort((a, b) => b.date.localeCompare(a.date))
  const bfSorted = [...bfEntries].sort((a, b) => b.date.localeCompare(a.date))
  const latestWeight = weightSorted[0] ?? null
  const latestBf = bfSorted[0] ?? null

  function heightDisplay(totalIn: number) {
    const ft = Math.floor(totalIn / 12)
    const inches = totalIn % 12
    return `${ft}'${inches}"`
  }

  if (!hydrated) return <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Loading...</div>

  return (
    <>
      <header className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/80 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <h1 className="font-bold text-base text-zinc-100">Health</h1>
          <div className="flex items-center gap-2">
            <button onClick={openBfModal} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-colors border border-zinc-700">
              + Body Fat
            </button>
            <button onClick={openWeightModal} className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
              + Weight
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-20 w-full">

        {/* Height */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Height</p>
              {editingHeight ? (
                <div className="flex items-center gap-2 mt-1">
                  <input value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className="w-14 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-sm text-zinc-100 text-center focus:outline-none focus:border-orange-500" />
                  <span className="text-zinc-500 text-sm">ft</span>
                  <input value={heightInPart} onChange={(e) => setHeightInPart(e.target.value)} placeholder="10" className="w-14 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-sm text-zinc-100 text-center focus:outline-none focus:border-orange-500" />
                  <span className="text-zinc-500 text-sm">in</span>
                  <button onClick={saveHeight} className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">Save</button>
                  <button onClick={() => setEditingHeight(false)} className="px-2.5 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-semibold transition-colors">Cancel</button>
                </div>
              ) : (
                <p className="text-xl font-bold text-zinc-100">
                  {heightIn ? heightDisplay(heightIn) : <span className="text-zinc-600 text-sm font-normal">Not set</span>}
                </p>
              )}
            </div>
            {!editingHeight && (
              <button onClick={() => setEditingHeight(true)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                {heightIn ? 'Edit' : 'Set height'}
              </button>
            )}
          </div>
        </div>

        {/* Latest stats row */}
        {(latestWeight || latestBf) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {latestWeight && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">Latest Weight</p>
                <p className="text-2xl font-bold text-zinc-100">{latestWeight.weight} <span className="text-base font-normal text-zinc-400">lbs</span></p>
                <p className="text-xs text-zinc-600 mt-1">{latestWeight.date}</p>
              </div>
            )}
            {latestBf && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">Body Fat</p>
                <p className="text-2xl font-bold text-zinc-100">{latestBf.percentage}<span className="text-base font-normal text-zinc-400">%</span></p>
                <p className="text-xs text-zinc-600 mt-1">{latestBf.date}</p>
              </div>
            )}
          </div>
        )}

        {/* Body weight chart */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Body Weight Over Time</h3>
          <BodyWeightChart entries={weightEntries} />
        </div>

        {/* Body fat chart */}
        {bfEntries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Body Fat Over Time</h3>
            <BodyFatChart entries={bfEntries} />
          </div>
        )}

        {/* Weight history */}
        <button onClick={() => setWeightHistoryOpen((o) => !o)} className="flex items-center gap-2 w-full mb-3 group">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Weight History</h3>
          <span className="text-zinc-600 text-xs group-hover:text-zinc-400 transition-colors">{weightHistoryOpen ? '▲' : '▼'}</span>
        </button>
        {weightHistoryOpen && (
          weightSorted.length === 0 ? (
            <p className="text-zinc-600 text-sm mb-6">No entries yet.</p>
          ) : (
            <div className="space-y-2 mb-6">
              {weightSorted.map((entry) => {
                if (weightConfirmId === entry.id) {
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-red-800/60">
                      <span className="text-sm text-zinc-400">Delete permanently?</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setWeightEntries((p) => p.filter((e) => e.id !== entry.id)); setWeightConfirmId(null) }} className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors">Yes</button>
                        <button onClick={() => setWeightConfirmId(null)} className="px-2.5 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold transition-colors">No</button>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                    <span className="font-semibold text-zinc-100">{entry.weight} lbs</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{entry.date}</span>
                      <button onClick={() => setWeightConfirmId(entry.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-lg leading-none px-1" aria-label="Delete">×</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Body fat history */}
        {bfEntries.length > 0 && (
          <>
            <button onClick={() => setBfHistoryOpen((o) => !o)} className="flex items-center gap-2 w-full mb-3 group">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Body Fat History</h3>
              <span className="text-zinc-600 text-xs group-hover:text-zinc-400 transition-colors">{bfHistoryOpen ? '▲' : '▼'}</span>
            </button>
            {bfHistoryOpen && (
              <div className="space-y-2 mb-6">
                {bfSorted.map((entry) => {
                  if (bfConfirmId === entry.id) {
                    return (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-red-800/60">
                        <span className="text-sm text-zinc-400">Delete permanently?</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setBfEntries((p) => p.filter((e) => e.id !== entry.id)); setBfConfirmId(null) }} className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors">Yes</button>
                          <button onClick={() => setBfConfirmId(null)} className="px-2.5 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold transition-colors">No</button>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                      <span className="font-semibold text-zinc-100">{entry.percentage}%</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">{entry.date}</span>
                        <button onClick={() => setBfConfirmId(entry.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-lg leading-none px-1" aria-label="Delete">×</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        <StatsInsights />
      </main>

      {/* Weight modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && setShowWeightModal(false)}>
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-zinc-100">Log Body Weight</h2>
              <button onClick={() => setShowWeightModal(false)} className="text-zinc-500 hover:text-zinc-200 text-2xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" aria-label="Close">×</button>
            </div>
            <form onSubmit={saveWeight} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Weight (lbs)</label>
                <input type="number" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} placeholder="170" min="0" step="0.1" required autoFocus className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
                <input type="text" value={weightDate} onChange={(e) => setWeightDate(e.target.value)} placeholder="YYYY-MM-DD" className={inputClass} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors mt-2">Save</button>
            </form>
          </div>
        </div>
      )}

      {/* Body fat modal */}
      {showBfModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && setShowBfModal(false)}>
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-zinc-100">Log Body Fat %</h2>
              <button onClick={() => setShowBfModal(false)} className="text-zinc-500 hover:text-zinc-200 text-2xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" aria-label="Close">×</button>
            </div>
            <form onSubmit={saveBf} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Body Fat %</label>
                <input type="number" value={bfInput} onChange={(e) => setBfInput(e.target.value)} placeholder="18" min="1" max="70" step="0.1" required className={inputClass} />
              </div>

              <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-3">
                <p className="text-xs text-zinc-500 leading-relaxed">Common measurement methods include the US Navy tape test, bioelectrical impedance (electrode scales), DEXA scan, and AI photo estimation apps.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
                <input type="text" value={bfDate} onChange={(e) => setBfDate(e.target.value)} placeholder="YYYY-MM-DD" className={inputClass} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors mt-2">Save</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
