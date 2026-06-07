// Education "Stats Screen" presentation constants — the tunable look of the
// stats list (section chrome, category badge labels/colours, selection accent,
// sort labels). Constants only: the course data lives in education.ts and the
// formatting/lookup functions in helpers.ts. Kept React/DOM-free so the row/list
// components stay logic-free, same split as Projects/constants.ts.

import type { CourseCategory } from './education'

// --- Stats-screen chrome (Task 02) -----------------------------------------
// Static section chrome, repurposed from P3R's Check Stats screen: the header →
// EDUCATION title, and the bottom "whose stats?" prompt → "which course?".
export const SECTION_TITLE = 'EDUCATION'
export const VIEW_HINT = 'Which course do you want to view?'

// --- Category badge (Task 02) ----------------------------------------------
// The reference's LEADER/PARTY role badge slot → course category. Data enum stays
// CORE/ELECTIVE/SEMINAR; these are only the display labels and accent colours.
export const CATEGORY_LABEL: Record<CourseCategory, string> = {
  CORE: 'CORE',
  ELECTIVE: 'ELECTIVE',
  SEMINAR: 'SEMINAR',
}

// Per-category accent colour. CORE → the site's confident crimson (the "main"
// requirements, echoing LEADER); ELECTIVE → cold P3R blue; SEMINAR → a muted
// slate so it reads as supporting. Tune freely.
export const CATEGORY_COLOR: Record<CourseCategory, string> = {
  CORE: '#E0444A',
  ELECTIVE: '#5EA8E0',
  SEMINAR: '#9AA7B4',
}

// --- Sort control (Task 04) ------------------------------------------------
// Optional sort, mirroring the Projects screen. 'index' (default) keeps the
// order authored in education.ts so the list reads "Sort by No." at rest.
// Sorting only re-orders the displayed /01 /02 numbers — each course keeps its
// slug, so deep links never move.
export type SortMode = 'index' | 'level' | 'category'

// Cycle order when the control is pressed: No. → Level → Category → No.
export const SORT_CYCLE: readonly SortMode[] = ['index', 'level', 'category']

export const SORT_LABELS: Record<SortMode, string> = {
  index: 'Sort by No.',
  level: 'Sort by Level',
  category: 'Sort by Category',
}

// --- Selection accent (Task 03) --------------------------------------------
// The active stats row uses the same soft translucent crimson + white marker as
// the Projects quest rows, so selection reads consistently across the site.
export const SELECT_BAND_FILL = 'rgba(163, 22, 33, 0.82)' // soft translucent crimson
export const SELECT_MARKER_WHITE = '#FFFFFF'

// Static section label in the detail readout's links block (Task 03).
export const LINKS_LABEL = 'Links'
