'use client'

// Minimal stand-in for a portfolio section (Task 06). Renders the section name
// over the shared P3R water background. Wrapped in a ScreenReveal (Task 08) so it
// plays the wavy-blot reveal armed by the menu when this route was opened. "Back
// to menu" returns straight to the MAIN MENU (not the landing screen): it arms
// the double-circle reveal the menu will play and flags page.tsx to open on the
// menu, then navigates to '/'.

import { useRouter } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'

type SectionPlaceholderProps = {
  title: string
}

export function SectionPlaceholder({ title }: SectionPlaceholderProps) {
  const router = useRouter()

  function back(origin: Origin) {
    // TODO Task 09: play cancel sound.
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 flex flex-col items-center justify-center bg-transparent select-none">
        <h1 className="font-display text-6xl tracking-wide text-white uppercase">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => back(centerOrigin())}
          className="mt-6 font-mono text-xs tracking-[0.3em] text-white/50 uppercase hover:text-white/80"
        >
          ← Back to menu
        </button>
      </main>
    </ScreenReveal>
  )
}
