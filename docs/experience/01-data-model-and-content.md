## Task 01 — Data Model & Content Source

> ✅ **DONE (structure) — but content is still SCAFFOLD.** The model shipped, adapted to
> [`redesign.md`](redesign.md): `experience.ts` exports `Role` with `bullets[]` (★ list),
> `summary`, and `technologies[]` **instead of** the `journal` / `companyBlurb` / `logo`
> below, and `helpers.ts` has `formatDateRange` / `getRoleBySlug` / `formatIndex`. The
> `journal` / tarot framing in this doc is superseded. **Remaining:** the `ROLES` entries
> are flagged `⚠️ SCAFFOLD — VERIFY THIS` — swap in real, Voice-compliant content. Note
> `summary` and `links` are currently unrendered (decide their fate in Task 03/04).

### Goal

Define the single source of truth for work-experience data so the rest of the page is
purely a renderer over it. The headline requirement from `goal.md` is the **journal
voice** ("I built X, which helped Y", *never* "responsible for X") and **most recent
role first** — both live or die on this layer. No UI here; this is the data the roster
(Task 02), the detail panel (Task 03), and the deep links (Task 03) all read from.

Follow the existing convention exactly: a data file (`experience.ts`) holding the typed
array, `constants.ts` for tunable look, and `helpers.ts` for pure formatting/lookup —
the same three-file split as `Education/` (`education.ts` / `constants.ts` /
`helpers.ts`) and `Projects/` (`projects.ts` / …). Keep all three React- and DOM-free.

---

### Where It Lives

- `src/components/Experience/experience.ts` — the `Role` type + the `ROLES` array
  (the data your future self edits to add a job).
- `src/components/Experience/helpers.ts` — pure helpers: `formatDateRange`,
  `getRoleBySlug`, etc.
- Company logos live under `public/assets/experience/` and are referenced by path from
  a role entry (don't inline them).

---

### The `Role` Shape

Model every field the reference and `goal.md` call for. Suggested shape (tune names, but
keep it flat and obvious to edit):

Field names follow the **fixed slot mapping** (see `00-overview.md`): each field lands in
a specific reference slot, so keep them named for the real thing, not the Persona label.

```ts
export type RoleLink = {
  label: string          // "GitHub", "Case study", "Demo", "Writeup"…
  href: string
  newTab?: boolean
}

export type Role = {
  // `slug` is the contract with selection + the deep link (`/experience/<slug>`).
  // URL-safe, stable, unique — changing it breaks any shared link to this role.
  slug: string
  company: string        // → the big "Magician"/arcana-name slot
  role: string           // job title → the "Classmate" relationship-label slot
  location: string       // → the "ARCANA" micro-label slot ("Toronto, ON" / "Remote")
  start: string          // ISO 'YYYY-MM'
  end?: string           // omitted ⇒ current → date range reads "… — Present" (fills the "RANK n" slot)
  logo?: string          // '/assets/experience/acme.svg' — drives the company tarot card; monogram fallback if absent
  companyBlurb?: string  // optional one-line company description → bottom-right name/bio slot
  journal: string        // THE journal paragraph (= the job description) — "I built X, which helped Y"
  links?: readonly RoleLink[]
}

// Order is intentional: MOST RECENT FIRST. The displayed roster order and the
// /01 /02 numbering derive from this array order, NOT a stored field.
export const ROLES: readonly Role[] = [ /* … */ ]
```

Key rules:

- **`slug` is the contract** with Task 03 — stable and unique; call this out in a
  comment (same discipline as `Project.slug` / `Term.slug`).
- **`end` is optional** so a current role renders a clean open range without a sentinel
  (the date range fills the reference's `RANK n` slot).
- **`journal` is the deliverable**, not a `summary`. It is the job description in prose:
  first person, past tense, outcome-oriented. Write a `**Voice:**` comment in the file so
  future edits keep the rule. Bad: "Responsible for the billing service." Good: "I
  rebuilt the billing service around idempotent webhooks, which cut failed renewals
  ~30%."
- **`logo` and `companyBlurb` are optional** — a role with neither must still render
  (monogram tarot card; no empty bio line). Never an empty frame.
- There is intentionally **no arcana / rank / employment-type field** — those reference
  slots are reused for company / dates / job title per the fixed mapping, so no invented
  flavour data exists to drift out of sync.

---

### Derived Helpers (pure, in `helpers.ts`)

Keep components logic-free by formatting here, matching `Education/helpers.ts`:

- `formatDateRange(start, end)` → `2025.05 — 2025.08`, or `2025.05 — Present` for a
  current role (this string fills the reference's `RANK n` slot).
- `getRoleBySlug(slug)` → used by the deep-link resolver in Task 03.

`constants.ts` holds: section chrome (`SOCIAL_LINK` band text, the
`Which bond do you want to view?` prompt), the selection accent (reuse the same
crimson/white as Education), the diagonal-stripe blue palette, the company-card frame
tunables (rotation, border, size), and the angular clip-paths — kept free of React/DOM.

---

### Seed Content

Populate `ROLES` with the visitor's **real** experience. If the list isn't known, **ask**
before inventing employers; otherwise seed 2–4 representative entries spanning at least
one current and one past role so Tasks 02–04 have realistic data to style against. Flag
any reconstructed content with a `⚠️ SEED — VERIFY THIS` comment, the way
`Education/education.ts` flags its term reconstruction. Each seeded `journal` must obey
the voice rule above, not be a placeholder bullet.

---

### What This Task Produces

- `src/components/Experience/experience.ts` exporting a typed `Role` model and a `ROLES`
  array seeded with real, journal-voiced entries, newest first.
- `helpers.ts` with `formatDateRange` and `getRoleBySlug` (pure).
- `constants.ts` with the tunable chrome, accent, stripe palette, company-card frame
  tunables, and clip-paths.
- A documented, stable `slug` field ready for deep linking.
- Adding a future role is a single, obvious append to `ROLES` — no UI touched. This is
  the success test for the task.
