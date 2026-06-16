// Technology list — the top-right region of the Skill screen: the selected
// category's technologies, the analog of P3R's skill list (Dia / Media). The
// header is the selected CATEGORY NAME in thick black (so it reads over the bright
// water without a scrim, like the reference's bold label), and below it each
// technology renders as a TechRow in cyan. NO cost columns / cost box. Exactly one
// row is always focused (the P3R skill cursor); Task 02 renders the FIRST focused.
//
// Presentational only: it renders whatever Category it is handed. Task 03 swaps
// the handed category as the roster selection changes (master/detail).

import { HEADER_COLOR, SKILL_HEADER_GAP } from './constants'
import { TechRow } from './TechRow'
import type { Category } from './stack'

export function TechList({ category }: { category: Category }) {
  return (
    <section className="flex w-[18rem] max-w-[80vw] flex-col items-start md:w-[22rem]">
      {/* Header — the category name in thick black, LEFT-aligned with the skill
          list below it (deviates from the reference's right-flush label). */}
      <h2
        className="text-left font-display text-4xl leading-[0.9] font-black tracking-tight uppercase md:text-5xl"
        style={{ color: HEADER_COLOR }}
      >
        {category.label}
      </h2>

      {/* Skill rows — left-aligned within the right-anchored block (diamond → name). */}
      <div className="flex w-full flex-col items-stretch" style={{ marginTop: SKILL_HEADER_GAP }}>
        {category.items.map((tech, i) => (
          <TechRow key={tech.name} tech={tech} focused={i === 0} />
        ))}
      </div>
    </section>
  )
}
