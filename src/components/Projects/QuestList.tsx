'use client'

// Quest list (Task 02 → Task 03) — the Projects "Quest Screen". Renders PROJECTS
// as a numbered Persona-style mission list over the shared P3R water background: a
// PROJECTS header with a "Sort by No." affordance, a vertical run of flat
// QuestRows separated by thin rules (never rounded cards), then the detail
// readout (QuestDetail) and the "which one?" hint. The ScreenReveal wrapper +
// "Back to menu" handoff mirror SectionPlaceholder so the menu → section → menu
// flow keeps working.
//
// Task 03 makes the list a master–detail control: exactly one project is active
// (tracked by `slug`, not index, so reordering PROJECTS never moves a link and
// Task 04 can drive selection from the URL). The rows form an ARIA listbox —
// click or arrow-key to select, selection follows focus, and the active row +
// QuestDetail update together. Default on load is the first row.
//
// Task 04 makes each project a shareable URL. The active slug is mirrored into
// the path (`/projects/<slug>`; the default/first project stays the bare
// `/projects`) via the native History API, which Next syncs into usePathname
// WITHOUT a navigation — so selection stays in-page (no remount, no replayed
// ScreenReveal). Cold-loading `/projects/<slug>` selects + scrolls that project
// in; an unknown slug falls back to the default and cleans up the URL.

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { QuestRow, ROW_GRID } from './QuestRow'
import { QuestDetail } from './QuestDetail'
import { SECTION_TITLE, SORT_HINT, VIEW_HINT } from './constants'
import { PROJECTS } from './projects'
import { getProjectBySlug } from './helpers'

// --- Deep-link URL helpers (Task 04) ---
// The projects screen lives under this base path; the default/first project maps
// to the bare base, every other project to `${BASE}/<slug>`.
const BASE = '/projects'

// The slug encoded in a path, or null for the bare list (default selection).
function slugFromPath(pathname: string): string | null {
  if (!pathname.startsWith(`${BASE}/`)) return null
  const rest = pathname.slice(BASE.length + 1)
  return rest ? decodeURIComponent(rest) : null
}

// Canonical path for an active slug — the default/first project is the bare base
// so there's exactly one URL per state and `/projects` always shows the default.
function pathForSlug(slug: string): string {
  return slug === PROJECTS[0].slug ? BASE : `${BASE}/${encodeURIComponent(slug)}`
}

// Resolve a path to a valid active slug. `explicit` = a real project slug was in
// the URL (cold deep link / back-forward → scroll it into view); `unknown` = a
// slug was present but matched nothing (degrade to default + clean the URL).
function resolveActive(pathname: string): {
  slug: string
  explicit: boolean
  unknown: boolean
} {
  const raw = slugFromPath(pathname)
  if (!raw) return { slug: PROJECTS[0].slug, explicit: false, unknown: false }
  if (getProjectBySlug(raw)) return { slug: raw, explicit: true, unknown: false }
  return { slug: PROJECTS[0].slug, explicit: false, unknown: true }
}

const indexOfSlug = (slug: string): number =>
  PROJECTS.findIndex((p) => p.slug === slug)

export function QuestList() {
  const router = useRouter()
  const pathname = usePathname()

  // The single active project, keyed by slug. Seeded from the URL so a cold
  // `/projects/<slug>` load opens that project (and bare `/projects` opens the
  // default first row, keeping the detail panel populated). usePathname returns
  // the real path during SSR, so the right project renders on the first paint —
  // no flash of the default before a client correction.
  const [activeSlug, setActiveSlug] = useState<string>(
    () => resolveActive(pathname).slug,
  )
  const activeProject = getProjectBySlug(activeSlug)

  // Mirror of activeSlug for the keydown handler, so the listener reads the live
  // selection without re-subscribing (same pattern as MainMenu's selectedRef).
  const selectedRef = useRef(activeSlug)
  useEffect(() => {
    selectedRef.current = activeSlug
  }, [activeSlug])

  // Refs to each row so keyboard nav can move DOM focus to the newly active row.
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  // The one place selection happens (Task 04). Updates state immediately (so the
  // detail panel swaps this tick — snappy) and mirrors the slug into the URL with
  // the native History API: pushState keeps it shallow (no Next navigation, so no
  // remount and no replayed ScreenReveal) while still adding a history entry so
  // browser back/forward walk between viewed projects. Rows are `outline-none`,
  // so the optional keyboard focus shows no ring.
  function selectSlug(slug: string, focus: boolean) {
    setActiveSlug(slug)
    const next = pathForSlug(slug)
    if (next !== window.location.pathname) {
      window.history.pushState(null, '', next)
    }
    if (focus) rowRefs.current[indexOfSlug(slug)]?.focus()
  }

  // Select by position and (for keyboard nav) move focus there too. Selection
  // follows focus, so QuestDetail re-renders in the same tick — snappy.
  function selectByIndex(idx: number, focus: boolean) {
    selectSlug(PROJECTS[idx].slug, focus)
  }

  // Cold deep link (mount): the slug is already seeded from the URL above, so here
  // we only run the side effects once — bring the targeted row into view and focus
  // it (a11y: keyboard/SR users land on the project, not the top of the list), and
  // normalize a removed/unknown slug back to the bare base. `nearest` is a no-op
  // when the row is already visible.
  useEffect(() => {
    const { slug, explicit, unknown } = resolveActive(window.location.pathname)
    if (unknown) window.history.replaceState(null, '', BASE)
    if (explicit) {
      const el = rowRefs.current[indexOfSlug(slug)]
      el?.scrollIntoView({ block: 'nearest' })
      el?.focus()
    }
  }, [])

  // Sync selection from the URL on browser back/forward — the one URL change we
  // don't originate (our own selections go through selectSlug). popstate fires
  // only on history traversal, never on our own pushState, so there's no echo;
  // the page stays mounted (the path was set via the History API), so this just
  // re-points the selection and scrolls the row in.
  useEffect(() => {
    function onPopState() {
      const { slug, explicit, unknown } = resolveActive(window.location.pathname)
      setActiveSlug(slug)
      if (unknown) window.history.replaceState(null, '', BASE)
      if (explicit) {
        rowRefs.current[indexOfSlug(slug)]?.scrollIntoView({ block: 'nearest' })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Listbox keyboard model — scoped to the list (not window) so it never hijacks
  // arrows when the Back button or a future control is focused. Arrows wrap like
  // MainMenu; Enter/Space are intentional no-ops (the detail already follows
  // selection) kept for game-feel and as the Task 05 confirm-sound hook.
  function onListKeyDown(e: React.KeyboardEvent) {
    const len = PROJECTS.length
    const i = PROJECTS.findIndex((p) => p.slug === selectedRef.current)
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        selectByIndex((i + 1) % len, true)
        break
      case 'ArrowUp':
        e.preventDefault()
        selectByIndex((i - 1 + len) % len, true)
        break
      case 'Home':
        e.preventDefault()
        selectByIndex(0, true)
        break
      case 'End':
        e.preventDefault()
        selectByIndex(len - 1, true)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        break
    }
  }

  // Back to the MAIN MENU (not the landing screen): arm the double-circle reveal
  // the menu will play, flag page.tsx to open on the menu, then navigate to '/'.
  // Copied from SectionPlaceholder so the handoff stays identical.
  function back(origin: Origin) {
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 overflow-y-auto bg-transparent select-none">
        {/* Legibility scrim — a left-anchored dark gradient over the water so the
            list text stays readable where the water runs bright (atmospheric,
            full-bleed, NOT a card). Sits above the global water, below content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20"
        />

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col px-[6vw] py-[6vh] md:px-12">
          {/* Header — QUEST → PROJECTS, with the "Sort by No." affordance right. */}
          <header className="flex items-end justify-between border-b-2 border-white/40 pb-2">
            <h1 className="font-display text-5xl leading-none tracking-wide text-white uppercase md:text-6xl">
              {SECTION_TITLE}
            </h1>
            <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/70 uppercase">
              {SORT_HINT}
            </span>
          </header>

          {/* Column labels — thin guide row aligned to the list grid (desktop).
              Matches the rows' left border + padding so the columns line up. */}
          <div
            className={`${ROW_GRID} hidden border-l-4 border-transparent px-3 pt-3 pb-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/50 uppercase md:grid`}
          >
            <span>No.</span>
            <span>Project</span>
            <span>Date</span>
            <span>Stack</span>
            <span className="justify-self-end">Status</span>
          </div>

          {/* The mission list — a single-select listbox of rounded row chips. */}
          <div
            role="listbox"
            aria-label={SECTION_TITLE}
            onKeyDown={onListKeyDown}
            className="flex flex-col gap-1"
          >
            {PROJECTS.map((project, i) => (
              <QuestRow
                key={project.slug}
                project={project}
                index={i}
                selected={project.slug === activeSlug}
                onSelect={(slug) => selectSlug(slug, false)}
                rowRef={(el) => {
                  rowRefs.current[i] = el
                }}
              />
            ))}
          </div>

          {/* Detail readout (Task 03) — swaps with the active selection and fills
              the lower area, pushing the footer down. */}
          <div className="min-h-0 flex-1 pt-8">
            <QuestDetail project={activeProject} />
          </div>

          {/* Bottom hint + back control. */}
          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-3">
            <p className="font-mono text-sm text-white/75">{VIEW_HINT}</p>
            <button
              type="button"
              onClick={() => back(centerOrigin())}
              className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase hover:text-white"
            >
              ← Back to menu
            </button>
          </div>
        </div>
      </main>
    </ScreenReveal>
  )
}
