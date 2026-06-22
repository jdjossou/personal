// The Persona dialogue-box silhouette done RIGHT. A naive `clip-path` bevel has
// two flaws: an `inset` box-shadow "border" doesn't follow the diagonal cut (the
// corners read as sliced-open), and `clip-path` clips away any drop shadow (no
// depth behind the box). BevelBox fixes both with two stacked clipped layers:
//
//   • outer layer  → the rim COLOUR, clipped to the bevel, with a `filter:
//     drop-shadow` that hugs the clipped silhouette (the box/shadow behind it).
//   • inner layer  → the FILL, clipped to the same bevel and inset by the rim
//     width (padding), so the rim shows as a clean edge all the way around —
//     including along the diagonal cuts.
//
// Polymorphic: pass `as="button"` / `as="form"` (with their handlers) for the
// interactive boxes; defaults to a <div>.

import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'

const DEFAULT_SHADOW = '0 6px 16px rgba(0,0,0,0.45)'

type BevelBoxOwnProps<T extends ElementType> = {
  as?: T
  // The bevel polygon (BOX_CLIP / CHIP_CLIP from constants).
  clip: string
  // Inner fill colour.
  fill: string
  // Rim colour shown along every edge (incl. the diagonals).
  border: string
  // Rim thickness in px.
  borderWidth?: number
  // drop-shadow value, or null for none.
  shadow?: string | null
  // Sizing/layout for the OUTER wrapper (e.g. a fixed-size avatar).
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
  children?: ReactNode
}

type BevelBoxProps<T extends ElementType> = BevelBoxOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BevelBoxOwnProps<T>>

export function BevelBox<T extends ElementType = 'div'>({
  as,
  clip,
  fill,
  border,
  borderWidth = 1,
  shadow = DEFAULT_SHADOW,
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  children,
  ...rest
}: BevelBoxProps<T>) {
  const Inner = (as ?? 'div') as ElementType
  return (
    <div
      className={wrapperClassName}
      style={{
        clipPath: clip,
        backgroundColor: border,
        padding: borderWidth,
        filter: shadow ? `drop-shadow(${shadow})` : undefined,
        display: 'flex',
        ...wrapperStyle,
      }}
    >
      <Inner
        className={className}
        style={{ clipPath: clip, backgroundColor: fill, flex: 1, minWidth: 0, ...style }}
        {...rest}
      >
        {children}
      </Inner>
    </div>
  )
}
