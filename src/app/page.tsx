'use client'

import { useState } from 'react'
import { Landing } from '@/components/Landing/Landing'
import { MainMenu } from '@/components/MainMenu/MainMenu'

// Root screen toggle (Task 06): the landing/start screen is shown first; once
// the visitor starts, the main menu takes over. Escape from the menu (onBack)
// returns here. The animated P3R water background is mounted globally in
// layout.tsx and stays behind both screens.
export default function Home() {
  const [screen, setScreen] = useState<'landing' | 'menu'>('landing')

  return screen === 'landing' ? (
    <Landing onStart={() => setScreen('menu')} />
  ) : (
    <MainMenu onBack={() => setScreen('landing')} />
  )
}
