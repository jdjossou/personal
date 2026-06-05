'use client'

// Sound toggle (Task 09) — a small speaker on/off button in the lower-left
// corner (the lower-right already holds the info block + nav prompts). It mutes
// or unmutes every UI sound and persists the choice to localStorage via audio.ts.
// Mute state is read with useSyncExternalStore against the audio module's
// subscribe API so the icon always reflects the live value; the server snapshot
// is `false` (default: sounds on) to match the persisted default.

import { useSyncExternalStore } from 'react'
import { getMuted, setMuted, subscribe } from './audio'

export function SoundToggle() {
  const muted = useSyncExternalStore(subscribe, getMuted, () => false)

  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      className="absolute bottom-6 left-[4vw] z-20 flex items-center gap-2 font-mono text-xs tracking-wide text-white/50 transition-colors hover:text-white/80"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* Speaker body */}
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        {muted ? (
          // Muted: an X to the right of the speaker
          <>
            <line x1="17" y1="9" x2="22" y2="15" />
            <line x1="22" y1="9" x2="17" y2="15" />
          </>
        ) : (
          // On: two sound waves
          <>
            <path d="M16 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
          </>
        )}
      </svg>
      <span>{muted ? 'Sound Off' : 'Sound On'}</span>
    </button>
  )
}
