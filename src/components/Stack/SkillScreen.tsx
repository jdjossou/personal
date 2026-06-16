'use client'

// Skill screen — the Stack section, a faithful reproduction of P3R's "Skill"
// screen (docs/stack/stack_reference.png), NOT a clone of the Education status
// screen. Over the shared BRIGHT blue water: a giant STACK title reading top→bottom
// up the left edge (cropped off-screen), two white semi-transparent triangles, a
// center-left roster of category quadrilaterals each backed by a red drop-shadow
// (the selected one bright white), a top-right skill list in cyan under the
// selected category's name in thick black, and a black-outlined prompt + a wired
// Back-to-menu control at the bottom-right.
//
// Static composition: the default category (getDefaultCategory) is hard-selected
// and the first technology renders focused. The selection model + master/detail
// swapping + the reference dialog land in Task 03. Back-to-menu IS wired here
// (cancel sound → double-circle reveal → route to '/'), the site's shared handoff.

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { playSound } from '@/components/MainMenu/audio'
import { P3RBackground } from '@/components/P3RBackground/P3RBackground'
import { TriangleField } from './TriangleField'
import { StackTitle } from './StackTitle'
import { CategoryRoster } from './CategoryRoster'
import { TechList } from './TechList'
import { KEY_HINTS, STACK_WATER, VIEW_HINT } from './constants'
import { CATEGORIES } from './stack'
import { getDefaultCategory } from './helpers'

// Black outline so white text reads over the bright water (prompt + Back).
const OUTLINE_SHADOW =
  '0 0 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,1)'

export function SkillScreen() {
  const router = useRouter()

  // Static selection — the first category in display order. Task 03 makes this
  // stateful + URL-driven (/stack/<category>).
  const category = getDefaultCategory()

  // Back to the MAIN MENU: play cancel, arm the double-circle reveal the menu will
  // play, flag page.tsx to open on the menu, then navigate to '/'. Held in a ref so
  // the window-level Escape listener (bound once) always calls the latest closure.
  function back(origin: Origin) {
    playSound('cancel')
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }
  const backRef = useRef(back)
  useEffect(() => {
    backRef.current = back
  })

  // Escape → back to menu, consistent with the rest of the site.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        backRef.current(centerOrigin())
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 overflow-hidden bg-transparent select-none">
        {/* Stack's own darker-blue instance of the P3R water (over the global
            bright one), the same move the landing makes — see STACK_WATER. */}
        <P3RBackground config={STACK_WATER} />

        {/* Light scrim for extra depth. Contrast comes from the black header +
            black-outlined prompt. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/25"
        />

        {/* White triangles + the cropped vertical STACK title over the water. */}
        <TriangleField />
        <StackTitle />

        {/* ---- Desktop / tablet: the reference's absolute composition ---- */}
        <div className="relative z-10 hidden h-full w-full md:block">
          {/* Category roster — center-left, rows flush to the left edge. */}
          <div className="absolute top-1/2 left-0 w-[min(34rem,46vw)] -translate-y-1/2">
            <CategoryRoster categories={CATEGORIES} selectedId={category.id} />
          </div>

          {/* Skill list — top-right. */}
          <div className="absolute top-[8vh] right-[4vw]">
            <TechList category={category} />
          </div>

          {/* Prompt + keyboard indications — bottom-right, black outline. */}
          <div className="absolute right-[4vw] bottom-[6vh] flex flex-col items-end gap-2">
            <p
              className="font-mono text-sm text-white"
              style={{ textShadow: OUTLINE_SHADOW }}
            >
              {VIEW_HINT}
            </p>

            {/* Divider line between the prompt and the key indications. */}
            <div
              aria-hidden
              className="h-px w-full bg-white/70"
              style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
            />

            <ul
              className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 font-mono text-xs text-white/85"
              style={{ textShadow: OUTLINE_SHADOW }}
            >
              {KEY_HINTS.map((hint) => (
                <li key={hint.label} className="flex items-center gap-2">
                  <span className="rounded-sm border border-white/55 px-1.5 py-0.5 tracking-[0.1em]">
                    {hint.keys}
                  </span>
                  <span className="tracking-[0.15em] uppercase text-white/65">
                    {hint.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to menu — bottom-LEFT, black outline for legibility. */}
          <button
            type="button"
            onClick={() => back(centerOrigin())}
            className="absolute bottom-[6vh] left-[4vw] font-mono text-xs tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none"
            style={{ textShadow: OUTLINE_SHADOW }}
          >
            ← Back to menu
          </button>
        </div>

        {/* ---- Mobile: a simple vertical flow of the same regions ---- */}
        <div className="relative z-10 flex h-full w-full flex-col gap-8 overflow-y-auto px-5 pt-[16vh] pb-10 md:hidden">
          <div className="self-end">
            <TechList category={category} />
          </div>
          <div className="-mx-5">
            <CategoryRoster categories={CATEGORIES} selectedId={category.id} />
          </div>
          <div className="mt-auto flex flex-col items-end gap-2">
            <p
              className="text-right font-mono text-sm text-white"
              style={{ textShadow: OUTLINE_SHADOW }}
            >
              {VIEW_HINT}
            </p>
            <button
              type="button"
              onClick={() => back(centerOrigin())}
              className="font-mono text-xs tracking-[0.3em] text-white uppercase"
              style={{ textShadow: OUTLINE_SHADOW }}
            >
              ← Back to menu
            </button>
          </div>
        </div>
      </main>
    </ScreenReveal>
  )
}
