// Experience "Social Link" helpers — the pure (React/DOM-free) formatting and
// lookup functions the components lean on, kept out of both the data file
// (experience.ts) and the constants file (constants.ts) so each stays single-
// purpose. Same separation as Education/helpers.ts and Projects/helpers.ts.

import { ROLES, type Role } from './experience'

// 'YYYY-MM' / 'YYYY-MM-DD' → 'Sep 2025' (abbreviated month + year). The date
// range sits in the white card panel, so it reads as a human label rather than
// the dotted-numeric idiom used elsewhere.
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const
const toMonthYear = (iso: string): string => {
  const [year, month] = iso.split('-')
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year
}

// Format a role's date span for the white card's right slot, e.g.
// `Sep 2025 – Dec 2025`. When `end` is omitted the role is current and reads
// `Sep 2025 – Present`.
export const formatDateRange = (start: string, end?: string): string =>
  `${toMonthYear(start)} – ${end ? toMonthYear(end) : 'Present'}`

// Same span split into its two ends for the LIST card, which stacks the start
// over the end (mirroring the reference's RANK-over-number block) instead of
// running them on one line. Returns `[start, end]`; a current role's end reads
// `Present`.
export const formatDateParts = (start: string, end?: string): [string, string] =>
  [toMonthYear(start), end ? toMonthYear(end) : 'Present']

// Resolve a role from its stable `slug` — used by the deep-link resolver (Task
// 03) to open a role directly from `/experience/<slug>`. Returns undefined for an
// unknown slug so callers can fall back to the default selection. Mirrors
// Education's getTermBySlug / Projects' getProjectBySlug.
export const getRoleBySlug = (slug: string): Role | undefined =>
  ROLES.find((role) => role.slug === slug)

// Zero-padded roster number derived from array order: 0 → '01', 9 → '10'.
// Mirrors Projects' formatIndex.
export const formatIndex = (i: number): string => String(i + 1).padStart(2, '0')
