// Sound (Task 09) — all UI sounds are synthesized at runtime with the Web Audio
// API; there are no audio files and nothing to download. A single lazily-created
// AudioContext (built only after a user gesture, per browser autoplay rules)
// feeds a low master gain so everything stays quiet. `playSound(event)` is the
// one entry point and returns early when muted. Mute state is mirrored to
// localStorage so the visitor's preference survives reloads, and exposed via a
// tiny subscribe API (getMuted/setMuted/subscribe) so a React toggle can read it
// with useSyncExternalStore. All window/localStorage access is SSR-guarded.

import {
  SOUND_MASTER_GAIN,
  SOUND_MUTE_STORAGE_KEY,
} from './constants'

export type SoundEvent = 'move' | 'confirm' | 'cancel' | 'open'

// --- Mute state (persisted) ------------------------------------------------

const isBrowser = typeof window !== 'undefined'

function readMuted(): boolean {
  if (!isBrowser) return false
  try {
    return window.localStorage.getItem(SOUND_MUTE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

// In-memory mirror of the persisted flag. Seeded from storage on the client;
// false during SSR so the server render matches the default-on state.
let muted = readMuted()
const listeners = new Set<() => void>()

export function getMuted(): boolean {
  return muted
}

export function setMuted(next: boolean): void {
  muted = next
  if (isBrowser) {
    try {
      window.localStorage.setItem(SOUND_MUTE_STORAGE_KEY, next ? '1' : '0')
    } catch {
      // ignore quota / privacy-mode failures — playback still respects `muted`
    }
  }
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// --- Audio context ---------------------------------------------------------

let ctx: AudioContext | null = null
let master: GainNode | null = null

function ensureContext(): AudioContext | null {
  if (!isBrowser) return null
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = SOUND_MASTER_GAIN
  master.connect(ctx.destination)
  return ctx
}

// Wire up first-gesture initialisation. Browsers refuse to start an AudioContext
// until the user interacts, so we create/resume it on the first pointer or key
// event and then detach. Safe to call repeatedly; only the first call binds.
let gestureBound = false
export function initAudioOnGesture(): void {
  if (!isBrowser || gestureBound) return
  gestureBound = true
  const onGesture = () => {
    const c = ensureContext()
    if (c && c.state === 'suspended') void c.resume()
    window.removeEventListener('pointerdown', onGesture)
    window.removeEventListener('keydown', onGesture)
  }
  window.addEventListener('pointerdown', onGesture)
  window.addEventListener('keydown', onGesture)
}

// --- Synthesis -------------------------------------------------------------

// A pitched tone with a fast attack and exponential decay (the blip/confirm/
// cancel family). `from`→`to` sweeps the frequency over the duration.
function tone(
  c: AudioContext,
  out: GainNode,
  type: OscillatorType,
  from: number,
  to: number,
  durationMs: number,
  peak: number,
) {
  const now = c.currentTime
  const dur = durationMs / 1000
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, now)
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + dur)
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(peak, now + 0.008) // fast attack
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur) // decay to silence
  osc.connect(g)
  g.connect(out)
  osc.start(now)
  osc.stop(now + dur + 0.02)
}

// A soft whoosh: short white-noise burst pushed through a lowpass filter whose
// cutoff sweeps upward, with its own short amplitude envelope.
function whoosh(c: AudioContext, out: GainNode, durationMs: number, peak: number) {
  const now = c.currentTime
  const dur = durationMs / 1000
  const frames = Math.floor(c.sampleRate * dur)
  const buffer = c.createBuffer(1, frames, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(300, now)
  filter.frequency.exponentialRampToValueAtTime(2400, now + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(peak, now + dur * 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(out)
  src.start(now)
  src.stop(now + dur + 0.02)
}

export function playSound(event: SoundEvent): void {
  if (muted) return
  const c = ensureContext()
  if (!c || !master) return
  if (c.state === 'suspended') void c.resume()

  switch (event) {
    case 'move': // short clean blip
      tone(c, master, 'triangle', 720, 680, 90, 0.5)
      break
    case 'confirm': // stronger rising tone
      tone(c, master, 'sine', 440, 660, 280, 0.7)
      break
    case 'cancel': // lower, softer falling tone
      tone(c, master, 'sine', 300, 200, 200, 0.45)
      break
    case 'open': // soft whoosh
      whoosh(c, master, 420, 0.6)
      break
  }
}
