// Chat route — streams Gemini 2.5 Flash replies for the About page. The bot is
// grounded by buildSystemPrompt() (compiled from the site's own data; see
// persona.ts). Node runtime (Fluid Compute default — no edge), POST (uncached).

import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { buildSystemPrompt } from '@/components/About/persona'
import { checkLimit } from '@/lib/rateLimit'

// Streaming replies are short; cap generously.
export const maxDuration = 30

export async function POST(req: Request) {
  const limited = await checkLimit('chat', req, 20, 60)
  if (limited) return limited

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: 'The chat model is not configured yet.' },
      { status: 503 },
    )
  }

  let body: { messages?: UIMessage[] }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const messages = body.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'No messages provided.' }, { status: 400 })
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    temperature: 0.6,
    maxOutputTokens: 700, // keep replies tight + cheap
    abortSignal: req.signal, // stop generating if the visitor navigates away
  })

  return result.toUIMessageStreamResponse()
}
