// The signature blue angular response-choice chips — Persona dialogue options.
// Shown on first load and whenever the visitor hasn't typed yet; clicking one
// sends it as the next message. No leading index numbers (site originality rule);
// a small "//" marker reads as a system/option glyph instead.

import { BevelBox } from './BevelBox'
import { ACCENT_BLUE, CHIP_BG, CHIP_BORDER, CHIP_CLIP, OUTLINE_SHADOW } from './constants'

export function SuggestedPrompts({
  prompts,
  onPick,
  disabled = false,
}: {
  prompts: readonly string[]
  onPick: (prompt: string) => void
  disabled?: boolean
}) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {prompts.map((prompt) => (
        <li key={prompt}>
          <BevelBox
            as="button"
            clip={CHIP_CLIP}
            fill={CHIP_BG}
            border={CHIP_BORDER}
            shadow="0 4px 10px rgba(0,0,0,0.35)"
            wrapperStyle={{ display: 'inline-flex' }}
            type="button"
            disabled={disabled}
            onClick={() => onPick(prompt)}
            className="group flex items-center gap-2 px-3.5 py-2 text-left font-mono text-[0.7rem] tracking-[0.12em] text-white/80 uppercase transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            style={{ textShadow: OUTLINE_SHADOW }}
          >
            <span aria-hidden style={{ color: ACCENT_BLUE }} className="transition-colors group-hover:text-white">
              {'//'}
            </span>
            {prompt}
          </BevelBox>
        </li>
      ))}
    </ul>
  )
}
