// Profile header (Task 02) — the fixed "character" block above the course list,
// rendering PROFILE (never a selectable row). The university is the dominant
// line and the section's H1 (font-display, uppercase, white); the degree is a
// secondary mono line; the expected graduation is a subdued mono figure pinned
// aside on wide screens (formatGraduation → "Expected 2028"). Optional location
// / tagline render as small mono meta when present. Sharp, thin-ruled, left-
// aligned — no card chrome. Reads as the system header above the ability list.

import { formatGraduation } from './helpers'
import { PROFILE } from './education'

export function ProfileHeader() {
  return (
    <header className="border-b-2 border-white/40 pt-6 pb-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {/* University — the dominant line / section H1. */}
          <h1 className="font-display text-5xl leading-none tracking-wide text-white uppercase md:text-6xl">
            {PROFILE.university}
          </h1>
          {/* Degree / program — secondary line. */}
          <p className="mt-2 font-mono text-sm tracking-[0.15em] text-white/80 uppercase">
            {PROFILE.degree}
          </p>
        </div>

        {/* Expected graduation — neutral fact, pinned aside on wide screens. */}
        <p className="shrink-0 font-mono text-xs tracking-[0.2em] text-white/60 uppercase">
          {formatGraduation(PROFILE.expectedGraduation)}
        </p>
      </div>

      {/* Optional small meta — location · tagline. */}
      {(PROFILE.location || PROFILE.tagline) && (
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.7rem] tracking-[0.15em] text-white/50 uppercase">
          {PROFILE.location && <span>{PROFILE.location}</span>}
          {PROFILE.location && PROFILE.tagline && (
            <span aria-hidden className="text-white/30">
              ·
            </span>
          )}
          {PROFILE.tagline && <span>{PROFILE.tagline}</span>}
        </p>
      )}
    </header>
  )
}
