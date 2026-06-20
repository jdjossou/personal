// Technology list — the top-right region of the Skill screen: the selected
// category's technologies, the analog of P3R's skill list (Dia / Media). The
// header is the selected CATEGORY NAME in thick black (so it reads over the bright
// water without a scrim, like the reference's bold label), and below it each
// technology renders as a TechRow in cyan. NO cost columns / cost box. Exactly one
// row is always focused (the P3R skill cursor) — the row at focusIndex.
//
// Presentational: it renders whatever Category it is handed and reports focus /
// activation back up (hover + click). SkillScreen owns the focus index and swaps
// the handed category as the roster selection changes (master/detail).

import {
  HEADER_COLOR,
  HEADER_OUTLINE_COLOR,
  HEADER_OUTLINE_WIDTH,
  SKILL_HEADER_GAP,
} from './constants'
import { TechRow } from './TechRow'
import type { Category, Technology } from './stack'

export function TechList({
  category,
  focusIndex,
  onFocusTech,
  onActivateTech,
  fullWidth = false,
  boxed = false,
}: {
  category: Category
  focusIndex: number
  onFocusTech: (i: number) => void
  onActivateTech: (tech: Technology) => void
  // Mobile: stretch to the parent's full width (the strip layout owns the width)
  // instead of the desktop's fixed right-anchored block.
  fullWidth?: boolean
  // Mobile: give unfocused rows a black rounded background (legibility over water).
  boxed?: boolean
}) {
  return (
    <section
      className={
        fullWidth
          ? 'flex w-full flex-col items-start'
          : 'flex w-[18rem] max-w-[80vw] flex-col items-start md:w-[22rem]'
      }
    >
      {/* Header — the category name in thick black, LEFT-aligned with the skill
          list below it (deviates from the reference's right-flush label). */}
      <h2
        className="text-left font-display text-4xl leading-[0.9] font-black tracking-tight uppercase md:text-5xl"
        style={{
          color: HEADER_COLOR,
          // Hairline white outline only — no shadow.
          WebkitTextStroke: `${HEADER_OUTLINE_WIDTH} ${HEADER_OUTLINE_COLOR}`,
        }}
      >
        {category.label}
      </h2>

      {/* Skill rows — left-aligned within the right-anchored block (diamond → name). */}
      <div
        role="listbox"
        aria-label={`${category.label} technologies`}
        className={`flex w-full flex-col items-stretch${boxed ? ' gap-1.5' : ''}`}
        style={{ marginTop: SKILL_HEADER_GAP }}
      >
        {category.items.map((tech, i) => (
          <TechRow
            key={tech.name}
            tech={tech}
            focused={i === focusIndex}
            boxed={boxed}
            onFocus={() => onFocusTech(i)}
            onActivate={() => onActivateTech(tech)}
          />
        ))}
      </div>
    </section>
  )
}
