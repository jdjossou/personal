// Status chip (Task 02) — the right-pinned badge on each quest row, echoing the
// reference's InProgress/Done chip. One visual per ProjectStatus: an angular
// parallelogram fill (BADGE_CLIP, never a soft pill) tinted by STATUS_COLOR,
// with dark mono label text over it. Pure + presentational.

import {
  BADGE_CLIP,
  STATUS_COLOR,
  STATUS_LABEL,
  type ProjectStatus,
} from './constants'

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className="inline-block px-3 py-1 font-mono text-[0.65rem] leading-none font-semibold tracking-[0.15em] text-[#0A0A0A] uppercase"
      style={{ backgroundColor: STATUS_COLOR[status], clipPath: BADGE_CLIP }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
