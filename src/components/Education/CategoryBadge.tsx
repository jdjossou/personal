// Category chip (Task 02 → Task 03) — the badge in each course row's LEADER/PARTY
// slot, marking a course CORE / ELECTIVE / SEMINAR. Unlike the Projects status
// pill this is a SHARP rectangular chip (no rounding) per the stats-screen badge
// spec: a filled CATEGORY_COLOR block with near-black text so each category is
// instantly scannable. When its row is `selected` (Task 03) it inverts — a white
// chip with CATEGORY_COLOR text — so it stays legible on the crimson selection
// band while still reading its category colour. Pure + presentational; colours
// come from constants, never hardcoded here.

import { CATEGORY_COLOR, CATEGORY_LABEL } from './constants'
import type { CourseCategory } from './education'

export function CategoryBadge({
  category,
  selected = false,
}: {
  category: CourseCategory
  selected?: boolean
}) {
  return (
    <span
      className="inline-block px-2 py-1 font-mono text-[0.6rem] leading-none font-semibold tracking-[0.18em] uppercase"
      style={
        selected
          ? { backgroundColor: '#FFFFFF', color: CATEGORY_COLOR[category] }
          : { backgroundColor: CATEGORY_COLOR[category], color: '#0A0A0A' }
      }
    >
      {CATEGORY_LABEL[category]}
    </span>
  )
}
