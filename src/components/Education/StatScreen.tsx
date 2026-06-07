'use client'

// Stat screen (Task 02) — the Education "Check Stats" screen. Renders PROFILE as
// a fixed profile header and COURSES as a numbered list of "ability" rows over
// the shared P3R water background, mirroring the Projects Quest Screen's layout
// language (scrim, content column, guide row, hint + back footer) but reduced to
// the STATIC frame: no selection, no detail swap, no transitions, no sound, no
// deep links — those arrive in Tasks 03–04. The ScreenReveal wrapper + "Back to
// menu" handoff are the shared baseline every section carries, copied from
// SectionPlaceholder / QuestList so the menu → section → menu flow keeps working.

import { useRouter } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { ProfileHeader } from './ProfileHeader'
import { StatRow, ROW_GRID } from './StatRow'
import { SECTION_TITLE, SORT_LABELS, VIEW_HINT } from './constants'
import { COURSES } from './education'

export function StatScreen() {
  const router = useRouter()

  // Back to the MAIN MENU (not the landing screen): arm the double-circle reveal
  // the menu will play, flag page.tsx to open on the menu, then navigate to '/'.
  // Copied from SectionPlaceholder so the handoff stays identical. (Cancel sound,
  // Escape-to-back and reduced-motion polish land in Task 04.)
  function back(origin: Origin) {
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 overflow-y-auto bg-transparent select-none">
        {/* Legibility scrim — a left-anchored dark gradient over the water so the
            stats text stays readable where the water runs bright (atmospheric,
            full-bleed, NOT a card). Sits above the global water, below content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20"
        />

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col px-[6vw] py-[6vh] md:px-12">
          {/* Top band — the "Check Station" bumper: the EDUCATION section label
              with a reserved sort affordance on the right. The label is a static,
              non-interactive readout for now; Task 04 turns it into a real control.
              The big H1 lives in the profile header below, not here. */}
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <span className="font-mono text-[0.7rem] tracking-[0.3em] text-white/70 uppercase">
              {SECTION_TITLE}
            </span>
            <span
              aria-hidden
              className="font-mono text-[0.7rem] tracking-[0.2em] text-white/40 uppercase"
            >
              {SORT_LABELS.index}
            </span>
          </div>

          {/* Profile header — the "character": university, degree, expected grad. */}
          <ProfileHeader />

          {/* Column labels — thin guide row aligned to the list grid (desktop).
              Matches the rows' left border + padding so the columns line up. */}
          <div
            className={`${ROW_GRID} mt-6 hidden border-l-4 border-transparent px-3 pt-3 pb-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/50 uppercase md:grid`}
          >
            <span>No.</span>
            <span>Type</span>
            <span>Code</span>
            <span>Course</span>
            <span>Lv.</span>
            <span className="justify-self-end">Term</span>
            <span className="justify-self-end">Units</span>
          </div>

          {/* The ability list — a numbered run of flat stat rows in authored
              order. The /01 /02 index is the display position. Selection /
              keyboard nav arrive in Task 03. */}
          <div className="flex flex-col gap-1">
            {COURSES.map((course, i) => (
              <StatRow key={course.slug} course={course} index={i} />
            ))}
          </div>

          {/* Reserved detail region (Task 03) — the StatDetail readout will swap
              with the active selection here and fill the lower area. Left empty
              for now, just holding the space. */}
          <div className="min-h-0 flex-1 pt-8" />

          {/* Bottom hint + back control. */}
          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-3">
            <p className="font-mono text-sm text-white/75">{VIEW_HINT}</p>
            <button
              type="button"
              onClick={() => back(centerOrigin())}
              className="rounded-sm font-mono text-xs tracking-[0.3em] text-white/60 uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              ← Back to menu
            </button>
          </div>
        </div>
      </main>
    </ScreenReveal>
  )
}
