// Top bumper — the title band above the Academic Status screen, repurposed from
// P3R's shoulder-button bar. Just the centred section title now (the on-screen
// prev/next arrows were removed; the roster is still paged by keyboard ←/→).
// Purely presentational chrome: it owns no state.

import { SECTION_TITLE } from './constants'

export function CheckStationBar() {
  return (
    <div className="flex items-center justify-center border-b border-white/20 pb-2">
      <span className="min-w-0 truncate font-display text-xl leading-none tracking-[0.12em] text-white uppercase md:text-2xl">
        {SECTION_TITLE}
      </span>
    </div>
  )
}
