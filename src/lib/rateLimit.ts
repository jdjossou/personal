// Shared IP rate limiter for the About-page API routes. Uses Upstash Redis when
// configured (durable + shared across serverless instances — the real cost guard
// in production); otherwise falls back to a relaxed in-memory limiter so local dev
// and unconfigured deploys still work (per-instance, resets on cold start).

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type Limiter = (id: string) => Promise<boolean> // → allowed?

function makeUpstash(limit: number, windowSec: number): Limiter | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const rl = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    prefix: 'about',
  })
  return async (id) => (await rl.limit(id)).success
}

function makeMemory(limit: number, windowSec: number): Limiter {
  const hits = new Map<string, number[]>()
  return async (id) => {
    const now = Date.now()
    const win = windowSec * 1000
    const arr = (hits.get(id) ?? []).filter((t) => now - t < win)
    arr.push(now)
    hits.set(id, arr)
    return arr.length <= limit
  }
}

// One limiter instance per (name, limit, window) — created lazily and cached so
// the in-memory window persists across requests on a warm instance.
const cache = new Map<string, Limiter>()
function limiter(name: string, limit: number, windowSec: number): Limiter {
  const key = `${name}:${limit}:${windowSec}`
  let l = cache.get(key)
  if (!l) {
    l = makeUpstash(limit, windowSec) ?? makeMemory(limit, windowSec)
    cache.set(key, l)
  }
  return l
}

function clientIp(req: Request): string {
  const h = req.headers
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    '127.0.0.1'
  )
}

// Returns a 429 Response if the caller is over the limit for `name`, else null.
// Usage: `const limited = await checkLimit('chat', req, 20, 60); if (limited) return limited`
export async function checkLimit(
  name: string,
  req: Request,
  limit: number,
  windowSec: number,
): Promise<Response | null> {
  const allowed = await limiter(name, limit, windowSec)(clientIp(req))
  if (allowed) return null
  return Response.json(
    { error: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429 },
  )
}
