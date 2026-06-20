'use client'

// Academic Status screen — the Education section, rebuilt from P3R's "Check
// Status" comparison screen (docs/education/education_reference.png) so it reads
// as its own menu, NOT a clone of the Projects quest log. A single-screen,
// two-panel composition over the shared P3R water: a Check-Station bumper on top,
// a roster of study terms on the left, the always-on identity panel (university /
// degree / "Class of 20XX" — the required content) plus the selected term's
// course detail on the right, diagonal blue brush-slashes behind it all, and a
// "which term?" prompt + Back control at the bottom.
//
// The interaction grammar is the site's shared one, lifted from Projects/
// QuestList: exactly one term is active (keyed by slug, not index, so the deep
// link drives it and the order can change without moving a link); the roster is
// an ARIA listbox (click / arrow / Home / End, selection follows focus); the
// active slug mirrors into the URL via the History API (`/education/<slug>`, the
// default term staying the bare `/education`) with popstate sync and cold-load
// deep links; the menu's UI sounds fire on move/confirm/cancel; Escape and the
// Back button arm the double-circle reveal back to the main menu; and a lower-
// menu. Keyboard ← / → page the roster selection.

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { initAudioOnGesture, playSound } from '@/components/MainMenu/audio'
import { CheckStationBar } from './CheckStationBar'
import { BackdropShapes } from './BackdropShapes'
import { SlashField } from './SlashField'
import { TermRoster } from './TermRoster'
import { IdentityPanel } from './IdentityPanel'
import { TermDetail } from './TermDetail'
import { VIEW_HINT } from './constants'
import { TERMS } from './education'
import { getTermBySlug } from './helpers'

// --- Deep-link URL helpers (mirror Projects/QuestList) ---
const BASE = '/education'

// The default selection — the live ("current") term if there is one, else the
// most recent completed term, else the first. Stable, so the bare-base URL maps
// to exactly one term regardless of how the roster is authored.
const DEFAULT_TERM =
  TERMS.find((t) => t.status === 'current') ??
  [...TERMS].reverse().find((t) => t.status === 'completed') ??
  TERMS[0]

// The slug encoded in a path, or null for the bare list (default selection).
function slugFromPath(pathname: string): string | null {
  if (!pathname.startsWith(`${BASE}/`)) return null
  const rest = pathname.slice(BASE.length + 1)
  return rest ? decodeURIComponent(rest) : null
}

// Canonical path for an active slug — the default term is the bare base, so
// there is exactly one URL per state and `/education` always shows the default.
function pathForSlug(slug: string): string {
  return slug === DEFAULT_TERM.slug ? BASE : `${BASE}/${encodeURIComponent(slug)}`
}

// Resolve a path to a valid active slug. `explicit` = a real term slug was in the
// URL (cold deep link / back-forward → bring it into view); `unknown` = a slug
// was present but matched nothing (degrade to default + clean the URL).
function resolveActive(pathname: string): {
  slug: string
  explicit: boolean
  unknown: boolean
} {
  const raw = slugFromPath(pathname)
  if (!raw) return { slug: DEFAULT_TERM.slug, explicit: false, unknown: false }
  if (getTermBySlug(raw)) return { slug: raw, explicit: true, unknown: false }
  return { slug: DEFAULT_TERM.slug, explicit: false, unknown: true }
}

export function StatScreen() {
  const router = useRouter()
  const pathname = usePathname()

  // The single active term, keyed by slug, seeded from the URL so a cold
  // `/education/<slug>` opens that term and the bare path opens the default.
  // usePathname returns the real path during SSR, so the right term renders on
  // the first paint — no flash of the default before a client correction.
  const [activeSlug, setActiveSlug] = useState<string>(
    () => resolveActive(pathname).slug,
  )
  const activeTerm = getTermBySlug(activeSlug)

  // Refs to each row, keyed by slug (NOT position) so focus/scroll lookups stay
  // correct if the roster is reordered.
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})
  function registerRef(slug: string, el: HTMLDivElement | null) {
    rowRefs.current[slug] = el
  }

  // The one place selection happens. Updates state immediately (detail swaps this
  // tick) and mirrors the slug into the URL with the native History API —
  // pushState keeps it shallow (no Next navigation, so no remount / replayed
  // ScreenReveal) while still adding a history entry for back/forward. Kept
  // sound-free — the pure URL/selection writer — so popstate/deep-link callers
  // don't fire SFX; the SFX live at the user-input sites below.
  function selectSlug(slug: string, focus: boolean) {
    setActiveSlug(slug)
    const next = pathForSlug(slug)
    if (next !== window.location.pathname) {
      window.history.pushState(null, '', next)
    }
    if (focus) rowRefs.current[slug]?.focus()
  }

  // Cold deep link (mount): the slug is already seeded above, so here we only run
  // the side effects once — bring the targeted row into view + focus it (a11y),
  // normalize a removed/unknown slug back to the bare base, and arm the audio
  // context (matches MainMenu / QuestList first-gesture init).
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
  // don't originate. popstate never fires on our own pushState, so there's no
  // echo; the page stays mounted, so this just re-points selection + scrolls in.
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

  // Select the term at a position (wrapping) and, for keyboard / bumper nav, move
  // focus there. Plays the move blip — only from explicit user navigation, never
  // on programmatic selection.
  function moveTo(index: number) {
    const len = TERMS.length
    const i = ((index % len) + len) % len
    playSound('move')
    selectSlug(TERMS[i].slug, true)
  }
  const activeIndex = TERMS.findIndex((t) => t.slug === activeSlug)

  // Listbox keyboard model — scoped to the list so it never hijacks arrows when
  // the bumper / Back control is focused. Arrows wrap like MainMenu; Home/End
  // jump; Enter/Space confirm (detail already follows selection).
  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        moveTo(activeIndex + 1)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        moveTo(activeIndex - 1)
        break
      case 'Home':
        e.preventDefault()
        moveTo(0)
        break
      case 'End':
        e.preventDefault()
        moveTo(TERMS.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        playSound('confirm')
        break
    }
  }

  // Pointer selection from a row — move blip only on a real change (never re-
  // fires on the active row, never double-fires with keyboard nav via moveTo).
  function onRowSelect(slug: string) {
    if (slug !== activeSlug) playSound('move')
    selectSlug(slug, false)
  }

  // Back to the MAIN MENU: play the cancel sound, arm the double-circle reveal
  // the menu will play, flag page.tsx to open on the menu, then navigate to '/'.
  // Held in a ref so the window-level Escape listener (bound once) always calls
  // the latest closure without re-subscribing.
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

  // Escape → back to menu, consistent with the rest of the site. Window-level so
  // it fires regardless of focus; the listbox keeps arrows/Enter scoped to
  // itself, so the two never conflict.
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
      <main className="fixed inset-0 z-0 overflow-y-auto bg-transparent select-none md:overflow-hidden">
          {/* Legibility scrim — full-bleed dark gradient over the water so the
              text stays readable where it runs bright. Sits above the global
              water, below the slashes + content. */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30"
          />

          {/* Soft angular colour fields (crimson + blue) so the screen isn't one
              flat scrim, then the diagonal brush-slashes — both above the scrim,
              below the content. */}
          <BackdropShapes />
          <SlashField />

          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-6xl flex-col px-[6vw] py-[5vh] md:h-full md:px-12 md:py-[6vh]">
            {/* Check-Station bumper — the section title (roster paged by keyboard). */}
            <CheckStationBar />

            {/* Two-panel body. Mobile: identity → roster → detail (flex order).
                Desktop: roster spans the left column; identity (top) + detail
                (bottom) fill the right column. */}
            <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6 md:mt-8 md:grid md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)] md:gap-x-12 md:gap-y-6">
              <div className="order-1 md:order-none md:col-start-2 md:row-start-1">
                <IdentityPanel />
              </div>
              <div className="order-2 min-h-0 md:order-none md:col-start-1 md:row-start-1 md:row-span-2">
                <TermRoster
                  terms={TERMS}
                  activeSlug={activeSlug}
                  onSelect={onRowSelect}
                  onKeyDown={onListKeyDown}
                  registerRef={registerRef}
                />
              </div>
              <div className="order-3 min-h-0 md:order-none md:col-start-2 md:row-start-2">
                <TermDetail term={activeTerm} />
              </div>
            </div>

            {/* Bottom prompt + Back control. */}
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
    </ScreenReveal>
  )
}
