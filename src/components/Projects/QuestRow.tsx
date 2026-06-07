// Quest row (Task 02 → Task 03) — one flat mission row mapping 1:1 to a Project.
// Columns align left→right into shared vertical guides (see ROW_GRID, also used
// by the header in QuestList): index · name · date range · tags · status badge.
// Flat and edge-to-edge with a thin bottom rule and a subtle alternating tint —
// deliberately NOT a rounded card.
//
// Task 03 makes the row a real interactive listbox option: it is focusable,
// click-/keyboard-selectable, marks itself selected via `aria-selected`, and —
// when active — wears a horizontal red selection band with a white left marker
// (the table-row analogue of MainMenu's selector triangle, matching the
// highlighted quest row in reference.png). `data-slug` still makes the row
// individually targetable for deep linking (Task 04).

import { StatusBadge } from './StatusBadge'
import {
  MAX_ROW_TAGS,
  SELECT_BAND_FILL,
  SELECT_MARKER_WHITE,
  STATUS_LABEL,
} from './constants'
import { formatDateRange, formatIndex } from './helpers'
import type { Project } from './projects'

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
  selected,
  onSelect,
  rowRef,
}: {
  project: Project
  index: number
  selected: boolean
  // Pointer selection — keyboard arrow/Enter is handled at the listbox level.
  onSelect: (slug: string) => void
  // Lets QuestList focus the active row during keyboard navigation.
  rowRef?: (el: HTMLDivElement | null) => void
}) {
  const shownTags = project.tags.slice(0, MAX_ROW_TAGS)
  const extraTags = project.tags.length - shownTags.length

  return (
    <div
      ref={rowRef}
      role="option"
      aria-selected={selected}
      // Roving tabindex — only the active row is in the tab order; arrows move
      // selection within the listbox (QuestList), focus follows.
      tabIndex={selected ? 0 : -1}
      aria-label={`Project ${formatIndex(index)}: ${project.name}, ${STATUS_LABEL[project.status]}`}
      data-slug={project.slug}
      onClick={() => onSelect(project.slug)}
      // Every row is the same rounded "chip" so nothing clashes with the rounded
      // selection: the active row fills with the soft crimson + white left marker
      // (set inline), the rest stay a faint translucent chip that warms on hover.
      // The always-present (transparent) left border keeps widths identical so
      // selecting never shifts the layout.
      style={
        selected
          ? { backgroundColor: SELECT_BAND_FILL, borderColor: SELECT_MARKER_WHITE }
          : undefined
      }
      className={`${ROW_GRID} relative cursor-pointer rounded-lg border-l-4 px-3 py-3 outline-none transition-colors duration-100 ${
        selected
          ? 'text-white'
          : 'border-transparent bg-white/[0.04] hover:bg-white/[0.08]'
      }`}
    >
      {/* Index — the quest number, zero-padded, mono. */}
      <span
        className={`font-mono text-sm tabular-nums ${
          selected ? 'text-white' : 'text-white/65'
        }`}
      >
        {formatIndex(index)}
      </span>

      {/* Name — the dominant text in the row. */}
      <span className="truncate font-display text-2xl leading-none tracking-wide text-white uppercase">
        {project.name}
      </span>

      {/* Date range — hidden first on mobile. */}
      <span
        className={`hidden font-mono text-xs whitespace-nowrap tabular-nums md:block ${
          selected ? 'text-white' : 'text-white/80'
        }`}
      >
        {formatDateRange(project.start, project.end)}
      </span>

      {/* Tags — system-tag styled, capped, hidden earliest on mobile. */}
      <span className="hidden min-w-0 items-center gap-2 overflow-hidden md:flex">
        {shownTags.map((tag) => (
          <span
            key={tag}
            className={`font-mono text-[0.7rem] whitespace-nowrap uppercase ${
              selected ? 'text-white' : 'text-white/65'
            }`}
          >
            {tag}
          </span>
        ))}
        {extraTags > 0 && (
          <span
            className={`font-mono text-[0.7rem] whitespace-nowrap ${
              selected ? 'text-white/85' : 'text-white/45'
            }`}
          >
            +{extraTags}
          </span>
        )}
      </span>

      {/* Status badge — pinned to the right edge; inverts on selection so it
          stays legible on the crimson chip. */}
      <span className="justify-self-end">
        <StatusBadge status={project.status} selected={selected} />
      </span>
    </div>
  )
}
