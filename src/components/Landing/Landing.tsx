'use client'

// Landing / start screen — the first thing the visitor sees before the main
// menu is summoned. Deliberately minimal here (Task 06): a centered start
// prompt floating over the shared P3R water background (mounted in layout.tsx).
// Enter / click / tap enters the menu via onStart. The richer "summoned" menu
// opening sequence and mask transitions are Tasks 07–08.

import { useEffect } from 'react'
import { centerOrigin, originFromEvent, type Origin } from '@/components/Transitions/handoff'

type LandingProps = {
  // Switches the app from the landing screen into the main menu. Receives the
  // origin point the entrance mask (wavy blot) should grow from.
  onStart: (origin: Origin) => void
}

export function Landing({ onStart }: LandingProps) {
  // Enter key starts the menu (mask grows from screen centre). Removed on unmount
  // so it never leaks into the menu screen's own key handling.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        onStart(centerOrigin())
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onStart])

  return (
    <main
      onClick={(e) => onStart(originFromEvent(e))}
      className="fixed inset-0 z-0 flex cursor-pointer flex-col items-center justify-center bg-transparent select-none"
    >
      <p className="font-mono text-sm tracking-[0.4em] text-white/60 uppercase">
        Press Enter
      </p>
      <p className="mt-3 font-display text-5xl tracking-wide text-white uppercase">
        Start
      </p>
    </main>
  )
}
