// Status chip (Task 02 → Task 03) — the right-pinned badge on each quest row,
// echoing the reference's InProgress/Done chip. A soft rounded pill; by default
// it is filled with STATUS_COLOR over dark text. When its row is `selected` it
// inverts — a white pill with STATUS_COLOR text — so the colour visibly changes
// on selection and stays legible on the crimson selection chip (while still
// reading DONE-green vs IN-PROGRESS-blue). Pure + presentational.

import { STATUS_COLOR, STATUS_LABEL } from './constants'
import type { ProjectStatus } from './projects'

export function StatusBadge({
  status,
  selected = false,
}: {
  status: ProjectStatus
  selected?: boolean
}) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 font-mono text-[0.65rem] leading-none font-semibold tracking-[0.15em] uppercase"
      style={
        selected
          ? { backgroundColor: '#FFFFFF', color: STATUS_COLOR[status] }
          : { backgroundColor: STATUS_COLOR[status], color: '#0A0A0A' }
      }
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
