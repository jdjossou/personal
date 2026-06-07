// Identity panel — the "character" of the Academic Status screen, taking the
// place of the reference's focal party-member illustration (no silhouette, per
// the brief). It renders PROFILE as a bold typographic block and is ALWAYS
// visible (never a selectable row): university (eyebrow) → the degree program as
// the giant display title → credential + specialization meta → a large "Class of
// 20XX" graduation "rank". These three — university, degree, graduation — are
// the page's required content; everything else (the term roster) supports them.
// Purely presentational: all formatting comes from helpers.

import { PROFILE } from './education'
import { graduationYear, splitDegree } from './helpers'

export function IdentityPanel() {
  const { credential, program } = splitDegree(PROFILE.degree)
  const gradYear = graduationYear(PROFILE)

  return (
    <div className="flex flex-col">
      {/* University — the affiliation eyebrow. */}
      <p className="font-mono text-[0.7rem] tracking-[0.3em] text-white/70 uppercase md:text-xs">
        {PROFILE.university}
      </p>

      {/* Degree program — the dominant display title. */}
      <h1 className="mt-2 font-display text-6xl leading-[0.82] tracking-wide text-white uppercase md:text-7xl xl:text-8xl">
        {program}
      </h1>

      {/* Credential + specialization meta line. */}
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] tracking-[0.15em] text-white/75 uppercase md:text-xs">
        <span className="text-white/90">{credential}</span>
        {PROFILE.tagline && (
          <>
            <span aria-hidden className="text-white/30">
              ·
            </span>
            <span>{PROFILE.tagline}</span>
          </>
        )}
      </p>

      {/* Expected graduation — the "rank", as one cohesive Bebas block: a medium
          "CLASS OF" directly over the large year. */}
      <div className="mt-6 flex flex-col md:mt-7">
        <span className="font-display text-2xl leading-none tracking-[0.12em] text-white/70 uppercase md:text-3xl">
          Class of
        </span>
        <span className="font-display text-6xl leading-[0.85] tracking-wide text-white tabular-nums md:text-7xl">
          {gradYear}
        </span>
      </div>

      {/* Optional location meta. */}
      {PROFILE.location && (
        <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-white/45 uppercase">
          {PROFILE.location}
        </p>
      )}
    </div>
  )
}
