// Term detail — the lower-right master/detail readout that swaps as the roster
// selection changes (the reference's stat readout under the highlighted party
// row). It presents the selected term's courses as the "abilities / learned
// skills" the brief calls for: each course is a category badge + code + name +
// Lv.N + a one-line summary. No GPA, factual only. Empty upcoming terms read a
// clean "ahead of you" state. Purely presentational — it renders whatever Term
// it is handed, with no selection state of its own.

import { CategoryBadge } from './CategoryBadge'
import { TERM_STATUS_COLOR, TERM_STATUS_LABEL, VIEW_HINT } from './constants'
import { coursesForTerm, formatTermPeriod, levelFromCode } from './helpers'
import type { Term } from './education'

export function TermDetail({ term }: { term: Term | undefined }) {
  // Neutral fallback — only reached if an unknown slug is somehow active; the
  // default selection is always a real term, so normally one is present.
  if (!term) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-sm tracking-wide text-white/60">{VIEW_HINT}</p>
      </div>
    )
  }

  const courses = coursesForTerm(term)
  const accent = TERM_STATUS_COLOR[term.status]

  return (
    <section className="relative flex h-full min-h-0 flex-col">
      {/* Subtle rounded backing so the detail reads as its own region without
          competing with the identity. */}
      <div aria-hidden className="absolute inset-0 rounded-2xl bg-[#0b1b2e]/30" />

      <div className="relative flex min-h-0 flex-col p-4 md:p-5">
        {/* Heading — term label · season/year · status tag. */}
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/15 pb-2">
          <h2 className="font-display text-3xl leading-none tracking-wide text-white uppercase md:text-4xl">
            {term.label}
          </h2>
          <span className="font-mono text-xs tracking-[0.15em] text-white/70 uppercase">
            {formatTermPeriod(term.period)}
          </span>
          <span
            className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase"
            style={{ color: accent }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accent }} />
            {TERM_STATUS_LABEL[term.status]}
          </span>
        </header>

        {courses.length === 0 ? (
          <p className="pt-4 font-mono text-sm tracking-wide text-white/55">
            Courses to come — this term is still ahead.
          </p>
        ) : (
          <ul className="mt-3 flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
          {courses.map((course) => {
            const level = levelFromCode(course)
            return (
              <li
                key={course.slug}
                className="flex flex-col gap-1 border-l-2 border-white/15 pl-3"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <CategoryBadge category={course.category} />
                  <span className="font-mono text-sm tabular-nums text-white/85">
                    {course.code}
                  </span>
                  <span className="font-display text-xl leading-none tracking-wide text-white uppercase">
                    {course.name}
                  </span>
                  {level !== undefined && (
                    <span className="font-mono text-xs tabular-nums whitespace-nowrap text-white/55">
                      Lv.{level}
                    </span>
                  )}
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-white/75">
                  {course.summary}
                </p>
              </li>
            )
          })}
          </ul>
        )}
      </div>
    </section>
  )
}
