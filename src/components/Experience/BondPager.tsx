// Bond pager — the minimal selectable indicator that stands in for a roster on
// this screen: one small angular pip per bond (the site's rotate-45 diamond
// idiom), the active one filled white, the rest faint. Under the LB/RB-only
// decision this + the bumpers are the whole bond selector — no on-screen list.
// Presentational: SocialLinkScreen passes the count + active index; click-to-
// select is wired in Task 03. An sr-only "Bond n of m" keeps it accessible.

import {
  PAGER_GAP,
  PAGER_PIP_ACTIVE,
  PAGER_PIP_IDLE,
  SELECT_MARKER_WHITE,
} from './constants'

export function BondPager({
  count,
  activeIndex,
  orientation = 'horizontal',
}: {
  count: number
  activeIndex: number
  // 'vertical' stacks the pips top→bottom for the angled strip beside the card
  // (change 6); the default 'horizontal' row is used on mobile.
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <div
      className={`flex items-center ${orientation === 'vertical' ? 'flex-col' : ''}`}
      style={{ gap: PAGER_GAP }}
      role="group"
      aria-label="Bond pager"
    >
      <span className="sr-only">{`Bond ${activeIndex + 1} of ${count}`}</span>
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex
        return (
          <span
            key={i}
            aria-hidden
            className="rotate-45 transition-all duration-150"
            style={{
              width: active ? PAGER_PIP_ACTIVE : PAGER_PIP_IDLE,
              height: active ? PAGER_PIP_ACTIVE : PAGER_PIP_IDLE,
              backgroundColor: active ? SELECT_MARKER_WHITE : 'rgba(255,255,255,0.28)',
            }}
          />
        )
      })}
    </div>
  )
}
