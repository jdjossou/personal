// The command-style input row: a text field plus voice controls (mic = push-to-
// talk speech-to-text; speaker = auto-speak replies) and a send button. Angular
// container matching the dialogue boxes. Fully presentational — all state +
// handlers come from AboutScreen / useVoice.

import { BevelBox } from './BevelBox'
import { ACCENT_BLUE, ACCENT_RED, BOX_CLIP, INPUT_PLACEHOLDER, PANEL_BG } from './constants'
import { MicIcon, SendIcon, SpeakerIcon, SpeakerOffIcon, StopIcon } from './icons'

export function Composer({
  value,
  onChange,
  onSubmit,
  onMicToggle,
  listening = false,
  micSupported = false,
  speakerOn = false,
  onSpeakerToggle,
  busy = false,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onMicToggle: () => void
  listening?: boolean
  micSupported?: boolean
  speakerOn?: boolean
  onSpeakerToggle: () => void
  // Chat request in flight — disables send so messages can't overlap.
  busy?: boolean
}) {
  const canSend = value.trim().length > 0 && !busy

  return (
    <BevelBox
      as="form"
      clip={BOX_CLIP}
      fill={PANEL_BG}
      border={`${ACCENT_BLUE}55`}
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault()
        if (canSend) onSubmit()
      }}
      className="flex items-center gap-1.5 px-2.5 py-1.5"
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={listening ? 'Listening…' : INPUT_PLACEHOLDER}
        aria-label="Ask about Juniel"
        className="min-w-0 flex-1 bg-transparent px-2 py-2 font-rounded text-[0.95rem] text-white placeholder:text-white/40 focus:outline-none"
      />

      {/* Speaker toggle — auto-speak Juniel's replies. */}
      <button
        type="button"
        onClick={onSpeakerToggle}
        aria-pressed={speakerOn}
        aria-label={speakerOn ? 'Mute replies' : 'Hear replies aloud'}
        title={speakerOn ? 'Replies: voice on' : 'Replies: voice off'}
        className="grid h-9 w-9 place-items-center text-white/70 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
        style={speakerOn ? { color: ACCENT_BLUE } : undefined}
      >
        {speakerOn ? <SpeakerIcon className="h-[1.15rem] w-[1.15rem]" /> : <SpeakerOffIcon className="h-[1.15rem] w-[1.15rem]" />}
      </button>

      {/* Mic — push-to-talk. Pulsing red square while listening. */}
      {micSupported && (
        <button
          type="button"
          onClick={onMicToggle}
          aria-pressed={listening}
          aria-label={listening ? 'Stop listening' : 'Speak your question'}
          title={listening ? 'Stop' : 'Speak'}
          className={`grid h-9 w-9 place-items-center transition-colors focus-visible:outline-none ${listening ? '' : 'text-white/70 hover:text-white'}`}
          style={listening ? { color: ACCENT_RED } : undefined}
        >
          {listening ? <StopIcon className="h-4 w-4 animate-pulse motion-reduce:animate-none" /> : <MicIcon className="h-[1.15rem] w-[1.15rem]" />}
        </button>
      )}

      {/* Send. */}
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send"
        className="grid h-9 w-9 place-items-center text-white transition-opacity disabled:opacity-30"
        style={{ color: canSend ? ACCENT_BLUE : undefined }}
      >
        <SendIcon className="h-[1.2rem] w-[1.2rem]" />
      </button>
    </BevelBox>
  )
}
