'use client'

// The "Contact Juniel" modal — a Persona-style confirm box with a message form.
// Posts to /api/contact (Resend). Honeypot + client validation; idle → sending →
// success / error states. Closes on the X, backdrop click, or Escape.

import { useEffect, useRef, useState } from 'react'
import { BevelBox } from './BevelBox'
import {
  ACCENT_BLUE,
  ACCENT_RED,
  BOX_CLIP,
  PANEL_BORDER,
} from './constants'
import { CloseIcon, MailIcon, SendIcon } from './icons'

type Status = 'idle' | 'sending' | 'success' | 'error'

const FIELD_CLASS =
  'w-full bg-[rgba(255,255,255,0.06)] px-3 py-2 font-rounded text-[0.92rem] text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-[var(--ring)]'

export function ContactDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  // Escape closes — captured here (the screen's own Escape handler is suppressed
  // while this dialog is open).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setError(json.error || 'Could not send your message.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Contact Juniel"
    >
      <BevelBox
        clip={BOX_CLIP}
        fill="rgba(8,18,30,0.96)"
        border={PANEL_BORDER}
        shadow="0 18px 48px rgba(0,0,0,0.6)"
        wrapperClassName="w-full max-w-md"
        className="relative"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Accent top edge. */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT_BLUE }} />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 grid h-8 w-8 place-items-center text-white/55 transition-colors hover:text-white focus-visible:outline-none"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="p-6 pt-7">
          <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-white uppercase">
            <span style={{ color: ACCENT_BLUE }}>
              <MailIcon className="h-5 w-5" />
            </span>
            Contact Juniel
          </h2>

          {status === 'success' ? (
            <div className="mt-5 flex flex-col gap-4">
              <p className="font-rounded text-[0.95rem] leading-relaxed text-white/85">
                Message sent — thanks for reaching out. Juniel will get back to you at the email you
                provided.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="self-start rounded-sm px-4 py-2 font-mono text-xs font-semibold tracking-[0.18em] text-[#06131F] uppercase"
                style={{ backgroundColor: ACCENT_BLUE }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 flex flex-col gap-3" style={{ '--ring': ACCENT_BLUE } as React.CSSProperties}>
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] tracking-[0.22em] text-white/50 uppercase">Name</span>
                <input
                  ref={firstRef}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={FIELD_CLASS}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] tracking-[0.22em] text-white/50 uppercase">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={FIELD_CLASS}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] tracking-[0.22em] text-white/50 uppercase">Message</span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to say?"
                  rows={4}
                  className={`${FIELD_CLASS} resize-none`}
                />
              </label>

              {/* Honeypot — hidden from people, tempting to bots. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {status === 'error' && (
                <p className="font-rounded text-sm" style={{ color: ACCENT_RED }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-1 flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 font-mono text-xs font-semibold tracking-[0.2em] text-[#06131F] uppercase transition-[filter] hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: ACCENT_BLUE }}
              >
                <SendIcon className="h-4 w-4" />
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </BevelBox>
    </div>
  )
}
