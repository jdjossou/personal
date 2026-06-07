// Projects "Quest Screen" helpers — the pure (React/DOM-free) formatting and
// lookup functions the components lean on, kept out of both the data file
// (projects.ts) and the constants file (constants.ts) so each stays single-
// purpose. Same separation as Landing/promptSweep.ts vs Landing/constants.ts.

import { PROJECTS, type Project } from './projects'
import type { SortMode } from './constants'

// 'YYYY-MM' / 'YYYY-MM-DD' → 'YYYY.MM' (drops any day component).
const toDottedMonth = (iso: string): string => {
  const [year, month] = iso.split('-')
  return month ? `${year}.${month}` : year
}

// Format a project's date span for a row, e.g. `2025.03 — 2025.06`. When `end`
// is omitted the project is ongoing and renders an open range: `2025.03 — `.
export const formatDateRange = (start: string, end?: string): string =>
  `${toDottedMonth(start)} — ${end ? toDottedMonth(end) : ''}`

// Resolve a project from its stable `slug` — used by the deep-link logic
// (Task 04) to open a project directly from a shared URL. Returns undefined for
// an unknown slug so callers can fall back to the plain list.
export const getProjectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((project) => project.slug === slug)

// Zero-padded quest number derived from array order: 0 → '01', 9 → '10'.
export const formatIndex = (i: number): string =>
  String(i + 1).padStart(2, '0')

// --- Sort (Task 05) --------------------------------------------------------
// Status priority for the 'status' sort — active quests (IN_PROGRESS) rise to
// the top, finished ones (DONE) sink below, matching a quest log's "what's
// open" framing.
const STATUS_RANK: Record<Project['status'], number> = {
  IN_PROGRESS: 0,
  DONE: 1,
}

// Return PROJECTS in the requested display order. 'index' is the authored order
// (returned as-is). 'date' is newest start first. 'status' groups IN_PROGRESS
// before DONE. Both sorted modes break ties by the original authored index so
// the order is stable and deterministic. Never mutates PROJECTS — slugs and the
// deep-link contract are untouched; only the displayed sequence changes.
export const orderProjects = (mode: SortMode): readonly Project[] => {
  if (mode === 'index') return PROJECTS
  const indexed = PROJECTS.map((project, i) => ({ project, i }))
  indexed.sort((a, b) => {
    if (mode === 'date') {
      // String compare is correct for zero-padded ISO 'YYYY-MM' values.
      const byStart = b.project.start.localeCompare(a.project.start)
      if (byStart !== 0) return byStart
    } else {
      const byStatus = STATUS_RANK[a.project.status] - STATUS_RANK[b.project.status]
      if (byStatus !== 0) return byStatus
    }
    return a.i - b.i // stable tiebreak: authored order
  })
  return indexed.map((entry) => entry.project)
}
