// Term row — one selectable entry in the roster, the Academic Status analogue of
// P3R's party-member row (and of Projects/QuestRow). It maps 1:1 to a Term: the
// big study-term label ('2A') is the "name", the year is the "level", the dotted
// season/year is the sub-line, and a small count + status pip stand in for the
// reference's stat figures (we deliberately carry NO numeric stats — the term's
// courses live in the detail panel). Flat and sharp with a left accent border in
// the term's status colour; when active it wears the site's crimson selection
// band + white marker, exactly like QuestRow, so selection reads consistently.

import {
  BAND_CLIP,
  SELECT_BAND_FILL,
  SELECT_MARKER_WHITE,
  TERM_STATUS_COLOR,
  TERM_STATUS_LABEL,
} from './constants'
import { formatTermPeriod } from './helpers'
import type { Term } from './education'

export function TermRow({
  term,
  selected,
  onSelect,
  rowRef,
}: {
  term: Term
  selected: boolean
  // Pointer selection — keyboard arrow/Enter is handled at the listbox level.
  onSelect: (slug: string) => void
  // Lets StatScreen focus the active row during keyboard navigation.
  rowRef?: (el: HTMLDivElement | null) => void
}) {
  const accent = TERM_STATUS_COLOR[term.status]

  return (
    <div
      ref={rowRef}
      role="option"
      aria-selected={selected}
      // Roving tabindex — only the active row is in the tab order; arrows move
      // selection within the listbox (StatScreen), focus follows.
      tabIndex={selected ? 0 : -1}
      aria-label={`Term ${term.label}, year ${term.year}, ${formatTermPeriod(term.period)}, ${TERM_STATUS_LABEL[term.status]}`}
      data-slug={term.slug}
      onClick={() => onSelect(term.slug)}
      // Active row: a slanted crimson band (BAND_CLIP — flat left edge keeps the
      // white marker, slanted right edge) so selection reads as a Persona band,
      // not a plain rectangle. Otherwise a faint band whose left border carries
      // the term's status colour. The always-present 4px border keeps widths
      // identical so selecting never shifts the row.
      style={
        selected
          ? {
              backgroundColor: SELECT_BAND_FILL,
              borderColor: SELECT_MARKER_WHITE,
              clipPath: BAND_CLIP,
            }
          : { borderColor: accent }
      }
      className={`relative grid cursor-pointer grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-3 border-l-4 px-3 py-2.5 outline-none transition-colors duration-100 ${
        selected ? 'text-white' : 'bg-white/[0.04] hover:bg-white/[0.08]'
      }`}
    >
      {/* Term label — the big roster "name". */}
      <span className="font-display text-3xl leading-none tracking-wide text-white">
        {term.label}
      </span>

      {/* Year ("level") + season/year sub-line. */}
      <span className="flex min-w-0 flex-col">
        <span
          className={`font-mono text-xs tracking-[0.15em] uppercase ${
            selected ? 'text-white' : 'text-white/80'
          }`}
        >
          Year {term.year}
        </span>
        <span
          className={`truncate font-mono text-[0.7rem] tracking-[0.1em] uppercase ${
            selected ? 'text-white/80' : 'text-white/55'
          }`}
        >
          {formatTermPeriod(term.period)}
        </span>
      </span>

      {/* Status pip — the figure slot, kept non-numeric-stat. */}
      <span className="flex items-center justify-self-end">
        <span
          aria-hidden
          className="h-2 w-2 shrink-0 rotate-45"
          style={{ backgroundColor: selected ? SELECT_MARKER_WHITE : accent }}
        />
      </span>
    </div>
  )
}
