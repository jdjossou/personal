'use client'

// About Me — the 5th section, an ORIGINAL P3R idiom not used elsewhere on the
// site: a Persona-style CONVERSATION with an AI version of Juniel. Over a focused
// darker instance of the shared blue water (ABOUT_WATER): a big ABOUT title, a
// "speaker" identity panel, a streaming dialogue transcript, the signature blue
// response-choice chips (suggested prompts), a command composer with voice
// controls, and a bottom bar of external links + a CONTACT button. Back-to-menu
// uses the site's shared double-circle handoff.
//
// The chat runs on Gemini 2.5 Flash via the AI SDK (useChat → /api/chat), grounded
// on the site's own data (persona.ts). Voice (mic STT + speak TTS) is layered in
// by useVoice; contact opens ContactDialog. Each integration degrades gracefully
// when its keys are absent — the page always renders.

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'

import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { initAudioOnGesture, playSound } from '@/components/MainMenu/audio'
import { resetWaterConfig, setWaterConfig } from '@/components/P3RBackground/waterConfig'

import { IdentityPanel } from './IdentityPanel'
import { Conversation, type UIChatMessage } from './Conversation'
import { SuggestedPrompts } from './SuggestedPrompts'
import { Composer } from './Composer'
import { ContactBar } from './ContactBar'
import { ContactDialog } from './ContactDialog'
import { useVoice } from './useVoice'
import {
  ABOUT_WATER,
  CHAT_ERROR,
  GREETING,
  OUTLINE_SHADOW,
  SECTION_TITLE,
  SUBTITLE,
  SUGGESTED_PROMPTS,
  TITLE_SIZE,
  TITLE_SKEW,
} from './constants'

// Flatten a UIMessage's parts to its plain text (the only part type this chat
// produces).
function messageText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
}

export function AboutScreen() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [contactOpen, setContactOpen] = useState(false)

  const { messages, sendMessage, status, setMessages } = useChat({
    // Never let a failed request look broken — drop a friendly assistant line into
    // the transcript instead (no key configured, rate-limited, offline, …).
    onError() {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          parts: [{ type: 'text', text: CHAT_ERROR }],
        } as UIMessage,
      ])
    },
  })

  const busy = status === 'submitted' || status === 'streaming'
  const thinking = status === 'submitted' // sent, first token not in yet

  const send = useCallback(
    (text: string) => {
      const t = text.trim()
      if (!t || busy) return
      playSound('confirm')
      sendMessage({ text: t })
      setInput('')
    },
    [busy, sendMessage],
  )

  // Voice: mic → STT fills the composer + sends; speaker → TTS speaks replies.
  const voice = useVoice({ onTranscript: send, getLatestReply: () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return messageText(messages[i])
    }
    return ''
  }, replyComplete: status === 'ready' })

  // Display list: a greeting box (display-only — never sent to the model) followed
  // by the real user/assistant turns.
  const turns: UIChatMessage[] = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ id: m.id, role: m.role as 'user' | 'assistant', text: messageText(m) }))
  const display: UIChatMessage[] = [
    { id: 'greeting', role: 'assistant', text: GREETING },
    ...turns,
  ]
  const hasUserMessage = messages.some((m) => m.role === 'user')

  // Back to the MAIN MENU — shared handoff (cancel sound → double-circle reveal →
  // flag page.tsx to open on the menu → route to '/').
  const back = useCallback(
    (origin: Origin) => {
      playSound('cancel')
      armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
      armEnterMenu()
      router.push('/')
    },
    [router],
  )

  useEffect(() => {
    initAudioOnGesture()
  }, [])

  // Escape backs to the menu — unless the contact dialog is open (it handles its
  // own Escape). Rebinds when contactOpen changes so the guard stays current.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !contactOpen) {
        e.preventDefault()
        back(centerOrigin())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [back, contactOpen])

  // Drive the single global water canvas into About's darker variant while this
  // screen is shown, reverting on leave. No second WebGL context — the hook
  // re-tunes the live uniforms in place (see waterConfig).
  useEffect(() => {
    setWaterConfig(ABOUT_WATER)
    return () => resetWaterConfig()
  }, [])

  function openContact() {
    playSound('open')
    setContactOpen(true)
  }

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 flex flex-col overflow-hidden bg-transparent select-none">
        {/* The P3R water is the single global canvas (layout.tsx); the effect above
            drives it into the ABOUT_WATER variant while this screen is mounted. */}

        {/* Soft top/bottom darkening for depth + text legibility. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45"
        />

        {/* Back to menu — top-right (the title anchors the top-left). */}
        <button
          type="button"
          onClick={() => back(centerOrigin())}
          className="absolute top-[3vh] right-[4vw] z-30 font-mono text-xs tracking-[0.3em] text-white/70 uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
          style={{ textShadow: OUTLINE_SHADOW }}
        >
          ← Back to menu
        </button>

        {/* Content column — centred, capped width, full height so the transcript
            scrolls between a fixed header and a fixed footer. */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-[5vw] py-[3vh] md:px-8">
          <header className="shrink-0">
            <h1
              className="font-display leading-[0.85] text-white uppercase"
              style={{ fontSize: TITLE_SIZE, transform: `skewX(${TITLE_SKEW})`, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
            >
              {SECTION_TITLE}
            </h1>
            <p
              className="mt-1 font-mono text-[0.72rem] tracking-[0.22em] text-white/55 lowercase"
              style={{ textShadow: OUTLINE_SHADOW }}
            >
              {SUBTITLE}
            </p>
          </header>

          {/* Middle — desktop: identity rail beside the transcript; mobile: a
              compact identity chip above a full-width transcript. */}
          <div className="mt-4 flex min-h-0 flex-1 gap-6">
            <aside className="hidden w-56 shrink-0 md:block">
              <IdentityPanel />
            </aside>

            <section className="flex min-h-0 flex-1 flex-col">
              <div className="mb-3 md:hidden">
                <IdentityPanel compact />
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-2">
                <Conversation messages={display} thinking={thinking} />
              </div>
            </section>
          </div>

          {/* Footer — suggested prompts (until the visitor speaks), composer, then
              the contact bar. Pinned to the bottom of the screen. */}
          <footer className="mt-3 flex shrink-0 flex-col gap-3">
            {!hasUserMessage && (
              <SuggestedPrompts prompts={SUGGESTED_PROMPTS} onPick={send} disabled={busy} />
            )}
            <Composer
              value={input}
              onChange={setInput}
              onSubmit={() => send(input)}
              onMicToggle={voice.toggleMic}
              listening={voice.listening}
              micSupported={voice.micSupported}
              speakerOn={voice.speakerOn}
              onSpeakerToggle={voice.toggleSpeaker}
              busy={busy}
            />
            <ContactBar onContact={openContact} />
          </footer>
        </div>
      </main>

      {contactOpen && <ContactDialog onClose={() => setContactOpen(false)} />}
    </ScreenReveal>
  )
}
