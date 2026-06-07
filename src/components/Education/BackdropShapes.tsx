// Backdrop shapes — large, soft, low-opacity angular colour fields behind the
// content, so the screen isn't one flat scrim (Persona puts colours + shapes
// behind the text). All cool tones (red is reserved for the selection band): a
// deep cold-blue slab anchors the roster side, a steel-blue wedge sits behind
// the identity title, and a faint cyan glint accents the lower right. Each is an
// angular clip-path shape with the blur applied on an OUTER wrapper (so it
// softens the already-clipped edges into a brush-like field instead of a hard
// block). Decorative only: aria-hidden, no pointer events, static (no animation →
// nothing to gate for reduced-motion); the SlashField streaks above carry the
// motion. Sits above the scrim, below the content.

import { SHAPE_CYAN, SHAPE_DEEP_BLUE, SHAPE_STEEL } from './constants'

const SHAPES = [
  // Deep-blue angular slab, lower-left, behind the term roster.
  {
    color: SHAPE_DEEP_BLUE,
    opacity: 0.6,
    blur: '34px',
    clip: 'polygon(0 16%, 44% 32%, 39% 100%, 0 100%)',
  },
  // Steel-blue wedge, upper-right, behind the identity title.
  {
    color: SHAPE_STEEL,
    opacity: 0.3,
    blur: '44px',
    clip: 'polygon(50% 0, 100% 0, 100% 56%, 62% 28%)',
  },
  // Faint cyan glint, mid/lower-right.
  {
    color: SHAPE_CYAN,
    opacity: 0.2,
    blur: '40px',
    clip: 'polygon(58% 62%, 100% 46%, 100% 82%, 64% 98%)',
  },
] as const

export function BackdropShapes() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {SHAPES.map((s, i) => (
        <div key={i} className="absolute inset-0" style={{ filter: `blur(${s.blur})` }}>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: s.color, opacity: s.opacity, clipPath: s.clip }}
          />
        </div>
      ))}
    </div>
  )
}
