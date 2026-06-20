// Term detail — the lower-right master/detail readout that swaps as the roster
// selection changes (the reference's stat readout under the highlighted party
// row). It presents the selected term's learned SKILLS (never the courses): a
// wrapped field of angular skill tags. Factual only, no grades. Empty upcoming
// terms read a clean "ahead of you" state. Purely presentational — it renders
// whatever Term it is handed, with no selection state of its own.

import { TAG_CLIP, TERM_STATUS_COLOR, TERM_STATUS_LABEL, VIEW_HINT } from './constants'
import { formatTermPeriod } from './helpers'
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

  const skills = term.skills ?? []
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

        {skills.length === 0 ? null : (
          <>
            <p className="mt-3 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.3em] text-white/50 uppercase">
              <span aria-hidden className="h-2 w-2 rotate-45" style={{ backgroundColor: accent }} />
              Skills Learned
            </p>
            <ul className="mt-3 flex min-h-0 flex-wrap content-start gap-2 overflow-y-auto pr-1">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="bg-white/[0.08] px-3 py-1.5 font-mono text-sm tracking-wide text-white/90 ring-1 ring-white/15"
                  style={{ clipPath: TAG_CLIP }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
