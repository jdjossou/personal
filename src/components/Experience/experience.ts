// Experience "Social Link" data — the single source of truth the whole page
// renders over (the angled info card, the star-bullet job description, the
// company icon, the bottom-right identity panel, and the `/experience/<slug>`
// deep link all read from here). Pure data + the types that describe it: no
// React, no DOM, no helper logic (formatting / lookup live in helpers.ts;
// tunable look lives in constants.ts). This is the one file you edit to add a
// job.
//
// Adding a future role is meant to be a single, obvious append to ROLES below —
// no UI code touched. That is the success test for this layer.
//
// **Voice:** `bullets` are resume-style accomplishment lines (the ★ list on the
// left), first person, past/present tense, outcome-oriented — "Built X, which
// did Y." `summary` is the one-sentence "what this experience is" shown in the
// bottom-right identity panel — shorter and more descriptive than the bullets.
//   Bad bullet:  "Responsible for the billing service."
//   Good bullet: "Rebuilt the billing service around idempotent webhooks, which
//                 cut failed renewals ~30%."

export type RoleLink = {
  label: string // "GitHub", "Case study", "Demo", "Writeup"…
  href: string
  newTab?: boolean // open in a new tab (external links)
}

export type Role = {
  // `slug` is the contract with selection + the deep link (`/experience/<slug>`).
  // URL-safe, stable, unique — changing it breaks any shared link to this role.
  slug: string
  company: string // → the info card's black header strip + the identity-panel name
  role: string // experience title → the big black text in the white card panel
  location: string // → the small angled black tab on the card's left edge
  start: string // ISO 'YYYY-MM'
  // `end` omitted ⇒ current role → the date range reads "… — Present" and fills
  // the right side of the white card panel (formatDateRange in helpers.ts).
  end?: string
  // The ★ resume bullets — the left-side job description. See **Voice:** above.
  bullets: readonly string[]
  // The one-sentence summary shown in the bottom-right identity panel. See **Voice:**.
  summary: string
  // The technologies used — rendered as small angular tags in the identity panel.
  technologies: readonly string[]
  links?: readonly RoleLink[] // optional
}

// ⚠️ SCAFFOLD — VERIFY THIS. These entries use the company names called out in
// docs/experience/redesign.md as a starting shape; the dates, bullets, tech, and
// summaries are plausible placeholders meant to be replaced with your real
// experience. Befriend's copy is lifted from the redesign's own examples (§5/§9.2).
//
// Order is intentional: MOST RECENT FIRST. The displayed roster order and the
// /01 /02 numbering derive from this array order, NOT a stored field — reorder
// these entries to reorder the roster.
export const ROLES: readonly Role[] = [
  {
    slug: 'intact',
    company: 'Intact Financial Corporation',
    role: 'Software Developer I - Backend',
    location: 'Montreal',
    start: '2025-09',
    end: '2025-12',
    summary:
      'A backend co-op shipping production features across Spring Boot microservices for Canada’s largest property & casualty insurer.',
    bullets: [
      'Designed and shipped backend features across Spring Boot microservices using Java, Kubernetes, and Kafka.',
      'Implemented a multilingual logo-selection system across Angular and Thymeleaf services, deployed to production with full test coverage.',
      'Increased test coverage up to 90% across 3 Spring Boot services using JUnit and Spring Boot Test, reducing the risk of regression in critical flows.',
      'Resolved critical SOAP and REST API issues, improving reliability and cross-team integrations.',
      'Led observability efforts by adding service-level metrics and building Dynatrace dashboards for 7 services.',
    ],
    technologies: [
      'Java', 'Spring Boot', 'Kubernetes', 'Kafka', 'Angular', 'Thymeleaf',
      'JUnit', 'Spring Boot Test', 'SOAP', 'REST API', 'Dynatrace',
    ],
  },
  {
    // ⚠️ SCAFFOLD — VERIFY THIS.
    slug: 'watplan',
    company: 'WatPlan',
    role: 'Full-Stack Developer',
    location: 'Waterloo, ON',
    start: '2024-01',
    end: '2024-04',
    summary:
      'A degree-planning tool that maps Waterloo course requirements onto a visual term-by-term roadmap.',
    bullets: [
      'Built a course-planning web app that turns a tangle of prerequisites into a clear term-by-term roadmap.',
      'Modelled the requirement graph and wrote the validator that flags missing prerequisites before a plan is saved.',
      'Shipped a responsive drag-and-drop board so students can rearrange courses across terms on any device.',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    links: [
      {
        label: 'GitHub',
        href: 'https://example.com/watplan',
        newTab: true,
      },
    ],
  },
  {
    // ⚠️ SCAFFOLD — VERIFY THIS.
    slug: 'mcgill-research',
    company: 'McGill University',
    role: 'Chemistry Research Intern',
    location: 'Montréal, QC',
    start: '2023-05',
    end: '2023-08',
    summary:
      'A summer research role building data-processing tooling for a computational chemistry lab.',
    bullets: [
      'Wrote Python pipelines that cleaned and aggregated raw spectrometer output for downstream analysis.',
      'Automated a manual reporting workflow, cutting a recurring multi-hour task to a single command.',
      'Collaborated with graduate researchers to translate experimental needs into reusable scripts.',
    ],
    technologies: ['Python', 'NumPy', 'pandas', 'Matplotlib', 'Git'],
  },
  {
    // ⚠️ SCAFFOLD — VERIFY THIS.
    slug: 'cineplex',
    company: 'Cineplex',
    role: 'Software Developer Intern',
    location: 'Toronto, ON',
    start: '2022-09',
    end: '2022-12',
    summary:
      'A backend internship on the services that power ticketing and loyalty across the theatre network.',
    bullets: [
      'Implemented and tested REST endpoints for the loyalty service used across the booking flow.',
      'Added integration tests that caught regressions before release and raised confidence in deploys.',
      'Paired with senior engineers to ship a caching layer that trimmed response times on hot paths.',
    ],
    technologies: ['C#', '.NET', 'SQL Server', 'Azure', 'Git'],
  },
] as const
