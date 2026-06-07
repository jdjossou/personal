// Education "Academic Status" helpers — the pure (React/DOM-free) formatting and
// lookup functions the components lean on, kept out of both the data file
// (education.ts) and the constants file (constants.ts) so each stays single-
// purpose. Same separation as Projects/helpers.ts.

import { COURSES, TERMS, type Course, type Term } from './education'
import type { EducationProfile } from './education'

// Resolve a term from its stable `slug` — used by selection and the deep link
// (`/education/<slug>`). Returns undefined for an unknown slug so callers can
// fall back to the default selection. Mirrors Projects' getProjectBySlug.
export const getTermBySlug = (slug: string): Term | undefined =>
  TERMS.find((term) => term.slug === slug)

// The courses shown under a term: every course whose `term` matches the term's
// `period` (authored COURSES order preserved), then any extra `courseSlugs`
// pinned on the term (term-less courses like PD) that weren't already matched.
// Pure — never mutates COURSES.
export const coursesForTerm = (term: Term): readonly Course[] => {
  const matched = COURSES.filter((course) => course.term === term.period)
  if (!term.courseSlugs || term.courseSlugs.length === 0) return matched
  const have = new Set(matched.map((course) => course.slug))
  const pinned = term.courseSlugs
    .filter((slug) => !have.has(slug))
    .map((slug) => COURSES.find((course) => course.slug === slug))
    .filter((course): course is Course => course !== undefined)
  return [...matched, ...pinned]
}

// Derive the P3R `Lv.N` figure from the course number — the first digit of the
// numeric part of the code (CS246 → 2, CS341 → 3, PD11 → 1). Respects an
// explicit `course.level` override. Returns undefined when the code has no
// numeric part so callers can omit the level cleanly.
export const levelFromCode = (course: Course): number | undefined => {
  if (course.level !== undefined) return course.level
  const digits = course.code.match(/\d/)
  return digits ? Number(digits[0]) : undefined
}

// ISO 'YYYY-MM' → 'Winter 2025' / 'Spring 2025' / 'Fall 2025'. Waterloo's three
// terms map by start month: Jan–Apr → Winter, May–Aug → Spring, Sep–Dec → Fall.
export const formatTermPeriod = (period: string): string => {
  const [year, month] = period.split('-')
  if (!month) return year
  const m = Number(month)
  const season = m <= 4 ? 'Winter' : m <= 8 ? 'Spring' : 'Fall'
  return `${season} ${year}`
}

// Expected graduation ISO 'YYYY-MM' → the bare year ('2028') for the "Class of"
// treatment in the identity panel.
export const graduationYear = (
  profile: EducationProfile,
): string => profile.expectedGraduation.split('-')[0]

// Split a degree string like 'BCS, Computer Science' into its parts: the
// credential ('BCS') and the program ('Computer Science', the big display
// title). A degree with no comma falls back to the whole string as the program.
export const splitDegree = (
  degree: string,
): { credential: string; program: string } => {
  const [credential, ...rest] = degree.split(',')
  const program = rest.join(',').trim()
  return { credential: credential.trim(), program: program || credential.trim() }
}
