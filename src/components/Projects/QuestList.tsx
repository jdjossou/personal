'use client'

// Quest list (Task 02 → Task 05) — the Projects "Quest Screen". Renders PROJECTS
// as a numbered Persona-style mission list over the shared P3R water background: a
// PROJECTS header with a live "Sort by …" control, a vertical run of flat
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
//
// Task 05 wires the page into the site's game feel: Escape returns to the main
// menu (alongside the Back button), the menu's UI sounds fire on move/confirm/
// cancel, a lower-left SoundToggle mutes them all, and the "Sort by No." label
// becomes a real control cycling No. → Date → Status. Sorting only re-orders the
// displayed rows + their /01 /02 numbers — every project keeps its slug, so the
// deep-link contract is untouched (refs are slug-keyed, not index-keyed).

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { SoundToggle } from '@/components/MainMenu/SoundToggle'
import { initAudioOnGesture, playSound } from '@/components/MainMenu/audio'
import { QuestRow, ROW_GRID } from './QuestRow'
import { QuestDetail } from './QuestDetail'
import {
  SECTION_TITLE,
  SORT_CYCLE,
  SORT_LABELS,
  VIEW_HINT,
  type SortMode,
} from './constants'
import { PROJECTS } from './projects'
import { getProjectBySlug, orderProjects } from './helpers'

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
// Note: "first project" is always PROJECTS[0] (the authored default), never the
// first row after a sort — so the bare-base URL is sort-independent.
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

  // Sort mode (Task 05). 'index' is the authored order, so the page reads
  // "Sort by No." at rest. orderedProjects is the live display sequence; render,
  // keyboard nav, and the /01 /02 numbers all key off it. Slugs are unaffected.
  const [sortMode, setSortMode] = useState<SortMode>('index')
  const orderedProjects = useMemo(() => orderProjects(sortMode), [sortMode])

  // Refs to each row, keyed by slug (NOT position) so focus/scroll lookups stay
  // correct after a sort re-orders the rows.
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // The one place selection happens (Task 04). Updates state immediately (so the
  // detail panel swaps this tick — snappy) and mirrors the slug into the URL with
  // the native History API: pushState keeps it shallow (no Next navigation, so no
  // remount and no replayed ScreenReveal) while still adding a history entry so
  // browser back/forward walk between viewed projects. Kept sound-free — the
  // single pure URL/selection writer — so callers (popstate, deep link) drive it
  // without firing SFX; the SFX live at the user-input sites below.
  function selectSlug(slug: string, focus: boolean) {
    setActiveSlug(slug)
    const next = pathForSlug(slug)
    if (next !== window.location.pathname) {
      window.history.pushState(null, '', next)
    }
    if (focus) rowRefs.current[slug]?.focus()
  }

  // Cold deep link (mount): the slug is already seeded from the URL above, so here
  // we only run the side effects once — bring the targeted row into view and focus
  // it (a11y: keyboard/SR users land on the project, not the top of the list), and
  // normalize a removed/unknown slug back to the bare base. `nearest` is a no-op
  // when the row is already visible. Also arms the audio context for the
  // SoundToggle + key/pointer SFX (matches MainMenu's first-gesture init).
  useEffect(() => {
    initAudioOnGesture()
    const { slug, explicit, unknown } = resolveActive(window.location.pathname)
    if (unknown) window.history.replaceState(null, '', BASE)
    if (explicit) {
      const el = rowRefs.current[slug]
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
      if (explicit) rowRefs.current[slug]?.scrollIntoView({ block: 'nearest' })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Select the project at a display position (within the current sort order) and,
  // for keyboard nav, move focus there too. Plays the move blip — only called
  // from explicit user navigation, so it never fires on programmatic selection.
  function moveTo(displayIndex: number) {
    playSound('move')
    selectSlug(orderedProjects[displayIndex].slug, true)
  }

  // Listbox keyboard model — scoped to the list (not window) so it never hijacks
  // arrows when the Back/Sort button or another control is focused. Arrows wrap
  // like MainMenu and walk the CURRENT sort order. Enter/Space confirm the active
  // project (the detail already follows selection; the confirm sound gives the
  // game-feel beat). This handler re-binds every render, so orderedProjects /
  // activeSlug are always current.
  function onListKeyDown(e: React.KeyboardEvent) {
    const len = orderedProjects.length
    const i = orderedProjects.findIndex((p) => p.slug === activeSlug)
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        moveTo((i + 1) % len)
        break
      case 'ArrowUp':
        e.preventDefault()
        moveTo((i - 1 + len) % len)
        break
      case 'Home':
        e.preventDefault()
        moveTo(0)
        break
      case 'End':
        e.preventDefault()
        moveTo(len - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        playSound('confirm')
        break
    }
  }

  // Pointer selection from a row. Plays the move blip only on a real change (never
  // re-fires on the already-active row, and never double-fires with keyboard nav,
  // which routes through moveTo).
  function onRowSelect(slug: string) {
    if (slug !== activeSlug) playSound('move')
    selectSlug(slug, false)
  }

  // Cycle the sort control: No. → Date → Status → No. The active project stays
  // selected (its row just moves); a move blip marks the change.
  function cycleSort() {
    playSound('move')
    setSortMode(
      (m) => SORT_CYCLE[(SORT_CYCLE.indexOf(m) + 1) % SORT_CYCLE.length],
    )
  }

  // Back to the MAIN MENU (not the landing screen): play the cancel sound, arm
  // the double-circle reveal the menu will play, flag page.tsx to open on the
  // menu, then navigate to '/'. Copied from SectionPlaceholder so the handoff
  // stays identical. Held in a ref so the window-level Escape listener (bound
  // once) always calls the latest closure without re-subscribing.
  function back(origin: Origin) {
    playSound('cancel')
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }
  const backRef = useRef(back)
  useEffect(() => {
    backRef.current = back
  })

  // Escape → back to menu, consistent with the rest of the site (MainMenu binds
  // Escape the same way). Window-level so it fires regardless of focus; the
  // listbox keeps arrows/Enter scoped to itself, so the two never conflict.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        backRef.current(centerOrigin())
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <ScreenReveal reveals="section">
      <>
        <main className="fixed inset-0 z-0 overflow-y-auto bg-transparent select-none">
          {/* Legibility scrim — a left-anchored dark gradient over the water so the
              list text stays readable where the water runs bright (atmospheric,
              full-bleed, NOT a card). Sits above the global water, below content. */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20"
          />

          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col px-[6vw] py-[6vh] md:px-12">
            {/* Header — QUEST → PROJECTS, with the live "Sort by …" control right. */}
            <header className="flex items-end justify-between border-b-2 border-white/40 pb-2">
              <h1 className="font-display text-5xl leading-none tracking-wide text-white uppercase md:text-6xl">
                {SECTION_TITLE}
              </h1>
              <button
                type="button"
                onClick={cycleSort}
                aria-label={`Change sort order (currently ${SORT_LABELS[sortMode]})`}
                className="rounded-sm font-mono text-[0.7rem] tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {SORT_LABELS[sortMode]}
              </button>
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

            {/* The mission list — a single-select listbox of row chips, in the
                current sort order. The /01 /02 index is the display position. */}
            <div
              role="listbox"
              aria-label={SECTION_TITLE}
              onKeyDown={onListKeyDown}
              className="flex flex-col gap-1"
            >
              {orderedProjects.map((project, i) => (
                <QuestRow
                  key={project.slug}
                  project={project}
                  index={i}
                  selected={project.slug === activeSlug}
                  onSelect={onRowSelect}
                  rowRef={(el) => {
                    rowRefs.current[project.slug] = el
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
                className="rounded-sm font-mono text-xs tracking-[0.3em] text-white/60 uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                ← Back to menu
              </button>
            </div>
          </div>
        </main>

        {/* Sound toggle (Task 05) — reused from the menu, pinned to the viewport
            lower-left. Rendered OUTSIDE the scrolling <main> so it stays put while
            the quest list scrolls. */}
        <SoundToggle />
      </>
    </ScreenReveal>
  )
}
