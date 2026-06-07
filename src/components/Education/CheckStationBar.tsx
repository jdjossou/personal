// Top bumper — the band above the Academic Status screen, repurposed from P3R's
// shoulder-button bar. Two rounded, filled "controller button" controls page the
// roster selection (prev / next term); the centre is the section title. Purely
// presentational chrome: it owns no state, it just calls the prev/next handlers
// StatScreen hands it (the same selection the arrow keys drive).

import { SECTION_TITLE } from './constants'

// A filled, rounded, button-like control (reads as a game-pad button) with a
// solid triangle glyph inside, so the prev/next affordance is obvious.
const ARROW =
  'flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm leading-none text-white/85 ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80'

export function CheckStationBar({
  onPrev,
  onNext,
}: {
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-2">
      <button type="button" onClick={onPrev} aria-label="Previous term" className={ARROW}>
        <span aria-hidden>◀</span>
      </button>

      <span className="min-w-0 truncate font-display text-xl leading-none tracking-[0.12em] text-white uppercase md:text-2xl">
        {SECTION_TITLE}
      </span>

      <button type="button" onClick={onNext} aria-label="Next term" className={ARROW}>
        <span aria-hidden>▶</span>
      </button>
    </div>
  )
}
