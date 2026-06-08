# Experience — Social Link Screen (Design Overview)

This is the north-star doc for the Experience section. It fixes the design and the
P3R mapping; the four numbered task docs (`01`–`04`) build toward it. The raw brief
lives in [`goal.md`](goal.md); the visual standard is `experience_reference.png`.

---

### What This Section Is

The Experience page presents work history **like a Persona Social Link screen** — each
role is a *bond* you select and read as a journal entry, not a résumé bullet. It is
*not* a list of "responsible for X" lines and *not* a card grid.

From `goal.md`, every role must surface:

- Company name
- Role title
- Date range
- A short **journal-style paragraph** about what you *built* or contributed
- Most recent role first
- A **company / system-like visual treatment**

The defining rule: it reads as **"I built X, which helped Y"**, never "responsible
for X." The journal voice is the content's whole point — see Task 01.

---

### The Reference → Experience Mapping

`experience_reference.png` is P3R's **Social Link** screen: a top `SOCIAL LINK` band
with LB/RB bumpers, a relationship label (`Classmate`), an Arcana name (`Magician`) under
an `ARCANA` micro-label, a `RANK n`, the tilted **tarot card**, a left-hand **journal
paragraph**, a focal character portrait on the right, a `Back` control, all over a blue
diagonal-striped field. The reference's slots map **directly** onto a role's fields (this
mapping is fixed — no invented arcana/rank flavour):

- **Each role = one Social Link / bond.** A role is the unit you select and inspect.
- **Arcana name slot (`Magician`) → company name** — the dominant label of the detail.
- **Relationship label (`Classmate`) → job title** (the role).
- **`ARCANA` micro-label → job location** (e.g. `Toronto, ON` / `Remote`).
- **`RANK n` slot → the date range** (`2025.05 — 2025.08`, or `— Present` while current).
- **Tilted tarot card → the company / system-like visual** the brief asks for: the
  company logo on a tarot-style "system card." A logo-less company falls back to a
  monogram system card so the slot never renders empty.
- **Journal paragraph → the role's journal entry = the job description** in journal voice
  ("I built X, which helped Y"). The dominant text; the heart of the screen.
- **Bottom-right name/bio slot → an optional one-line company blurb** ("what this place
  is"). Optional — omitted cleanly when absent.
- **Bottom prompt** → "Which bond do you want to view?" with a Back control.

So the detail's header stack reads: job title (`Classmate` slot) · location (`ARCANA`
micro-label) · **COMPANY** (`Magician` slot, big) · dates (`RANK` slot).

**One deliberate departure from the reference, already decided:** there is no person
illustration. The right-hand focal art is the **company card** (logo on a tarot/system
frame), because `goal.md` explicitly wants a company/system-like visual — this is where
Experience *keeps* focal art that Education deliberately dropped.

**One deliberate addition, for site consistency:** the reference shows a single bond in
isolation, but the rest of the site (Projects quest log, Education stats) is
**master–detail**. Experience follows suit: a selectable **roster of bonds** (roles,
newest first) drives a detail panel rendered in the Social Link composition above. Same
interaction grammar, same deep-link contract, same back-to-menu — so it feels like one
menu system, not a one-off page.

---

### Visual Rules (P3R house style)

Match the rest of the site (see `MainMenu/`, `Projects/`, `Education/`):

- `font-display` (Bebas Neue) for the company / role / section headers; `font-mono` for
  the location, dates, and labels; white over the dark water.
- Angular Persona UI: sharp edges, thin rules, tight grid alignment, asymmetric and
  left-aligned. **No `rounded-*` card chrome, no drop-shadow boxes** — the same
  "no generic rounded cards" rule Projects and Education obey. (The tarot card is the
  one intentional framed object, and it is *sharp/tilted*, not a soft rounded card.)
- The page sits over the **shared global P3R water background** — do not re-mount it.
  Add a legibility scrim plus the reference's **diagonal blue stripe field** as the
  section's signature texture (the analog of Education's `SlashField`).
- Selection uses the site's red/white Persona accent (as in `MainMenu` / `Projects` /
  `Education`), never a generic hover box.

---

### How the Work Is Split

| Task | File | What it adds |
|------|------|--------------|
| 01 | [`01-data-model-and-content.md`](01-data-model-and-content.md) | `Role` data model + helpers + real, journal-voiced content. |
| 02 | [`02-social-link-screen-layout.md`](02-social-link-screen-layout.md) | The static Social Link composition: bumper band, bond roster, journal/detail panel, tarot company card, stripe field. |
| 03 | [`03-selection-detail-and-deep-linking.md`](03-selection-detail-and-deep-linking.md) | Selectable rows + swapping detail (master–detail) + shareable `/experience/<slug>` deep links. |
| 04 | [`04-transitions-and-polish.md`](04-transitions-and-polish.md) | Entry/exit reveal, back-to-menu, sound, reduced-motion, final fidelity pass. |

Eventual code shape (prescribed across the tasks, mirroring `Education/`):
`src/components/Experience/` → `SocialLinkScreen.tsx`, `SocialLinkBar.tsx`,
`BondRoster.tsx`, `BondRow.tsx`, `BondDetail.tsx`, `CompanyCard.tsx`,
`BackdropShapes.tsx`, `StripeField.tsx`, `experience.ts`, `constants.ts`, `helpers.ts`.
The route [`src/app/experience/page.tsx`](../../src/app/experience/page.tsx) renders
`<SocialLinkScreen />` (replacing the current `SectionPlaceholder`), with a deep-link
route at `src/app/experience/[slug]/page.tsx`.

---

### Done When

- The page reads as a Persona Social Link screen: a roster of roles as selectable bonds,
  each opening a journal entry with the job title · location · company · dates header, a
  company tarot card, and an optional one-line company blurb.
- Every entry reads "I built X, which helped Y," newest role first — verified against the
  voice rule in Task 01.
- It matches `experience_reference.png` in layout language and palette (verified via the
  established headless-screenshot iteration workflow).
- Adding a future role is a one-line append to the data array — no UI code touched.
