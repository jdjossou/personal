'use client'

import { useEffect, useState } from 'react'
import { Landing } from '@/components/Landing/Landing'
import { MainMenu } from '@/components/MainMenu/MainMenu'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armTransition,
  consumeEnterMenu,
  peekEnterMenu,
  type Origin,
} from '@/components/Transitions/handoff'

// Root screen toggle (Task 06): the landing/start screen is shown first; once the
// visitor starts, the main menu takes over. Each screen is wrapped in a
// ScreenReveal (Task 08) which plays the transition mask armed by whatever
// triggered the change — wavy blot going in, double-circle going back. The
// distinct keys force a remount on swap so the new screen's reveal replays. The
// animated P3R water background is mounted globally in layout.tsx and stays
// behind both screens (and behind the reveal mask).
type Screen = 'landing' | 'menu'

export default function Home() {
  // Open straight on the menu when a section sent us back (Section → Menu),
  // otherwise start on landing. Decided once with a non-mutating peek so it's
  // safe under StrictMode's double-invoked initializer; the flag is cleared in
  // the effect below. On the server there's no flag, so this is 'landing' and
  // hydration matches.
  const [screen, setScreen] = useState<Screen>(() =>
    peekEnterMenu() ? 'menu' : 'landing',
  )
  useEffect(() => {
    consumeEnterMenu()
  }, [])

  // Arm the destination's reveal, then swap. Landing → Menu uses the wavy blot;
  // Menu → Landing (Escape) uses the double-circle.
  function go(to: Screen, origin: Origin) {
    armTransition({
      effect: to === 'menu' ? 'wavyBlot' : 'doubleCircle',
      origin,
      target: to,
    })
    setScreen(to)
  }

  return screen === 'landing' ? (
    <ScreenReveal key="landing" reveals="landing">
      <Landing onStart={(origin) => go('menu', origin)} />
    </ScreenReveal>
  ) : (
    <ScreenReveal key="menu" reveals="menu">
      <MainMenu onBack={(origin) => go('landing', origin)} />
    </ScreenReveal>
  )
}
