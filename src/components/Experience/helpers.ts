// Experience "Social Link" helpers — the pure (React/DOM-free) formatting and
// lookup functions the components lean on, kept out of both the data file
// (experience.ts) and the constants file (constants.ts) so each stays single-
// purpose. Same separation as Education/helpers.ts and Projects/helpers.ts.

import { ROLES, type Role } from './experience'

// 'YYYY-MM' / 'YYYY-MM-DD' → 'YYYY.MM' (drops any day component). Mirrors the
// dotted-month idiom in Projects/helpers.ts.
const toDottedMonth = (iso: string): string => {
  const [year, month] = iso.split('-')
  return month ? `${year}.${month}` : year
}

// Format a role's date span for the "RANK n" slot, e.g. `2025.05 — 2025.08`.
// When `end` is omitted the role is current and reads `2025.05 — Present` (unlike
// Projects' open-ended `2025.05 — `, Experience names the live state explicitly).
export const formatDateRange = (start: string, end?: string): string =>
  `${toDottedMonth(start)} — ${end ? toDottedMonth(end) : 'Present'}`

// Resolve a role from its stable `slug` — used by the deep-link resolver (Task
// 03) to open a role directly from `/experience/<slug>`. Returns undefined for an
// unknown slug so callers can fall back to the default selection. Mirrors
// Education's getTermBySlug / Projects' getProjectBySlug.
export const getRoleBySlug = (slug: string): Role | undefined =>
  ROLES.find((role) => role.slug === slug)

// Zero-padded roster number derived from array order: 0 → '01', 9 → '10'.
// Mirrors Projects' formatIndex.
export const formatIndex = (i: number): string => String(i + 1).padStart(2, '0')
