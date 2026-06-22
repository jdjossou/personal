// The "speaker" panel — who you're talking to. An angular monogram avatar (the
// initials, since no portrait asset is required; swap in an <img> from /public if
// one is added), Juniel's name + role, and a small status readout. Anchors the
// conversation the way a character portrait does in a Persona dialogue.

import { BevelBox } from './BevelBox'
import {
  ACCENT_BLUE,
  BOX_CLIP,
  OUTLINE_SHADOW,
  PANEL_BG,
  SPEAKER_INITIALS,
  SPEAKER_NAME,
  SPEAKER_ROLE,
  SPEAKER_STATUS,
} from './constants'

export function IdentityPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center ${compact ? 'gap-3' : 'gap-4 sm:flex-col sm:items-start sm:gap-5'}`}
    >
      {/* Angular monogram avatar — bevelled square (same silhouette as the
          dialogue boxes), pale-blue rim, big display initials. */}
      <BevelBox
        clip={BOX_CLIP}
        fill={PANEL_BG}
        border={`${ACCENT_BLUE}88`}
        borderWidth={1.5}
        wrapperClassName="shrink-0"
        wrapperStyle={{ width: compact ? 48 : 92, height: compact ? 48 : 92 }}
        className="grid place-items-center"
      >
        <span
          className="font-display leading-none text-white"
          style={{ fontSize: compact ? '1.4rem' : '2.6rem', letterSpacing: '0.04em' }}
        >
          {SPEAKER_INITIALS}
        </span>
      </BevelBox>

      <div className="min-w-0">
        <p
          className="font-display leading-tight text-white"
          style={{ fontSize: compact ? '1.15rem' : '1.7rem', letterSpacing: '0.02em', textShadow: OUTLINE_SHADOW }}
        >
          {SPEAKER_NAME}
        </p>
        {!compact && (
          <p
            className="mt-0.5 font-mono text-[0.7rem] tracking-[0.18em] text-white/55 uppercase"
            style={{ textShadow: OUTLINE_SHADOW }}
          >
            {SPEAKER_ROLE}
          </p>
        )}
        <p
          className="mt-1.5 flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.25em] uppercase"
          style={{ color: ACCENT_BLUE, textShadow: OUTLINE_SHADOW }}
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: ACCENT_BLUE, boxShadow: `0 0 6px ${ACCENT_BLUE}` }}
          />
          {SPEAKER_STATUS}
        </p>
      </div>
    </div>
  )
}
