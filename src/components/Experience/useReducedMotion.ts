'use client'

// One-time read of the user's `prefers-reduced-motion` setting, matching the
// pattern used across the site (ScreenReveal, MainMenu): useSyncExternalStore
// with a no-op subscribe, so it's read once at mount and never re-subscribes.
// SSR-safe (server snapshot = false → motion-on default, no hydration mismatch).
// Kept out of the React-free helpers.ts so that file stays pure.

import { useSyncExternalStore } from 'react'

const NO_SUBSCRIBE = () => () => {}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    NO_SUBSCRIBE,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}
