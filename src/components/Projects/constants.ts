// Projects "Quest Screen" data layer — the single source of truth the whole
// page renders over (the list rows, the detail panel, and the deep links all
// read from here). Plain values / `as const` data, kept free of React + DOM so
// editing content never touches component logic (same split as
// MainMenu/constants.ts, Landing/constants.ts, P3RBackground/constants.ts).
//
// Adding a future project is meant to be a single, obvious append to PROJECTS
// below — no UI code touched. That is the success test for this layer.

export type ProjectStatus = 'IN_PROGRESS' | 'DONE'

export type ProjectLink = {
  label: string // "GitHub", "Demo", "Devpost", "Writeup"…
  href: string
  newTab?: boolean // open in a new tab (external links)
}

export type Project = {
  // `slug` is the contract with the deep-link logic (getProjectBySlug below).
  // It must be URL-safe, stable and unique — changing it breaks any shared
  // link that opens this project directly.
  slug: string
  name: string
  start: string // ISO 'YYYY-MM' (or 'YYYY-MM-DD')
  // `end` is optional so an IN_PROGRESS project renders a clean, open-ended
  // range (e.g. `2025.03 — `) without needing a sentinel value.
  end?: string
  status: ProjectStatus
  tags: readonly string[]
  summary: string // one-liner shown in the row / collapsed state
  details?: string // longer body for the expanded detail panel
  links?: readonly ProjectLink[]
  // Screenshots are shown "only when useful" — a project with none must still
  // render fine. Assets live under public/assets/projects/ and are referenced
  // by path.
  screenshots?: readonly { src: string; alt: string }[]
}

// Order is intentional: newest / most important first. The displayed
// /01 /02 /03 numbering (Task 02) derives from this array order, NOT a stored
// field — reorder these entries to reorder the quest log.
export const PROJECTS: readonly Project[] = [
  {
    slug: 'agent-squared',
    name: 'Agent²',
    start: '2026-03',
    end: '2026-03',
    status: 'DONE',
    tags: ['Python', 'FastAPI', 'Railtracks', 'Playwright', 'Telnyx', 'AWS'],
    summary:
      'AI real estate assistant that turns phone conversations into a structured home search and texts back matching listings.',
    details:
      'Built a voice-to-search pipeline using Telnyx voice streaming, PersonaPlex speech processing, and LLM-based extraction to interpret a caller’s preferences into structured search criteria. Automated listing discovery scrapes real estate sites with Playwright and ranks results with LLM-assisted scoring, returning matches to the user by SMS.',
  },
  {
    slug: 'farmesh',
    name: 'Farmesh',
    start: '2026-03',
    end: '2026-03',
    status: 'DONE',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Backboard'],
    summary:
      'AI-assisted platform matching farm supply with restaurant demand through a multi-agent pipeline.',
    details:
      'A multi-agent pipeline — intake, normalization, demand interpretation, and vendor matching — converts free-text marketplace inputs into structured data. Role-based dashboards surface matching workflows with transparent AI reasoning behind each supply–demand recommendation.',
  },
  {
    slug: 'befriend',
    name: 'Befriend — Your Social Circle',
    start: '2023-06',
    end: '2024-08',
    status: 'DONE',
    tags: ['Flutter', 'Firebase'],
    summary:
      'Cross-platform social app (100+ downloads), taken solo from design to store deployment.',
    details:
      'Built and published a cross-platform social app to both the App Store and Play Store, managing every aspect from design through deployment, reaching 100+ downloads.',
  },
] as const

// --- Derived helpers (pure, React/DOM-free) --------------------------------
// Small formatting / lookup helpers kept beside the data so components stay
// logic-free (same separation as Landing/promptSweep.ts vs Landing/constants.ts).

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

// --- Quest-list presentation (Task 02) -------------------------------------
// Tunable look of the mission list. Kept here (React/DOM-free values) so the
// row/list components stay logic-free, same split as MainMenu/constants.ts.

// Static section chrome, repurposed from P3R's Quest screen: the QUEST header →
// PROJECTS title, the "Sort by No." affordance, and the bottom "which one?" hint.
export const SECTION_TITLE = 'PROJECTS'
export const SORT_HINT = 'Sort by No.'
export const VIEW_HINT = 'Which project do you want to view?'

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

// Zero-padded quest number derived from array order: 0 → '01', 9 → '10'.
export const formatIndex = (i: number): string =>
  String(i + 1).padStart(2, '0')
