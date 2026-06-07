// Projects "Quest Screen" helpers — the pure (React/DOM-free) formatting and
// lookup functions the components lean on, kept out of both the data file
// (projects.ts) and the constants file (constants.ts) so each stays single-
// purpose. Same separation as Landing/promptSweep.ts vs Landing/constants.ts.

import { PROJECTS, type Project } from './projects'

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
