// Speech-to-text — transcribes a recorded mic clip with ElevenLabs Scribe so the
// visitor can talk to the chat. Expects multipart/form-data with an `audio` blob;
// returns { text }. Falls back to the browser's SpeechRecognition client-side when
// this isn't configured (503). Node runtime, POST (uncached).

import { experimental_transcribe as transcribe } from 'ai'
import { elevenlabs } from '@ai-sdk/elevenlabs'
import { checkLimit } from '@/lib/rateLimit'

export const maxDuration = 30

export async function POST(req: Request) {
  const limited = await checkLimit('stt', req, 30, 60)
  if (limited) return limited

  if (!process.env.ELEVENLABS_API_KEY) {
    return Response.json({ error: 'Voice is not configured.' }, { status: 503 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const file = form.get('audio')
  if (!(file instanceof Blob)) {
    return Response.json({ error: 'No audio provided.' }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: 'Audio clip too large.' }, { status: 413 })
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const { text } = await transcribe({
      model: elevenlabs.transcription('scribe_v1'),
      audio: bytes,
    })
    return Response.json({ text })
  } catch (err) {
    console.error('STT error:', err)
    return Response.json({ error: 'Transcription failed.' }, { status: 502 })
  }
}
