'use client'

// Category strip — the MOBILE analog of the desktop CategoryRoster. The vertical
// party-row column doesn't fit a phone, so here the same categories become a
// HORIZONTAL, scroll-snapping row of angular chips at the top of the screen; the
// selected category's tech list fills the area below (master/detail in one view).
//
// Each chip mirrors a CategoryRow's palette: a parallelogram (CHIP_CLIP) carrying
// the category icon + label, the selected one a bright-white fill with dark text
// over an offset P3R-red drop-shadow, the rest solid dark with white text. Clicking
// a chip selects its category (onSelect) — the same handler the desktop roster
// uses. Presentational: it owns no selection state, just renders + reports.

import { useEffect, useRef } from 'react'
import {
  CHIP_CLIP,
  ROW_FILL,
  SELECT_FILL,
  SELECT_TEXT,
  SHADOW_COLOR,
  SHADOW_OFFSET,
} from './constants'
import { CategoryIcon } from './CategoryIcon'
import type { Category } from './stack'

export function CategoryStrip({
  categories,
  selectedId,
  onSelect,
}: {
  categories: readonly Category[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  // Keep the selected chip in view as the selection changes (keyboard / off-screen
  // taps), scrolling only the strip — never the page.
  const selectedRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedId])

  return (
    <div
      role="listbox"
      aria-label="Technology categories"
      className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const selected = category.id === selectedId
        return (
          <div key={category.id} className="relative shrink-0 snap-center">
            {/* Red drop-shadow behind the lit chip — same move as CategoryRow. */}
            {selected && (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundColor: SHADOW_COLOR,
                  clipPath: CHIP_CLIP,
                  transform: SHADOW_OFFSET,
                }}
              />
            )}

            <button
              ref={selected ? selectedRef : undefined}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(category.id)}
              className="relative flex items-center gap-2 px-5 py-2 focus-visible:outline-none"
              style={{
                backgroundColor: selected ? SELECT_FILL : ROW_FILL,
                clipPath: CHIP_CLIP,
                color: selected ? SELECT_TEXT : '#FFFFFF',
              }}
            >
              <CategoryIcon icon={category.icon} size={18} />
              <span className="font-display text-xl leading-none tracking-wide whitespace-nowrap">
                {category.label}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
