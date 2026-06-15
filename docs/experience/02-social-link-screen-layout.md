## Task 02 — Social Link Screen Layout (static)

> ✅ **DONE — but built to [`redesign.md`](redesign.md), not this doc.** The static layout
> shipped as a single-role **collage**, not the tarot/roster split described below. Actual
> components: `SocialLinkScreen` (desktop scale-to-fit stage + `matchMedia` gate + mobile
> flow), `ExperienceCard` (angled B/W card), `SocialLinkBar` (`NavButton` Prev/Next),
> `BondPager`, `JobPanels` (★ bullets collage), `TechStack` (draggable tokens). There is
> **no** `CompanyCard` / tarot card, `BondRoster`/`BondRow`, `StripeField`, or
> `BackdropShapes` — those were dropped in the redesign. Read this doc for intent only;
> the code + `redesign.md` are the truth.

### Goal

Build the static, data-driven Social Link composition: render `ROLES` (Task 01) as the
screen from `experience_reference.png` — a top `SOCIAL LINK` bumper band, a selectable
**bond roster**, and a **journal / detail panel** carrying the role's arcana, rank, role
title, dates, journal paragraph, the **company tarot card**, and the company name + bio.
No selection logic, no deep links, no transitions yet (Tasks 03–04). Just the correct
visual structure and typography. **This is the heaviest task** — the reference is rich
and Experience must not look like a recolour of the Projects/Education screens.

**The important rule from `goal.md`: a unique, company/system-like visual treatment.**
This is the screen that has to *feel* like a Social Link, with its tarot card and blue
stripe field — see `00-overview.md` for the full mapping.

---

### Reference

See `experience_reference.png` (P3R's Social Link screen). Reproduce, do not approximate
(the project's standing rule for P3R work). Decode the composition:

- **Top band:** `SOCIAL LINK` header at the left, `LB` / `RB` bumper chips at the top
  corners. → the section bumper (analog of `Education/CheckStationBar`).
- **Upper-left stack:** a small relationship label (`Classmate`), then the Arcana name
  (`Magician`) under an `ARCANA` micro-label, then `RANK 1`. → **job title** (`Classmate`)
  · **location** (`ARCANA` micro-label) · **COMPANY** (`Magician`, big) · **date range**
  (`RANK n`).
- **Tilted tarot card** floating mid-left. → the **company card** (`CompanyCard`, Task
  02's signature object): the company `logo` on a sharp, slightly-rotated tarot/system
  frame, with a monogram fallback when `logo` is absent.
- **Journal paragraph** lower-left, the dominant body text. → the role's `journal` (the
  job description in journal voice).
- **Focal portrait** filling the right. → in our build the company card *is* the focal
  art (no person illustration — see overview). Enlarge the `CompanyCard` to carry the
  reference's right-side mass.
- **Name + bio** bottom-right (`Kenji Tomochika` + one-line description). → an optional
  one-line `companyBlurb` ("what this place is"); omit cleanly when absent.
- **`Back`** control bottom-right.
- **Blue diagonal stripe field** behind everything.

---

### Composition

A single-screen, two-region layout over the shared P3R water (do **not** re-mount the
water). Top → bottom:

1. **`SocialLinkBar`** — the bumper band: `SOCIAL LINK` title + ← / → bumper affordances
   (wired to selection in Task 03; inert here). Model it on `CheckStationBar`.
2. **Body** — a roster + detail split (master–detail, like `StatScreen`'s grid):
   - **`BondRoster`** (left column): the list of `ROLES`, newest first. Each `BondRow`
     shows `company` (dominant), `role` (job title), and the date range; location is
     optional in the row. Flat, edge-to-edge, thin rules — **not** boxed cards. The
     active row carries the crimson/white selection band (reuse `SELECT_BAND_FILL` /
     `BAND_CLIP` language from `Education/constants.ts`). Static here: preselect the first
     (most-recent) row so the detail has content.
   - **`BondDetail`** (right region): the Social Link readout for the active role — the
     header stack (job title · location · **COMPANY** · `formatDateRange`), the
     `CompanyCard` (company tarot card) as focal art, the `journal` paragraph as the hero
     text, and the optional `companyBlurb` in the bottom-right bio slot.
3. **Bottom strip** — the `Which bond do you want to view?` prompt + a `← Back to menu`
   control (inert here; wired in Task 04). Mirror `StatScreen`'s footer row.

Behind the content, layer (above the water, below content): a legibility scrim, the
soft angular `BackdropShapes`, and the **`StripeField`** — the reference's diagonal blue
stripes, this section's signature texture (the analog of `Education/SlashField`, tuned to
parallel stripes rather than brush-slashes).

---

### The Company Tarot Card (`CompanyCard`)

This is the deliverable that makes the page a *Social Link* and satisfies the
"company/system-like visual treatment" requirement, and it is the focal art on the right:

- A sharp, slightly-rotated card frame (tarot proportions, ~`2:3`), angular not rounded,
  with a thin Persona border and a faint inner system-grid/scanline texture so it reads
  as a *system* card.
- The company `logo` centred inside; when absent, render a **monogram** (company
  initials in `font-display`) on the same frame so the slot is never empty.
- Optionally stamp the company name along the card edge (like a tarot title) — flavour.
- Keep it tunable from `constants.ts` (rotation, border colour, frame size).

---

### Typography & Composition Rules

- `font-display` for company / role / section headers; `font-mono` for location, dates,
  controls; white over the dark water. Asymmetric, left-aligned, never reads as a light
  background.
- Sharp edges, thin rules, tight vertical guides down the roster — angular Persona UI,
  **no `rounded-*`, no drop-shadow card chrome** (the tarot card is the one framed object
  and it is sharp + tilted).
- The journal paragraph gets generous measure (`max-w-*`) and relaxed leading — it is the
  thing visitors actually read.

---

### Responsive Notes

- Desktop: roster left column, detail right (the reference's left-stack / right-mass).
- Mobile: stack roster → detail; the tarot card scales down but stays present; rows stay
  rows (collapse the least-important column — drop location/date before company/role).
  Never collapses into cards.

---

### What This Task Produces

- `src/components/Experience/` components rendering `ROLES` as the Social Link screen:
  `SocialLinkBar`, `BondRoster` + `BondRow`, `BondDetail`, `CompanyCard`,
  `BackdropShapes`, `StripeField`, assembled in `SocialLinkScreen.tsx`.
- A faithful reproduction of `experience_reference.png`: bumper band, bond roster with
  rank, journal-led detail, the tilted company tarot card, company name + bio, stripe
  field — verified via headless screenshots against the reference.
- `src/app/experience/page.tsx` renders `<SocialLinkScreen />` instead of
  `SectionPlaceholder` (first row preselected).
- Static only: no selection behaviour, deep links, or transitions yet (Tasks 03–04).
