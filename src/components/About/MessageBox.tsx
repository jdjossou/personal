// One conversation turn, rendered as a Persona-style angled dialogue box. The
// assistant (Juniel) speaks from the left in a blue-tinted box with a name tag and
// a thin accent edge; the visitor's messages sit on the right in a lighter box.
// The body uses the rounded sans (Nunito) so replies read as spoken/friendly,
// distinct from the mono UI chrome.

import { BevelBox } from './BevelBox'
import { MessageMarkdown } from './MessageMarkdown'
import {
  ACCENT_BLUE,
  ASSISTANT_TAG,
  BOX_CLIP,
  OUTLINE_SHADOW,
  USER_TAG,
} from './constants'

export type ChatRole = 'user' | 'assistant'

export function MessageBox({
  role,
  text,
  pending = false,
}: {
  role: ChatRole
  text: string
  // True while this assistant box is still streaming with no text yet — shows a
  // blinking caret instead of an empty box.
  pending?: boolean
}) {
  const isAssistant = role === 'assistant'
  return (
    <div className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[min(42rem,86%)] ${isAssistant ? '' : 'items-end'} flex flex-col gap-1`}>
        <span
          className="px-1 font-mono text-[0.6rem] tracking-[0.28em] uppercase"
          style={{
            color: isAssistant ? ACCENT_BLUE : 'rgba(255,255,255,0.5)',
            textShadow: OUTLINE_SHADOW,
            alignSelf: isAssistant ? 'flex-start' : 'flex-end',
          }}
        >
          {isAssistant ? ASSISTANT_TAG : USER_TAG}
        </span>
        <BevelBox
          clip={BOX_CLIP}
          fill={isAssistant ? 'rgba(10,26,44,0.82)' : 'rgba(236,244,252,0.94)'}
          border={isAssistant ? `${ACCENT_BLUE}66` : 'rgba(0,0,0,0.12)'}
          className="relative px-4 py-3"
        >
          {/* Accent edge on assistant boxes (left) — the blue dialogue rail. */}
          {isAssistant && (
            <span
              aria-hidden
              className="absolute top-0 left-0 h-full w-[3px]"
              style={{ backgroundColor: ACCENT_BLUE }}
            />
          )}
          {/* Assistant replies often arrive as Markdown — render them properly.
              Visitor messages are plain text, so they stay in a pre-wrapped <p>. */}
          {isAssistant ? (
            <div className="leading-relaxed" style={{ color: '#EAF3FB' }}>
              {text && <MessageMarkdown text={text} />}
              {pending && (
                <span
                  aria-hidden
                  className="inline-block h-[1.05em] w-[0.5ch] translate-y-[0.15em] animate-pulse motion-reduce:animate-none"
                  style={{ backgroundColor: ACCENT_BLUE }}
                />
              )}
            </div>
          ) : (
            <p
              className="font-rounded text-[0.95rem] leading-relaxed whitespace-pre-wrap"
              style={{ color: '#0C1A24' }}
            >
              {text}
            </p>
          )}
        </BevelBox>
      </div>
    </div>
  )
}
