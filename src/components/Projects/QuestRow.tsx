// Quest row (Task 02) — one flat mission row mapping 1:1 to a Project. Columns
// align left→right into shared vertical guides (see ROW_GRID, also used by the
// header in QuestList): index · name · date range · tags · status badge. Flat
// and edge-to-edge with a thin bottom rule and a subtle alternating tint —
// deliberately NOT a rounded card. Pure + presentational; `data-slug` makes the
// row individually targetable for selection (Task 03) and deep linking (Task 04).

import { StatusBadge } from './StatusBadge'
import {
  MAX_ROW_TAGS,
  formatDateRange,
  formatIndex,
  type Project,
} from './constants'

// One grid template shared by every row AND the QuestList header so the columns
// line up down the whole list. Mobile keeps only index · name · status (3
// tracks); the date and tag cells are display:none there, so they leave the grid
// flow entirely and the remaining cells fill cleanly. md+ adds dates then tags.
export const ROW_GRID =
  'grid items-center gap-x-4 md:gap-x-6 ' +
  'grid-cols-[2.5rem_minmax(0,1fr)_auto] ' +
  'md:grid-cols-[4rem_minmax(0,2fr)_8.5rem_minmax(0,1fr)_auto]'

export function QuestRow({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const shownTags = project.tags.slice(0, MAX_ROW_TAGS)
  const extraTags = project.tags.length - shownTags.length

  return (
    <div
      data-slug={project.slug}
      className={`${ROW_GRID} border-b border-white/15 px-2 py-3 ${
        index % 2 === 1 ? 'bg-white/[0.05]' : ''
      }`}
    >
      {/* Index — the quest number, zero-padded, mono. */}
      <span className="font-mono text-sm text-white/65 tabular-nums">
        {formatIndex(index)}
      </span>

      {/* Name — the dominant text in the row. */}
      <span className="truncate font-display text-2xl leading-none tracking-wide text-white uppercase">
        {project.name}
      </span>

      {/* Date range — hidden first on mobile. */}
      <span className="hidden font-mono text-xs whitespace-nowrap text-white/80 tabular-nums md:block">
        {formatDateRange(project.start, project.end)}
      </span>

      {/* Tags — system-tag styled, capped, hidden earliest on mobile. */}
      <span className="hidden min-w-0 items-center gap-2 overflow-hidden md:flex">
        {shownTags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[0.7rem] whitespace-nowrap text-white/65 uppercase"
          >
            {tag}
          </span>
        ))}
        {extraTags > 0 && (
          <span className="font-mono text-[0.7rem] whitespace-nowrap text-white/45">
            +{extraTags}
          </span>
        )}
      </span>

      {/* Status badge — pinned to the right edge. */}
      <span className="justify-self-end">
        <StatusBadge status={project.status} />
      </span>
    </div>
  )
}
