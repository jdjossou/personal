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
// did Y."
//   Bad bullet:  "Responsible for the billing service."
//   Good bullet: "Rebuilt the billing service around idempotent webhooks, which
//                 cut failed renewals ~30%."

export type Role = {
  // `slug` is the contract with selection + the deep link (`/experience/<slug>`).
  // URL-safe, stable, unique — changing it breaks any shared link to this role.
  slug: string
  company: string // → the info card's black header strip + the identity-panel name
  role: string // experience title → the big black text in the white card panel
  location: string // → the small angled black tab on the card's left edge; city only (e.g. "Montreal", not "Montreal, Canada")
  start: string // ISO 'YYYY-MM'
  // `end` omitted ⇒ current role → the date range reads "… — Present" and fills
  // the right side of the white card panel (formatDateRange in helpers.ts).
  end?: string
  // The ★ resume bullets — the left-side job description. See **Voice:** above.
  bullets: readonly string[]
  // The technologies used — rendered as small angular tags in the identity panel.
  technologies: readonly string[]
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
    slug: "intact-fullstack-2026",
    company: "Intact Financial Corporation",
    role: "Software Developer I – Full-Stack",
    location: "Montreal",
    start: "2026-05",
    end: "2026-08",
    bullets: [
      "Investigated and resolved production defects across distributed microservices, collaborating with developers and stakeholders to restore service reliability and minimize business impact.",
      "Drove an AI-assisted defect analysis initiative to automate root cause identification and reduce mean time to resolution.",
      "Leveraged experience across the full stack to contribute to both frontend and backend services in a high-throughput production environment.",
    ],
    technologies: ["Java", "Spring Boot", "Kafka", "Angular", "AWS", "JUnit", "TypeScript", "Jira", "Oracle SQL", "MongoDB"],
  },
  {
    slug: "intact-backend-2025",
    company: "Intact Financial Corporation",
    role: "Software Developer I – Backend",
    location: "Montreal",
    start: "2025-09",
    end: "2025-12",
    bullets: [
      "Designed and shipped backend features across Spring Boot microservices using Java, Kubernetes, and Kafka.",
      "Implemented a multilingual logo-selection system across Angular and Thymeleaf services, deployed to production with full test coverage.",
      "Increased test coverage up to 90% across 3 Spring Boot services using JUnit and Spring Boot Test, reducing regression risk in critical flows.",
      "Led observability efforts by adding service-level metrics and building Dynatrace dashboards for 7 services.",
    ],
    technologies: ["Java", "Spring Boot", "Kubernetes", "Kafka", "Angular", "Thymeleaf", "JUnit", "Dynatrace", "HTML", "CSS", "Jenkins", "Postman", "Jira", "Oracle SQL"],
  },
  {
    slug: "li-ai-researcher-2025",
    company: "Local Technologies Inc.",
    role: "Student AI Researcher",
    location: "Remote",
    start: "2025-01",
    end: "2025-04",
    bullets: [
      "Researched recommendation systems and predictive analytics to identify scalable AI solutions for local businesses.",
      "Delivered reports translating AI capabilities into actionable product decisions for non-technical stakeholders.",
    ],
    technologies: ["AI", "Research", "Recommendation Systems", "Predictive Analytics"],
  },
] as const
