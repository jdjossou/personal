## Task 04 — Deep Linking (Shareable Project URLs)

### Goal

Make individual projects directly addressable: per `goal.md`, "it should be
possible to send the link of the page that opens directly the project page."
Opening such a link lands on the projects page with that project already
selected and its detail showing, scrolled into view.

---

### URL Scheme

Pick one and document it (recommended: **path segment**, cleanest to share):

- **Path:** `/projects/<slug>` — a dynamic route alongside `/projects`.
  Bare `/projects` shows the list with the default selection (Task 03).
- *(Alternative)* **Query / hash:** `/projects?p=<slug>` or `/projects#<slug>`
  — simpler (no extra route) but less clean. Only use if the path route fights
  the current routing setup.

The `<slug>` is the stable `Project.slug` from Task 01. `getProjectBySlug`
resolves it.

> Read the relevant guide in `node_modules/next/dist/docs/` before adding the
> route — this Next.js has breaking changes vs. training data (see `AGENTS.md`).
> Confirm the current dynamic-route file convention and how `/projects` (list)
> and `/projects/<slug>` coexist rather than assuming the App Router layout from
> memory.

---

### Behaviour

**On load with a slug:**

- Resolve the slug → set it as the active project (drives the Task 03 selection
  state by `slug`).
- Ensure the detail panel shows that project and the row is scrolled into view /
  focused.
- **Unknown / removed slug:** fall back gracefully to the default list view
  (don't hard-404 a missing project out of a portfolio) — or a clear "not found"
  within the quest screen. Document the choice.

**On selecting a project (from Task 03):**

- Update the URL to match the active project so the address bar is always
  shareable, without a full navigation/remount that would re-trigger the entry
  transition. Use a shallow URL update (e.g. `history.replaceState` /
  `router.replace`) so selection feels in-page.
- Deselecting / returning to the neutral list state should return the URL to the
  bare `/projects`.

**Browser back / forward:**

- Should move between previously viewed projects (sync selection state ⇄ URL in
  both directions).

---

### Interaction With Transitions

- The first arrival at `/projects/<slug>` from the menu still plays the normal
  section entry reveal (see `ScreenReveal` / Task 05). In-page selection changes
  must **not** replay that transition — only the cross-page entry does.
- Sharing/opening the link cold (not from the menu) should still render the
  section correctly over the P3R background.

---

### What This Task Produces

- A shareable URL per project (`/projects/<slug>` or the documented scheme).
- Cold-loading such a URL opens the projects page with that project selected,
  detailed, and in view; unknown slugs degrade gracefully.
- Selecting projects in-page keeps the URL in sync (shallow, no transition
  replay); back/forward navigates between them.
- The `slug` contract from Task 01 is now the public, linkable surface.
