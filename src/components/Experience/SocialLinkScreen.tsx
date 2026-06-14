'use client'

// Experience screen — the P3R "Social Link" menu adapted into a single full-blue
// collage (docs/experience/redesign.md + the redesign spec). There is no longer a
// white half: the shared animated blue P3R water (mounted globally in layout.tsx —
// this page stays transparent there) is the background for the WHOLE page, with a
// soft darkening veil over it for legibility. Over that:
//   • a large EXPERIENCE title, top-left, above the detail card
//   • Previous / Next controls straddling the title ↔ card seam
//   • the detail card (ExperienceCard): a white parallelogram (with a
//     semi-transparent black shadow card behind it), inset black panel, location
//     triangle, the experience title + date range
//   • a vertical experience indicator (BondPager) leaning along the card's right
//     edge, just to its right
//   • the TECH STACK title + floating/draggable tech tokens (TechStack) in the
//     zone below the card on the left
//   • the ★ job HIGHLIGHTS as a scattered comic-frame collage (JobPanels) filling
//     the RIGHT side, top→bottom
//   • "Back to menu" alone, bottom-right
//
// VISUAL-ONLY pass: the most-recent role is preselected; Previous / Next and Back
// are styled but inert (the handlers are no-ops).

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { ExperienceCard } from './ExperienceCard'
import { NavButton } from './SocialLinkBar'
import { BondPager } from './BondPager'
import { TechStack } from './TechStack'
import { JobPanels } from './JobPanels'
import {
  ACCENT_CYAN,
  BACK_BOTTOM,
  BACK_RIGHT,
  BULLETS_RIGHT,
  BULLETS_TOP,
  BULLETS_WIDTH,
  CARD_GAP,
  CARD_WIDTH,
  NAV_INSET_X,
  NAV_LEFT,
  NAV_TOP,
  NAV_WIDTH,
  SECTION_TITLE,
  STAGE_MAX_SCALE,
  STAGE_REF_H,
  STAGE_REF_W,
  TAG_FILL,
  TECH_TITLE,
  TECH_TITLE_OUTLINE,
  TECH_TITLE_OUTLINE_COLOR,
  TECH_TOKEN_CLIP,
  TECH_TOKEN_OUTLINE,
  TECH_TOKEN_SIZE,
  TITLE_LEFT,
  TITLE_SIZE,
  TITLE_SIZE_MOBILE,
  TITLE_SKEW,
  TITLE_TOP,
  TITLE_TRACKING,
} from './constants'
import { formatDateRange } from './helpers'
import { ROLES } from './experience'
import {
  armEnterMenu,
  armTransition,
  centerOrigin,
  type Origin,
} from '@/components/Transitions/handoff'
import { playSound } from '@/components/MainMenu/audio'

export function SocialLinkScreen() {
  // Static preselection — the most recent role (ROLES is authored newest-first).
  const activeIndex = 0
  const role = ROLES[activeIndex]
  const dates = formatDateRange(role.start, role.end)
  const noop = () => {}

  // Back to the MAIN MENU — same handoff as the rest of the site (StatScreen /
  // QuestList): play the cancel sound, arm the double-circle reveal the menu will
  // play, flag page.tsx to open on the menu, then navigate to '/'. Held in a ref
  // so the window-level Escape listener always calls the latest closure.
  const router = useRouter()
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

  // Desktop scale-to-fit: author the collage at STAGE_REF and scale it as one
  // rigid unit to fit the window. Written to a CSS var imperatively (no re-render);
  // also kept in a ref so the TechStack drag handler can divide pointer deltas by
  // the live scale (screen px → stage px).
  const stageRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(1)
  useEffect(() => {
    const update = () => {
      const s = Math.min(
        window.innerWidth / STAGE_REF_W,
        window.innerHeight / STAGE_REF_H,
        STAGE_MAX_SCALE,
      )
      scaleRef.current = s
      stageRef.current?.style.setProperty('--stage-scale', String(s))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <main className="fixed inset-0 z-0 overflow-y-auto bg-transparent select-none md:overflow-hidden">
      {/* No darkening veil — the animated blue water shows through clean; each
          element carries its own shadow/outline for legibility. */}

      {/* ===== DESKTOP — scale-to-fit canvas (proportions locked) ===== */}
      <div className="absolute inset-0 z-10 hidden overflow-hidden md:block">
        {/* STAGE — fixed reference size + `container-type: size` (so the cqw/cqh
            dials resolve against THIS box, not the viewport), scaled as one rigid
            unit to fit the window and ANCHORED TO THE LEFT EDGE (vertically centred)
            so left-side components start flush at the screen's left edge at every
            size; any leftover space falls on the right, where the water fills it. */}
        <div
          ref={stageRef}
          className="absolute top-1/2 left-0"
          style={{
            width: `${STAGE_REF_W}px`,
            height: `${STAGE_REF_H}px`,
            containerType: 'size',
            transform: 'translateY(-50%) scale(var(--stage-scale, 1))',
            transformOrigin: 'left center',
            willChange: 'transform',
          }}
        >
        {/* EXPERIENCE title + detail card — one stacked column, so the card always
            sits directly beneath the title (CARD_GAP apart) no matter the title
            size. The column is placed by TITLE_TOP / TITLE_LEFT. */}
        <div
          className="absolute z-20 flex flex-col"
          style={{ top: TITLE_TOP, left: TITLE_LEFT, width: CARD_WIDTH }}
        >
          <h1
            className="font-display leading-[0.82] text-white uppercase"
            style={{
              fontSize: TITLE_SIZE,
              letterSpacing: TITLE_TRACKING,
              transform: `skewX(${TITLE_SKEW})`,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {SECTION_TITLE}
          </h1>

          {/* CARD_GAP is a margin (not flex gap), so a NEGATIVE value pulls the
              card up over the title until the letters touch its top edge. The
              vertical experience indicator now lives INSIDE the card (centred +
              angled to its right slant). */}
          <div style={{ marginTop: CARD_GAP }}>
            <ExperienceCard
              company={role.company}
              role={role.role}
              location={role.location}
              dates={dates}
              roleCount={ROLES.length}
              activeIndex={activeIndex}
            />
          </div>
        </div>

        {/* Previous / Next — straddling the seam between the title and the card. */}
        <div
          className="absolute z-30 flex items-center justify-between"
          style={{ top: NAV_TOP, left: NAV_LEFT, width: NAV_WIDTH, paddingLeft: NAV_INSET_X, paddingRight: NAV_INSET_X }}
        >
          <NavButton dir="prev" onClick={noop} />
          <NavButton dir="next" onClick={noop} />
        </div>

        {/* TECH STACK title + floating draggable tech tokens — zone below the card,
            on the left. (Renders its own absolute title + stage-spanning layer.) */}
        <TechStack technologies={role.technologies} scaleRef={scaleRef} />

        {/* ★ Job HIGHLIGHTS — the scattered comic-frame collage filling the right
            side and flowing into the freed bottom-right space (logo removed). */}
        <div
          className="absolute z-20"
          style={{ top: BULLETS_TOP, right: BULLETS_RIGHT, width: BULLETS_WIDTH }}
        >
          <JobPanels bullets={role.bullets} />
        </div>

        {/* Back — bottom-right. Wired to the menu handoff. */}
        <div className="absolute z-30" style={{ bottom: BACK_BOTTOM, right: BACK_RIGHT }}>
          <button
            type="button"
            onClick={() => back(centerOrigin())}
            className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            ← Back to menu
          </button>
        </div>
        </div>
      </div>

      {/* ===== MOBILE — simple stacked, non-interactive flow ===== */}
      <div className="relative z-10 flex flex-col gap-6 px-5 py-8 md:hidden">
        <h1
          className="font-display leading-[0.82] text-white uppercase"
          style={{ fontSize: TITLE_SIZE_MOBILE, letterSpacing: TITLE_TRACKING, transform: `skewX(${TITLE_SKEW})` }}
        >
          {SECTION_TITLE}
        </h1>
        <div className="flex items-center justify-between">
          <NavButton dir="prev" onClick={noop} />
          <NavButton dir="next" onClick={noop} />
        </div>
        <ExperienceCard
          company={role.company}
          role={role.role}
          location={role.location}
          dates={dates}
          roleCount={ROLES.length}
          activeIndex={activeIndex}
          mobile
        />

        {/* ★ Job HIGHLIGHTS — the comic frames, collapsed to a readable stack. */}
        <JobPanels bullets={role.bullets} mobile />

        {/* TECH STACK — static wrapped tags on mobile (no drag/float). Two-layer
            outline so the cyan rim follows the full slanted shape (change 4). */}
        <div className="flex flex-col gap-3">
          <p
            className="font-display text-4xl font-black tracking-[-0.03em] text-white uppercase"
            style={{ WebkitTextStroke: `${TECH_TITLE_OUTLINE} ${TECH_TITLE_OUTLINE_COLOR}` }}
          >
            {TECH_TITLE}
          </p>
          <ul className="flex flex-wrap gap-2">
            {role.technologies.map((tech) => (
              <li key={tech} className="relative">
                <span
                  aria-hidden
                  className="absolute"
                  style={{ inset: `-${TECH_TOKEN_OUTLINE}`, backgroundColor: ACCENT_CYAN, clipPath: TECH_TOKEN_CLIP }}
                />
                <span
                  className="relative block px-3 py-1.5 font-medium tracking-[0.08em] whitespace-nowrap text-white uppercase"
                  style={{ fontSize: TECH_TOKEN_SIZE, backgroundColor: TAG_FILL, clipPath: TECH_TOKEN_CLIP }}
                >
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-5 pt-2">
          <BondPager count={ROLES.length} activeIndex={activeIndex} />
          <button
            type="button"
            onClick={() => back(centerOrigin())}
            className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase"
          >
            ← Back to menu
          </button>
        </div>
      </div>
    </main>
  )
}
