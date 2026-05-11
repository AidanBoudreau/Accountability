'use client'

import { useState, useEffect } from 'react'
import type { DayLog, Goal } from '../types'
import { DEFAULT_GOALS } from '../data/goals'
import { SEED_CONSISTENCY } from '../data/seedConsistency'

const STORAGE_KEY = 'gym-consistency-v1'
const GOALS_KEY = 'gym-goals-v1'

function getLocalDate() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function calculateStreak(dayLogs: DayLog[], today: string, goals: Goal[]): number {
  if (goals.length === 0) return 0
  const goalIds = new Set(goals.map((g) => g.id))
  const count = goals.length

  const todayLog = dayLogs.find((d) => d.date === today)
  const todayDone = todayLog ? todayLog.completedGoalIds.filter((id) => goalIds.has(id)).length : 0
  const todayComplete = todayDone >= count

  const d = new Date(today + 'T12:00:00')
  if (!todayComplete) d.setDate(d.getDate() - 1)

  let streak = 0
  while (streak < 1000) {
    const dateStr = buildDateStr(d.getFullYear(), d.getMonth(), d.getDate())
    const log = dayLogs.find((l) => l.date === dateStr)
    const done = log ? log.completedGoalIds.filter((id) => goalIds.has(id)).length : 0
    if (!log || done < count) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

type DayStatus = 'all' | 'some' | 'none' | null

function getDayStatus(dayLogs: DayLog[], dateStr: string, goals: Goal[]): DayStatus {
  if (goals.length === 0) return null
  const goalIds = new Set(goals.map((g) => g.id))
  const log = dayLogs.find((d) => d.date === dateStr)
  if (!log) return null
  const done = log.completedGoalIds.filter((id) => goalIds.has(id)).length
  if (done >= goals.length) return 'all'
  if (done > 0) return 'some'
  return 'none'
}

const STATUS_STYLES: Record<NonNullable<DayStatus>, string> = {
  all: 'bg-emerald-500 text-white',
  some: 'bg-amber-500 text-white',
  none: 'bg-red-500/80 text-white',
}

export default function ConsistencyTracker() {
  const today = getLocalDate()
  const now = new Date()
  const [dayLogs, setDayLogs] = useState<DayLog[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [showManageGoals, setShowManageGoals] = useState(false)
  const [newGoalName, setNewGoalName] = useState('')
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editingGoalName, setEditingGoalName] = useState('')
  const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const loaded: DayLog[] = stored ? JSON.parse(stored) : [...SEED_CONSISTENCY]
      if (!loaded.find((d) => d.date === today)) {
        loaded.push({ date: today, completedGoalIds: [] })
      }
      setDayLogs(loaded)

      const storedGoals = localStorage.getItem(GOALS_KEY)
      setGoals(storedGoals ? JSON.parse(storedGoals) : [...DEFAULT_GOALS])
    } catch {
      setDayLogs([...SEED_CONSISTENCY, { date: today, completedGoalIds: [] }])
      setGoals([...DEFAULT_GOALS])
    }
    setHydrated(true)
  }, [today])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dayLogs))
  }, [dayLogs, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  }, [goals, hydrated])

  function toggleGoal(goalId: string) {
    setDayLogs((prev) => {
      const existing = prev.find((d) => d.date === today)
      if (!existing) return [...prev, { date: today, completedGoalIds: [goalId] }]
      const already = existing.completedGoalIds.includes(goalId)
      return prev.map((d) =>
        d.date === today
          ? { ...d, completedGoalIds: already ? d.completedGoalIds.filter((id) => id !== goalId) : [...d.completedGoalIds, goalId] }
          : d
      )
    })
  }

  function addGoal() {
    const name = newGoalName.trim()
    if (!name) return
    setGoals((prev) => [...prev, { id: `goal-${Date.now()}`, name }])
    setNewGoalName('')
  }

  function saveGoalEdit(id: string) {
    const name = editingGoalName.trim()
    if (!name) return
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)))
    setEditingGoalId(null)
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    setConfirmDeleteGoalId(null)
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11) }
    else setCalMonth((m) => m - 1)
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0) }
    else setCalMonth((m) => m + 1)
  }

  const todayLog = dayLogs.find((d) => d.date === today)
  const goalIds = new Set(goals.map((g) => g.id))
  const todayDone = todayLog ? todayLog.completedGoalIds.filter((id) => goalIds.has(id)).length : 0
  const streak = hydrated ? calculateStreak(dayLogs, today, goals) : 0

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay()
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long' })

  const calCells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) calCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d)

  if (!hydrated) {
    return <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
  }

  return (
    <>
      <header className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/80 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <h1 className="font-bold text-base text-zinc-100">Consistency</h1>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <span className="text-sm font-semibold text-orange-400">{streak} day streak</span>
            )}
            <button
              onClick={() => setShowManageGoals((v) => !v)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-colors border border-zinc-700"
            >
              {showManageGoals ? 'Done' : 'Edit Goals'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-20 w-full">

        {/* Manage goals panel */}
        {showManageGoals && (
          <section className="mb-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Manage Goals</h2>
            <div className="space-y-2 mb-4">
              {goals.map((goal) => (
                <div key={goal.id}>
                  {confirmDeleteGoalId === goal.id ? (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-800 border border-red-800/60">
                      <span className="text-sm text-zinc-400">Delete this goal?</span>
                      <div className="flex gap-2">
                        <button onClick={() => deleteGoal(goal.id)} className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors">Yes</button>
                        <button onClick={() => setConfirmDeleteGoalId(null)} className="px-2.5 py-1 rounded-lg bg-zinc-600 hover:bg-zinc-500 text-zinc-200 text-xs font-semibold transition-colors">No</button>
                      </div>
                    </div>
                  ) : editingGoalId === goal.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editingGoalName}
                        onChange={(e) => setEditingGoalName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveGoalEdit(goal.id); if (e.key === 'Escape') setEditingGoalId(null) }}
                        autoFocus
                        className="flex-1 bg-zinc-800 border border-orange-500/60 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none"
                      />
                      <button onClick={() => saveGoalEdit(goal.id)} className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">Save</button>
                      <button onClick={() => setEditingGoalId(null)} className="px-2.5 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-semibold transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-800">
                      <span className="text-sm text-zinc-200">{goal.name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingGoalId(goal.id); setEditingGoalName(goal.name) }}
                          className="px-2 py-1 rounded text-zinc-500 hover:text-zinc-200 text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteGoalId(goal.id)}
                          className="px-2 py-1 rounded text-zinc-600 hover:text-red-400 text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                placeholder="New goal…"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={addGoal}
                className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
              >
                Add
              </button>
            </div>
          </section>
        )}

        {/* Today's goals */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Today</h2>
            <span className="text-xs text-zinc-500">{today}</span>
          </div>

          {goals.length === 0 ? (
            <p className="text-zinc-600 text-sm">No goals set. Use &quot;Edit Goals&quot; to add some.</p>
          ) : (
            <>
              <div className="space-y-2 mb-3">
                {goals.map((goal) => {
                  const done = todayLog?.completedGoalIds.includes(goal.id) ?? false
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                        done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                        {done && (
                          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`font-medium text-sm ${done ? 'text-emerald-400' : 'text-zinc-300'}`}>{goal.name}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      todayDone === goals.length ? 'bg-emerald-500' : todayDone > 0 ? 'bg-amber-500' : 'bg-zinc-700'
                    }`}
                    style={{ width: goals.length > 0 ? `${(todayDone / goals.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-zinc-500 tabular-nums">{todayDone}/{goals.length}</span>
              </div>
            </>
          )}
        </section>

        {/* Calendar */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Calendar</h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="text-zinc-500 hover:text-zinc-200 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors text-base" aria-label="Previous month">‹</button>
              <span className="text-sm font-medium text-zinc-300 w-32 text-center">{monthLabel} {calYear}</span>
              <button onClick={nextMonth} className="text-zinc-500 hover:text-zinc-200 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors text-base" aria-label="Next month">›</button>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="grid grid-cols-7 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="text-center text-xs text-zinc-600 font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calCells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} />
                const dateStr = buildDateStr(calYear, calMonth, day)
                const isToday = dateStr === today
                const isFuture = dateStr > today
                const status = isFuture ? null : getDayStatus(dayLogs, dateStr, goals)
                const cellStyle = status ? STATUS_STYLES[status] : 'bg-zinc-800/50 text-zinc-600'
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium select-none ${cellStyle} ${isToday ? 'ring-2 ring-orange-500 ring-offset-1 ring-offset-zinc-900' : ''} ${isFuture ? 'opacity-20' : ''}`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-5 mt-4">
              {[{ style: 'bg-emerald-500', label: 'All done' }, { style: 'bg-amber-500', label: 'Partial' }, { style: 'bg-red-500/80', label: 'None done' }].map(({ style, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${style}`} />
                  <span className="text-xs text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
