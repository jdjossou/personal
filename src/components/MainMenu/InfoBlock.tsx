'use client'

// Info block (Task 05) — the lower-right readout: a "View …" title over a
// muted subtitle followed by a trailing em-dash line. On selection change the
// content does a quick fade-out → fade-in (short, game-like, not a dissolve):
// when selectedIndex changes we drop opacity to 0 for INFO_FADE_OUT_MS, swap
// the displayed content, then fade back in over INFO_FADE_IN_MS.

import { useEffect, useState } from 'react'
import {
  INFO_FADE_IN_MS,
  INFO_FADE_OUT_MS,
  INFO_SUBTITLE_COLOR,
  INFO_TITLE_COLOR,
  INFO_TRAILING,
  SECTION_INFO,
} from './constants'

export function InfoBlock({ selectedIndex }: { selectedIndex: number }) {
  // `shown` lags `selectedIndex`: we fade out, then adopt the new index.
  const [shown, setShown] = useState(selectedIndex)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (selectedIndex === shown) return
    setVisible(false)
    const id = window.setTimeout(() => {
      setShown(selectedIndex)
      setVisible(true)
    }, INFO_FADE_OUT_MS)
    return () => window.clearTimeout(id)
  }, [selectedIndex, shown])

  const info = SECTION_INFO[shown]

  return (
    <div
      className="text-right"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${visible ? INFO_FADE_IN_MS : INFO_FADE_OUT_MS}ms ease-out`,
      }}
    >
      <div
        className="font-display text-3xl leading-none tracking-wide"
        style={{ color: INFO_TITLE_COLOR }}
      >
        {info.title}
      </div>
      <div
        className="mt-1 font-mono text-xs tracking-wide whitespace-nowrap"
        style={{ color: INFO_SUBTITLE_COLOR }}
      >
        {info.subtitle} {INFO_TRAILING}
      </div>
    </div>
  )
}
