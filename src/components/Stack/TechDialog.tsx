'use client'

// Reference dialog — opened by activating a focused tech (Enter / click) on the
// Skill screen. It lists the tech's `links` (where the skill was used): the P3R
// "skill detail" popover analog. The chrome is angular Persona, NOT a rounded
// SaaS modal — a chamfered navy panel (DIALOG_CLIP) over a dimming backdrop,
// backed by an offset P3R-red slash.
//
// Links route by kind: an INTERNAL link (/projects/…, /experience/…) navigates
// through the site's transition hand-off (confirm sound → armed section reveal →
// router.push) so the destination animates in like the rest of the site; an
// EXTERNAL link (http…) opens in a new tab. A tech with NO links shows a single
// "no references yet" line — the dialog never renders empty.
//
// Dismiss: Esc (own window listener), a backdrop click, or the Back control —
// all call onClose. Focus moves into the panel on mount and is restored on close.

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { armTransition, type Origin } from '@/components/Transitions/handoff'
import { playSound } from '@/components/MainMenu/audio'
import {
  DIALOG_ACCENT,
  DIALOG_BACKDROP,
  DIALOG_CLIP,
  DIALOG_EMPTY,
  DIALOG_LINK_CYAN,
  DIALOG_PANEL_FILL,
  DIALOG_PANEL_TEXT,
} from './constants'
import type { TechLink, Technology } from './stack'

const isExternal = (url: string): boolean => /^https?:\/\//i.test(url)

export function TechDialog({
  tech,
  onClose,
}: {
  tech: Technology
  onClose: () => void
}) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const links = tech.links ?? []

  // Navigate an internal link the site's way: confirm blip, arm the section
  // reveal the destination's ScreenReveal plays, then push (same as
  // ExperienceList.openRole). wavyBlot = "going deeper".
  function openInternal(url: string, origin: Origin) {
    playSound('confirm')
    armTransition({ effect: 'wavyBlot', origin, target: 'section' })
    router.push(url)
  }

  // Esc closes; focus the panel on mount and restore the previously-focused
  // element on unmount so keyboard users aren't dropped at the top of the page.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      prev?.focus?.()
    }
  }, [onClose])

  return (
    // Backdrop — clicking it (outside the panel) dismisses.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: DIALOG_BACKDROP }}
      onClick={onClose}
    >
      {/* Offset red slash + the navy panel, both chamfered. Stop propagation so
          clicks inside the panel don't reach the backdrop. */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: DIALOG_ACCENT,
            clipPath: DIALOG_CLIP,
            transform: 'translate(8px, 8px)',
          }}
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${tech.name} references`}
          tabIndex={-1}
          className="relative w-[min(28rem,90vw)] px-7 py-6 focus-visible:outline-none"
          style={{
            backgroundColor: DIALOG_PANEL_FILL,
            clipPath: DIALOG_CLIP,
            color: DIALOG_PANEL_TEXT,
          }}
        >
          {/* Header — tech name + a red rule, the Persona label bar. */}
          <h2 className="font-display text-2xl font-black tracking-tight uppercase md:text-3xl">
            {tech.name}
          </h2>
          <div
            aria-hidden
            className="mt-2 mb-4 h-0.5 w-full"
            style={{ backgroundColor: DIALOG_ACCENT }}
          />

          {links.length > 0 && (
            <p className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-white/55 uppercase">
              Used in
            </p>
          )}

          {links.length === 0 ? (
            <p className="font-mono text-sm text-white/70">{DIALOG_EMPTY}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {links.map((link: TechLink) => (
                <li key={`${link.label}-${link.url}`}>
                  {isExternal(link.url) ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 font-mono text-base tracking-[0.02em] transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
                      style={{ color: DIALOG_LINK_CYAN }}
                    >
                      <span className="truncate">{link.label}</span>
                      <span aria-hidden className="text-sm leading-none opacity-70">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) =>
                        openInternal(link.url, {
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      className="group flex w-full items-center justify-between gap-3 text-left font-mono text-base tracking-[0.02em] transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
                      style={{ color: DIALOG_LINK_CYAN }}
                    >
                      <span className="truncate">{link.label}</span>
                      <span aria-hidden className="text-base leading-none opacity-70">
                        ›
                      </span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Back control — bottom-right, dismisses (Esc / backdrop also do). */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs tracking-[0.3em] text-white/80 uppercase transition-opacity hover:opacity-60 focus-visible:opacity-60 focus-visible:outline-none"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
