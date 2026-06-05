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

import { useEffect } from 'react'
import { centerOrigin, originFromEvent, type Origin } from '@/components/Transitions/handoff'
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
  SWEEP_PHASE_PX,
  SWEEP_STROKE,
} from './constants'
import { PROMPT_SWEEP_GRADIENT, SWEEP_CYCLE, SWEEP_TRANSLATE_PX } from './promptSweep'

type LandingProps = {
  // Switches the app from the landing screen into the main menu. Receives the
  // origin point the entrance mask (wavy blot) should grow from.
  onStart: (origin: Origin) => void
}

export function Landing({ onStart }: LandingProps) {
  // Enter key starts the menu (mask grows from screen centre). Removed on unmount
  // so it never leaks into the menu screen's own key handling.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        onStart(centerOrigin())
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onStart])

  return (
    <main
      onClick={(e) => onStart(originFromEvent(e))}
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
              animation: `prompt-sweep ${SWEEP_CYCLE} linear infinite`,
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
