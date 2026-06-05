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
