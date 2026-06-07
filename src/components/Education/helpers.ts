// Education "Stats Screen" helpers — the pure (React/DOM-free) formatting and
// lookup functions the components lean on, kept out of both the data file
// (education.ts) and the constants file (constants.ts) so each stays single-
// purpose. Same separation as Projects/helpers.ts.

import { COURSES, type Course } from './education'
import type { EducationProfile } from './education'
import type { SortMode } from './constants'

// 'YYYY-MM' / 'YYYY-MM-DD' → 'YYYY.MM' (drops any day component). Same idiom as
// Projects/helpers.ts toDottedMonth.
const toDottedMonth = (iso: string): string => {
  const [year, month] = iso.split('-')
  return month ? `${year}.${month}` : year
}

// Resolve a course from its stable `slug` — used by selection (Task 03) and the
// optional deep link (Task 04). Returns undefined for an unknown slug so callers
// can fall back to the plain list.
export const getCourseBySlug = (slug: string): Course | undefined =>
  COURSES.find((course) => course.slug === slug)

// Zero-padded stats number derived from array order: 0 → '01', 9 → '10'.
export const formatIndex = (i: number): string =>
  String(i + 1).padStart(2, '0')

// Derive the P3R `Lv.N` figure from the course number — the first digit of the
// numeric part of the code (CS246 → 2, CS341 → 3, PD11 → 1). Respects an explicit
// `course.level` override when present. Returns undefined if the code has no
// numeric part so callers can omit the level cleanly.
export const levelFromCode = (course: Course): number | undefined => {
  if (course.level !== undefined) return course.level
  const digits = course.code.match(/\d/)
  return digits ? Number(digits[0]) : undefined
}

// 'YYYY-MM' → '2025.01' for the term figure. Reuses the dotted-month idiom.
export const formatTerm = (term: string): string => toDottedMonth(term)

// Course weight → display string, e.g. 0.5 → '0.50 units'.
export const formatUnits = (units: number): string =>
  `${units.toFixed(2)} units`

// Expected graduation ISO 'YYYY-MM' → 'Expected 2028' (year only).
export const formatGraduation = (
  expectedGraduation: EducationProfile['expectedGraduation'],
): string => `Expected ${expectedGraduation.split('-')[0]}`

// --- Sort (Task 04) --------------------------------------------------------
// Category priority for the 'category' sort — CORE requirements rise to the top,
// SEMINAR sinks below, matching the reference's LEADER-before-PARTY framing.
const CATEGORY_RANK: Record<Course['category'], number> = {
  CORE: 0,
  ELECTIVE: 1,
  SEMINAR: 2,
}

// Return COURSES in the requested display order. 'index' is the authored order
// (returned as-is, same reference). 'level' is highest course level first.
// 'category' groups CORE → ELECTIVE → SEMINAR. Both sorted modes break ties by
// the original authored index so the order is stable and deterministic. Never
// mutates COURSES — slugs and the deep-link contract are untouched; only the
// displayed sequence changes.
export const orderCourses = (mode: SortMode): readonly Course[] => {
  if (mode === 'index') return COURSES
  const indexed = COURSES.map((course, i) => ({ course, i }))
  indexed.sort((a, b) => {
    if (mode === 'level') {
      const byLevel =
        (levelFromCode(b.course) ?? 0) - (levelFromCode(a.course) ?? 0)
      if (byLevel !== 0) return byLevel
    } else {
      const byCategory =
        CATEGORY_RANK[a.course.category] - CATEGORY_RANK[b.course.category]
      if (byCategory !== 0) return byCategory
    }
    return a.i - b.i // stable tiebreak: authored order
  })
  return indexed.map((entry) => entry.course)
}
