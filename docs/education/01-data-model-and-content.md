## Task 01 — Data Model & Content Source

### Goal

Define the single source of truth for the Education page so the rest of the section is purely
a renderer over it. There are two pieces of data: the **profile** (the "character" — your
university, degree, expected graduation) and the **courses** (the selectable ability rows). As
with Projects, the headline requirement is that **adding a future course must be a single,
obvious append** to an array — that lives or dies on this task. No UI here.

Follow the existing convention (see `Projects/projects.ts`, `Projects/constants.ts`,
`Projects/helpers.ts`): plain data / `as const` kept free of React + DOM, UI tuning in
`constants.ts`, pure formatters in `helpers.ts`.

---

### Where It Lives

- `src/components/Education/education.ts` — the `EducationProfile` type + the single `PROFILE`
  value, and the `Course` type + the `COURSES` array (the data your future self edits).
- `src/components/Education/constants.ts` — UI tuning only: section title, the bottom view
  hint, category labels/colours, sort labels. No course data here.
- `src/components/Education/helpers.ts` — pure lookup/format helpers (below).

Keep any long-form course detail copy inline in the entry; there are no heavy assets here
(no screenshots, no illustration — see `goal.md`).

---

### The `EducationProfile` Shape

The fixed header data — the "character" whose abilities the courses are. Exactly one value.

```ts
export type EducationProfile = {
  university: string          // "University of Waterloo"
  degree: string              // "BCS, Computer Science" (degree / program)
  expectedGraduation: string  // ISO 'YYYY-MM' — formatted for display by a helper
  location?: string           // "Waterloo, ON" (optional)
  tagline?: string            // short factual line, optional (e.g. specialization)
}

export const PROFILE: EducationProfile = { /* … */ }
```

---

### The `Course` Shape

Model every field the stats rows (Task 02) and detail panel (Task 03) need. Keep it flat and
obvious to edit:

```ts
export type CourseCategory = 'CORE' | 'ELECTIVE' | 'SEMINAR'

export type CourseLink = {
  label: string        // "Syllabus", "Project", "Notes"…
  href: string
  newTab?: boolean
}

export type Course = {
  slug: string         // URL-safe, stable — keys selection (Task 03) + optional deep link (Task 04)
  code: string         // "CS246"
  name: string         // "Object-Oriented Software Development"
  category: CourseCategory   // → the LEADER/PARTY badge slot
  term?: string        // ISO 'YYYY-MM' when taken — formatted by formatTerm()
  units?: number       // course weight/credits (factual figure; default 0.5 at Waterloo)
  level?: number        // optional explicit override; otherwise derived from `code` (see helpers)
  summary: string      // one-liner shown in / near the row and as the detail lead
  details?: string     // longer "what it taught" body for the detail panel (optional)
  links?: readonly CourseLink[]   // optional
}

export const COURSES: readonly Course[] = [ /* … */ ]
```

Key rules:

- **`slug` is the contract** with Task 03 (selection) and Task 04 (optional deep link) — it
  must be stable and unique; changing it breaks any shared link. Note this in a comment.
- **No grade / GPA field anywhere** — `education.md` excludes it. The figures are factual
  only (term, units, level).
- `details`, `links`, `term`, `units` are all **optional** — a course with only `code` /
  `name` / `category` / `summary` must still render cleanly (Task 02/03 render "only when
  present").
- Array order is the authored default order — the displayed `/01 /02` numbering (Task 02)
  derives from order, not a stored field.

---

### Seed Content

Populate `PROFILE` with the real University of Waterloo BCS data, and `COURSES` with a
representative set of **relevant** courses spanning all three categories so later tasks have
realistic data to style against. Suggested seed (edit freely — these are examples):

- **CORE** — CS136 (functional/imperative), CS245 (logic & computation), CS246
  (object-oriented dev), CS240 (data structures & types), CS341 (algorithms), CS350
  (operating systems).
- **ELECTIVE** — e.g. CS370 (numerical computation), a systems/AI/security elective.
- **SEMINAR** — PD (professional development / co-op) or a communications course (COMMST/ENGL).

Pick courses worth surfacing to a portfolio visitor; this is "relevant courses", not a full
transcript. Order intentionally (most signal first).

---

### Derived Helpers (pure, in `helpers.ts`)

Keep the components logic-free. Mirror `Projects/helpers.ts`:

- `getCourseBySlug(slug)` → used by selection (Task 03) and the optional deep link (Task 04).
- `orderCourses(mode)` → returns a display-ordered copy for the optional sort (Task 04);
  `'index'` is the authored order. Never mutate `COURSES`.
- `levelFromCode(code)` → derive `Lv.N` from the course number (e.g. `CS246` → 2, `CS341` → 3:
  first digit of the numeric part). Respect an explicit `course.level` override when present.
- `formatTerm(term)` → `2025.01` style (reuse the `YYYY.MM` formatting idiom from
  `Projects/helpers.ts` `formatDateRange`).
- `formatUnits(units)` / `formatGraduation(profile.expectedGraduation)` → display strings
  ("0.50 units", "Expected 2027").

All free of React/DOM, matching the existing file split.

---

### What This Task Produces

- `src/components/Education/education.ts` exporting a typed `EducationProfile` (`PROFILE`) and
  `Course` model (`COURSES`) seeded with real Waterloo content across CORE/ELECTIVE/SEMINAR.
- A documented, stable `slug` field; **no GPA/grade field anywhere**.
- Pure lookup/format helpers in `helpers.ts` and UI labels in `constants.ts`.
- Adding a future course is a single append to `COURSES` — the success test for this task.
- No UI yet (Task 02), no selection (Task 03), no transitions (Task 04).
