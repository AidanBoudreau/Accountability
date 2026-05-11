'use client'

import { useState, useEffect } from 'react'
import GymTracker from './GymTracker'
import HealthTracker from './HealthTracker'
import ConsistencyTracker from './ConsistencyTracker'

type Tab = 'workouts' | 'health' | 'consistency'

function DumbbellIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="8.5" width="4" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18" y="8.5" width="4" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth={active ? '2.5' : '2'} strokeLinecap="round" />
      <line x1="9" y1="9.5" x2="9" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="9.5" x2="15" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <path
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 15.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TABS: { id: Tab; label: string; Icon: (props: { active: boolean }) => React.ReactElement }[] = [
  { id: 'workouts', label: 'Workouts', Icon: DumbbellIcon },
  { id: 'health', label: 'Health', Icon: HeartIcon },
  { id: 'consistency', label: 'Consistency', Icon: CalendarCheckIcon },
]

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('workouts')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  return (
    <>
      {activeTab === 'workouts' && <GymTracker />}
      {activeTab === 'health' && <HealthTracker />}
      {activeTab === 'consistency' && <ConsistencyTracker />}

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800/80 z-50">
        <div className="max-w-2xl mx-auto flex h-16">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  active ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon active={active} />
                {label}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
