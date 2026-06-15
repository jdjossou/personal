'use client'

// Experience LIST card — one angular plate in the ExperienceList stack (the P3R
// "Social Link LIST" row). Two visual states from one `selected` prop:
//   • SELECTED  — black/white: off-white paper plate (CARD_PAPER) with a red
//     ACCENT_RED slash offset behind it, the role (big black italic) + date in
//     the upper area, and a BLACK company strip (white text) along the bottom.
//   • NON-SELECTED — navy/cyan: a dark-navy plate over a flat dark backing plate,
//     aqua role + date, and a bright-CYAN company strip (navy text).
// Presentational only — built from layered clipped shapes (never a plain
// rectangle), reusing the detail card's tokens (CARD_INK/CARD_PAPER/ACCENT_RED)
// for site consistency. No location, no rank/index badge, no tarot (per spec).
// It is the listbox OPTION: pointer/focus previews the selection (onSelect),
// click/confirm opens the detail (onOpen).

import type { MouseEvent } from 'react'

import { ACCENT_RED, CARD_INK, CARD_PAPER } from './constants'
import {
  LIST_CARD_CLIP,
  LIST_CARD_HEIGHT,
  LIST_CARD_SHADOW,
  LIST_CARD_STRIP_FRAC,
  LIST_COMPANY_ON_CYAN,
  LIST_COMPANY_SIZE,
  LIST_CYAN_STRIP,
  LIST_CYAN_TEXT,
  LIST_DATE_SIZE,
  LIST_DIAGONAL_STEP,
  LIST_NAVY,
  LIST_VISIBLE_CARDS,
  LIST_RED_OFFSET,
  LIST_ROLE_SIZE,
  LIST_ROLE_SIZE_MOBILE,
  LIST_ROLE_SKEW,
  LIST_SELECTED_CLIP,
  LIST_SHADOW_OFFSET,
  LIST_STRIP_INSET,
  LIST_STRIP_RADIUS,
} from './list-constants'

export function ExperienceListCard({
  role,
  company,
  dates,
  index,
  selected,
  onSelect,
  onOpen,
  optionRef,
  mobile = false,
}: {
  role: string
  company: string
  // [start, end] — stacked in the upper-right (start over end), per the reference.
  dates: [string, string]
  // Row position in the stack — drives the diagonal indent (each row sits a step
  // right of the one above).
  index: number
  selected: boolean
  // Preview the selection (pointer/focus) — does NOT navigate.
  onSelect: () => void
  // Confirm — open the detail page. Receives the click event so the caller can
  // grow the reveal from the pointer; keyboard callers pass nothing.
  onOpen: (e?: MouseEvent<HTMLDivElement>) => void
  // Slug-keyed ref so the list can focus/scroll the option (like QuestRow).
  optionRef?: (el: HTMLDivElement | null) => void
  mobile?: boolean
}) {
  // Palette + shapes per state.
  const outerClip = selected ? LIST_SELECTED_CLIP : LIST_CARD_CLIP
  const panelBg = selected ? CARD_PAPER : LIST_NAVY
  const roleColor = selected ? CARD_INK : LIST_CYAN_TEXT
  const dateColor = selected ? CARD_INK : LIST_CYAN_TEXT
  const stripBg = selected ? CARD_INK : LIST_CYAN_STRIP
  const stripText = selected ? '#FFFFFF' : LIST_COMPANY_ON_CYAN
  // Behind-plate: red slash for selected, flat dark plate for non-selected.
  const backFill = selected ? ACCENT_RED : LIST_CARD_SHADOW
  const backOffset = selected ? LIST_RED_OFFSET : LIST_SHADOW_OFFSET
  const [dateStart, dateEnd] = dates

  // Desktop: each row sits a diagonal step right of the one above (left edge runs
  // on a diagonal); selection only changes palette + z-index, not position. The
  // indent caps at one screenful so cards beyond the visible window (which scroll
  // in) never overrun the scroller's right padding and clip.
  // Mobile: a clean full-width stack, no horizontal offset.
  const indentSteps = Math.min(index, LIST_VISIBLE_CARDS - 1)
  const offsetX = mobile ? '0' : `calc(${indentSteps} * ${LIST_DIAGONAL_STEP})`

  return (
    <div
      ref={optionRef}
      role="option"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onOpen}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      className="relative shrink-0 cursor-pointer outline-none"
      style={{
        height: mobile ? 'auto' : LIST_CARD_HEIGHT,
        minHeight: mobile ? '11vh' : undefined,
        transform: `translateX(${offsetX})`,
        zIndex: selected ? 10 : 1,
        transition: 'transform 120ms ease-out, filter 120ms ease-out',
      }}
    >
      {/* Behind-plate — red slash (selected) or flat dark backing (non-selected),
          offset down/right so the stack reads layered and aggressive. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: backFill, clipPath: outerClip, transform: backOffset }}
      />

      {/* Main plate. */}
      <div
        className="relative flex h-full flex-col justify-between"
        style={{ backgroundColor: panelBg, clipPath: outerClip }}
      >
        {/* Upper row — role (left) + date (right). */}
        <div className="flex items-start justify-between gap-3 px-[7%] pt-[3%]">
          <h3
            className="font-display leading-[0.92] tracking-[-0.04em] uppercase"
            style={{
              color: roleColor,
              fontSize: mobile ? LIST_ROLE_SIZE_MOBILE : LIST_ROLE_SIZE,
              transform: `skewX(${LIST_ROLE_SKEW})`,
            }}
          >
            {role}
          </h3>
          {/* Date span — stacked start over end (replaces the reference RANK block). */}
          <span
            className="mt-1 flex shrink-0 flex-col items-end gap-[0.6em] text-right font-black tracking-tight whitespace-nowrap uppercase leading-[1.05]"
            style={{ color: dateColor, fontSize: LIST_DATE_SIZE }}
          >
            <span>{dateStart}</span>
            <span>{dateEnd}</span>
          </span>
        </div>

        {/* Company box — a rounded rectangle (black selected / cyan non-selected),
            inset from the plate edges so it never touches them. */}
        <div
          className="flex items-center justify-center px-[6%]"
          style={{
            height: mobile ? undefined : LIST_CARD_STRIP_FRAC,
            paddingTop: mobile ? '0.6rem' : undefined,
            paddingBottom: mobile ? '0.7rem' : undefined,
            marginTop: mobile ? '0.6rem' : undefined,
            marginLeft: LIST_STRIP_INSET,
            marginRight: LIST_STRIP_INSET,
            marginBottom: mobile ? undefined : LIST_STRIP_INSET,
            backgroundColor: stripBg,
            borderRadius: LIST_STRIP_RADIUS,
          }}
        >
          <p
            className="text-center font-semibold tracking-wide"
            style={{ color: stripText, fontSize: LIST_COMPANY_SIZE }}
          >
            {company}
          </p>
        </div>
      </div>
    </div>
  )
}
