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
// Interactive composition (no deep links — selection is pure in-page state): a
// category is selected (default getDefaultCategory) and exactly one tech in its
// list is focused (default the first). Clicking / hovering / arrowing the roster
// swaps the right list; hover + ↑↓/WS move the tech cursor; Enter / click on a
// tech opens its reference dialog (TechDialog). Back-to-menu IS wired here too
// (cancel sound → double-circle reveal → route to '/'), the site's shared handoff.

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScreenReveal } from '@/components/Transitions/ScreenReveal'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { initAudioOnGesture, playSound } from '@/components/MainMenu/audio'
import { resetWaterConfig, setWaterConfig } from '@/components/P3RBackground/waterConfig'
import { TriangleField } from './TriangleField'
import { StackTitle } from './StackTitle'
import { CategoryRoster } from './CategoryRoster'
import { CategoryStrip } from './CategoryStrip'
import { TechList } from './TechList'
import { TechDialog } from './TechDialog'
import { KEY_HINTS, STACK_WATER, VIEW_HINT } from './constants'
import { CATEGORIES, type Technology } from './stack'
import { getDefaultCategory } from './helpers'

// Black outline so white text reads over the bright water (prompt + Back).
const OUTLINE_SHADOW =
  '0 0 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,1)'

export function SkillScreen() {
  const router = useRouter()

  // Selection state (no URL — pure in-page). selectedId picks the category whose
  // tech list shows on the right; focusIndex is the always-present skill cursor in
  // that list; dialogTech (non-null) is the activated tech whose reference dialog
  // is open.
  const [selectedId, setSelectedId] = useState(getDefaultCategory().id)
  const [focusIndex, setFocusIndex] = useState(0)
  const [dialogTech, setDialogTech] = useState<Technology | null>(null)

  const category =
    CATEGORIES.find((c) => c.id === selectedId) ?? getDefaultCategory()
  const dialogOpen = dialogTech !== null

  // --- Selection writers (mirror ExperienceList.preview: SFX only on a real
  // change so hover re-entry / no-ops stay silent) -------------------------------

  // Select a category → swap the right list + reset the cursor to its first item.
  function selectCategory(id: string) {
    if (id === selectedId) return
    playSound('move')
    setSelectedId(id)
    setFocusIndex(0)
  }
  // Move the skill cursor, wrapping within the current list.
  function focusTech(i: number) {
    const n = category.items.length
    const next = ((i % n) + n) % n
    if (next === focusIndex) return
    playSound('move')
    setFocusIndex(next)
  }
  // Open a tech's reference dialog. The tech is passed explicitly (click hands its
  // own row's tech; keyboard hands the focused one) so we never read a focusIndex
  // that a same-tick focus change hasn't committed yet.
  function activateTech(tech: Technology) {
    playSound('open')
    setDialogTech(tech)
  }
  function closeDialog() {
    playSound('cancel')
    setDialogTech(null)
  }

  // Back to the MAIN MENU: play cancel, arm the double-circle reveal the menu will
  // play, flag page.tsx to open on the menu, then navigate to '/'.
  function back(origin: Origin) {
    playSound('cancel')
    armTransition({ effect: 'doubleCircle', origin, target: 'menu' })
    armEnterMenu()
    router.push('/')
  }

  // All key handlers live in a ref so the single window-level listener (bound
  // once) always reads the latest closure without re-subscribing — same pattern
  // as ExperienceList's keysRef.
  const keysRef = useRef({
    selectCategory,
    focusTech,
    activateTech,
    closeDialog,
    back,
    dialogOpen,
    category,
    focusIndex,
  })
  useEffect(() => {
    keysRef.current = {
      selectCategory,
      focusTech,
      activateTech,
      closeDialog,
      back,
      dialogOpen,
      category,
      focusIndex,
    }
  })

  // Window-level keys. With the dialog OPEN, only Escape acts (closes it) and the
  // rest are swallowed so the underlying list doesn't move; the dialog runs its
  // own Esc/backdrop dismissal too. With it CLOSED: ↑↓/WS move the skill cursor,
  // ←→ swap category, Home/End jump, Enter/Space activate, Escape backs to menu.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = keysRef.current

      if (k.dialogOpen) {
        if (e.key === 'Escape') {
          e.preventDefault()
          k.closeDialog()
        }
        return
      }

      const catIndex = CATEGORIES.findIndex((c) => c.id === k.category.id)
      switch (e.key) {
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          k.focusTech(k.focusIndex + 1)
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          k.focusTech(k.focusIndex - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          k.selectCategory(CATEGORIES[(catIndex + 1) % CATEGORIES.length].id)
          break
        case 'ArrowLeft':
          e.preventDefault()
          k.selectCategory(
            CATEGORIES[(catIndex - 1 + CATEGORIES.length) % CATEGORIES.length].id,
          )
          break
        case 'Home':
          e.preventDefault()
          k.focusTech(0)
          break
        case 'End':
          e.preventDefault()
          k.focusTech(k.category.items.length - 1)
          break
        case 'Enter':
        case ' ': {
          const onButton = document.activeElement instanceof HTMLButtonElement
          if (onButton) break
          e.preventDefault()
          k.activateTech(k.category.items[k.focusIndex])
          break
        }
        case 'Escape':
          e.preventDefault()
          k.back(centerOrigin())
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Unlock the Web Audio context on the first gesture (same as the other screens).
  useEffect(() => {
    initAudioOnGesture()
  }, [])

  // Drive the single global water canvas into Stack's variant while this screen is
  // shown, reverting on leave. No second WebGL context — the hook re-tunes the live
  // uniforms in place (see waterConfig).
  useEffect(() => {
    setWaterConfig(STACK_WATER)
    return () => resetWaterConfig()
  }, [])

  return (
    <ScreenReveal reveals="section">
      <main className="fixed inset-0 z-0 overflow-hidden bg-transparent select-none">
        {/* The P3R water is the single global canvas (layout.tsx); the effect above
            drives it into the STACK_WATER variant while this screen is mounted. */}

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
            <CategoryRoster
              categories={CATEGORIES}
              selectedId={category.id}
              onSelect={selectCategory}
            />
          </div>

          {/* Skill list — top-right. */}
          <div className="absolute top-[8vh] right-[4vw]">
            <TechList
              category={category}
              focusIndex={focusIndex}
              onFocusTech={focusTech}
              onActivateTech={activateTech}
            />
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

        {/* ---- Mobile: a horizontal category bar feeding the tech list below ---- */}
        <div className="relative z-10 flex h-full w-full flex-col gap-5 pt-[9vh] pb-8 md:hidden">
          {/* Category selector — horizontal scroll-snap strip of chips. */}
          <CategoryStrip
            categories={CATEGORIES}
            selectedId={category.id}
            onSelect={selectCategory}
          />

          {/* Selected category's tech list — big outlined header + rows, fills the
              rest and scrolls. Full-width so the focused row's white pill can bleed
              to the screen's right edge (SKILL_EDGE_BLEED), left-padded for the text. */}
          <div className="min-h-0 flex-1 overflow-y-auto pl-5">
            <TechList
              category={category}
              focusIndex={focusIndex}
              onFocusTech={focusTech}
              onActivateTech={activateTech}
              fullWidth
              boxed
            />
          </div>

          {/* Prompt + Back — compact footer, outlined for legibility. */}
          <div className="flex flex-col gap-2 px-5">
            <div
              aria-hidden
              className="h-px w-full bg-white/40"
              style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
            />
            <div className="flex items-end justify-between gap-4">
              <button
                type="button"
                onClick={() => back(centerOrigin())}
                className="font-mono text-xs tracking-[0.3em] text-white uppercase"
                style={{ textShadow: OUTLINE_SHADOW }}
              >
                ← Back
              </button>
              <p
                className="text-right font-mono text-xs text-white/85"
                style={{ textShadow: OUTLINE_SHADOW }}
              >
                {VIEW_HINT}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Reference dialog — mounted while a tech is activated. */}
      {dialogTech && <TechDialog tech={dialogTech} onClose={closeDialog} />}
    </ScreenReveal>
  )
}
