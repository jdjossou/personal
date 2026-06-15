'use client'

// Experience detail card — the main structural element of the top-left, the
// reference's Social Link banner re-imagined per the latest spec:
//   • a large WHITE parallelogram that bleeds off the LEFT screen edge (only its
//     slanted right edge reads) — it feels like it starts outside the canvas
//   • a smaller BLACK parallelogram inset inside it: shorter, not touching the
//     white's top or right edge (white shows above + to the right). The COMPANY
//     name sits horizontally centred in it, in normal case (not all-caps)
//   • a small triangular wedge dropping out of the black panel's bottom-left,
//     carrying the LOCATION along its angle
//   • the experience TITLE in big display caps toward the centre-left of the
//     white area, and the DATE range in the upper-right gap (the old RANK slot)
// Built from layered clipped shapes — never a plain rectangle. Presentational.

import { useEffect, useRef, useState } from 'react'

import { BondPager } from './BondPager'
import {
  CARD_BLACK_CLIP,
  CARD_BLACK_HEIGHT,
  CARD_BLACK_WIDTH,
  CARD_BLACK_X,
  CARD_BLACK_Y,
  CARD_BLEED_LEFT,
  CARD_COMPANY_BOTTOM,
  CARD_COMPANY_SIZE,
  CARD_HEIGHT,
  CARD_SHADOW_FILL,
  CARD_SHADOW_X,
  CARD_SHADOW_Y,
  CARD_DATE_RIGHT,
  CARD_DATE_SIZE,
  CARD_INK,
  CARD_PAPER,
  CARD_TITLE_DATE_GAP,
  CARD_TITLE_MAXW,
  CARD_TITLE_SIZE,
  CARD_TITLE_SKEW,
  CARD_TITLE_TOP,
  CARD_WHITE_CLIP,
  INDICATOR_GAP,
  LOCATION_HEIGHT,
  LOCATION_LEFT,
  LOCATION_MOBILE_CLIP,
  LOCATION_TEXT_LEFT,
  LOCATION_TEXT_SIZE,
  LOCATION_TEXT_TOP,
  LOCATION_TOP,
  LOCATION_TRI_CLIP,
  LOCATION_TRI_POINT_X,
  LOCATION_WIDTH,
} from './constants'

export function ExperienceCard({
  company,
  role,
  location,
  dates,
  roleCount,
  activeIndex,
  mobile = false,
}: {
  company: string
  role: string
  location: string
  dates: string
  // The vertical experience indicator rides inside the card so it can be centred
  // on the card and angled to the card's measured right slant (see below).
  roleCount: number
  activeIndex: number
  // Mobile renders a self-contained card (no left bleed, auto height, full-width
  // panel, an inline location chip, no indicator) so it sits cleanly in the
  // stacked column instead of the desktop "bleed off the left screen edge" layout.
  mobile?: boolean
}) {
  // Angle the location text to ride along the triangle's bottom-right edge. That
  // edge runs from the top-right corner down to the point at LOCATION_TRI_POINT_X
  // (% of width); its lean is atan(rise / run) where rise is the pennant's height
  // and run is the horizontal span of the edge. We measure the pennant's rendered
  // pixels (LOCATION_WIDTH/HEIGHT mix vw + vh, so the slope is only real on-screen)
  // and recompute on resize.
  const pennantRef = useRef<HTMLDivElement>(null)
  const [textAngle, setTextAngle] = useState(0)

  useEffect(() => {
    const pennant = pennantRef.current
    if (!pennant) return

    const measure = () => {
      const locationWidth = pennant.offsetWidth
      const locationHeight = pennant.offsetHeight
      const run = locationWidth * ((100 - LOCATION_TRI_POINT_X) / 100)
      const angleDeg = -Math.atan(locationHeight / run) * (180 / Math.PI)
      setTextAngle(angleDeg)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(pennant)
    return () => observer.disconnect()
  }, [])

  // Angle the vertical indicator to PARALLEL the white card's slanted right edge.
  // CARD_WHITE_CLIP runs the right edge from the top-right corner (100% 0) down to
  // (90% 100%), so over the card's rendered height it shifts left by 10% of the
  // card's rendered width. The lean from vertical is atan(run / rise) where run =
  // 0.10·width and rise = height; a POSITIVE (clockwise) rotation tilts a vertical
  // pip column top-right / bottom-left, matching that edge. Width mixes vw with the
  // height's vh, so the slope is only real once rendered — measure + recompute on resize.
  const cardRef = useRef<HTMLDivElement>(null)
  const [indicatorAngle, setIndicatorAngle] = useState(0)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const measure = () => {
      const angleDeg =
        Math.atan((0.1 * card.offsetWidth) / card.offsetHeight) * (180 / Math.PI)
      setIndicatorAngle(angleDeg)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  // MOBILE — a self-contained card: full column width (no left bleed), height that
  // grows with content (so the role title is never cropped by the clip-path), a
  // full-width black company panel, the location as a compact horizontal chip
  // (can't spill), and no vertical indicator (the mobile flow shows a horizontal
  // pager separately). Keeps the white/black parallelogram + clip-paths identity.
  if (mobile) {
    return (
      <div className="relative w-full">
        {/* cast shadow */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            transform: 'translate(0.4rem, 0.4rem)',
            backgroundColor: CARD_SHADOW_FILL,
            clipPath: CARD_WHITE_CLIP,
          }}
        />
        {/* white card face */}
        <div
          className="relative px-5 pt-5 pb-8"
          style={{ backgroundColor: CARD_PAPER, clipPath: CARD_WHITE_CLIP }}
        >
          {/* black company panel — full width */}
          <div
            className="flex items-center justify-center px-4 py-3"
            style={{ backgroundColor: CARD_INK, clipPath: CARD_BLACK_CLIP }}
          >
            <p
              className="text-center font-semibold tracking-wide text-white"
              style={{ fontSize: 'clamp(1.05rem, 4.4vw, 1.4rem)' }}
            >
              {company}
            </p>
          </div>

          {/* location chip — horizontal, sized to its own text; pulled up so it
              touches (merges into) the black company panel above, like a pennant. */}
          <div style={{ marginTop: '-2px' }}>
            <span
              className="inline-block px-3 pt-2 pb-3 font-black tracking-[-0.04em] whitespace-nowrap text-white uppercase"
              style={{ backgroundColor: CARD_INK, clipPath: LOCATION_MOBILE_CLIP, fontSize: '0.78rem' }}
            >
              {location}
            </span>
          </div>

          {/* title + date — right-aligned, padded clear of the clipped corner */}
          <div className="mt-4 flex flex-col items-end" style={{ paddingRight: '10%' }}>
            <h2
              className="font-display text-right leading-[0.9] tracking-wide uppercase"
              style={{
                color: CARD_INK,
                fontSize: 'clamp(1.7rem, 7.5vw, 2.6rem)',
                maxWidth: '100%',
                transform: `skewX(${CARD_TITLE_SKEW})`,
              }}
            >
              {role}
            </h2>
            <p
              className="text-right leading-tight font-extrabold tracking-tight"
              style={{ color: CARD_INK, fontSize: 'clamp(0.95rem, 3.8vw, 1.25rem)' }}
            >
              {dates}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    // GEOMETRY wrapper — carries the card's footprint (left bleed + height) and
    // stacks two layers: the semi-transparent black SHADOW card behind, and the
    // WHITE parallelogram in front. Shifted a touch off the left edge so the
    // cards' left side is off-canvas; only the slanted right edge is visible.
    <div
      ref={cardRef}
      className="relative"
      style={{
        marginLeft: `calc(-1 * ${CARD_BLEED_LEFT})`,
        width: `calc(100% + ${CARD_BLEED_LEFT})`,
        height: CARD_HEIGHT,
      }}
    >
      {/* Vertical experience indicator — centred on the card height and placed just
          right of the shadow's right edge at mid-height (the white clip's right edge
          sits at 95% width at the vertical centre; the shadow is CARD_SHADOW_X to its
          right). Rotated to parallel the card's measured right slant. */}
      <div
        className="absolute z-20"
        style={{
          top: '50%',
          left: `calc(95% + ${CARD_SHADOW_X} + ${INDICATOR_GAP})`,
          transform: `translateY(-50%) rotate(${indicatorAngle}deg)`,
          transformOrigin: 'center',
        }}
      >
        <BondPager count={roleCount} activeIndex={activeIndex} orientation="vertical" />
      </div>

      {/* SHADOW card — a black copy of the white parallelogram, offset down/right
          so it reads as a cast shadow behind the card (change 5). */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          transform: `translate(${CARD_SHADOW_X}, ${CARD_SHADOW_Y})`,
          backgroundColor: CARD_SHADOW_FILL,
          clipPath: CARD_WHITE_CLIP,
        }}
      />

      {/* WHITE parallelogram — the card face. */}
      <div
        className="relative h-full pt-6 pr-10 pb-12 pl-[7cqw]"
        style={{
          backgroundColor: CARD_PAPER,
          clipPath: CARD_WHITE_CLIP,
        }}
      >
      {/* BLACK panel — fully positioned via the dials: CARD_BLACK_X/Y move it
          (a big −X bleeds it off the left edge, clipped to the white card),
          CARD_BLACK_WIDTH/HEIGHT size it. The location pennant rides along inside
          this wrapper, so moving the panel moves the pennant with it. */}
      <div
        className="relative"
        style={{ width: CARD_BLACK_WIDTH, transform: `translate(${CARD_BLACK_X}, ${CARD_BLACK_Y})` }}
      >
        <div
          className="flex items-end justify-center px-10 pt-3.5"
          style={{ backgroundColor: CARD_INK, clipPath: CARD_BLACK_CLIP, height: CARD_BLACK_HEIGHT, paddingBottom: CARD_COMPANY_BOTTOM }}
        >
          <p
            className="text-center font-semibold tracking-wide text-white"
            style={{ fontSize: CARD_COMPANY_SIZE }}
          >
            {company}
          </p>
        </div>

        {/* LOCATION — a black pennant poking out of the black panel: a flat top
            carrying the text, with a triangular point below. LOCATION_TOP/LEFT
            place the pennant and LOCATION_TRI_CLIP shapes it; the text inside is
            placed and angled independently (LOCATION_TEXT_*) so it can ride along
            the triangle's bottom-right edge. */}
        <div
          ref={pennantRef}
          className="absolute"
          style={{
            backgroundColor: CARD_INK,
            clipPath: LOCATION_TRI_CLIP,
            top: LOCATION_TOP,
            left: LOCATION_LEFT,
            width: LOCATION_WIDTH,
            height: LOCATION_HEIGHT,
          }}
        >
          <span
            className="absolute block font-black tracking-[-0.05em] whitespace-nowrap text-white uppercase"
            style={{
              fontSize: LOCATION_TEXT_SIZE,
              top: LOCATION_TEXT_TOP,
              left: LOCATION_TEXT_LEFT,
              transform: `rotate(${textAngle}deg)`,
              transformOrigin: 'left top',
            }}
          >
            {location}
          </span>
        </div>
      </div>

      {/* TITLE over DATE — a right-aligned stack in the white below the black
          panel, both flush to the same right edge (CARD_DATE_RIGHT). The
          experience TITLE (big display caps) sits on top, the DATE range (bold)
          directly beneath it. The title stays on one line when it fits and wraps
          only when too long; CARD_TITLE_MAXW caps its width so a wrap happens
          before it crosses the white card's slanted right edge. */}
      <div
        className="flex flex-col items-end"
        style={{ marginTop: CARD_TITLE_TOP, paddingRight: CARD_DATE_RIGHT, gap: CARD_TITLE_DATE_GAP }}
      >
        <h2
          className="font-display text-right leading-[0.9] tracking-wide uppercase"
          style={{
            color: CARD_INK,
            fontSize: CARD_TITLE_SIZE,
            maxWidth: CARD_TITLE_MAXW,
            transform: `skewX(${CARD_TITLE_SKEW})`,
          }}
        >
          {role}
        </h2>

        <p
          className="text-right leading-tight font-extrabold tracking-tight"
          style={{ color: CARD_INK, fontSize: CARD_DATE_SIZE }}
        >
          {dates}
        </p>
      </div>
      </div>
    </div>
  )
}
