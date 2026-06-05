'use client'

// Quest list (Task 02) — the Projects "Quest Screen". Renders PROJECTS as a
// numbered Persona-style mission list over the shared P3R water background: a
// PROJECTS header with a "Sort by No." affordance, a vertical run of flat
// QuestRows separated by thin rules (never rounded cards), then a reserved
// detail region (filled in Task 03) and the "which one?" hint. The
// ScreenReveal wrapper + "Back to menu" handoff mirror SectionPlaceholder so the
// menu → section → menu flow keeps working. Static only: no selection,
// expansion, deep links, or entrance transitions yet (Tasks 03–05).

import { useRouter } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { QuestRow, ROW_GRID } from './QuestRow'
import { PROJECTS, SECTION_TITLE, SORT_HINT, VIEW_HINT } from './constants'

export function QuestList() {
  const router = useRouter()

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

          {/* Column labels — thin guide row aligned to the list grid (desktop). */}
          <div
            className={`${ROW_GRID} hidden px-2 pt-3 pb-1 font-mono text-[0.6rem] tracking-[0.2em] text-white/50 uppercase md:grid`}
          >
            <span>No.</span>
            <span>Project</span>
            <span>Date</span>
            <span>Stack</span>
            <span className="justify-self-end">Status</span>
          </div>

          {/* The mission list — compact rows packed near the top. */}
          <div role="list">
            {PROJECTS.map((project, i) => (
              <QuestRow key={project.slug} project={project} index={i} />
            ))}
          </div>

          {/* Spacer pushes the footer to the bottom without a visible box; the
              project detail readout is built into this lower area in Task 03. */}
          <div className="flex-1" />

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
