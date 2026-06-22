// The bottom horizontal bar: the same external links as the landing screen
// (reused verbatim from Landing's LINKS + LinkIcon so there's one source of truth
// for Juniel's profiles) plus a primary CONTACT button that opens the message
// form. Laid out as a single horizontal row, as requested.

import { LinkIcon } from '@/components/Landing/icons'
import {
  LINKS,
  LINK_BG_COLOR,
  LINK_BORDER_COLOR,
  LINK_ICON_COLOR,
  LINK_TEXT_COLOR,
} from '@/components/Landing/constants'
import { ACCENT_BLUE, CONTACT_BUTTON_LABEL } from './constants'
import { MailIcon } from './icons'

export function ContactBar({ onContact }: { onContact: () => void }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
      {LINKS.map(({ label, href, icon, newTab }) => (
        <a
          key={label}
          href={href}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.18em] uppercase [color:var(--link-text)] transition-colors hover:[color:#fff]"
          style={
            {
              '--link-text': LINK_TEXT_COLOR,
              '--icon': LINK_ICON_COLOR,
              borderColor: LINK_BORDER_COLOR,
              backgroundColor: LINK_BG_COLOR,
            } as React.CSSProperties
          }
        >
          <LinkIcon
            icon={icon}
            className="h-[1.1em] w-[1.1em] [color:var(--icon)] transition-colors group-hover:[color:#fff]"
          />
          <span>{label}</span>
          {newTab && <span className="sr-only">(opens in a new tab)</span>}
        </a>
      ))}

      {/* Primary action — filled accent so it reads as the CTA next to the outline
          profile links. */}
      <button
        type="button"
        onClick={onContact}
        className="flex items-center gap-2 rounded-sm px-3.5 py-1.5 font-mono text-[0.72rem] font-semibold tracking-[0.18em] text-[#06131F] uppercase transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{ backgroundColor: ACCENT_BLUE }}
      >
        <MailIcon className="h-[1.1em] w-[1.1em]" />
        <span>{CONTACT_BUTTON_LABEL}</span>
      </button>
    </nav>
  )
}
