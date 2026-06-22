// Text-to-speech — Juniel's reply spoken in his ElevenLabs voice. Returns audio
// (mp3) the client plays. Falls back to the browser's speechSynthesis client-side
// when this isn't configured (503). Node runtime, POST (uncached).

import { experimental_generateSpeech as generateSpeech } from 'ai'
import { elevenlabs } from '@ai-sdk/elevenlabs'
import { checkLimit } from '@/lib/rateLimit'

export const maxDuration = 30

export async function POST(req: Request) {
  const limited = await checkLimit('tts', req, 30, 60)
  if (limited) return limited

  if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID) {
    return Response.json({ error: 'Voice is not configured.' }, { status: 503 })
  }

  let text: unknown
  try {
    ;({ text } = await req.json())
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  if (typeof text !== 'string' || !text.trim()) {
    return Response.json({ error: 'No text provided.' }, { status: 400 })
  }

  try {
    const { audio } = await generateSpeech({
      // flash = low-latency + cheap; the premium quality comes from the voice.
      // Swap to 'eleven_multilingual_v2' for higher fidelity at more cost.
      model: elevenlabs.speech('eleven_flash_v2_5'),
      text: text.slice(0, 1200), // cap length → cap cost/latency
      voice: process.env.ELEVENLABS_VOICE_ID,
      outputFormat: 'mp3',
    })
    // Hand back a standalone ArrayBuffer (avoids the Uint8Array<ArrayBufferLike>
    // → BodyInit lib-type friction).
    const buf = audio.uint8Array
    const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
    return new Response(body, {
      headers: { 'content-type': audio.mediaType || 'audio/mpeg', 'cache-control': 'no-store' },
    })
  } catch (err) {
    console.error('TTS error:', err)
    return Response.json({ error: 'Speech generation failed.' }, { status: 502 })
  }
}
