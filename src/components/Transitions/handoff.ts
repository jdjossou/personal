// Transition hand-off (Task 08). A screen change that crosses a route
// (router.push) unmounts the old screen, so the reveal mask can't span the
// navigation in one component. Instead the trigger ARMS the next transition here
// and the destination screen PLAYS it on mount. We stash it in sessionStorage so
// it survives the route change; an in-page state swap (Landing↔Menu) uses the
// exact same path for consistency.

import type { TransitionEffect, RevealTarget } from './constants'

export type Origin = { x: number; y: number }

// Origin helpers for callers arming a transition: the mask grows from the point
// the visitor clicked, or the screen centre for keyboard-driven changes.
export const originFromEvent = (e: {
  clientX: number
  clientY: number
}): Origin => ({ x: e.clientX, y: e.clientY })

export const centerOrigin = (): Origin =>
  typeof window === 'undefined'
    ? { x: 0, y: 0 }
    : { x: window.innerWidth / 2, y: window.innerHeight / 2 }

type Handoff = {
  effect: TransitionEffect
  origin: Origin
  target: RevealTarget
  t: number // timestamp (Date.now), for the stale guard
}

const KEY = 'p3r:transition'
const ENTER_MENU_KEY = 'p3r:enterMenu'
// Generous so a slow first-visit route compile in `next dev` (which can take a
// couple of seconds) still plays its reveal; production navigations are instant.
const STALE_MS = 6000

const store = (): Storage | null =>
  typeof window === 'undefined' ? null : window.sessionStorage

// Arm the reveal the destination screen should play when it mounts.
export function armTransition(h: Omit<Handoff, 't'>): void {
  const s = store()
  if (!s) return
  const payload: Handoff = { ...h, t: Date.now() }
  s.setItem(KEY, JSON.stringify(payload))
}

function read(target: RevealTarget): Handoff | null {
  const s = store()
  if (!s) return null
  const raw = s.getItem(KEY)
  if (!raw) return null
  try {
    const h = JSON.parse(raw) as Handoff
    if (h.target !== target) return null
    if (Date.now() - h.t > STALE_MS) {
      s.removeItem(KEY)
      return null
    }
    return h
  } catch {
    s.removeItem(KEY)
    return null
  }
}

// Look at the armed reveal for `target` without clearing it — used during render
// so the wrapper can paint already clipped-closed and avoid a flash.
export function peekTransition(
  target: RevealTarget,
): { effect: TransitionEffect; origin: Origin } | null {
  const h = read(target)
  return h ? { effect: h.effect, origin: h.origin } : null
}

// Take the armed reveal for `target` and clear it — used once the wrapper starts
// animating, so it can't replay.
export function consumeTransition(
  target: RevealTarget,
): { effect: TransitionEffect; origin: Origin } | null {
  const h = read(target)
  if (h) store()?.removeItem(KEY)
  return h ? { effect: h.effect, origin: h.origin } : null
}

// A separate flag for "a section sent us back — open straight on the menu, not
// the landing screen". Read once by page.tsx's initial-state initializer.
export function armEnterMenu(): void {
  store()?.setItem(ENTER_MENU_KEY, '1')
}

// Non-mutating read — safe to call from a render / useState initializer (which
// React double-invokes under StrictMode). Pair with consumeEnterMenu in an
// effect to actually clear the flag.
export function peekEnterMenu(): boolean {
  return store()?.getItem(ENTER_MENU_KEY) === '1'
}

export function consumeEnterMenu(): boolean {
  const s = store()
  if (!s) return false
  const v = s.getItem(ENTER_MENU_KEY)
  if (v) s.removeItem(ENTER_MENU_KEY)
  return v === '1'
}
