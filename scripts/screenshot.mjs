// Captures the live background at several viewports for visual comparison against
// the P3R reference. Standalone (not part of the test suite) so it can pass the
// WebGL/SwiftShader launch flags headless Chromium needs.
//
//   node scripts/screenshot.mjs            # uses http://localhost:3000, /tmp/p3r-shots
//   URL=... SHOT_DIR=... node scripts/screenshot.mjs
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const OUT = process.env.SHOT_DIR || '/tmp/p3r-shots'
const URL = process.env.URL || 'http://localhost:3000'
mkdirSync(OUT, { recursive: true })

const viewports = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'laptop-1440x900', width: 1440, height: 900 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-landscape-844x390', width: 844, height: 390 },
]

const browser = await chromium.launch({
  headless: true,
  // Force software WebGL so the canvas isn't blank in headless CI/macOS.
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
})

// REDUCED=1 emulates prefers-reduced-motion to verify the static frame path.
const reducedMotion = process.env.REDUCED ? 'reduce' : 'no-preference'

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion,
  })
  // domcontentloaded (not networkidle) — the Next dev HMR socket never goes idle.
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('canvas')
  // Let the canvas paint and the 6fps caustics step through a few frames.
  await page.waitForTimeout(3500)
  await page.screenshot({ path: `${OUT}/${vp.name}.png` })
  await page.close()
  console.log('captured', vp.name)
}

await browser.close()
console.log('done ->', OUT)
