// Category row — one entry in the center-left roster, the Stack analog of P3R's
// party-member row. It maps 1:1 to a Category and reproduces the reference's row
// shape: a quadrilateral with a STRAIGHT left edge (flush to the screen edge) and
// a DIAGONAL right edge (CAT_CLIP), backed by an offset RED copy that reads as a
// drop-shadow. The selected row is a bright white fill with dark text (the lit
// party member); the rest are translucent dark-blue with white text.
//
// Interactive: clicking OR hovering the row selects its category (onSelect),
// which swaps the right tech list. It's an ARIA listbox option with roving
// tabindex so keyboard focus tracks the selection.

import {
  CAT_CLIP,
  ROW_FILL,
  SELECT_FILL,
  SELECT_TEXT,
  SHADOW_COLOR,
  SHADOW_OFFSET,
} from './constants'
import { CategoryIcon } from './CategoryIcon'
import type { Category } from './stack'

export function CategoryRow({
  category,
  selected,
  onSelect,
}: {
  category: Category
  selected: boolean
  onSelect: () => void
}) {
  return (
    // Selected row sits above its siblings so its red shadow can spill OVER the
    // neighbouring rows instead of being painted/clipped by them.
    <div className="relative" style={{ zIndex: selected ? 10 : 0 }}>
      {/* Red drop-shadow — a same-shape copy offset behind the face. Only the
          selected row casts it (the lit party member). */}
      {selected && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: SHADOW_COLOR,
            clipPath: CAT_CLIP,
            transform: SHADOW_OFFSET,
          }}
        />
      )}

      {/* Face — the quadrilateral carrying the icon + label. Click / hover both
          select the category; roving tabindex keeps it keyboard-reachable. */}
      <div
        role="option"
        aria-selected={selected}
        tabIndex={selected ? 0 : -1}
        onClick={onSelect}
        onMouseEnter={onSelect}
        className="relative flex cursor-pointer items-center gap-3 py-2.5 pr-9 pl-[max(1rem,4vw)] transition-colors duration-100 focus-visible:outline-none"
        style={{
          backgroundColor: selected ? SELECT_FILL : ROW_FILL,
          clipPath: CAT_CLIP,
          color: selected ? SELECT_TEXT : '#FFFFFF',
        }}
      >
        <CategoryIcon icon={category.icon} size={22} />
        <span className="truncate font-display text-2xl leading-none tracking-wide md:text-3xl">
          {category.label}
        </span>
      </div>
    </div>
  )
}
