# Personal Portfolio

A personal portfolio website with a UI inspired by the menus and visual language of *Persona 3 Reload*. Built with Next.js 16, React 19, and Three.js — featuring an animated water background, a voice-enabled AI assistant, and a layered, game-menu-style navigation.

## Features

- **Persona 3 Reload–inspired UI** — custom main menu, page transitions, and a layered animated water background rendered with Three.js (WebGL).
- **AI assistant** — a chat assistant (Google Gemini via the Vercel AI SDK) that can answer questions about me, with optional **voice in / voice out**:
  - Speech-to-text (`/api/stt`)
  - Text-to-speech using ElevenLabs (`/api/tts`)
- **Contact form** — sends email through [Resend](https://resend.com) (`/api/contact`).
- **Rate limiting** — API routes are protected with Upstash Redis + Ratelimit.
- **Content sections** — About, Experience, Projects, Education, and Tech Stack, each with individual detail pages.

## Tech Stack

| Area | Tooling |
|------|---------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D / graphics | Three.js |
| AI | Vercel AI SDK (`ai`), Google Gemini, ElevenLabs |
| Email | Resend |
| Rate limiting | Upstash Redis + Ratelimit |
| Testing | Playwright |

## Getting Started

### Prerequisites

- Node.js 20+
- An npm-compatible package manager

### Install

```bash
npm install
```

### Environment variables

Create a `.env.local` in the project root:

```bash
# AI assistant (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=

# Text-to-speech (ElevenLabs)
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=

# Contact form (Resend)
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=

# Rate limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> Features degrade gracefully — e.g. the site renders without AI/email keys, but the assistant and contact form need their respective keys to function.

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx playwright test` | Run the Playwright tests |

## Project Structure

```
src/
├── app/              # App Router routes + API handlers
│   ├── about/        # About, Experience, Projects, Education, Stack pages
│   ├── experience/   #   (each with [slug] detail pages)
│   ├── projects/
│   ├── education/
│   ├── stack/
│   └── api/          # chat, tts, stt, contact route handlers
├── components/       # UI: P3RBackground, MainMenu, Transitions, sections
├── data/             # Portfolio content
└── lib/              # Shared utilities
```

## Deployment

Optimized for deployment on [Vercel](https://vercel.com). Add the environment variables above to the project settings, then deploy. The Three.js water background runs client-side (WebGL); no extra build config required.
