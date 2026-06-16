// Category icon — the leading glyph each category renders (the analog of a P3R
// party-member portrait, with NO character art). Maps a CategoryIconId from
// stack.ts to a small monochrome inline-SVG glyph drawn in `currentColor`, so it
// inherits the row's text colour (white, or white-on-crimson when selected) and
// stays P3R-flat — no full-colour brand logos. Pure + presentational: the same
// glyph heads its category's roster row and its technology list.

import type { CategoryIconId } from './stack'

// Each glyph is authored on a 24×24 viewBox, stroked in currentColor, sharp
// (no fills, square joins) to match the flat HUD language. Kept geometric and
// legible at small sizes.
const GLYPHS: Record<CategoryIconId, React.ReactNode> = {
  // Languages — angle brackets + slash ("</>").
  languages: (
    <>
      <path d="M8 7 3 12l5 5" />
      <path d="M16 7l5 5-5 5" />
      <path d="M13 5l-2 14" />
    </>
  ),
  // Frameworks & Libraries — stacked layers.
  frameworks: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </>
  ),
  // Tools & Platforms — wrench.
  tools: (
    <>
      <path d="M15 5a4 4 0 0 0-5 5L4 16l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-1-1-3 3-3Z" />
    </>
  ),
  // Certifications — ribbon / award medal.
  certifications: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14 7 22l5-3 5 3-2-8" />
    </>
  ),
  // Databases — cylinder.
  databases: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </>
  ),
  // Spoken languages — speech bubble with a globe meridian.
  spoken: (
    <>
      <path d="M4 5h16v11H9l-4 4V5Z" />
      <path d="M7 10h10M12 7v8" />
    </>
  ),
}

export function CategoryIcon({
  icon,
  size = 22,
  className,
}: {
  icon: CategoryIconId
  size?: number
  className?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="miter"
      strokeLinecap="square"
      className={className}
    >
      {GLYPHS[icon]}
    </svg>
  )
}
