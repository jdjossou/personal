# Task 01 — Data Model & Content

Build the data layer for the Stack section: the `Category` + technology types, the
per-category icon mapping, helpers, and the real content from [`goal.md`](goal.md). No UI
yet — this task is the single source of truth every later task renders.

See [`00-overview.md`](00-overview.md) for the reference mapping.

---

### Data Model

In `src/components/Stack/stack.ts`:

```ts
export interface TechLink {
  label: string         // "Befriend", "WatPlan repo", "Cineplex internship"
  url: string           // /experience/<slug>, /projects/<slug>, or external URL
}

export interface Technology {
  name: string          // "Spring Boot", "Microsoft Azure AZ-900"
  note?: string         // optional one-line detail (e.g. cert issuer / context)
  links?: TechLink[]    // where it was used; 0 / 1 / many (see Task 03 dialog)
}

export interface Category {
  id: string            // slug, e.g. "languages", "frameworks", "spoken-languages"
  label: string         // display name, e.g. "Frameworks & Libraries"
  icon: CategoryIconId  // which leading glyph (see Task 02 CategoryIcon)
  items: Technology[]
}
```

- Order of the array = display order in the roster.
- `id` is the deep-link slug (Task 03). Stable, kebab-case.
- `note` is optional and **name-only by default** — the right list is not a stats table.
- `links` is optional and variable in length. A tech with no links omits the field; the
  reference dialog (Task 03) handles the empty case gracefully. Prefer internal links
  (`/experience/<slug>`, `/projects/<slug>`) where the tech maps to existing site content.

**Categories are author-discretion.** The `goal.md` grouping below is a starting example —
re-group, rename, or move an item if a cleaner classification exists. Two judgment calls to
make explicitly: whether **HTML/CSS** belongs under Languages or its own "Markup & Styling"
slot, and whether **Spoken languages** reads better as its own category or folded into a
broader one. Pick what classifies best; keep the set small enough for the left roster.

### Content (from `goal.md`, verbatim)

- **languages** — Java, Python, C++, TypeScript, JavaScript, Swift, HTML/CSS, Dart
- **frameworks** — "Frameworks & Libraries": Spring Boot, React, Next.js, Angular,
  PyTorch, NumPy, FastAPI, Flutter
- **tools** — "Tools & Platforms": Git, Kubernetes, Kafka, Jenkins, Dynatrace, Postman, Jira
- **certifications** — Microsoft Azure AZ-900, Microsoft Azure AI-900
- **databases** — PostgreSQL, Oracle SQL, MongoDB, Firebase Firestore
- **spoken-languages** — "Spoken languages": English, French

Do not invent extra technologies. The set above is the launch content.

### Helpers

In `src/components/Stack/helpers.ts`:

- `getCategoryBySlug(slug): Category | undefined`
- `getDefaultCategory(): Category` (first in the array — the initial selection)
- `categorySlugs(): string[]` (for `generateStaticParams` in Task 03)

### Done When

- `stack.ts` exports the categories with every `goal.md` item (re-grouped if a cleaner
  classification was chosen), in display order.
- Each category has a stable `id` slug + an `icon` id; each technology may carry optional
  `note` + `links`.
- Helpers resolve a slug to a category and expose the default + all slugs.
- Adding a technology (with or without links) is a one-line edit to an `items` array.
