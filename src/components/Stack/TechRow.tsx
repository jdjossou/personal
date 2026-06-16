// Technology row — one entry in the top-right skill list, the Stack analog of a
// P3R skill (Dia / Media). It maps 1:1 to a Technology: the tech name (font-mono),
// name only — NO cost columns, NO secondary description line. One row in the list
// is always in the focused/cursor state (there is no empty state).
//
// Unfocused rows are cyan over the water. The FOCUSED row is the lit cursor: it
// mirrors a selected CategoryRow on the left — a WHITE rounded rectangle whose
// RIGHT side is flush to the screen edge (left corners rounded), backed by an
// offset P3R-red drop-shadow, with dark text. If the tech carries links it shows a
// subtle chevron hinting that activating it opens its references.
//
// Interactive: hovering moves the cursor to this row (onFocus); clicking focuses
// it AND activates it (onActivate) to open the reference dialog. The chevron is
// the affordance for that dialog.

import {
  SKILL_CYAN,
  SKILL_EDGE_BLEED,
  SKILL_SELECT_FILL,
  SKILL_SELECT_RADIUS,
  SKILL_SELECT_TEXT,
  SKILL_SHADOW_COLOR,
  SKILL_SHADOW_OFFSET,
} from './constants'
import type { Technology } from './stack'

export function TechRow({
  tech,
  focused,
  onFocus,
  onActivate,
}: {
  tech: Technology
  focused: boolean
  onFocus: () => void
  onActivate: () => void
}) {
  const hasLinks = (tech.links?.length ?? 0) > 0

  // Click focuses then activates (so clicking a non-focused row both moves the
  // cursor there and opens its dialog).
  function onClick() {
    onFocus()
    onActivate()
  }

  if (focused) {
    // Lit row — the white rounded rectangle + offset red drop-shadow, the mirror
    // of a selected CategoryRow. Lifted above siblings so the red can spill OVER
    // the neighbouring row instead of being painted by it.
    return (
      <div
        role="option"
        aria-selected
        onMouseEnter={onFocus}
        onClick={onClick}
        className="relative cursor-pointer"
        style={{ zIndex: 10 }}
      >
        {/* Red drop-shadow — the same rounded shape, offset toward the open side,
            bleeding past the list block to the screen's right edge. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0"
          style={{
            right: `calc(-1 * ${SKILL_EDGE_BLEED})`,
            backgroundColor: SKILL_SHADOW_COLOR,
            borderTopLeftRadius: SKILL_SELECT_RADIUS,
            borderBottomLeftRadius: SKILL_SELECT_RADIUS,
            transform: SKILL_SHADOW_OFFSET,
          }}
        />

        {/* White face — extends past the block to touch the screen edge (negative
            right margin); padding keeps the text off that edge. Fresh-mounted on
            every cursor move (rows are keyed by tech), so `stack-cursor-flick`
            plays as a crisp slide-in; auto-disabled under reduced motion via the
            [data-stack-cursor] rule in globals.css. */}
        <div
          data-stack-cursor
          className="relative flex items-center gap-2.5 py-2 pl-5"
          style={{
            marginRight: `calc(-1 * ${SKILL_EDGE_BLEED})`,
            paddingRight: `calc(${SKILL_EDGE_BLEED} + 1.25rem)`,
            backgroundColor: SKILL_SELECT_FILL,
            borderTopLeftRadius: SKILL_SELECT_RADIUS,
            borderBottomLeftRadius: SKILL_SELECT_RADIUS,
            color: SKILL_SELECT_TEXT,
            animation: 'stack-cursor-flick 110ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="min-w-0 flex-1 truncate font-mono text-base font-medium tracking-[0.02em]">
            {tech.name}
          </span>

          {hasLinks && (
            <span aria-hidden className="font-mono text-base leading-none">
              ›
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      role="option"
      aria-selected={false}
      onMouseEnter={onFocus}
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2.5 py-1.5"
      style={{ opacity: 0.78 }}
    >
      <span
        className="min-w-0 flex-1 truncate font-mono text-base font-medium tracking-[0.02em]"
        style={{
          color: SKILL_CYAN,
          textShadow: '0 1px 2px rgba(0,0,0,0.45)',
        }}
      >
        {tech.name}
      </span>

      {/* Reference affordance — a chevron hinting that activating this tech opens
          its links (Task 03). Omitted entirely for techs with no links. */}
      {hasLinks && (
        <span
          aria-hidden
          className="font-mono text-base leading-none"
          style={{ color: SKILL_CYAN, opacity: 0.5 }}
        >
          ›
        </span>
      )}
    </div>
  )
}
