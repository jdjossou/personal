// Experience "Social Link" data — the single source of truth the whole page
// renders over (the bond roster, the journal/detail panel, the company tarot
// card, and the `/experience/<slug>` deep link all read from here). Pure data +
// the types that describe it: no React, no DOM, no helper logic (formatting /
// lookup live in helpers.ts; tunable look lives in constants.ts). This is the
// one file you edit to add a job.
//
// Adding a future role is meant to be a single, obvious append to ROLES below —
// no UI code touched. That is the success test for this layer.
//
// **Voice:** `journal` is the deliverable, not a résumé bullet. Write it in the
// first person, past tense, outcome-oriented — "I built X, which helped Y."
//   Bad:  "Responsible for the billing service."
//   Good: "I rebuilt the billing service around idempotent webhooks, which cut
//          failed renewals ~30%."
// Keep every entry in this voice; it is the whole point of the section.

export type RoleLink = {
  label: string // "GitHub", "Case study", "Demo", "Writeup"…
  href: string
  newTab?: boolean // open in a new tab (external links)
}

export type Role = {
  // `slug` is the contract with selection (Task 03) + the deep link
  // (`/experience/<slug>`). URL-safe, stable, unique — changing it breaks any
  // shared link to this role. Same discipline as Project.slug / Term.slug.
  slug: string
  company: string // → the big arcana-name ("Magician") slot — dominant label
  role: string // job title → the relationship-label ("Classmate") slot
  location: string // → the "ARCANA" micro-label slot ("Toronto, ON" / "Remote")
  start: string // ISO 'YYYY-MM'
  // `end` omitted ⇒ current role → the date range reads "… — Present" and fills
  // the reference's "RANK n" slot (formatDateRange in helpers.ts).
  end?: string
  // '/assets/experience/acme.svg' — drives the company tarot card. Optional: a
  // logo-less company falls back to a monogram system card (never an empty frame).
  logo?: string
  companyBlurb?: string // optional one-line "what this place is" → bottom-right bio slot
  journal: string // THE journal paragraph (= the job description). See **Voice:** above.
  links?: readonly RoleLink[] // optional
}

// NOTE: there is intentionally NO arcana / rank / employment-type field — those
// reference slots are reused for company / dates / job title per the fixed
// mapping (00-overview.md), so there is no invented flavour data to drift.
//
// Order is intentional: MOST RECENT FIRST. The displayed roster order and the
// /01 /02 numbering (Task 02) derive from this array order, NOT a stored field —
// reorder these entries to reorder the bond roster.
export const ROLES: readonly Role[] = [
  {
    // ⚠️ SEED — VERIFY THIS. Placeholder current role — replace company, title,
    // location, dates, and journal with your real, in-progress co-op.
    slug: 'current-co-op-software',
    company: 'Acme Systems',
    role: 'Software Engineer Intern',
    location: 'Toronto, ON',
    start: '2026-05',
    companyBlurb: 'Logistics platform for mid-market freight carriers.',
    journal:
      'I am building the carrier-onboarding service that turns a new partner from signup to first shipment, which trimmed manual setup from days to under an hour. I designed the document-verification pipeline around a small state machine so a stuck application is always inspectable rather than silently lost.',
  },
  {
    // ⚠️ SEED — VERIFY THIS. Placeholder past role.
    slug: 'past-co-op-backend',
    company: 'Northwind Labs',
    role: 'Backend Developer Intern',
    location: 'Remote',
    start: '2025-09',
    end: '2025-12',
    companyBlurb: 'Developer-tooling startup for observability pipelines.',
    journal:
      'I rebuilt the log-ingestion path around batched, idempotent writes, which cut dropped events to near zero during traffic spikes and let us replay any window without duplicates. I added the back-pressure metrics the on-call team had been flying blind without, so incidents got caught at the source instead of at the dashboard.',
    links: [
      {
        label: 'Writeup',
        href: 'https://example.com/writeup',
        newTab: true,
      },
    ],
  },
  {
    // ⚠️ SEED — VERIFY THIS. Placeholder earliest role (no logo → monogram card).
    slug: 'first-co-op-fullstack',
    company: 'Bridgeline',
    role: 'Full-Stack Developer Intern',
    location: 'Waterloo, ON',
    start: '2025-01',
    end: '2025-04',
    journal:
      'I shipped the self-serve reporting page that let account managers pull their own numbers, which removed a recurring weekly ask from the engineering queue. I built it as a thin query layer over the existing warehouse so adding a new report became a config change, not a deploy.',
  },
] as const
