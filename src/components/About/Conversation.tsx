// The scrolling transcript. Maps the message list to angled dialogue boxes and
// keeps the newest turn in view as replies stream in. A typing indicator shows
// after the visitor sends and before the first assistant token arrives.

import { useEffect, useRef } from 'react'
import { BevelBox } from './BevelBox'
import { MessageBox, type ChatRole } from './MessageBox'
import { ACCENT_BLUE, BOX_CLIP } from './constants'

export type UIChatMessage = { id: string; role: ChatRole; text: string }

export function Conversation({
  messages,
  thinking = false,
}: {
  messages: readonly UIChatMessage[]
  // True between sending and the first streamed token (no assistant box yet).
  thinking?: boolean
}) {
  const endRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the latest turn whenever the transcript grows / streams. Smooth
  // unless the user prefers reduced motion (then jump).
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'end' })
  }, [messages, thinking])

  return (
    <div className="mt-auto flex flex-col gap-4 pr-1">
      {messages.map((m) => (
        <MessageBox key={m.id} role={m.role} text={m.text} />
      ))}

      {thinking && (
        <div className="flex justify-start">
          <BevelBox
            clip={BOX_CLIP}
            fill="rgba(10,26,44,0.82)"
            border={`${ACCENT_BLUE}66`}
            wrapperStyle={{ display: 'inline-flex' }}
            className="flex items-center gap-1.5 px-4 py-3"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block h-1.5 w-1.5 animate-bounce rounded-full motion-reduce:animate-none"
                style={{ backgroundColor: ACCENT_BLUE, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </BevelBox>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
