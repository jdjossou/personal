'use client'

// Quest list (Task 02 → Task 03) — the Projects "Quest Screen". Renders PROJECTS
// as a numbered Persona-style mission list over the shared P3R water background: a
// PROJECTS header with a "Sort by No." affordance, a vertical run of flat
// QuestRows separated by thin rules (never rounded cards), then the detail
// readout (QuestDetail) and the "which one?" hint. The ScreenReveal wrapper +
// "Back to menu" handoff mirror SectionPlaceholder so the menu → section → menu
// flow keeps working.
//
// Task 03 makes the list a master–detail control: exactly one project is active
// (tracked by `slug`, not index, so reordering PROJECTS never moves a link and
// Task 04 can drive selection from the URL). The rows form an ARIA listbox —
// click or arrow-key to select, selection follows focus, and the active row +
// QuestDetail update together. Default on load is the first row. Deep links and
// entrance/exit transitions are still later tasks (04–05).

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { QuestRow, ROW_GRID } from './QuestRow'
import { QuestDetail } from './QuestDetail'
import {
  PROJECTS,
  SECTION_TITLE,
  SORT_HINT,
  VIEW_HINT,
  getProjectBySlug,
} from './constants'

export function QuestList() {
  const router = useRouter()

  // The single active project, keyed by slug. Default = first row so the detail
  // panel always has content (matches the reference's always-highlighted row).
  // `setActiveSlug` is the stable setter Task 04 will call to sync selection with
  // the URL (on load and on browser back/forward).
  const [activeSlug, setActiveSlug] = useState<string>(PROJECTS[0].slug)
  const activeProject = getProjectBySlug(activeSlug)

  // Mirror of activeSlug for the keydown handler, so the listener reads the live
  // selection without re-subscribing (same pattern as MainMenu's selectedRef).
  const selectedRef = useRef(activeSlug)
  useEffect(() => {
    selectedRef.current = activeSlug
  }, [activeSlug])

  // Refs to each row so keyboard nav can move DOM focus to the newly active row.
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  // Select by position and (for keyboard nav) move focus there too. Selection
  // follows focus, so QuestDetail re-renders in the same tick — snappy.
  function selectByIndex(idx: number, focus: boolean) {
    setActiveSlug(PROJECTS[idx].slug)
    if (focus) rowRefs.current[idx]?.focus()
  }

  // Listbox keyboard model — scoped to the list (not window) so it never hijacks
  // arrows when the Back button or a future control is focused. Arrows wrap like
  // MainMenu; Enter/Space are intentional no-ops (the detail already follows
  // selection) kept for game-feel and as the Task 05 confirm-sound hook.
  function onListKeyDown(e: React.KeyboardEvent) {
    const len = PROJECTS.length
    const i = PROJECTS.findIndex((p) => p.slug === selectedRef.current)
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        selectByIndex((i + 1) % len, true)
        break
      case 'ArrowUp':
        e.preventDefault()
        selectByIndex((i - 1 + len) % len, true)
        break
      case 'Home':
        e.preventDefault()
        selectByIndex(0, true)
        break
      case 'End':
        e.preventDefault()
        selectByIndex(len - 1, true)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        break
    }
  }

  // Back to the MAIN MENU (not the landing screen): arm the double-circle reveal
  // the menu will play, flag page.tsx to open on the menu, then navigate to '/'.
  // Copied from SectionPlaceholder so the handoff stays identical.
  function back(origin: Origin) {
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 overflow-y-auto bg-transparent select-none">
        {/* Legibility scrim — a left-anchored dark gradient over the water so the
            list text stays readable where the water runs bright (atmospheric,
            full-bleed, NOT a card). Sits above the global water, below content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20"
        />

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col px-[6vw] py-[6vh] md:px-12">
          {/* Header — QUEST → PROJECTS, with the "Sort by No." affordance right. */}
          <header className="flex items-end justify-between border-b-2 border-white/40 pb-2">
            <h1 className="font-display text-5xl leading-none tracking-wide text-white uppercase md:text-6xl">
              {SECTION_TITLE}
            </h1>
            <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/70 uppercase">
              {SORT_HINT}
            </span>
          </header>

          {/* Column labels — thin guide row aligned to the list grid (desktop).
              Matches the rows' left border + padding so the columns line up. */}
          <div
            className={`${ROW_GRID} hidden border-l-4 border-transparent px-3 pt-3 pb-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/50 uppercase md:grid`}
          >
            <span>No.</span>
            <span>Project</span>
            <span>Date</span>
            <span>Stack</span>
            <span className="justify-self-end">Status</span>
          </div>

          {/* The mission list — a single-select listbox of rounded row chips. */}
          <div
            role="listbox"
            aria-label={SECTION_TITLE}
            onKeyDown={onListKeyDown}
            className="flex flex-col gap-1"
          >
            {PROJECTS.map((project, i) => (
              <QuestRow
                key={project.slug}
                project={project}
                index={i}
                selected={project.slug === activeSlug}
                onSelect={setActiveSlug}
                rowRef={(el) => {
                  rowRefs.current[i] = el
                }}
              />
            ))}
          </div>

          {/* Detail readout (Task 03) — swaps with the active selection and fills
              the lower area, pushing the footer down. */}
          <div className="min-h-0 flex-1 pt-8">
            <QuestDetail project={activeProject} />
          </div>

          {/* Bottom hint + back control. */}
          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-3">
            <p className="font-mono text-sm text-white/75">{VIEW_HINT}</p>
            <button
              type="button"
              onClick={() => back(centerOrigin())}
              className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase hover:text-white"
            >
              ← Back to menu
            </button>
          </div>
        </div>
      </main>
    </ScreenReveal>
  )
}
