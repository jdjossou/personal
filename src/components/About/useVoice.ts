'use client'

// Voice layer for the chat. Two directions, each with a premium server path and a
// free browser fallback so it never hard-breaks and works in local dev with no
// keys:
//   • LISTEN (mic → text): record with MediaRecorder → POST /api/stt (ElevenLabs
//     Scribe). If the server STT isn't configured (503) or errors, fall back to the
//     browser's Web Speech API (SpeechRecognition) on subsequent attempts.
//   • SPEAK (text → voice): POST /api/tts (ElevenLabs) → play the audio. If TTS
//     isn't configured/errors, fall back to the browser's speechSynthesis.
//
// The hook owns no chat state — it calls onTranscript(text) when speech is
// recognized, and speaks the latest reply (getLatestReply) when a reply completes
// while the speaker is on.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

// Minimal shapes for the non-standard Web Speech API (not in the TS DOM lib).
type RecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: RecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type SRConstructor = new () => SpeechRecognitionLike

function getSR(): SRConstructor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor
    webkitSpeechRecognition?: SRConstructor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

// Voice input is available if we can record (MediaRecorder → server STT) or the
// browser has its own SpeechRecognition. Read via useSyncExternalStore so it's
// SSR-safe (server = false, no hydration mismatch) without a setState-in-effect.
const NO_SUBSCRIBE = () => () => {}
function micSupportSnapshot(): boolean {
  const hasRecorder =
    typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
  return hasRecorder || !!getSR()
}

export function useVoice({
  onTranscript,
  getLatestReply,
  replyComplete,
}: {
  onTranscript: (text: string) => void
  getLatestReply: () => string
  // True when the chat is idle with a finished reply (status === 'ready').
  replyComplete: boolean
}) {
  const micSupported = useSyncExternalStore(NO_SUBSCRIBE, micSupportSnapshot, () => false)
  const [listening, setListening] = useState(false)
  const [speakerOn, setSpeakerOn] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  // Server availability is assumed until a 503 proves otherwise, then we stick to
  // the browser fallback for the rest of the session.
  const serverSttRef = useRef(true)
  const serverTtsRef = useRef(true)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastSpokenRef = useRef('')

  // Keep the latest onTranscript without resubscribing the recorder callbacks.
  const onTranscriptRef = useRef(onTranscript)
  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  // --- LISTEN ----------------------------------------------------------------
  const startWebSpeech = useCallback(() => {
    const SR = getSR()
    if (!SR) {
      setListening(false)
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript ?? ''
      if (text.trim()) onTranscriptRef.current(text.trim())
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }, [])

  const startServerRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data)
      }
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setListening(false)
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        if (!blob.size) return
        try {
          const fd = new FormData()
          fd.append('audio', blob, 'speech.webm')
          const res = await fetch('/api/stt', { method: 'POST', body: fd })
          if (res.status === 503) {
            serverSttRef.current = false // next attempt uses the browser fallback
            return
          }
          if (!res.ok) throw new Error('stt failed')
          const { text } = (await res.json()) as { text?: string }
          if (text?.trim()) onTranscriptRef.current(text.trim())
        } catch {
          if (getSR()) serverSttRef.current = false
        }
      }
      rec.start()
      recorderRef.current = rec
      setListening(true)
    } catch {
      // getUserMedia denied/unavailable — try the browser recognizer instead.
      startWebSpeech()
    }
  }, [startWebSpeech])

  const stopListening = useCallback(() => {
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') {
      rec.stop()
      recorderRef.current = null
      return
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      return
    }
    setListening(false)
  }, [])

  const toggleMic = useCallback(() => {
    if (listening) {
      stopListening()
      return
    }
    const hasRecorder =
      typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
    if (serverSttRef.current && hasRecorder) startServerRecording()
    else startWebSpeech()
  }, [listening, stopListening, startServerRecording, startWebSpeech])

  // --- SPEAK -----------------------------------------------------------------
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const webSpeak = useCallback((text: string) => {
    if (typeof speechSynthesis === 'undefined') return
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    speechSynthesis.speak(u)
  }, [])

  const speak = useCallback(
    async (text: string) => {
      stopSpeaking()
      if (!serverTtsRef.current) {
        webSpeak(text)
        return
      }
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (res.status === 503) {
          serverTtsRef.current = false
          webSpeak(text)
          return
        }
        if (!res.ok) throw new Error('tts failed')
        const buf = await res.arrayBuffer()
        const blob = new Blob([buf], { type: res.headers.get('content-type') || 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        setSpeaking(true)
        audio.onended = () => {
          setSpeaking(false)
          URL.revokeObjectURL(url)
        }
        audio.onerror = () => {
          setSpeaking(false)
          URL.revokeObjectURL(url)
        }
        await audio.play()
      } catch {
        webSpeak(text)
      }
    },
    [stopSpeaking, webSpeak],
  )

  const toggleSpeaker = useCallback(() => {
    setSpeakerOn((on) => {
      const next = !on
      if (!next) stopSpeaking()
      // Enabling shouldn't replay the reply already on screen — only future ones.
      else lastSpokenRef.current = getLatestReply()
      return next
    })
  }, [stopSpeaking, getLatestReply])

  // Speak each newly-completed reply while the speaker is on.
  useEffect(() => {
    if (!speakerOn || !replyComplete) return
    const reply = getLatestReply()
    if (reply && reply !== lastSpokenRef.current) {
      lastSpokenRef.current = reply
      void speak(reply)
    }
  }, [speakerOn, replyComplete, getLatestReply, speak])

  // Stop any audio/recording on unmount.
  useEffect(() => {
    return () => {
      stopSpeaking()
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [stopSpeaking])

  return { micSupported, listening, toggleMic, speakerOn, toggleSpeaker, speaking }
}
