// Stat row (Task 02) — one flat "ability" row mapping 1:1 to a Course, the
// stats-screen analogue of Projects/QuestRow. Columns align left→right into the
// shared vertical guides exported as ROW_GRID (also used by the header guide row
// in StatScreen): index · category badge · code · name · level · term · units.
// Flat and edge-to-edge with a thin left border + a faint tint — deliberately
// NOT a rounded card, and carrying NO GPA, only neutral facts.
//
// Static for now: `data-slug` already makes the row individually targetable so
// Task 03 (selection / listbox option) and Task 04 (deep link) can key off the
// stable course slug. No onClick / role / selection styling yet.

import { CategoryBadge } from './CategoryBadge'
import { formatIndex, formatTerm, formatUnits, levelFromCode } from './helpers'
import type { Course } from './education'

// One grid template shared by every row AND the StatScreen header guide so the
// columns line up down the whole list. Mobile keeps only index · badge · name ·
// level (4 tracks); the code, term and units cells are display:none there, so
// they leave the grid flow entirely and the remaining cells fill cleanly. md+
// adds code, then the two neutral-fact figures (term · units) pinned right.
export const ROW_GRID =
  'grid items-center gap-x-4 md:gap-x-6 ' +
  'grid-cols-[2.5rem_auto_minmax(0,1fr)_auto] ' +
  'md:grid-cols-[3.5rem_auto_5rem_minmax(0,1fr)_3.5rem_6rem_6rem]'

export function StatRow({
  course,
  index,
}: {
  course: Course
  index: number
}) {
  const level = levelFromCode(course)

  return (
    <div
      data-slug={course.slug}
      className={`${ROW_GRID} relative border-l-4 border-transparent bg-white/[0.04] px-3 py-3 transition-colors duration-100`}
    >
      {/* Index — the stats number, zero-padded, mono. */}
      <span className="font-mono text-sm tabular-nums text-white/65">
        {formatIndex(index)}
      </span>

      {/* Category badge — the LEADER/PARTY slot. */}
      <span>
        <CategoryBadge category={course.category} />
      </span>

      {/* Code — the system identifier; hidden first on mobile. */}
      <span className="hidden font-mono text-sm tabular-nums whitespace-nowrap text-white/80 md:block">
        {course.code}
      </span>

      {/* Name — the dominant text in the row. */}
      <span className="truncate font-display text-2xl leading-none tracking-wide text-white uppercase">
        {course.name}
      </span>

      {/* Level — the P3R Lv.N figure; omitted cleanly when undefined. */}
      <span className="font-mono text-sm tabular-nums whitespace-nowrap text-white/80">
        {level !== undefined ? `Lv.${level}` : ''}
      </span>

      {/* Term — neutral fact, pinned right; hidden on mobile (collapses after
          units). Guarded for courses with no recorded term. */}
      <span className="hidden justify-self-end font-mono text-xs tabular-nums whitespace-nowrap text-white/70 md:block">
        {course.term ? formatTerm(course.term) : ''}
      </span>

      {/* Units — neutral fact, pinned right; first to collapse on mobile. */}
      <span className="hidden justify-self-end font-mono text-xs tabular-nums whitespace-nowrap text-white/70 md:block">
        {course.units !== undefined ? formatUnits(course.units) : ''}
      </span>
    </div>
  )
}
