'use client'

// Landing / start screen — the first thing the visitor sees before the main
// menu is summoned. Modelled on Persona 3 Reload's title screen (see
// docs/landing-page/reference.png): a small upper identity cluster, a huge
// left-aligned PRESS ANY KEY centerpiece, and corner furniture (external links)
// where the ATLUS logo sits in the reference.
//
// The background (Task 02) is its own darker, calmer instance of the site's P3R
// water (mounted below with the LANDING_WATER config) — distinct from the main
// menu's brighter water yet clearly the same world, so entering the menu reads as
// the lights coming up. The scan-line text animation (Task 03) and responsive
// copy switch (Task 04) are still to come. The existing onStart wiring (click /
// Enter) is preserved so the app keeps working end-to-end. All tunables live in
// constants.ts.

import { useCallback, useEffect, useRef, useState } from 'react'
import { centerOrigin, originFromEvent, type Origin } from '@/components/Transitions/handoff'
import { initAudioOnGesture, playSound } from '@/components/MainMenu/audio'
import { P3RBackground } from '@/components/P3RBackground/P3RBackground'
import { LinkIcon } from './icons'
import {
  BLOCK_LEFT_VW,
  LABEL_FONT,
  LANDING_WATER,
  LINKS,
  LINK_BG_COLOR,
  LINK_BORDER_COLOR,
  LINK_ICON_COLOR,
  LINK_TEXT_COLOR,
  NAME,
  NAME_FONT,
  PORTFOLIO_TAG,
  PROMPT_FONT,
  PROMPT_GAP_REM,
  PROMPT_LINE_HEIGHT,
  PROMPT_WORDS,
  ROLE_LABEL,
  SNAP_MS,
  SWEEP_PHASE_PX,
  SWEEP_STROKE,
} from './constants'
import { PROMPT_SWEEP_GRADIENT, SWEEP_CYCLE, SWEEP_TRANSLATE_PX } from './promptSweep'

type LandingProps = {
  // Switches the app from the landing screen into the main menu. Receives the
  // origin point the entrance mask (wavy blot) should grow from.
  onStart: (origin: Origin) => void
}

// Modifier / navigation keys that must NOT count as "any key": bare modifiers
// would fire spuriously, and Tab is reserved so keyboard users can still reach
// the external links instead of entering on their first keystroke (Task 04
// accessibility decision).
const IGNORED_KEYS = new Set([
  'Tab',
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'CapsLock',
])

export function Landing({ onStart }: LandingProps) {
  // `entering` swaps the looping wipe for the one-shot snap; the refs guard the
  // hand-off so it fires EXACTLY ONCE (a held key, a tap that also clicks, or a
  // rapid double-click can otherwise re-trigger) and let us clear the pending
  // snap timer on unmount.
  const [entering, setEntering] = useState(false)
  const firedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Resume the (lazily-created) AudioContext on the first gesture so the confirm
  // blip below is audible on the very interaction that triggers entry — mirrors
  // the MainMenu pattern. Clear any pending snap timer on unmount.
  useEffect(() => {
    initAudioOnGesture()
    return () => {
      if (timerRef.current != null) clearTimeout(timerRef.current)
    }
  }, [])

  // The single entry path for every activation source. Plays the confirm sound,
  // snaps the prompt, then hands off into the menu (wavyBlot armed by the parent).
  // Reduced motion skips the snap delay — ScreenReveal already gives the simpler
  // transition there.
  const activate = useCallback(
    (origin: Origin) => {
      if (firedRef.current) return
      firedRef.current = true

      playSound('confirm')
      setEntering(true)

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        onStart(origin)
        return
      }
      timerRef.current = setTimeout(() => onStart(origin), SNAP_MS)
    },
    [onStart],
  )

  // Any key starts the menu (mask grows from screen centre), except auto-repeat
  // from a held key, the ignored navigation/modifier keys, and shortcut combos
  // (⌘R, ⌘Tab, …) which stay with the browser. Removed on unmount so it never
  // leaks into the menu screen's own key handling.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      if (IGNORED_KEYS.has(e.key)) return
      e.preventDefault()
      activate(centerOrigin())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activate])

  return (
    <main
      onClick={(e) => activate(originFromEvent(e))}
      className="fixed inset-0 z-0 cursor-pointer overflow-hidden select-none"
    >
      {/* Task 02 — the landing's own darker/calmer instance of the P3R water,
          rendered behind the title text. This sits inside <main> (its own
          stacking context) so it covers the brighter global water for the landing
          only; the menu and other pages keep the default look. */}
      <P3RBackground config={LANDING_WATER} />

      {/* Single vertically-centred text block: identity cluster + giant prompt
          live in ONE flow column so the name truly sits "over" the prompt — when
          the prompt's height changes with the viewport, the name moves with it
          instead of staying pinned. Left-aligned, asymmetrical (title screen, not
          a centered hero). */}
      <div
        className="absolute top-1/2 flex -translate-y-1/2 flex-col"
        style={{ left: `${BLOCK_LEFT_VW}vw` }}
      >
        {/* Identity cluster — role label, name (white display), portfolio tag. */}
        <p
          className="font-mono tracking-[0.35em] text-white/50 uppercase"
          style={{ fontSize: LABEL_FONT }}
        >
          {ROLE_LABEL}
        </p>
        <h1
          className="font-display leading-none tracking-wide text-white"
          style={{ fontSize: NAME_FONT }}
        >
          {NAME}
        </h1>
        <p
          className="font-mono tracking-[0.3em] text-white/35 uppercase"
          style={{ fontSize: `calc(${LABEL_FONT} * 0.85)` }}
        >
          {PORTFOLIO_TAG}
        </p>

        {/* Centerpiece — the largest text on screen, running the Task 03 wipe.
            ONE diagonal gradient clipped to the whole block (`background-clip:
            text`) so the sweep is a single coherent diagonal across all three
            words; a permanent white text-stroke keeps the letters outlined in the
            transparent state (water showing through the interiors). The
            `prompt-sweep` keyframe (globals.css) holds on a solid state, dashes
            half a period so a group of "/" strips wipes the block to the other
            state, holds, then dashes the second half back. `--sweep-tile` is the
            full horizontal period; `--sweep-phase` aligns a hold over the text.
            Reduced motion falls back to solid white (media query in globals.css). */}
        <div
          data-press-any-key
          className="font-display tracking-tight uppercase"
          style={
            {
              fontSize: PROMPT_FONT,
              lineHeight: PROMPT_LINE_HEIGHT,
              marginTop: `${PROMPT_GAP_REM}rem`,
              backgroundImage: PROMPT_SWEEP_GRADIENT,
              // Size the background to exactly one full horizontal period so the
              // whole pattern (both flats + both strip groups) lives in the image
              // and scrolls into view. With `auto`, the image is only box-sized —
              // narrower than a single flat — so the transparent flat is clipped
              // off-canvas and the title never leaves the white state.
              backgroundSize: `${SWEEP_TRANSLATE_PX}px 100%`,
              backgroundRepeat: 'repeat',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: `${SWEEP_STROKE} #fff`,
              '--sweep-tile': `${SWEEP_TRANSLATE_PX}px`,
              '--sweep-phase': `${SWEEP_PHASE_PX}px`,
              // On activation, swap the perpetual wipe for the one-shot snap flash
              // (held by `forwards`) for the brief beat before the screen cuts away.
              animation: entering
                ? `prompt-snap ${SNAP_MS}ms ease-out forwards`
                : `prompt-sweep ${SWEEP_CYCLE} linear infinite`,
            } as React.CSSProperties
          }
        >
          {PROMPT_WORDS.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Lower-left furniture: external links as themed icon buttons, echoing
          where the ATLUS logo sits in the reference. stopPropagation keeps a link
          click from triggering the screen's onStart. */}
      <nav
        className="absolute bottom-[6vh] left-[5vw] flex flex-wrap gap-3"
        style={{ fontSize: LABEL_FONT }}
      >
        {LINKS.map(({ label, href, icon, newTab }) => (
          // Colours flow through CSS vars (not inline `color`) so the hover/
          // group-hover utilities can still brighten label + icon to white —
          // inline `color` would otherwise win over them. Icon rests in the
          // theme accent; label in muted white; both go white on hover.
          <a
            key={label}
            href={href}
            onClick={(e) => e.stopPropagation()}
            {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono tracking-[0.18em] uppercase [color:var(--link-text)] transition-colors hover:[color:#fff]"
            style={
              {
                '--link-text': LINK_TEXT_COLOR,
                '--icon': LINK_ICON_COLOR,
                borderColor: LINK_BORDER_COLOR,
                backgroundColor: LINK_BG_COLOR,
              } as React.CSSProperties
            }
          >
            <LinkIcon
              icon={icon}
              className="h-[1.1em] w-[1.1em] [color:var(--icon)] transition-colors group-hover:[color:#fff]"
            />
            <span>{label}</span>
            {newTab && <span className="sr-only">(opens in a new tab)</span>}
          </a>
        ))}
      </nav>
    </main>
  )
}
