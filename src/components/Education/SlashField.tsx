// Slash field — the page's signature, and the main visual divergence from the
// calm Projects quest log: bold diagonal blue brush-slashes sweeping across the
// screen, echoing P3R's "Check Status" composition. Each slash is a long, soft
// blue gradient bar rotated to the same diagonal and blended additively (screen)
// over the dark scrim/water so it reads as a streak of light, not a box. A gentle
// drift (the `edu-slash-drift` keyframe in globals.css) gives the P3R shimmer;
// it is switched off under prefers-reduced-motion by the rule in globals.css,
// keyed off the `data-edu-slashes` attribute — matching how the water and
// ScreenReveal freeze. Decorative only: aria-hidden, no pointer events, sits
// above the scrim and below the content column.

import { SLASH_BLUES } from './constants'

// Geometry, tuned by eye against the reference: a few thick anchor slashes plus
// thin accent streaks, fanned across the viewport. Sizes are viewport-relative
// so they scale; widths overshoot (≥140vw) so the −22° rotation still covers the
// corners. `delay` staggers the drift so they don't pulse in lockstep.
const SLASHES = [
  { top: '14%', height: '15vh', blur: '14px', opacity: 0.42, color: SLASH_BLUES[1], delay: '0s' },
  { top: '30%', height: '7vh', blur: '6px', opacity: 0.55, color: SLASH_BLUES[0], delay: '-5s' },
  { top: '50%', height: '26vh', blur: '26px', opacity: 0.34, color: SLASH_BLUES[2], delay: '-9s' },
  { top: '68%', height: '5vh', blur: '4px', opacity: 0.5, color: SLASH_BLUES[0], delay: '-3s' },
  { top: '80%', height: '18vh', blur: '18px', opacity: 0.36, color: SLASH_BLUES[1], delay: '-7s' },
] as const

export function SlashField() {
  return (
    <div
      aria-hidden
      data-edu-slashes
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {SLASHES.map((s, i) => (
        <div
          key={i}
          className="absolute left-1/2 w-[150vw] [animation:edu-slash-drift_16s_ease-in-out_infinite_alternate]"
          style={{
            top: s.top,
            height: s.height,
            opacity: s.opacity,
            filter: `blur(${s.blur})`,
            mixBlendMode: 'screen',
            animationDelay: s.delay,
            // Static fallback (used when reduced-motion disables the animation):
            // centre it (left-1/2 + −50%) and lay it on the diagonal. The
            // edu-slash-drift keyframe carries the same rotate and just nudges
            // the translateX, so it overrides this only while it runs.
            transform: 'translateX(-50%) rotate(-22deg)',
            background: `linear-gradient(90deg, transparent 0%, ${s.color} 35%, ${s.color} 65%, transparent 100%)`,
          }}
        />
      ))}
    </div>
  )
}
