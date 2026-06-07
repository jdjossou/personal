// Projects "Quest Screen" data — the single source of truth the whole page
// renders over (the list rows, the detail panel, and the deep links all read
// from here). Pure data + the types that describe it: no React, no DOM, no
// helper logic (formatting/lookup live in helpers.ts; tunable look lives in
// constants.ts). This is the one file you edit to manage projects.
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
  // `slug` is the contract with the deep-link logic (getProjectBySlug in
  // helpers.ts). It must be URL-safe, stable and unique — changing it breaks any
  // shared link that opens this project directly.
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
    links: [
      {
        label: 'Devpost',
        href: 'https://devpost.com/software/agent-o3l6si',
        newTab: true,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/chantalzhang/genaigenesis2026',
        newTab: true,
      },
    ],
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
    links: [
      {
        label: 'Devpost',
        href: 'https://devpost.com/software/farmesh',
        newTab: true,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/jdjossou/farmesh',
        newTab: true,
      },
    ],
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
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/jdjossou/befriend',
        newTab: true,
      },
    ],
    tags: ['Flutter', 'Firebase'],
    summary:
      'Cross-platform social app (100+ downloads), taken solo from design to store deployment.',
    details:
      'Built and published a cross-platform social app to both the App Store and Play Store, managing every aspect from design through deployment, reaching 100+ downloads.',
  },
] as const
