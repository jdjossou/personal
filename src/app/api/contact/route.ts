// Contact route — emails Juniel the visitor's message via Resend. Validates input,
// drops bot submissions via a honeypot, and is rate-limited. Node runtime, POST
// (uncached). Requires RESEND_API_KEY + a verified-domain CONTACT_FROM_EMAIL +
// CONTACT_TO_EMAIL; returns 503 until configured.

import { Resend } from 'resend'
import { z } from 'zod'
import { checkLimit } from '@/lib/rateLimit'

export const maxDuration = 15

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
  // Honeypot — a hidden field real users never fill; bots do.
  company: z.string().optional(),
})

export async function POST(req: Request) {
  const limited = await checkLimit('contact', req, 5, 300) // 5 per 5 min / IP
  if (limited) return limited

  let data: unknown
  try {
    data = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return Response.json(
      { error: 'Please include your name, a valid email, and a message.' },
      { status: 400 },
    )
  }
  const { name, email, message, company } = parsed.data

  // Honeypot tripped → silently accept, send nothing.
  if (company && company.trim() !== '') return Response.json({ ok: true })

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    return Response.json({ error: 'Contact is not configured yet.' }, { status: 503 })
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: `Portfolio Contact <${from}>`,
      to,
      replyTo: email, // replying goes straight to the visitor
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })
    if (error) {
      console.error('Resend error:', error)
      return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 502 })
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error('Contact error:', err)
    return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 502 })
  }
}
