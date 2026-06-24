// Active-config store for the single, global P3R water canvas.
//
// The water is mounted ONCE (layout.tsx) and lives for the page lifetime. Screens
// that want a different look (e.g. the landing screen's darker, calmer variant)
// don't mount their own canvas — that meant two WebGL contexts + two full 8-pass
// pipelines running at once, with the global one fully occluded yet still drawing.
// Instead they push a config here on mount and revert on unmount; the hook applies
// it to the existing uniforms in place (no remount, no new context, no re-bake).
//
// Module-store + useSyncExternalStore pattern, matching handoff.ts and the
// codebase's existing media-query gates.

import { DEFAULT_P3R_CONFIG, type P3RConfig } from './constants'

let current: P3RConfig = DEFAULT_P3R_CONFIG
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

// Push a new active config (e.g. the landing screen's LANDING_WATER). No-op if it's
// already the active reference, so a re-render doesn't churn subscribers.
export function setWaterConfig(config: P3RConfig): void {
  if (config === current) return
  current = config
  emit()
}

// Revert to the site-wide default — called when a screen that overrode the config
// unmounts.
export function resetWaterConfig(): void {
  setWaterConfig(DEFAULT_P3R_CONFIG)
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): P3RConfig {
  return current
}

// SSR / first hydration always reflects the default so server and client markup
// agree; a screen override only takes effect in a client effect after mount.
export function getServerSnapshot(): P3RConfig {
  return DEFAULT_P3R_CONFIG
}
