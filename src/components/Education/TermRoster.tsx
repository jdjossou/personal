// Term roster — the left column of the Academic Status screen: a single-select
// listbox of TermRows on its own distinct zone, P3R's party list repurposed as
// the study-term sequence. The zone is a translucent, frosted, chamfered panel
// (PANEL_CLIP) so the left side reads as its own region instead of sharing one
// flat background with the rest of the screen. It is the presentational shell
// only; StatScreen owns the active slug, the keyboard model (onKeyDown), and the
// row refs (registerRef), and hands them down — the same master/listbox split as
// Projects/QuestList.

import { PANEL_CLIP } from './constants'
import { TermRow } from './TermRow'
import type { Term } from './education'

export function TermRoster({
  terms,
  activeSlug,
  onSelect,
  onKeyDown,
  registerRef,
}: {
  terms: readonly Term[]
  activeSlug: string
  onSelect: (slug: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  registerRef: (slug: string, el: HTMLDivElement | null) => void
}) {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Frosted, chamfered zone backdrop — distinct from the rest of the screen. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#0b1b2e]/55 backdrop-blur-sm"
        style={{ clipPath: PANEL_CLIP }}
      />

      <div className="relative flex min-h-0 flex-col p-3 md:p-4">
        <p className="mb-3 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.3em] text-white/50 uppercase">
          <span aria-hidden className="h-2 w-2 rotate-45 bg-[#5EA8E0]" />
          Study Terms
        </p>
        <div
          role="listbox"
          aria-label="Study terms"
          onKeyDown={onKeyDown}
          className="flex min-h-0 flex-col gap-1 overflow-y-auto pr-1"
        >
          {terms.map((term) => (
            <TermRow
              key={term.slug}
              term={term}
              selected={term.slug === activeSlug}
              onSelect={onSelect}
              rowRef={(el) => registerRef(term.slug, el)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
