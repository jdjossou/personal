// Projects "Quest Screen" presentation constants — the tunable look of the
// mission list (labels, status colours, selection accent). Constants only: the
// project data lives in projects.ts and the formatting/lookup functions in
// helpers.ts. Kept React/DOM-free so the row/list components stay logic-free,
// same split as MainMenu/constants.ts, Landing/constants.ts.

import type { ProjectStatus } from './projects'

// --- Quest-list chrome (Task 02) -------------------------------------------
// Static section chrome, repurposed from P3R's Quest screen: the QUEST header →
// PROJECTS title, the "Sort by …" affordance, and the bottom "which one?" hint.
export const SECTION_TITLE = 'PROJECTS'
export const VIEW_HINT = 'Which project do you want to view?'

// --- Sort control (Task 05) ------------------------------------------------
// The reference's "Sort by No." is a live control that cycles through three
// orderings. The labels echo the reference; 'index' (default) keeps the order
// authored in projects.ts so the page reads "Sort by No." at rest. Sorting only
// re-orders the displayed /01 /02 numbers — each project keeps its slug, so
// deep links never move (see QuestList).
export type SortMode = 'index' | 'date' | 'status'

// Cycle order when the control is pressed: No. → Date → Status → No.
export const SORT_CYCLE: readonly SortMode[] = ['index', 'date', 'status']

export const SORT_LABELS: Record<SortMode, string> = {
  index: 'Sort by No.',
  date: 'Sort by Date',
  status: 'Sort by Status',
}

// Per-status badge copy. The data enum stays IN_PROGRESS/DONE; these are only
// the display labels (DONE reads "DONE", echoing the reference's chip).
export const STATUS_LABEL: Record<ProjectStatus, string> = {
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE',
}

// Per-status accent colour. IN PROGRESS → the site's cold P3R blue (echoes the
// reference's blue InProgress chip); DONE → a confident green. Tune freely.
export const STATUS_COLOR: Record<ProjectStatus, string> = {
  IN_PROGRESS: '#5EA8E0',
  DONE: '#3FB96B',
}

// Cap how many tags render inline in a row before the rest collapse to a "+N"
// counter, so a tag-heavy project never blows out the column.
export const MAX_ROW_TAGS = 4

// --- Selection accent (Task 03) --------------------------------------------
// The active quest row is a soft, rounded crimson chip with a white left marker
// — the table-row analogue of MainMenu's vertical selector triangle (and what
// reference.png shows for a highlighted quest row). A deep, slightly muted and
// translucent crimson (not MainMenu's hot #E01010) so the highlight reads as
// "selected" without shouting. Rendered as the row's own background (not an
// overlay) so it shares the exact rounded shape of every other row chip.
export const SELECT_BAND_FILL = 'rgba(163, 22, 33, 0.82)' // soft translucent crimson
export const SELECT_MARKER_WHITE = '#FFFFFF' // mirrors MainMenu SELECTOR_WHITE

// Static section label in the detail readout's links block (Task 03).
export const LINKS_LABEL = 'Links'
