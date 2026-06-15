'use client'

// Experience LIST screen — the master screen reached FIRST when you open
// EXPERIENCE from the main menu (menu → LIST → detail). A P3R "Social Link LIST"
// of every role over the shared animated blue water (mounted globally in
// layout.tsx — this page stays transparent): a top-left LIST title, the angular
// card stack on the left (ExperienceListCard), a giant white diagonal panel +
// cropped EXPERIENCE wordmark on the right, and a bottom-right prompt + controls.
//
// Selection is slug-keyed (so reordering ROLES never moves anything): arrows /
// hover PREVIEW the selection (the highlighted card flips to black/white, the
// rest stay navy/cyan); Enter or a click OPENS that role's detail page at
// /experience/<slug> via a real navigation (the detail's ScreenReveal plays the
// armed reveal). Escape backs to the main menu. The selection/keyboard/back/audio
// machinery mirrors Projects' QuestList; the only twist is that "open" crosses a
// route here (the Experience detail is its own full screen), so it arms a
// section→section reveal instead of swapping an in-page panel.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { useRouter } from 'next/navigation'

import { ExperienceListCard } from './ExperienceListCard'
import {
  LIST_DESKTOP_MIN_ASPECT_H,
  LIST_DESKTOP_MIN_ASPECT_W,
  LIST_DESKTOP_MIN_WIDTH,
  LIST_CARD_GAP,
  LIST_CARD_HEIGHT,
  LIST_HINT_BACK,
  LIST_HINT_OPEN,
  LIST_PROMPT,
  LIST_PROMPT_BOTTOM,
  LIST_PROMPT_LINE_WIDTH,
  LIST_PROMPT_RIGHT,
  LIST_STACK_LEFT,
  LIST_STACK_TOP,
  LIST_STACK_WIDTH,
  LIST_VISIBLE_CARDS,
  LIST_TITLE,
  LIST_TITLE_LEFT,
  LIST_TITLE_SIZE,
  LIST_TITLE_SKEW,
  LIST_TITLE_TOP,
  LIST_WHITE_PANEL_CLIP,
  LIST_WHITE_PANEL_FILL,
  LIST_WORDMARK,
  LIST_WORDMARK_COLOR,
  LIST_WORDMARK_RIGHT,
  LIST_WORDMARK_ROTATE,
  LIST_WORDMARK_SIZE,
  LIST_WORDMARK_TOP,
} from './list-constants'
import { formatDateParts } from './helpers'
import { ROLES } from './experience'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  originFromEvent,
  type Origin,
} from '@/components/Transitions/handoff'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import { initAudioOnGesture, playSound } from '@/components/MainMenu/audio'

const EXP_BASE = '/experience'

export function ExperienceList() {
  const router = useRouter()

  // Selection keyed by slug (default = the most recent role, ROLES[0]).
  const [activeSlug, setActiveSlug] = useState<string>(ROLES[0].slug)
  const activeIndex = Math.max(
    0,
    ROLES.findIndex((r) => r.slug === activeSlug),
  )

  // Preview a selection (arrows / hover) — palette swap only, never navigates.
  // Plays the move blip only on a real change (so hover re-entry / no-ops stay
  // silent). The single state writer; the SFX-bearing sites below call it.
  function preview(slug: string) {
    if (slug === activeSlug) return
    playSound('move')
    setActiveSlug(slug)
  }
  function move(delta: number) {
    const n = ROLES.length
    preview(ROLES[(activeIndex + delta + n) % n].slug)
  }
  function moveTo(i: number) {
    preview(ROLES[i].slug)
  }

  // Confirm — OPEN the role's detail page. Real route change, so arm the reveal
  // the detail's ScreenReveal (reveals="section") will play, then router.push.
  // wavyBlot = the "entering / going deeper" effect (same as menu → section).
  function openRole(slug: string, origin: Origin) {
    playSound('confirm')
    armTransition({ effect: 'wavyBlot', origin, target: 'section' })
    router.push(`${EXP_BASE}/${encodeURIComponent(slug)}`)
  }

  // Back to the MAIN MENU — same handoff as QuestList / SocialLinkScreen.
  function back(origin: Origin) {
    playSound('cancel')
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }

  // All key handlers live in a ref so the single window-level listener (bound
  // once) always calls the latest closure without re-subscribing (same pattern
  // as SocialLinkScreen's pagerRef / backRef).
  const keysRef = useRef({ move, moveTo, openRole, back, activeSlug })
  useEffect(() => {
    keysRef.current = { move, moveTo, openRole, back, activeSlug }
  })

  // Window-level keys: arrows page the stack with wrap, Home/End jump, Enter/Space
  // opens the active role, Escape backs to the menu. Enter is skipped when the
  // Back button holds focus so it triggers the button instead of double-firing.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = keysRef.current
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          k.move(1)
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          k.move(-1)
          break
        case 'Home':
          e.preventDefault()
          k.moveTo(0)
          break
        case 'End':
          e.preventDefault()
          k.moveTo(ROLES.length - 1)
          break
        case 'Enter':
        case ' ': {
          const onButton =
            document.activeElement instanceof HTMLButtonElement
          if (onButton) break
          e.preventDefault()
          k.openRole(k.activeSlug, centerOrigin())
          break
        }
        case 'Escape':
          e.preventDefault()
          k.back(centerOrigin())
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Unlock the Web Audio context on the first gesture (same as the other screens).
  useEffect(() => {
    initAudioOnGesture()
  }, [])

  // Wordmark rotation derived from the viewport so it tracks the panel's leading
  // diagonal: angle = -atan((0.55·H) / (0.28·W)). Recomputed on resize; SSR falls
  // back to the static LIST_WORDMARK_ROTATE.
  const [wordmarkRotate, setWordmarkRotate] = useState(LIST_WORDMARK_ROTATE)
  useEffect(() => {
    const compute = () => {
      const dx = 0.28 * window.innerWidth
      const dy = 0.55 * window.innerHeight
      const angleDeg = -Math.atan(dy / dx) * (180 / Math.PI)
      setWordmarkRotate(`${angleDeg}deg`)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // Responsive gate — desktop game-menu composition vs mobile stacked flow, on
  // the SAME breakpoint as the detail screen (SocialLinkScreen) so the two switch
  // together. useSyncExternalStore keeps it SSR-safe (server/first paint = mobile).
  const mqString = `(min-width: ${LIST_DESKTOP_MIN_WIDTH}px) and (min-aspect-ratio: ${LIST_DESKTOP_MIN_ASPECT_W}/${LIST_DESKTOP_MIN_ASPECT_H})`
  const gate = useMemo(
    () => ({
      subscribe(onChange: () => void) {
        const m = window.matchMedia(mqString)
        m.addEventListener('change', onChange)
        return () => m.removeEventListener('change', onChange)
      },
      getSnapshot: () => window.matchMedia(mqString).matches,
      getServerSnapshot: () => false,
    }),
    [mqString],
  )
  const isDesktop = useSyncExternalStore(
    gate.subscribe,
    gate.getSnapshot,
    gate.getServerSnapshot,
  )

  const activeRole = ROLES[activeIndex]

  // Slug-keyed option elements so the desktop scroller can pull the active card
  // into view when arrow/Home/End paging moves past the visible window.
  const optionEls = useRef<Record<string, HTMLDivElement | null>>({})
  useEffect(() => {
    optionEls.current[activeSlug]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [activeSlug])

  // One card per role — the listbox option. Reused by both layouts (mobile flag
  // drops the horizontal offset and fixed height).
  const cards = (mobile: boolean) =>
    ROLES.map((r, i) => (
      <ExperienceListCard
        key={r.slug}
        role={r.role}
        company={r.company}
        dates={formatDateParts(r.start, r.end)}
        index={i}
        selected={r.slug === activeSlug}
        onSelect={() => preview(r.slug)}
        onOpen={(e) =>
          openRole(r.slug, e ? originFromEvent(e) : centerOrigin())
        }
        optionRef={(el) => {
          optionEls.current[r.slug] = el
        }}
        mobile={mobile}
      />
    ))

  return (
    <ScreenReveal reveals="section">
      <main
        className="exp-list-main fixed inset-0 z-0 bg-transparent select-none"
        style={{ overflowX: 'hidden', overflowY: isDesktop ? 'hidden' : 'auto' }}
      >
        {/* Announce the previewed role to screen readers (the palette swap is
            otherwise purely visual). */}
        <div aria-live="polite" className="sr-only">
          {`${activeRole.role} — ${activeRole.company}`}
        </div>

        {/* ===== DESKTOP — full-viewport game-menu composition. ===== */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ display: isDesktop ? 'block' : 'none' }}
        >
          {/* Large white diagonal panel (right) — the reference's character slash,
              now the main graphic element. Behind everything. */}
          <div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{ backgroundColor: LIST_WHITE_PANEL_FILL, clipPath: LIST_WHITE_PANEL_CLIP }}
          />

          {/* Giant cropped EXPERIENCE wordmark over the panel — background
              branding, rotated along the diagonal and clipped by the viewport. */}
          <div
            aria-hidden
            className="font-display absolute z-[1] uppercase"
            style={{
              right: LIST_WORDMARK_RIGHT,
              top: LIST_WORDMARK_TOP,
              fontSize: LIST_WORDMARK_SIZE,
              fontWeight: 900,
              letterSpacing: '-0.06em',
              whiteSpace: 'nowrap',
              color: LIST_WORDMARK_COLOR,
              transform: `translateY(-50%) rotate(${wordmarkRotate})`,
              transformOrigin: 'right center',
            }}
          >
            {LIST_WORDMARK}
          </div>

          {/* LIST title (top-left). */}
          <h1
            className="font-display absolute z-20 text-white uppercase"
            style={{
              left: LIST_TITLE_LEFT,
              top: LIST_TITLE_TOP,
              fontSize: LIST_TITLE_SIZE,
              fontWeight: 900,
              lineHeight: 0.9,
              transform: `skewX(${LIST_TITLE_SKEW})`,
            }}
          >
            {LIST_TITLE}
          </h1>

          {/* The card stack — a slug-keyed listbox. Scrolls vertically once more
              than LIST_VISIBLE_CARDS roles exist; the active card is pulled into
              view on selection. Right/bottom padding leaves room for the diagonal
              offsets and the cards' offset shadows so they aren't clipped. */}
          <div
            role="listbox"
            aria-label="Experience"
            className="exp-list-scroll absolute z-20 flex flex-col"
            style={{
              left: LIST_STACK_LEFT,
              top: LIST_STACK_TOP,
              width: LIST_STACK_WIDTH,
              gap: LIST_CARD_GAP,
              maxHeight: `calc(${LIST_VISIBLE_CARDS} * ${LIST_CARD_HEIGHT} + ${LIST_VISIBLE_CARDS} * ${LIST_CARD_GAP})`,
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '7vw',
              paddingTop: '1.5vh',
              paddingBottom: '1.5vh',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.45) transparent',
            }}
          >
            {cards(false)}
          </div>

          {/* Bottom-right prompt + controls. */}
          <div
            className="absolute z-30 flex flex-col items-end"
            style={{ right: LIST_PROMPT_RIGHT, bottom: LIST_PROMPT_BOTTOM }}
          >
            <p
              className="font-display text-right text-white uppercase"
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 2rem)',
                transform: 'skewX(-6deg)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.55)',
              }}
            >
              {LIST_PROMPT}
            </p>
            <div
              className="mt-2"
              style={{
                width: LIST_PROMPT_LINE_WIDTH,
                height: 2,
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 2px 0 rgba(0,0,0,0.35)',
              }}
            />
            <div className="mt-2 flex items-center gap-4 font-mono text-xs tracking-[0.2em] text-white/80 uppercase">
              <span>{LIST_HINT_OPEN}</span>
              <span>{LIST_HINT_BACK}</span>
            </div>
          </div>

          {/* Back to menu — true bottom-left corner of the screen. */}
          <div className="absolute z-30" style={{ bottom: '3vh', left: '3vw' }}>
            <button
              type="button"
              onClick={(e) => back(originFromEvent(e))}
              className="font-mono text-xs font-semibold tracking-[0.3em] text-white uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.9)' }}
            >
              ← Back to menu
            </button>
          </div>
        </div>

        {/* ===== MOBILE — stacked flow (panel + wordmark dropped). ===== */}
        <div
          className="relative z-10 flex flex-col gap-5 px-5 py-8"
          style={{ display: isDesktop ? 'none' : 'flex' }}
        >
          <h1
            className="font-display text-white uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 13vw, 4rem)',
              lineHeight: 0.9,
              transform: `skewX(${LIST_TITLE_SKEW})`,
            }}
          >
            {LIST_TITLE}
          </h1>

          <div
            role="listbox"
            aria-label="Experience"
            className="flex flex-col gap-3"
          >
            {cards(true)}
          </div>

          <p className="font-display text-white/90 uppercase" style={{ transform: 'skewX(-6deg)' }}>
            {LIST_PROMPT}
          </p>

          <button
            type="button"
            onClick={(e) => back(originFromEvent(e))}
            className="self-start font-mono text-xs tracking-[0.3em] text-white/60 uppercase"
          >
            ← Back to menu
          </button>
        </div>
      </main>
    </ScreenReveal>
  )
}
