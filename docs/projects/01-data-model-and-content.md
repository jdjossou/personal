## Task 01 — Data Model & Content Source

### Goal

Define the single source of truth for project data so the rest of the page is
purely a renderer over it. The headline requirement from `goal.md` is that it
must be **easy to add a new project in the future** — that lives or dies on this
task. No UI here; this is the data layer the list (Task 02), the detail panel
(Task 03) and the deep links (Task 04) all read from.

Follow the existing convention: a `constants.ts` that holds plain values /
`as const` data kept free of React + DOM (same split as
`MainMenu/constants.ts`, `Landing/constants.ts`, `P3RBackground/constants.ts`).

---

### Where It Lives

- `src/components/Projects/constants.ts` — the `Project` type + the `PROJECTS`
  array (the data the visitor's future self edits).
- Heavy / long-form detail copy and screenshots should be referenceable from a
  project entry without bloating the array — keep image assets under
  `public/assets/projects/` and reference them by path.

---

### The `Project` Shape

Model every field the reference quest log and `goal.md` call for. Suggested
shape (tune names as needed, but keep it flat and obvious to edit):

```ts
export type ProjectStatus = 'SHIPPED' | 'IN_PROGRESS' | 'ARCHIVED'

export type ProjectLink = {
  label: string          // "GitHub", "Demo", "Devpost", "Writeup"…
  href: string
  newTab?: boolean
}

export type Project = {
  slug: string           // URL-safe, stable — drives the deep link (Task 04)
  name: string
  start: string          // ISO 'YYYY-MM' (or 'YYYY-MM-DD')
  end?: string           // omitted ⇒ ongoing / "—" in the row
  status: ProjectStatus
  tags: readonly string[]
  summary: string        // one-liner shown in the row / collapsed state
  details?: string       // longer body for the expanded detail panel
  links?: readonly ProjectLink[]
  screenshots?: readonly { src: string; alt: string }[] // optional, "only when useful"
}

export const PROJECTS: readonly Project[] = [ /* … */ ]
```

Key rules:

- **`slug` is the contract** with Task 04 — it must be stable and unique;
  changing it breaks any shared link. Call this out in a comment.
- **`end` is optional** so IN PROGRESS projects render a clean date range
  (e.g. `2025.03 — `) without sentinel values.
- `status` is a closed enum of exactly the three states from `goal.md`:
  `SHIPPED`, `IN PROGRESS`, `ARCHIVED`.
- `screenshots` and `details` are optional — the reference says screenshots
  **only when useful**, so a project with neither must still render fine.

---

### Seed Content

Populate `PROJECTS` with the visitor's real projects (ask if the list isn't
known; otherwise seed 3–5 representative entries spanning all three statuses so
later tasks have realistic data to style against). Order should be intentional
(newest / most important first) — the displayed `/01 /02 /03` numbering in
Task 02 derives from array order, not a stored field.

---

### Derived Helpers (optional, kept here)

Small pure helpers that format the data can live alongside the constants so the
components stay logic-free, e.g.:

- `formatDateRange(start, end)` → `2025.03 — 2025.06` / `2025.03 — ` for ongoing.
- `getProjectBySlug(slug)` → used by the deep-link logic in Task 04.

Keep these free of React/DOM, matching the existing file split (see how
`Landing/promptSweep.ts` is separated from `Landing/constants.ts`).

---

### What This Task Produces

- A `src/components/Projects/constants.ts` exporting a typed `Project` model and
  a `PROJECTS` data array seeded with real entries.
- A documented, stable `slug` field ready for deep linking.
- Optional pure formatting / lookup helpers.
- Adding a future project is a single, obvious append to the array — no UI code
  touched. This is the success test for the task.
